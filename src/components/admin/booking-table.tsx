import Link from "next/link";
import type { AdminBooking } from "./admin-data";
import { StatusBadge } from "./admin-ui";

export function BookingTable({ bookings }: { bookings: AdminBooking[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#ded8ce] text-xs uppercase text-[#6f6a60]">
            <th className="py-3 pr-4 font-semibold">Request</th>
            <th className="py-3 pr-4 font-semibold">Guest</th>
            <th className="py-3 pr-4 font-semibold">Stay</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Role</th>
            <th className="py-3 pr-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-[#eee8df] last:border-0">
              <td className="py-4 pr-4 font-semibold text-[#3e2a1d]">
                {booking.id}
                <span className="block text-xs font-normal text-[#6f6a60]">
                  {booking.submittedAt}
                </span>
              </td>
              <td className="py-4 pr-4">
                <span className="font-semibold">{booking.guestName}</span>
                <span className="block text-xs text-[#6f6a60]">{booking.phone}</span>
              </td>
              <td className="py-4 pr-4">
                {booking.roomName}
                <span className="block text-xs text-[#6f6a60]">
                  {booking.arrivalDate} to {booking.departureDate}
                </span>
              </td>
              <td className="py-4 pr-4">
                <StatusBadge status={booking.status} />
              </td>
              <td className="py-4 pr-4 capitalize text-[#6f6a60]">
                {booking.assignedRole}
              </td>
              <td className="py-4 pr-4">
                <Link
                  className="focus-ring inline-flex min-h-10 items-center rounded-md bg-[#0f6b63] px-3 text-sm font-semibold text-white"
                  href={`/admin/bookings/${booking.id}`}
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
