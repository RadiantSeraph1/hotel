import type {
  EmailMessage,
  NotificationChannel,
  NotificationResult,
  SmsMessage,
  WhatsAppTemplateMessage,
} from "../notifications/types";

export type BookingNotificationProviders = {
  email: {
    sendEmail(message: EmailMessage): Promise<NotificationResult>;
  };
  sms: {
    sendSms(message: SmsMessage): Promise<NotificationResult>;
  };
  whatsapp: {
    sendWhatsAppTemplate(
      message: WhatsAppTemplateMessage,
    ): Promise<NotificationResult>;
  };
};

export type BookingNotificationBooking = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  whatsApp?: string;
  roomName: string;
  arrivalDate: string;
  departureDate: string;
  guests: number;
};

export type HotelNotificationContact = {
  email: string;
  phone: string;
  whatsApp?: string;
};

type SubmittedNotificationInput = {
  booking: BookingNotificationBooking;
  hotel: HotelNotificationContact;
  providers: BookingNotificationProviders;
};

type CustomerNotificationInput = {
  booking: BookingNotificationBooking;
  providers: BookingNotificationProviders;
};

async function safelySend(
  channel: NotificationChannel,
  send: () => Promise<NotificationResult>,
): Promise<NotificationResult> {
  try {
    return await send();
  } catch (error) {
    return {
      channel,
      status: "failed",
      error: error instanceof Error ? error.message : "Notification failed",
    };
  }
}

function bookingSummary(booking: BookingNotificationBooking) {
  return `${booking.roomName}, ${booking.arrivalDate} to ${booking.departureDate}, ${booking.guests} guest(s)`;
}

function customerReceivedEmail(booking: BookingNotificationBooking): EmailMessage {
  const summary = bookingSummary(booking);

  return {
    to: booking.email,
    subject: "Booking request received",
    text: `Hello ${booking.guestName}, we received your booking request for ${summary}.`,
    html: `<p>Hello ${booking.guestName},</p><p>We received your booking request for ${summary}.</p>`,
  };
}

function hotelAlertEmail(
  booking: BookingNotificationBooking,
  hotel: HotelNotificationContact,
): EmailMessage {
  const summary = bookingSummary(booking);

  return {
    to: hotel.email,
    subject: "New booking request",
    text: `New booking request from ${booking.guestName}: ${summary}. Contact: ${booking.email}, ${booking.phone}.`,
    html: `<p>New booking request from ${booking.guestName}: ${summary}.</p><p>Contact: ${booking.email}, ${booking.phone}.</p>`,
  };
}

function customerSms(booking: BookingNotificationBooking, status: string): SmsMessage {
  return {
    to: booking.phone,
    body: `Luxury Touch Hotel booking ${status}: ${bookingSummary(booking)}.`,
  };
}

function hotelAlertSms(
  booking: BookingNotificationBooking,
  hotel: HotelNotificationContact,
): SmsMessage {
  return {
    to: hotel.phone,
    body: `New booking request from ${booking.guestName}: ${bookingSummary(booking)}.`,
  };
}

function customerWhatsApp(
  booking: BookingNotificationBooking,
  templateName: string,
): WhatsAppTemplateMessage {
  return {
    to: booking.whatsApp ?? booking.phone,
    templateName,
    parameters: {
      guestName: booking.guestName,
      roomName: booking.roomName,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate,
    },
  };
}

function hotelAlertWhatsApp(
  booking: BookingNotificationBooking,
  hotel: HotelNotificationContact,
): WhatsAppTemplateMessage {
  return {
    to: hotel.whatsApp ?? hotel.phone,
    templateName: "hotel_booking_alert",
    parameters: {
      guestName: booking.guestName,
      roomName: booking.roomName,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate,
      phone: booking.phone,
    },
  };
}

function customerStatusEmail(
  booking: BookingNotificationBooking,
  status: "approved" | "declined",
): EmailMessage {
  const summary = bookingSummary(booking);

  return {
    to: booking.email,
    subject: `Booking request ${status}`,
    text: `Hello ${booking.guestName}, your booking request for ${summary} has been ${status}.`,
    html: `<p>Hello ${booking.guestName},</p><p>Your booking request for ${summary} has been ${status}.</p>`,
  };
}

export async function sendBookingSubmittedNotifications({
  booking,
  hotel,
  providers,
}: SubmittedNotificationInput): Promise<NotificationResult[]> {
  return Promise.all([
    safelySend("email", () => providers.email.sendEmail(customerReceivedEmail(booking))),
    safelySend("sms", () =>
      providers.sms.sendSms(customerSms(booking, "received")),
    ),
    safelySend("whatsapp", () =>
      providers.whatsapp.sendWhatsAppTemplate(
        customerWhatsApp(booking, "booking_request_received"),
      ),
    ),
    safelySend("email", () =>
      providers.email.sendEmail(hotelAlertEmail(booking, hotel)),
    ),
    safelySend("sms", () => providers.sms.sendSms(hotelAlertSms(booking, hotel))),
    safelySend("whatsapp", () =>
      providers.whatsapp.sendWhatsAppTemplate(hotelAlertWhatsApp(booking, hotel)),
    ),
  ]);
}

async function sendCustomerStatusNotifications(
  booking: BookingNotificationBooking,
  providers: BookingNotificationProviders,
  status: "approved" | "declined",
): Promise<NotificationResult[]> {
  return Promise.all([
    safelySend("email", () =>
      providers.email.sendEmail(customerStatusEmail(booking, status)),
    ),
    safelySend("sms", () => providers.sms.sendSms(customerSms(booking, status))),
    safelySend("whatsapp", () =>
      providers.whatsapp.sendWhatsAppTemplate(
        customerWhatsApp(booking, `booking_${status}`),
      ),
    ),
  ]);
}

export async function sendBookingApprovedNotification({
  booking,
  providers,
}: CustomerNotificationInput): Promise<NotificationResult[]> {
  return sendCustomerStatusNotifications(booking, providers, "approved");
}

export async function sendBookingDeclinedNotification({
  booking,
  providers,
}: CustomerNotificationInput): Promise<NotificationResult[]> {
  return sendCustomerStatusNotifications(booking, providers, "declined");
}
