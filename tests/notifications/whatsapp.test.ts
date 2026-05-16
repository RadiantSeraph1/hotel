import { describe, expect, it, vi } from "vitest";

import { createBirdWhatsAppProvider } from "../../src/lib/notifications/whatsapp";

const message = {
  to: "+233501112222",
  templateName: "booking_approved",
  parameters: {
    guestName: "Ama Mensah",
    roomName: "Delux",
  },
};

describe("createBirdWhatsAppProvider", () => {
  it("returns a failed whatsapp result when required environment is missing", async () => {
    const fetcher = vi.fn();
    const provider = createBirdWhatsAppProvider({
      env: {},
      fetcher,
    });

    const result = await provider.sendWhatsAppTemplate(message);

    expect(fetcher).not.toHaveBeenCalled();
    expect(result).toEqual({
      channel: "whatsapp",
      status: "failed",
      error:
        "Missing required whatsapp provider env: BIRD_ACCESS_KEY, BIRD_WORKSPACE_ID, BIRD_WHATSAPP_CHANNEL_ID",
    });
  });

  it("sends a whatsapp template through Bird with the expected request shape", async () => {
    const fetcher = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          id: "bird-message-id",
        }),
        { status: 202 },
      );
    });
    const provider = createBirdWhatsAppProvider({
      env: {
        BIRD_ACCESS_KEY: "test-access-key",
        BIRD_WORKSPACE_ID: "workspace-id",
        BIRD_WHATSAPP_CHANNEL_ID: "channel-id",
        BIRD_TEMPLATE_LOCALE: "en_GH",
      },
      fetcher,
    });

    const result = await provider.sendWhatsAppTemplate(message);

    expect(fetcher).toHaveBeenCalledWith(
      "https://api.bird.com/workspaces/workspace-id/channels/channel-id/messages",
      {
        method: "POST",
        headers: {
          Authorization: "AccessKey test-access-key",
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
            name: "booking_approved",
            locale: "en_GH",
            parameters: [
              {
                type: "string",
                key: "guestName",
                value: "Ama Mensah",
              },
              {
                type: "string",
                key: "roomName",
                value: "Delux",
              },
            ],
          },
        }),
      },
    );
    expect(result).toEqual({
      channel: "whatsapp",
      status: "sent",
      providerMessageId: "bird-message-id",
    });
  });
});
