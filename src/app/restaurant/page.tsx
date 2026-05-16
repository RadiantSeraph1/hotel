import Image from "next/image";
import Link from "next/link";
import { Clock, UtensilsCrossed, Wine } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import { restaurant } from "@/lib/content/hotel-content";

export default function RestaurantPage() {
  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="Restaurant and lounge"
          title="Dining and drinks without leaving the hotel"
          copy={restaurant.intro}
          image={restaurant.hero}
          primaryAction={{ href: "/booking", label: "Book a stay" }}
          secondaryAction={{ href: "/contact", label: "Contact hotel" }}
        />

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Service"
              title="Food, bar, and guest lounge spaces"
              copy="The original website promised local and continental dishes, drinks, cocktails, shakes, kebabs, and an executive lounge for relaxed meetings. That content is now structured for CMS editing."
            />
            <div className="feature-strip">
              <div>
                <UtensilsCrossed size={22} aria-hidden="true" />
                <span>Hotel dining</span>
              </div>
              <div>
                <Wine size={22} aria-hidden="true" />
                <span>Bar and lounge</span>
              </div>
              <div>
                <Clock size={22} aria-hidden="true" />
                <span>Menu updates coming through CMS</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container story-grid">
            {restaurant.sections.map((section) => (
              <article className="story-card" key={section.title}>
                <div className="story-image">
                  <Image src={section.image.src} alt={section.image.alt} fill sizes="(min-width: 900px) 33vw, 100vw" />
                </div>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container cta-band">
            <div>
              <p className="eyebrow">Private stays and groups</p>
              <h2>Planning a meeting, stay, or group meal?</h2>
              <p>Contact the hotel with your dates and group size so staff can confirm room and dining availability.</p>
            </div>
            <Link className="button button-primary focus-ring" href="/contact">
              Contact hotel
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
