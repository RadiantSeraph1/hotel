import {
  Bell,
  CalendarCheck,
  Hotel,
  ImageIcon,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Booking Requests", icon: CalendarCheck },
  { href: "/admin/rooms", label: "Rooms", icon: Hotel },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#171612]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#ded8ce] bg-[#221912] text-white lg:border-b-0 lg:border-r">
          <div className="px-5 py-6">
            <p className="text-xs font-semibold uppercase text-[#d6b98f]">
              Luxury Touch Hotel
            </p>
            <h1 className="mt-2 text-xl font-semibold">CMS Admin</h1>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-3 pb-4 lg:block lg:space-y-1 lg:overflow-visible">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-semibold text-[#f7efe2] hover:bg-white/10"
                >
                  <Icon aria-hidden="true" size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden border-t border-white/10 p-5 text-sm text-[#d8c8b7] lg:block">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Bell aria-hidden="true" size={16} />
              Notification visibility
            </div>
            <p className="mt-2 leading-6">
              Email, SMS, and WhatsApp attempts stay visible for staff review.
            </p>
          </div>
        </aside>
        <section>
          <header className="border-b border-[#ded8ce] bg-[#fbfaf7] px-5 py-6 md:px-8">
            <p className="text-sm font-semibold uppercase text-[#0f6b63]">
              Staff workspace
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-[#3e2a1d]">
              {title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6f6a60]">
              {description}
            </p>
          </header>
          <div className="p-5 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
