import { z } from "zod";

function isValidDate(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time);
}

export const bookingRequestSchema = z
  .object({
    guestName: z.string().trim().min(1, "Guest name is required"),
    email: z.email("A valid email is required").trim(),
    phone: z.string().trim().min(1, "Phone number is required"),
    roomSlug: z.string().trim().min(1, "Room is required"),
    arrivalDate: z
      .string()
      .trim()
      .refine(isValidDate, "Arrival date is required"),
    departureDate: z
      .string()
      .trim()
      .refine(isValidDate, "Departure date is required"),
    guests: z.number().int().positive().default(1),
    notes: z.string().trim().optional(),
  })
  .refine(
    (booking) => Date.parse(booking.departureDate) > Date.parse(booking.arrivalDate),
    {
      message: "Departure date must be after arrival date",
      path: ["departureDate"],
    },
  );

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
