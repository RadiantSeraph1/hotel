import Image from "next/image";
import { Building2, MapPin, Waves } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import { facilities, hotel } from "@/lib/content/hotel-content";

export default function AboutPage() {
  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="About Luxury Touch Hotel"
          title="A polished hotel base in Tarkwa"
          copy="Luxury Touch Hotel serves guests visiting Tarkwa for work, education, events, and leisure with rooms, dining, pool, lounge, and meeting facilities close at hand."
          image={hotel.heroImages[0]}
          primaryAction={{ href: "/rooms", label: "View rooms" }}
          secondaryAction={{ href: "/contact", label: "Find us" }}
        />

        <section className="section">
          <div className="container split-grid">
            <div className="split-copy">
              <p className="eyebrow">Hotel profile</p>
              <h2>Comfortable stays near UMaT and central Tarkwa activity</h2>
              <p>
                The hotel combines practical guest rooms with useful on-site facilities, making it suitable for short work trips, campus visits, small events, family stays, and weekend breaks.
              </p>
              <div className="detail-list">
                <span>
                  <MapPin size={18} aria-hidden="true" />
                  {hotel.area}
                </span>
                <span>
                  <Building2 size={18} aria-hidden="true" />
                  Conference facilities
                </span>
                <span>
                  <Waves size={18} aria-hidden="true" />
                  Swimming pool
                </span>
              </div>
            </div>
            <div className="split-media">
              <Image src={facilities[0].image.src} alt={facilities[0].image.alt} fill sizes="(min-width: 900px) 50vw, 100vw" />
            </div>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container">
            <SectionHeading
              eyebrow="Facilities"
              title="Everything guests need in one place"
              copy="The MVP avoids placeholder staff and reviews, focusing instead on verifiable hotel spaces and services."
            />
            <div className="facility-cards">
              {facilities.map((facility) => (
                <article key={facility.title}>
                  <div className="facility-image">
                    <Image src={facility.image.src} alt={facility.image.alt} fill sizes="(min-width: 900px) 25vw, 100vw" />
                  </div>
                  <h3>{facility.title}</h3>
                  <p>{facility.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
