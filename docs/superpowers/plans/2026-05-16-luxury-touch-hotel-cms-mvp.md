# Luxury Touch Hotel CMS MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working Next.js + Supabase hotel website/CMS MVP for Luxury Touch Hotel with imported existing assets and booking-request notifications.

**Architecture:** Use one Next.js App Router project for the public website and admin dashboard. Keep business logic in small server-side modules under `src/lib`, keep provider APIs behind wrappers, and store imported website assets in `public/imported/luxurytouchhotel`.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Supabase, Resend, mNotify, Bird, Vitest, Testing Library, Playwright.

---

## File Structure

- `package.json`: scripts and dependencies.
- `src/app/(public)/*`: public hotel pages.
- `src/app/admin/*`: admin dashboard pages.
- `src/app/api/bookings/route.ts`: public booking submission endpoint.
- `src/components/public/*`: public UI sections.
- `src/components/admin/*`: admin UI components.
- `src/lib/content/hotel-content.ts`: seeded hotel content using imported assets.
- `src/lib/bookings/*`: booking validation, persistence, status transitions, notification orchestration.
- `src/lib/notifications/*`: Resend, mNotify, Bird wrappers plus notification log helpers.
- `src/lib/supabase/*`: browser/server clients and schema types.
- `src/lib/assets/imported-assets.ts`: imported logo/image manifest.
- `scripts/import-luxurytouch-assets.mjs`: download logo and images from the current website.
- `supabase/migrations/0001_initial_schema.sql`: CMS, booking, and notification schema.
- `tests/*`: unit tests for booking and notifications.
- `public/imported/luxurytouchhotel/*`: imported images and logo files.

## Task 1: Scaffold Next.js App

**Files:**
- Create/modify generated Next.js project files.
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: Scaffold project**

Run:

