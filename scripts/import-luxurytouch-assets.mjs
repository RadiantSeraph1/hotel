import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const siteOrigin = "https://luxurytouchhotel.com";
const seedPages = [
  `${siteOrigin}/`,
  `${siteOrigin}/gallery3`,
  `${siteOrigin}/restaurant`,
  `${siteOrigin}/standard_room`,
  `${siteOrigin}/delux.html`,
  `${siteOrigin}/presidential`,
];

const outDir = path.join(process.cwd(), "public", "imported", "luxurytouchhotel");
const manifestPath = path.join(process.cwd(), "src", "lib", "assets", "imported-assets.ts");
const maxPages = 24;
const maxAssetBytes = 20 * 1024 * 1024;

const requestHeaders = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  "user-agent": "Mozilla/5.0 (compatible; LuxuryTouchHotelAssetImporter/1.0)",
};

const imageContentTypes = new Map([
  ["image/avif", ".avif"],
  ["image/gif", ".gif"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/svg+xml", ".svg"],
  ["image/webp", ".webp"],
  ["image/x-icon", ".ico"],
]);

function absolutize(value, baseUrl) {
  try {
    return new URL(decodeHtml(value.trim()), baseUrl).toString();
  } catch {
    return null;
  }
}

function cleanAssetUrl(url) {
  const parsed = new URL(url);
  parsed.hash = "";
  return parsed.toString();
}

function cleanPageUrl(url) {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.search = "";
  return parsed.toString();
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function uniquePush(list, value) {
  if (!list.includes(value)) list.push(value);
}

function registerAsset(assets, rawUrl, sourcePage, discoveredAs) {
  const absolute = absolutize(rawUrl, sourcePage);
  if (!absolute) return;

  const parsed = new URL(absolute);
  if (!["http:", "https:"].includes(parsed.protocol)) return;
  if (parsed.protocol === "http:" && parsed.hostname === "luxurytouchhotel.com") {
    parsed.protocol = "https:";
  }

  const url = cleanAssetUrl(parsed.toString());
  if (url.startsWith("data:") || url.startsWith("blob:")) return;
  if (/\.(?:pdf|docx?|xlsx?|zip|rar|7z|mp4|webm|mov|avi|mp3|wav)(?:\?|$)/i.test(url)) return;

  const record = assets.get(url) ?? { sourcePages: [], discoveredAs: [] };
  uniquePush(record.sourcePages, sourcePage);
  uniquePush(record.discoveredAs, discoveredAs);
  assets.set(url, record);
}

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([:@\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[3] ?? match[4] ?? match[5] ?? "");
  }
  return attributes;
}

function extractSrcsetUrls(srcset) {
  return srcset
    .split(",")
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function collectFromHtml(html, pageUrl, assets, pageQueue, seenPages) {
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    for (const attr of ["src", "data-src", "data-lazy-src", "data-original"]) {
      if (attrs[attr]) registerAsset(assets, attrs[attr], pageUrl, `img:${attr}`);
    }
    for (const attr of ["srcset", "data-srcset"]) {
      if (!attrs[attr]) continue;
      for (const url of extractSrcsetUrls(attrs[attr])) registerAsset(assets, url, pageUrl, `img:${attr}`);
    }
  }

  for (const match of html.matchAll(/<source\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    if (attrs.src) registerAsset(assets, attrs.src, pageUrl, "source:src");
    if (attrs.srcset) {
      for (const url of extractSrcsetUrls(attrs.srcset)) registerAsset(assets, url, pageUrl, "source:srcset");
    }
  }

  for (const match of html.matchAll(/<(?:meta|link)\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    const hint = attrs.property || attrs.name || attrs.rel || "metadata";
    if (attrs.content && /image|thumbnail|icon/i.test(hint)) registerAsset(assets, attrs.content, pageUrl, `meta:${hint}`);
    if (attrs.href && /icon|apple-touch-icon|preload/i.test(hint)) registerAsset(assets, attrs.href, pageUrl, `link:${hint}`);
  }

  for (const match of html.matchAll(/url\((["']?)([^"')]+)\1\)/gi)) {
    registerAsset(assets, match[2], pageUrl, "css:url");
  }

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    if (!attrs.href) continue;
    const absolute = absolutize(attrs.href, pageUrl);
    if (!absolute) continue;

    const nextPage = cleanPageUrl(absolute);
    const parsed = new URL(nextPage);
    if (parsed.origin !== siteOrigin) continue;
    if (/\.(?:png|jpe?g|webp|gif|svg|ico|pdf|zip|mp4|webm|mov|mp3|docx?|xlsx?)(?:\?|$)/i.test(parsed.pathname)) continue;
    if (!seenPages.has(nextPage) && !pageQueue.includes(nextPage) && pageQueue.length + seenPages.size < maxPages) {
      pageQueue.push(nextPage);
    }
  }
}

async function fetchText(url) {
  const response = await fetch(url, { headers: requestHeaders, redirect: "follow" });
  if (!response.ok) throw new Error(`Failed to fetch page ${url}: ${response.status} ${response.statusText}`);
  return response.text();
}

function extensionFor(url, contentType) {
  const fromContentType = imageContentTypes.get(contentType.split(";")[0].trim().toLowerCase());
  if (fromContentType) return fromContentType;

  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (/^\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/.test(ext)) return ext === ".jpeg" ? ".jpg" : ext;
  return ".jpg";
}

function filenameFor(url, index, contentType) {
  const parsed = new URL(url);
  const base = path.basename(parsed.pathname, path.extname(parsed.pathname)) || "asset";
  const safeBase = base.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "asset";
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 10);
  return `${String(index).padStart(2, "0")}-${safeBase}-${hash}${extensionFor(url, contentType)}`;
}

async function downloadAsset(url) {
  const response = await fetch(url, { headers: requestHeaders, redirect: "follow" });
  if (!response.ok) return { skipped: `HTTP ${response.status}` };

  const contentType = response.headers.get("content-type") ?? "";
  const contentLength = Number(response.headers.get("content-length") ?? "0");
  const hasImageType = imageContentTypes.has(contentType.split(";")[0].trim().toLowerCase());
  const hasImageExtension = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)(?:\?|$)/i.test(url);
  if (!hasImageType && !hasImageExtension) return { skipped: `not an image (${contentType || "unknown content type"})` };
  if (contentLength > maxAssetBytes) return { skipped: `too large (${contentLength} bytes)` };

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0) return { skipped: "empty response" };
  if (bytes.length > maxAssetBytes) return { skipped: `too large (${bytes.length} bytes)` };

  return { bytes, contentType: contentType || "application/octet-stream" };
}

function formatManifest(records) {
  return `export const importedLuxuryTouchAssets = ${JSON.stringify(records, null, 2)} as const;\n\nexport type ImportedLuxuryTouchAsset = (typeof importedLuxuryTouchAssets)[number];\n`;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });

  const assets = new Map();
  const seenPages = new Set();
  const pageQueue = seedPages.map(cleanPageUrl);

  while (pageQueue.length > 0 && seenPages.size < maxPages) {
    const page = pageQueue.shift();
    if (!page || seenPages.has(page)) continue;
    seenPages.add(page);

    try {
      const html = await fetchText(page);
      collectFromHtml(html, page, assets, pageQueue, seenPages);
    } catch (error) {
      console.warn(`Skipped page ${page}: ${error.message}`);
    }
  }

  const records = [];
  const urls = [...assets.keys()].sort((a, b) => a.localeCompare(b));
  let index = 1;
  for (const url of urls) {
    try {
      const result = await downloadAsset(url);
      if (result.skipped) {
        console.warn(`Skipped asset ${url}: ${result.skipped}`);
        continue;
      }

      const filename = filenameFor(url, index, result.contentType);
      await writeFile(path.join(outDir, filename), result.bytes);
      const metadata = assets.get(url);
      records.push({
        id: path.basename(filename, path.extname(filename)),
        src: `/imported/luxurytouchhotel/${filename}`,
        originalUrl: url,
        sourcePages: metadata.sourcePages.sort(),
        discoveredAs: metadata.discoveredAs.sort(),
        contentType: result.contentType,
        byteLength: result.bytes.length,
      });
      index += 1;
    } catch (error) {
      console.warn(`Skipped asset ${url}: ${error.message}`);
    }
  }

  await writeFile(manifestPath, formatManifest(records));
  console.log(`Imported ${records.length} assets from ${seenPages.size} pages`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
