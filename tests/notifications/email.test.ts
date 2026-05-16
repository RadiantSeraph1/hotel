import { describe, expect, it, vi } from "vitest";

import { createResendEmailProvider } from "../../src/lib/notifications/email";

const message = {
  to: "guest@example.com",
  subject: "Booking approved",
  html: "<p>Your booking was approved.</p>",
  text: "Your booking was approved.",
};

describe("createResendEmailProvider", () => {
  it("returns a failed email result when required environment is missing", async () => {
    const provider = createResendEmailProvider({
      env: {},
      client: {
        emails: {
          send: vi.fn(),
        },
      },
    });

    const result = await provider.sendEmail(message);

    expect(result).toEqual({
      channel: "email",
      status: "failed",
      error: "Missing required email provider env: RESEND_API_KEY, RESEND_FROM_EMAIL",
    });
  });

  it("sends email through Resend with the configured from address", async () => {
    const send = vi.fn(async () => ({
      data: {
        id: "resend-message-id",
      },
    }));
    const provider = createResendEmailProvider({
      env: {
        RESEND_API_KEY: "test-api-key",
        RESEND_FROM_EMAIL: "Luxury Touch <bookings@example.com>",
      },
      client: {
        emails: {
          send,
        },
      },
    });

    const result = await provider.sendEmail(message);

    expect(send).toHaveBeenCalledWith({
      from: "Luxury Touch <bookings@example.com>",
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    expect(result).toEqual({
      channel: "email",
      status: "sent",
      providerMessageId: "resend-message-id",
    });
  });
});
