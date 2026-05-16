import { describe, expect, it, vi } from "vitest";

import { createMNotifySmsProvider } from "../../src/lib/notifications/sms";

const message = {
  to: "+233501112222",
  body: "Luxury Touch Hotel booking approved.",
};

describe("createMNotifySmsProvider", () => {
  it("returns a failed sms result when required environment is missing", async () => {
    const fetcher = vi.fn();
    const provider = createMNotifySmsProvider({
      env: {},
      fetcher,
    });

    const result = await provider.sendSms(message);

    expect(fetcher).not.toHaveBeenCalled();
    expect(result).toEqual({
      channel: "sms",
      status: "failed",
      error: "Missing required sms provider env: MNOTIFY_API_KEY, MNOTIFY_SENDER_ID",
    });
  });

  it("sends sms through mNotify with the expected request shape", async () => {
    const fetcher = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          message_id: "mnotify-message-id",
        }),
        { status: 200 },
      );
    });
    const provider = createMNotifySmsProvider({
      env: {
        MNOTIFY_API_KEY: "test-api-key",
        MNOTIFY_SENDER_ID: "LuxuryTouch",
        MNOTIFY_BASE_URL: "https://api.mnotify.test/api/sms/quick",
      },
      fetcher,
    });

    const result = await provider.sendSms(message);

    expect(fetcher).toHaveBeenCalledWith(
      "https://api.mnotify.test/api/sms/quick?key=test-api-key",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: [message.to],
          sender: "LuxuryTouch",
          message: message.body,
          is_schedule: false,
          schedule_date: "",
        }),
      },
    );
    expect(result).toEqual({
      channel: "sms",
      status: "sent",
      providerMessageId: "mnotify-message-id",
    });
  });
});
