import { NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/bookings/booking-schema";
import { createBookingRequest } from "@/lib/bookings/booking-repository";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const booking = await createBookingRequest(parsed.data);

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      message:
        "Your booking request has been received. Luxury Touch Hotel will confirm availability shortly.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to save the booking request.",
      },
      { status: 500 },
    );
  }
}
