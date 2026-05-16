import { AdminShell } from "@/components/admin/admin-shell";
import { adminRoles, notificationLogs } from "@/components/admin/admin-data";
import { NotificationLogTable } from "@/components/admin/notification-log-table";
import { MockButton, SectionCard } from "@/components/admin/admin-ui";

const providerStatus = [
  {
    name: "Resend email",
    env: "RESEND_API_KEY",
    status: "Not configured",
    detail: "Used for customer acknowledgements and hotel booking alerts.",
  },
  {
    name: "mNotify SMS",
    env: "MNOTIFY_API_KEY",
    status: "Not configured",
    detail: "Used for concise booking status messages.",
  },
  {
    name: "Bird WhatsApp",
    env: "BIRD_ACCESS_KEY",
    status: "Not configured",
    detail: "Requires approved WhatsApp templates before production sends.",
  },
];

export default function AdminSettingsPage() {
  return (
    <AdminShell
      title="Settings"
      description="Hotel contact settings, notification provider readiness, message template names, and role language for staff access."
    >
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <SectionCard
          title="Hotel contact"
          description="Seed values for the CMS settings screen."
        >
          <div className="space-y-4 text-sm">
            <Setting label="Hotel" value="Luxury Touch Hotel" />
            <Setting label="Location" value="Tarkwa, Ghana" />
            <Setting label="Booking email" value="bookings@luxurytouchhotel.com" />
            <Setting label="Booking phone" value="+233 XX XXX XXXX" />
            <MockButton>Edit settings</MockButton>
          </div>
        </SectionCard>

        <SectionCard
          title="Notification providers"
          description="Missing provider configuration should remain visible to managers before launch."
        >
          <div className="grid gap-3 md:grid-cols-3">
            {providerStatus.map((provider) => (
              <div
                key={provider.name}
                className="rounded-md border border-[#eee8df] p-4"
              >
                <p className="font-semibold text-[#3e2a1d]">{provider.name}</p>
                <p className="mt-2 rounded-md bg-[#f7e4e1] px-2.5 py-1 text-xs font-semibold text-[#9b2f22]">
                  {provider.status}
                </p>
                <p className="mt-3 text-xs font-semibold text-[#6f6a60]">
                  {provider.env}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6f6a60]">
                  {provider.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
        <SectionCard
          title="Role language"
          description="Initial roles from the spec."
        >
          <div className="space-y-3">
            {Object.entries(adminRoles).map(([role, label]) => (
              <div key={role} className="rounded-md bg-[#f8f3ec] p-4">
                <p className="font-semibold capitalize text-[#3e2a1d]">{role}</p>
                <p className="mt-1 text-sm leading-6 text-[#6f6a60]">{label}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent notification log"
          description="Managers can inspect provider status and recent delivery attempts together."
        >
          <NotificationLogTable logs={notificationLogs} />
        </SectionCard>
      </div>
    </AdminShell>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[#6f6a60]">{label}</p>
      <p className="mt-1 font-semibold text-[#3e2a1d]">{value}</p>
    </div>
  );
}
