import Image from "next/image";
import { Building2, Check, MapPin, Waves } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import {
  aboutHighlights,
  hotel,
  hotelStats,
  serviceHighlights,
} from "@/lib/content/hotel-content";

export default function AboutPage() {
  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="About Luxury Touch Hotel"
          title="Luxury Touch Hotel, since 2021"
          copy="A true Tarkwa getaway near UMaT, with 20 guest rooms, restaurant and bar, executive lounge, pool, and meeting facilities."
          image={hotel.heroImages[0]}
          primaryAction={{ href: "/rooms", label: "View rooms" }}
          secondaryAction={{ href: "/contact", label: "Find us" }}
        />

        <section className="section">
          <div className="container split-grid">
            <div className="split-copy">
              <p className="eyebrow">Hotel profile</p>
              <h2>Located in the hills with warm Ghanaian room design</h2>
              <p>
                Luxury Touch Hotel is close to Agric hills and about five minutes from the University of Mines and Technology. The hotel combines bright rooms, suites, dining, lounge service, meeting facilities, and safety-minded hospitality.
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
              <Image src={serviceHighlights[0].image!.src} alt={serviceHighlights[0].image!.alt} fill sizes="(min-width: 900px) 50vw, 100vw" />
            </div>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container stats-grid">
            {hotelStats.map((stat) => (
              <div key={stat.label}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container split-grid">
            <div className="split-copy">
              <p className="eyebrow">Best known for</p>
              <h2>Comfort, food, poolside breaks, and attentive service</h2>
              <p>
                The original site describes Luxury Touch Hotel as a place for healing, relaxation, good food, and efficient service. This section keeps those details visible and ready for CMS editing.
              </p>
            </div>
            <ul className="check-list">
              {aboutHighlights.map((highlight) => (
                <li key={highlight}>
                  <Check size={18} aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container">
            <SectionHeading
              eyebrow="Facilities"
              title="Everything guests need in one place"
              copy="Restaurant, executive lounge, conference room, and pool are now represented with richer original-site copy."
            />
            <div className="facility-cards">
              {serviceHighlights.map((facility) => (
                <article key={facility.title}>
                  <div className="facility-image">
                    <Image src={facility.image!.src} alt={facility.image!.alt} fill sizes="(min-width: 900px) 25vw, 100vw" />
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