```powershell
npx.cmd create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Next.js files created in the current directory.

- [ ] **Step 2: Install runtime and test dependencies**

Run:

```powershell
npm.cmd install @supabase/supabase-js @supabase/ssr resend zod lucide-react clsx
npm.cmd install -D vitest @testing-library/react @testing-library/jest-dom jsdom playwright
```

Expected: dependencies are added to `package.json`.

- [ ] **Step 3: Add environment template**

Create `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=bookings@luxurytouchhotel.com
MNOTIFY_API_KEY=
MNOTIFY_SENDER_ID=LuxuryTouch
BIRD_ACCESS_KEY=
BIRD_WORKSPACE_ID=
BIRD_WHATSAPP_CHANNEL_ID=
BIRD_TEMPLATE_REQUEST_RECEIVED=
BIRD_TEMPLATE_HOTEL_ALERT=
BIRD_TEMPLATE_BOOKING_APPROVED=
BIRD_TEMPLATE_BOOKING_DECLINED=
HOTEL_NOTIFICATION_EMAIL=
HOTEL_NOTIFICATION_PHONE=
HOTEL_NOTIFICATION_WHATSAPP=
```

- [ ] **Step 4: Verify scaffold**

Run:

```powershell
npm.cmd run lint
```

Expected: lint passes or only generated-template warnings appear.

## Task 2: Import Existing Logo and Images

**Files:**
- Create: `scripts/import-luxurytouch-assets.mjs`
- Create: `src/lib/assets/imported-assets.ts`
- Create/update: `public/imported/luxurytouchhotel/*`

- [ ] **Step 1: Write import script**

Create `scripts/import-luxurytouch-assets.mjs`:

```js
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const pages = [
  "https://luxurytouchhotel.com/",
  "https://luxurytouchhotel.com/gallery3",
  "https://luxurytouchhotel.com/restaurant",
  "https://luxurytouchhotel.com/standard_room",
  "https://luxurytouchhotel.com/delux.html",
  "https://luxurytouchhotel.com/presidential",
];

const outDir = path.join(process.cwd(), "public", "imported", "luxurytouchhotel");
const manifestPath = path.join(process.cwd(), "src", "lib", "assets", "imported-assets.ts");

function absoluteUrl(src, base) {
  return new URL(src, base).toString();
}

function filenameFromUrl(url, index) {
  const parsed = new URL(url);
  const raw = path.basename(parsed.pathname) || `asset-${index}`;
  const safe = raw.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  return safe.includes(".") ? `${index}-${safe}` : `${index}-${safe}.jpg`;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });

  const urls = new Map();
  for (const page of pages) {
    const html = await fetch(page).then((res) => res.text());
    for (const match of html.matchAll(/<(?:img|source)[^>]+(?:src|data-src)=["']([^"']+)["']/gi)) {
      const src = match[1];
      if (!src || src.startsWith("data:")) continue;
      const url = absoluteUrl(src, page);
      if (/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url)) urls.set(url, page);
    }
  }

  const records = [];
  let index = 1;
  for (const [url, sourcePage] of urls) {
    const response = await fetch(url);
    if (!response.ok) continue;
    const filename = filenameFromUrl(url, index);
    const bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(path.join(outDir, filename), bytes);
    records.push({
      src: `/imported/luxurytouchhotel/${filename}`,
      originalUrl: url,
      sourcePage,
    });
    index += 1;
  }

  await writeFile(
    manifestPath,
    `export const importedLuxuryTouchAssets = ${JSON.stringify(records, null, 2)} as const;\n`,
  );
  console.log(`Imported ${records.length} assets`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 2: Run import**

Run:

```powershell
node scripts/import-luxurytouch-assets.mjs
```

Expected: `Imported N assets` where `N` is greater than 0.

- [ ] **Step 3: Verify logo/images exist**

Run:

```powershell
Get-ChildItem public\imported\luxurytouchhotel | Select-Object -First 20
```

Expected: image files are listed.

## Task 3: Add Supabase Schema

**Files:**
- Create: `supabase/migrations/0001_initial_schema.sql`

- [ ] **Step 1: Create schema migration**

Create tables: `profiles`, `rooms`, `room_images`, `gallery_images`, `content_blocks`, `testimonials`, `booking_requests`, `notification_logs`, and `site_settings`.

- [ ] **Step 2: Include role/status checks**

Use SQL enums or check constraints for roles `manager`, `receptionist`, `editor` and booking statuses `new`, `contacted`, `approved`, `declined`, `cancelled`.

- [ ] **Step 3: Add RLS policies**

Public can read active rooms, images, content blocks, testimonials, and site settings. Authenticated staff can read/write CMS tables according to role.

## Task 4: Booking Validation and Notifications TDD

**Files:**
- Create: `src/lib/bookings/booking-schema.ts`
- Create: `src/lib/bookings/booking-notifications.ts`
- Create: `src/lib/notifications/types.ts`
- Test: `tests/bookings/booking-schema.test.ts`
- Test: `tests/bookings/booking-notifications.test.ts`

- [ ] **Step 1: Write failing validation tests**

Test valid booking input and rejection for missing name, invalid email, missing phone, missing room, and departure before arrival.

- [ ] **Step 2: Run tests and verify they fail**

Run:

```powershell
npm.cmd test -- tests/bookings/booking-schema.test.ts
```

Expected: fail because `booking-schema.ts` does not exist.

- [ ] **Step 3: Implement minimal Zod schema**

Export `bookingRequestSchema` and `BookingRequestInput`.

- [ ] **Step 4: Run tests and verify pass**

Run:

```powershell
npm.cmd test -- tests/bookings/booking-schema.test.ts
```

Expected: pass.

- [ ] **Step 5: Write failing notification orchestration tests**

Test that submit sends customer received message by email/SMS/WhatsApp and hotel alert by email/SMS/WhatsApp; approval sends customer approval; decline sends customer decline; channel failure returns a loggable failed result without throwing away the booking.

- [ ] **Step 6: Implement minimal notification orchestration**

Use injected providers so tests use real function calls with fake provider objects, not network APIs.

## Task 5: Provider Wrappers

**Files:**
- Create: `src/lib/notifications/email.ts`
- Create: `src/lib/notifications/sms.ts`
- Create: `src/lib/notifications/whatsapp.ts`

- [ ] **Step 1: Write provider input types**

Define shared `NotificationResult`, `EmailMessage`, `SmsMessage`, and `WhatsAppTemplateMessage`.

- [ ] **Step 2: Implement Resend wrapper**

Read `RESEND_API_KEY` and `RESEND_FROM_EMAIL` from env. Never hard-code API keys.

- [ ] **Step 3: Implement mNotify wrapper**

Read `MNOTIFY_API_KEY` and `MNOTIFY_SENDER_ID` from env.

- [ ] **Step 4: Implement Bird wrapper**

Read `BIRD_ACCESS_KEY`, `BIRD_WORKSPACE_ID`, `BIRD_WHATSAPP_CHANNEL_ID`, and template IDs from env.

## Task 6: Public Website MVP

**Files:**
- Create: `src/lib/content/hotel-content.ts`
- Create: `src/app/(public)/page.tsx`
- Create: `src/app/(public)/rooms/page.tsx`
- Create: `src/app/(public)/rooms/[slug]/page.tsx`
- Create: `src/app/(public)/gallery/page.tsx`
- Create: `src/app/(public)/restaurant/page.tsx`
- Create: `src/app/(public)/about/page.tsx`
- Create: `src/app/(public)/contact/page.tsx`
- Create: `src/app/(public)/booking/page.tsx`

- [ ] **Step 1: Seed hotel content**

Use imported assets from `importedLuxuryTouchAssets` and create room records for Standard, Delux Standard, Delux, Delux Twin Bed, and Presidential Suite.

- [ ] **Step 2: Build responsive shell**

Add header, mobile navigation, footer, and persistent booking action.

- [ ] **Step 3: Build pages**

Use real hotel content, imported imagery, and no placeholder testimonials/staff.

- [ ] **Step 4: Verify layout**

Run:

```powershell
npm.cmd run dev
```

Open local site and verify mobile/desktop pages render.

## Task 7: Booking API and Form

**Files:**
- Create: `src/app/api/bookings/route.ts`
- Create: `src/components/public/booking-form.tsx`
- Modify: `src/app/(public)/booking/page.tsx`

- [ ] **Step 1: Use schema in API**

Validate input with `bookingRequestSchema`.

- [ ] **Step 2: Persist request**

Insert into Supabase `booking_requests` with status `new`.

- [ ] **Step 3: Send submit notifications**

Call booking notification orchestration and log results.

- [ ] **Step 4: Build public form**

Show inline errors and success state saying the hotel will confirm availability.

## Task 8: Admin CMS MVP

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/bookings/page.tsx`
- Create: `src/app/admin/bookings/[id]/page.tsx`
- Create: `src/app/admin/rooms/page.tsx`
- Create: `src/app/admin/gallery/page.tsx`
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/components/admin/admin-shell.tsx`

- [ ] **Step 1: Build admin shell**

Sidebar links: Dashboard, Booking Requests, Rooms, Gallery, Settings.

- [ ] **Step 2: Build booking list/detail**

Support status updates to `contacted`, `approved`, `declined`, and `cancelled`.

- [ ] **Step 3: Trigger approval/decline notifications**

When status changes to approved or declined, call the matching customer notification orchestration.

- [ ] **Step 4: Build content management screens**

Rooms and gallery screens should support create/edit/hide operations in the MVP.

## Task 9: Verification

**Files:**
- Modify as needed based on test failures only.

- [ ] **Step 1: Run unit tests**

Run:

```powershell
npm.cmd test
```

Expected: all tests pass.

- [ ] **Step 2: Run lint**

Run:

```powershell
npm.cmd run lint
```

Expected: pass.

- [ ] **Step 3: Run local app**

Run:

```powershell
npm.cmd run dev
```

Expected: public site and admin routes load.

- [ ] **Step 4: Browser verify**

Use desktop and mobile widths to inspect homepage, rooms, gallery, booking form, and admin booking pages. Confirm imported images render and text does not overlap.

---

## Self-Review

Spec coverage:

- Next.js + Supabase architecture: covered by Tasks 1 and 3.
- Existing logo/image import: covered by Task 2.
- Public hotel pages: covered by Task 6.
- Booking requests: covered by Tasks 4 and 7.
- Email/SMS/WhatsApp providers: covered by Tasks 4 and 5.
- Admin CMS: covered by Task 8.
- Tests and verification: covered by Tasks 4 and 9.

Known implementation constraint:

- Production provider credentials are not available yet. Use `.env.example` placeholders and fail clearly when a provider key is missing.
