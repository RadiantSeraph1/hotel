import { clsx } from "clsx";
import type {
  BookingStatus,
  NotificationChannel,
  NotificationStatus,
} from "./admin-data";
import { bookingStatusLabels } from "./admin-data";

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border border-[#ded8ce] bg-white p-5">
      <p className="text-sm font-semibold text-[#6f6a60]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#3e2a1d]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#6f6a60]">{detail}</p>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-[#ded8ce] bg-white">
      <div className="border-b border-[#ded8ce] px-5 py-4">
        <h3 className="text-lg font-semibold text-[#3e2a1d]">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-[#6f6a60]">{description}</p>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex min-h-7 items-center rounded-md px-2.5 text-xs font-semibold",
        status === "new" && "bg-[#e9f6f4] text-[#0f6b63]",
        status === "contacted" && "bg-[#f4ecd8] text-[#7a521d]",
        status === "approved" && "bg-[#e5f2e8] text-[#246b35]",
        status === "declined" && "bg-[#f7e4e1] text-[#9b2f22]",
        status === "cancelled" && "bg-[#ece9e3] text-[#5b554b]",
      )}
    >
      {bookingStatusLabels[status]}
    </span>
  );
}

export function NotificationBadge({
  status,
}: {
  status: NotificationStatus;
}) {
  return (
    <span
      className={clsx(
        "inline-flex min-h-7 items-center rounded-md px-2.5 text-xs font-semibold",
        status === "sent" && "bg-[#e5f2e8] text-[#246b35]",
        status === "failed" && "bg-[#f7e4e1] text-[#9b2f22]",
        status === "queued" && "bg-[#f4ecd8] text-[#7a521d]",
      )}
    >
      {status}
    </span>
  );
}

export function ChannelBadge({ channel }: { channel: NotificationChannel }) {
  return (
    <span className="inline-flex min-h-7 items-center rounded-md bg-[#eee8df] px-2.5 text-xs font-semibold uppercase text-[#3e2a1d]">
      {channel}
    </span>
  );
}

export function MockButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="focus-ring min-h-10 rounded-md border border-[#cfc5b8] bg-white px-3 text-sm font-semibold text-[#3e2a1d] hover:bg-[#f8f3ec]">
      {children}
    </button>
  );
}
