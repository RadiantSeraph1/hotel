import Image from "next/image";
import { Star } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { seededReviews } from "@/components/admin/admin-data";
import { MockButton, SectionCard } from "@/components/admin/admin-ui";

export default function AdminReviewsPage() {
  return (
    <AdminShell
      title="Reviews"
      description="Manage guest review content, star ratings, stay type, guest image, and public visibility before Supabase CMS writes are connected."
    >
      <SectionCard
        title="Guest reviews"
        description="Published reviews appear on the public home and reviews pages."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {seededReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-md border border-[#eee8df] bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={review.image}
                  alt=""
                  width={52}
                  height={52}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-[#3e2a1d]">{review.guestName}</h3>
                  <p className="text-sm text-[#6f6a60]">
                    {review.guestLocation} · {review.stayType}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-1 text-[#b78b3f]">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill={index < review.rating ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-[#6f6a60]">
                “{review.quote}”
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <ReviewStatusBadge status={review.status} />
                <MockButton>Edit review</MockButton>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </AdminShell>
  );
}

function ReviewStatusBadge({
  status,
}: {
  status: "draft" | "published" | "hidden";
}) {
  const classes = {
    draft: "bg-[#f4ecd8] text-[#7a521d]",
    published: "bg-[#e5f2e8] text-[#246b35]",
    hidden: "bg-[#ece9e3] text-[#5b554b]",
  };

  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-md px-2.5 text-xs font-semibold ${classes[status]}`}
    >
      {status}
    </span>
  );
}
