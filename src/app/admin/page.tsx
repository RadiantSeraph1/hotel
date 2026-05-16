import { AdminShell } from "@/components/admin/admin-shell";
import {
  adminRoles,
  notificationLogs,
  seededBookings,
  seededGallery,
  seededRooms,
} from "@/components/admin/admin-data";
import { BookingTable } from "@/components/admin/booking-table";
import { NotificationLogTable } from "@/components/admin/notification-log-table";
import { SectionCard, StatCard } from "@/components/admin/admin-ui";

export default function AdminDashboardPage() {
  const newRequests = seededBookings.filter(
    (booking) => booking.status === "new",
  ).length;
  const approved = seededBookings.filter(
    (booking) => booking.status === "approved",
  ).length;
  const declined = seededBookings.filter(
    (booking) => booking.status === "declined",
  ).length;
  const failedLogs = notificationLogs.filter((log) => log.status === "failed").length;

  return (
    <AdminShell
      title="Dashboard"
      description="Operational view for booking requests, content inventory, staff role language, and notification delivery health."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="New booking requests"
          value={String(newRequests)}
          detail="Reception should review and contact these guests first."
        />
        <StatCard
          label="Approved bookings"
          value={String(approved)}
          detail="Confirmed requests from the current seed data."
        />
        <StatCard
          label="Declined bookings"
          value={String(declined)}
          detail="Requests the hotel could not accept."
        />
        <StatCard
          label="Notification failures"
          value={String(failedLogs)}
          detail="Failed email, SMS, or WhatsApp attempts visible to staff."
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard
          title="Recent booking requests"
          description="Mock list backed by local seed data until Supabase booking reads are connected."
        >
          <BookingTable bookings={seededBookings.slice(0, 3)} />
        </SectionCard>

        <SectionCard
          title="Content shortcuts"
          description="Current CMS content counts and staff role scope."
        >
          <div className="space-y-4 text-sm">
            <div className="rounded-md bg-[#f8f3ec] p-4">
              <p className="font-semibold text-[#3e2a1d]">Rooms</p>
              <p className="mt-1 text-[#6f6a60]">
                {seededRooms.length} seeded room records,{" "}
                {seededRooms.filter((room) => room.status === "active").length} active.
              </p>
            </div>
            <div className="rounded-md bg-[#f8f3ec] p-4">
              <p className="font-semibold text-[#3e2a1d]">Gallery</p>
              <p className="mt-1 text-[#6f6a60]">
                {seededGallery.length} seeded images with visible/hidden state.
              </p>
            </div>
            {Object.entries(adminRoles).map(([role, label]) => (
              <div key={role} className="rounded-md border border-[#eee8df] p-4">
                <p className="font-semibold capitalize text-[#3e2a1d]">{role}</p>
                <p className="mt-1 text-[#6f6a60]">{label}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard
          title="Notification log visibility"
          description="Failures must not hide behind the booking workflow; staff can inspect provider attempts here."
        >
          <NotificationLogTable logs={notificationLogs} />
        </SectionCard>
      </div>
    </AdminShell>
  );
}
