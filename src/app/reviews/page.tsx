import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { ReviewGrid } from "@/components/public/review-card";
import { PublicShell } from "@/components/public/site-shell";
import { guestReviews, hotel } from "@/lib/content/hotel-content";

export default function ReviewsPage() {
  const publishedReviews = guestReviews.filter(
    (review) => review.status === "published",
  );

  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="Guest reviews"
          title="Guest feedback from Luxury Touch Hotel"
          copy="Read guest feedback from business stays, family weekends, meetings, and visits to Tarkwa."
          image={hotel.heroImages[1]}
          primaryAction={{ href: "/booking", label: "Request booking" }}
          secondaryAction={{ href: "/rooms", label: "View rooms" }}
        />

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Published reviews"
              title="Recent guest experiences"
              copy="Reviews highlight the room comfort, restaurant, pool, conference room, and staff service guests can expect."
            />
            <ReviewGrid reviews={publishedReviews} />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
