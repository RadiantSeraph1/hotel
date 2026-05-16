import Image from "next/image";
import { AdminShell } from "@/components/admin/admin-shell";
import { seededGallery } from "@/components/admin/admin-data";
import { MockButton, SectionCard } from "@/components/admin/admin-ui";

export default function AdminGalleryPage() {
  return (
    <AdminShell
      title="Gallery"
      description="Gallery management shell for uploaded hotel images, categories, captions, sort order, and visible or hidden state."
    >
      <SectionCard
        title="Gallery images"
        description="Local imported assets are shown as seed data. Upload and reorder controls are placeholders for the persistence layer."
      >
        <div className="mb-5 flex flex-wrap gap-3">
          <MockButton>Upload image</MockButton>
          <MockButton>Reorder gallery</MockButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {seededGallery.map((item) => (
            <article
              key={item.id}
              className="rounded-md border border-[#eee8df] bg-white p-3"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#eee8df]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#3e2a1d]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#6f6a60]">{item.category}</p>
                  </div>
                  <span className="rounded-md bg-[#eee8df] px-2.5 py-1 text-xs font-semibold uppercase text-[#3e2a1d]">
                    {item.status}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <MockButton>Edit</MockButton>
                  <MockButton>{item.status === "visible" ? "Hide" : "Show"}</MockButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </AdminShell>
  );
}
