import Image from "next/image";
import { AdminShell } from "@/components/admin/admin-shell";
import { seededRooms } from "@/components/admin/admin-data";
import { MockButton, SectionCard } from "@/components/admin/admin-ui";

export default function AdminRoomsPage() {
  return (
    <AdminShell
      title="Rooms"
      description="Seeded room content management shell for names, prices, occupancy, amenities, images, and active or inactive state."
    >
      <SectionCard
        title="Room inventory"
        description="Create, edit, and hide operations are represented as MVP controls until persistence is connected."
      >
        <div className="mb-5 flex flex-wrap gap-3">
          <MockButton>Create room</MockButton>
          <MockButton>Reorder rooms</MockButton>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {seededRooms.map((room) => (
            <article
              key={room.id}
              className="grid gap-4 rounded-md border border-[#eee8df] p-4 sm:grid-cols-[150px_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#eee8df]">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(min-width: 1024px) 150px, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#3e2a1d]">
                      {room.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#6f6a60]">
                      {room.rate} · {room.occupancy}
                    </p>
                  </div>
                  <span className="rounded-md bg-[#eee8df] px-2.5 py-1 text-xs font-semibold uppercase text-[#3e2a1d]">
                    {room.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6f6a60]">
                  {room.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-md bg-[#f8f3ec] px-2.5 py-1 text-xs font-semibold text-[#3e2a1d]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <MockButton>Edit</MockButton>
                  <MockButton>{room.status === "active" ? "Hide" : "Show"}</MockButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </AdminShell>
  );
}
