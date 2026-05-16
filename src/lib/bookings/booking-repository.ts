import type { BookingRequestInput } from "./booking-schema";
import { getSupabaseServiceClient } from "../supabase/server";

export type StoredBookingRequest = BookingRequestInput & {
  id: string;
  status: "new" | "contacted" | "approved" | "declined" | "cancelled";
};

export async function createBookingRequest(
  input: BookingRequestInput,
): Promise<StoredBookingRequest> {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return {
      ...input,
      id: `local-${Date.now()}`,
      status: "new",
    };
  }

  const { data, error } = await supabase
    .from("booking_requests")
    .insert({
      guest_name: input.guestName,
      email: input.email,
      phone: input.phone,
      room_slug: input.roomSlug,
      arrival_date: input.arrivalDate,
      departure_date: input.departureDate,
      guests: input.guests,
      special_requests: input.notes ?? null,
      status: "new",
    })
    .select("id,status")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...input,
    id: String(data.id),
    status: data.status as StoredBookingRequest["status"],
  };
}
