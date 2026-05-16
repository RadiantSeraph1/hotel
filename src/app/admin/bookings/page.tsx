import { AdminShell } from "@/components/admin/admin-shell";
import {
  bookingStatusDescriptions,
  bookingStatusLabels,
  seededBookings,
} from "@/components/admin/admin-data";
import { BookingTable } from "@/components/admin/booking-table";
import { SectionCard, StatusBadge } from "@/components/admin/admin-ui";

export default function AdminBookingsPage() {
  return (
    <AdminShell
      title="Booking Requests"
      description="Reception and manager workspace for viewing requests, filtering by state, and preparing approval, decline, cancellation, or contact updates."
    >
      <div className="mb-6 grid gap-3 md:grid-cols-5">
        {Object.entries(bookingStatusLabels).map(([status, label]) => (
          <div key={status} className="rounded-md border border-[#ded8ce] bg-white p-4">
            <StatusBadge status={status as keyof typeof bookingStatusLabels} />
            <p className="mt-3 text-sm font-semibold text-[#3e2a1d]">{label}</p>
            <p className="mt-1 text-xs leading-5 text-[#6f6a60]">
              {bookingStatusDescriptions[status as keyof typeof bookingStatusLabels]}
            </p>
          </div>
        ))}
      </div>

      <SectionCard
        title="All seeded requests"
        description="Local mock data for the MVP shell. Supabase reads and mutations can replace this source later."
      >
        <BookingTable bookings={seededBookings} />
      </SectionCard>
    </AdminShell>
  );
}
