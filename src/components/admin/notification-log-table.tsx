import type { NotificationLog } from "./admin-data";
import { ChannelBadge, NotificationBadge } from "./admin-ui";

export function NotificationLogTable({ logs }: { logs: NotificationLog[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#ded8ce] text-xs uppercase text-[#6f6a60]">
            <th className="py-3 pr-4 font-semibold">Time</th>
            <th className="py-3 pr-4 font-semibold">Booking</th>
            <th className="py-3 pr-4 font-semibold">Channel</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Recipient</th>
            <th className="py-3 pr-4 font-semibold">Detail</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-[#eee8df] last:border-0">
              <td className="py-4 pr-4 text-[#6f6a60]">{log.createdAt}</td>
              <td className="py-4 pr-4 font-semibold text-[#3e2a1d]">
                {log.bookingId}
                <span className="block text-xs font-normal text-[#6f6a60]">
                  {log.messageType}
                </span>
              </td>
              <td className="py-4 pr-4">
                <ChannelBadge channel={log.channel} />
              </td>
              <td className="py-4 pr-4">
                <NotificationBadge status={log.status} />
              </td>
              <td className="py-4 pr-4">{log.recipient}</td>
              <td className="py-4 pr-4 text-[#6f6a60]">{log.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
