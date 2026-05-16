import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  bookingStatusDescriptions,
  bookingStatusLabels,
  getBookingById,
  getLogsForBooking,
} from "@/components/admin/admin-data";
import {
  MockButton,
  SectionCard,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { NotificationLogTable } from "@/components/admin/notification-log-table";

type BookingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { id } = await params;
  const booking = getBookingById(decodeURIComponent(id));

  if (!booking) {
    notFound();
  }

  const logs = getLogsForBooking(booking.id);

  return (
    <AdminShell
      title={`Booking ${booking.id}`}
      description="Mock detail page for staff review, customer contact context, status language, and notification attempts."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <SectionCard
          title="Guest and stay details"
          description="Booking requests remain requests until staff approves them."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Detail label="Guest" value={booking.guestName} />
            <Detail label="Phone" value={booking.phone} />
            <Detail label="Email" value={booking.email} />
            <Detail label="Room" value={booking.roomName} />
            <Detail label="Arrival" value={booking.arrivalDate} />
            <Detail label="Departure" value={booking.departureDate} />
            <Detail label="Guests" value={String(booking.guests)} />
            <div>
              <p className="text-xs font-semibold uppercase text-[#6f6a60]">
                Current status
              </p>
              <div className="mt-2">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-md bg-[#f8f3ec] p-4 text-sm leading-6 text-[#3e2a1d]">
            {booking.notes}
          </div>
        </SectionCard>

        <SectionCard
          title="Status actions"
          description="These controls are visual-only in this local seed MVP."
        >
          <div className="space-y-3">
            {Object.entries(bookingStatusLabels)
              .filter(([status]) => status !== "new")
              .map(([status, label]) => (
                <div
                  key={status}
                  className="rounded-md border border-[#eee8df] p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#3e2a1d]">{label}</p>
                    <MockButton>Mark</MockButton>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#6f6a60]">
                    {bookingStatusDescriptions[status as keyof typeof bookingStatusLabels]}
                  </p>
                </div>
              ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <SectionCard
          title="Internal notes"
          description="Staff-only context for handoff between receptionist and manager roles."
        >
          <ul className="space-y-3 text-sm text-[#3e2a1d]">
            {booking.internalNotes.map((note) => (
              <li key={note} className="rounded-md bg-[#f8f3ec] p-3">
                {note}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Notification attempts"
          description="Approval and decline messages will add email, SMS, and WhatsApp attempts here once live actions are wired."
        >
          <NotificationLogTable logs={logs} />
        </SectionCard>
      </div>
    </AdminShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[#6f6a60]">{label}</p>
      <p className="mt-2 font-semibold text-[#3e2a1d]">{value}</p>
    </div>
  );
}
