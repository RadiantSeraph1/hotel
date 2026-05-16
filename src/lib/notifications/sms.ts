import type { NotificationResult, SmsMessage } from "./types";

type Env = Record<string, string | undefined>;
type Fetcher = typeof fetch;
type JsonObject = Record<string, unknown>;

type MNotifySmsProviderOptions = {
  env?: Env;
  fetcher?: Fetcher;
};

const DEFAULT_MNOTIFY_BASE_URL = "https://api.mnotify.com/api/sms/quick";

function currentEnv(): Env {
  return typeof process === "undefined" ? {} : process.env;
}

function missingRequiredEnv(env: Env, keys: string[]) {
  return keys.filter((key) => !env[key]);
}

function failed(error: string): NotificationResult {
  return {
    channel: "sms",
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

function mNotifyUrl(baseUrl: string, apiKey: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("key", apiKey);
  return url.toString();
}

export function createMNotifySmsProvider(
  options: MNotifySmsProviderOptions = {},
) {
  const env = options.env ?? currentEnv();

  return {
    async sendSms(message: SmsMessage): Promise<NotificationResult> {
      const missing = missingRequiredEnv(env, [
        "MNOTIFY_API_KEY",
        "MNOTIFY_SENDER_ID",
      ]);

      if (missing.length > 0) {
        return failed(`Missing required sms provider env: ${missing.join(", ")}`);
      }

      const apiKey = env.MNOTIFY_API_KEY;
      const sender = env.MNOTIFY_SENDER_ID;

      if (!apiKey || !sender) {
        return failed("SMS provider environment is incomplete");
      }

      const fetcher = options.fetcher ?? fetch;
      const response = await fetcher(
        mNotifyUrl(env.MNOTIFY_BASE_URL ?? DEFAULT_MNOTIFY_BASE_URL, apiKey),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: [message.to],
            sender,
            message: message.body,
            is_schedule: false,
            schedule_date: "",
          }),
        },
      );
      const body = await readJson(response);

      if (!response.ok) {
        return failed(
          stringField(body, ["message", "error"]) ??
            `mNotify sms send failed with status ${response.status}`,
        );
      }

      return {
        channel: "sms",
        status: "sent",
        providerMessageId: stringField(body, ["message_id", "messageId", "id"]),
      };
    },
  };
}

export async function sendSms(
  message: SmsMessage,
  options?: MNotifySmsProviderOptions,
): Promise<NotificationResult> {
  return createMNotifySmsProvider(options).sendSms(message);
}
