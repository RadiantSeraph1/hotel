import type { NotificationResult, WhatsAppTemplateMessage } from "./types";

type Env = Record<string, string | undefined>;
type Fetcher = typeof fetch;
type JsonObject = Record<string, unknown>;

type BirdWhatsAppProviderOptions = {
  env?: Env;
  fetcher?: Fetcher;
};

const DEFAULT_BIRD_BASE_URL = "https://api.bird.com";
const DEFAULT_TEMPLATE_LOCALE = "en";

function currentEnv(): Env {
  return typeof process === "undefined" ? {} : process.env;
}

function missingRequiredEnv(env: Env, keys: string[]) {
  return keys.filter((key) => !env[key]);
}

function failed(error: string): NotificationResult {
  return {
    channel: "whatsapp",
    status: "failed",
    error,
  };
}

async function readJson(response: Response): Promise<JsonObject> {
  try {
    const body: unknown = await response.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as JsonObject)
      : {};
  } catch {
    return {};
  }
}

function stringField(body: JsonObject, keys: string[]) {
  for (const key of keys) {
    const value = body[key];

    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return undefined;
}

function birdMessagesUrl(baseUrl: string, workspaceId: string, channelId: string) {
  const root = baseUrl.replace(/\/$/, "");
  return `${root}/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(channelId)}/messages`;
}

export function createBirdWhatsAppProvider(
  options: BirdWhatsAppProviderOptions = {},
) {
  const env = options.env ?? currentEnv();

  return {
    async sendWhatsAppTemplate(
      message: WhatsAppTemplateMessage,
    ): Promise<NotificationResult> {
      const missing = missingRequiredEnv(env, [
        "BIRD_ACCESS_KEY",
        "BIRD_WORKSPACE_ID",
        "BIRD_WHATSAPP_CHANNEL_ID",
      ]);

      if (missing.length > 0) {
        return failed(
          `Missing required whatsapp provider env: ${missing.join(", ")}`,
        );
      }

      const accessKey = env.BIRD_ACCESS_KEY;
      const workspaceId = env.BIRD_WORKSPACE_ID;
      const channelId = env.BIRD_WHATSAPP_CHANNEL_ID;

      if (!accessKey || !workspaceId || !channelId) {
        return failed("WhatsApp provider environment is incomplete");
      }

      const fetcher = options.fetcher ?? fetch;
      const response = await fetcher(
        birdMessagesUrl(env.BIRD_BASE_URL ?? DEFAULT_BIRD_BASE_URL, workspaceId, channelId),
        {
          method: "POST",
          headers: {
            Authorization: `AccessKey ${accessKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiver: {
              contacts: [
                {
                  identifierKey: "phonenumber",
                  identifierValue: message.to,
                },
              ],
            },
            template: {
              name: message.templateName,
              locale: env.BIRD_TEMPLATE_LOCALE ?? DEFAULT_TEMPLATE_LOCALE,
              parameters: Object.entries(message.parameters).map(([key, value]) => ({
                type: "string",
                key,
                value,
              })),
            },
          }),
        },
      );
      const body = await readJson(response);

      if (!response.ok) {
        return failed(
          stringField(body, ["message", "error", "detail"]) ??
            `Bird whatsapp send failed with status ${response.status}`,
        );
      }

      return {
        channel: "whatsapp",
        status: "sent",
        providerMessageId: stringField(body, ["id", "messageId"]),
      };
    },
  };
}

export async function sendWhatsAppTemplate(
  message: WhatsAppTemplateMessage,
  options?: BirdWhatsAppProviderOptions,
): Promise<NotificationResult> {
  return createBirdWhatsAppProvider(options).sendWhatsAppTemplate(message);
}
