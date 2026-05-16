import { describe, expect, it } from "vitest";

import { bookingRequestSchema } from "../../src/lib/bookings/booking-schema";

const validBooking = {
  guestName: "Ama Mensah",
  email: "ama@example.com",
  phone: "+233501112222",
  roomSlug: "delux",
  arrivalDate: "2026-06-10",
  departureDate: "2026-06-12",
  guests: 2,
  notes: "Late arrival",
};

describe("bookingRequestSchema", () => {
  it("accepts valid booking input", () => {
    const parsed = bookingRequestSchema.parse(validBooking);

    expect(parsed).toEqual(validBooking);
  });

  it.each([
    ["missing name", { guestName: "" }],
    ["invalid email", { email: "not-an-email" }],
    ["missing phone", { phone: "" }],
    ["missing room", { roomSlug: "" }],
  ])("rejects %s", (_caseName, override) => {
    const result = bookingRequestSchema.safeParse({
      ...validBooking,
      ...override,
    });

    expect(result.success).toBe(false);
  });

  it("rejects departure before arrival", () => {
    const result = bookingRequestSchema.safeParse({
      ...validBooking,
      arrivalDate: "2026-06-12",
      departureDate: "2026-06-10",
    });

    expect(result.success).toBe(false);
  });
});
