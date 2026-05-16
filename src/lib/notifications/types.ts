export type NotificationChannel = "email" | "sms" | "whatsapp";

export type NotificationResult =
  | {
      channel: NotificationChannel;
      status: "sent";
      providerMessageId?: string;
    }
  | {
      channel: NotificationChannel;
      status: "failed";
      error: string;
    };

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SmsMessage = {
  to: string;
  body: string;
};

export type WhatsAppTemplateMessage = {
  to: string;
  templateName: string;
  parameters: Record<string, string>;
};
