import { Resend } from "resend";

import type { EmailMessage, NotificationResult } from "./types";

type Env = Record<string, string | undefined>;

type ResendEmailClient = {
  emails: {
    send(message: {
      from: string;
      to: string;
      subject: string;
      html: string;
      text: string;
    }): Promise<{
      data?: {
        id?: string;
      } | null;
      error?: {
        message?: string;
      } | null;
    }>;
  };
};

type ResendEmailProviderOptions = {
  env?: Env;
  client?: ResendEmailClient;
};

function currentEnv(): Env {
  return typeof process === "undefined" ? {} : process.env;
}

function missingRequiredEnv(env: Env, keys: string[]) {
  return keys.filter((key) => !env[key]);
}

function failed(error: string): NotificationResult {
  return {
    channel: "email",
    status: "failed",
    error,
  };
}

export function createResendEmailProvider(
  options: ResendEmailProviderOptions = {},
) {
  const env = options.env ?? currentEnv();

  return {
    async sendEmail(message: EmailMessage): Promise<NotificationResult> {
      const missing = missingRequiredEnv(env, [
        "RESEND_API_KEY",
        "RESEND_FROM_EMAIL",
      ]);

      if (missing.length > 0) {
        return failed(`Missing required email provider env: ${missing.join(", ")}`);
      }

      const apiKey = env.RESEND_API_KEY;
      const from = env.RESEND_FROM_EMAIL;

      if (!apiKey || !from) {
        return failed("Email provider environment is incomplete");
      }

      try {
        const client = options.client ?? new Resend(apiKey);
        const result = await client.emails.send({
          from,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
        });

        if (result.error) {
          return failed(result.error.message ?? "Resend email send failed");
        }

        return {
          channel: "email",
          status: "sent",
          providerMessageId: result.data?.id,
        };
      } catch (error) {
        return failed(error instanceof Error ? error.message : "Resend email send failed");
      }
    },
  };
}

export async function sendEmail(
  message: EmailMessage,
  options?: ResendEmailProviderOptions,
): Promise<NotificationResult> {
  return createResendEmailProvider(options).sendEmail(message);
}
