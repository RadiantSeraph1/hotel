import { describe, expect, it, vi } from "vitest";

import {
  sendBookingApprovedNotification,
  sendBookingDeclinedNotification,
  sendBookingSubmittedNotifications,
  type BookingNotificationProviders,
} from "../../src/lib/bookings/booking-notifications";
import type { NotificationResult } from "../../src/lib/notifications/types";

const booking = {
  id: "booking-123",
  guestName: "Ama Mensah",
  email: "ama@example.com",
  phone: "+233501112222",
  whatsApp: "+233501112222",
  roomName: "Delux",
  arrivalDate: "2026-06-10",
  departureDate: "2026-06-12",
  guests: 2,
};

const hotel = {
  email: "bookings@luxurytouchhotel.com",
  phone: "+233302000000",
  whatsApp: "+233302000000",
};

function sent(channel: NotificationResult["channel"]): NotificationResult {
  return {
    channel,
    status: "sent",
    providerMessageId: `${channel}-message-id`,
  };
}

function createProviders(): BookingNotificationProviders {
  return {
    email: {
      sendEmail: vi.fn(async () => sent("email")),
    },
    sms: {
      sendSms: vi.fn(async () => sent("sms")),
    },
    whatsapp: {
      sendWhatsAppTemplate: vi.fn(async () => sent("whatsapp")),
    },
  };
}

describe("booking notification orchestration", () => {
  it("sends booking received messages to the customer and hotel across all channels", async () => {
    const providers = createProviders();

    const results = await sendBookingSubmittedNotifications({
      booking,
      hotel,
      providers,
    });

    expect(results).toHaveLength(6);
    expect(providers.email.sendEmail).toHaveBeenCalledTimes(2);
    expect(providers.sms.sendSms).toHaveBeenCalledTimes(2);
    expect(providers.whatsapp.sendWhatsAppTemplate).toHaveBeenCalledTimes(2);
    expect(providers.email.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: booking.email,
        subject: expect.stringContaining("received"),
      }),
    );
    expect(providers.email.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: hotel.email,
        subject: expect.stringContaining("New booking request"),
      }),
    );
  });

  it("sends approval notification to the customer across all channels", async () => {
    const providers = createProviders();

    const results = await sendBookingApprovedNotification({
      booking,
      providers,
    });

    expect(results).toHaveLength(3);
    expect(providers.email.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: booking.email,
        subject: expect.stringContaining("approved"),
      }),
    );
    expect(providers.sms.sendSms).toHaveBeenCalledWith(
      expect.objectContaining({
        to: booking.phone,
        body: expect.stringContaining("approved"),
      }),
    );
    expect(providers.whatsapp.sendWhatsAppTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: booking.whatsApp,
        templateName: "booking_approved",
      }),
    );
  });

  it("sends decline notification to the customer across all channels", async () => {
    const providers = createProviders();

    const results = await sendBookingDeclinedNotification({
      booking,
      providers,
    });

    expect(results).toHaveLength(3);
    expect(providers.email.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: booking.email,
        subject: expect.stringContaining("declined"),
      }),
    );
    expect(providers.sms.sendSms).toHaveBeenCalledWith(
      expect.objectContaining({
        to: booking.phone,
        body: expect.stringContaining("declined"),
      }),
    );
    expect(providers.whatsapp.sendWhatsAppTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: booking.whatsApp,
        templateName: "booking_declined",
      }),
    );
  });

  it("returns loggable failed results when one channel fails", async () => {
    const providers = createProviders();
    vi.mocked(providers.sms.sendSms).mockRejectedValueOnce(
      new Error("provider unavailable"),
    );

    const results = await sendBookingApprovedNotification({
      booking,
      providers,
    });

    expect(results).toContainEqual({
      channel: "sms",
      status: "failed",
      error: "provider unavailable",
    });
    expect(results).toContainEqual(sent("email"));
    expect(results).toContainEqual(sent("whatsapp"));
  });
});
