import Image from "next/image";
import Link from "next/link";
import { Check, Presentation, Utensils, Users } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import { conference, hotel } from "@/lib/content/hotel-content";

export default function ConferencePage() {
  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="Conference room"
          title="Meetings and presentations at Luxury Touch"
          copy={conference.description}
          image={conference.hero}
          primaryAction={{ href: "/contact", label: "Ask about the venue" }}
          secondaryAction={{ href: "/booking", label: "Book rooms" }}
        />

        <section className="section">
          <div className="container quick-panel">
            <div>
              <Presentation size={22} aria-hidden="true" />
              <span>Presentation-ready space</span>
            </div>
            <div>
              <Users size={22} aria-hidden="true" />
              <span>Business and private meetings</span>
            </div>
            <div>
              <Utensils size={22} aria-hidden="true" />
              <span>Restaurant and bar nearby</span>
            </div>
            <div>
              <Check size={22} aria-hidden="true" />
              <span>Rooms for travelling teams</span>
            </div>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container split-grid">
            <div className="split-media">
              <Image
                src={conference.hero.src}
                alt={conference.hero.alt}
                fill
                sizes="(min-width: 900px) 50vw, 100vw"
              />
            </div>
            <div className="split-copy">
              <p className="eyebrow">{conference.title}</p>
              <h2>A practical venue connected to the full hotel experience</h2>
              <p>
                Host your meeting in a professional setting while keeping food,
                rooms, lounge time, and poolside breaks close for guests and
                travelling teams.
              </p>
              <ul className="check-list">
                {conference.features.map((feature) => (
                  <li key={feature}>
                    <Check size={18} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container cta-band">
            <div>
              <SectionHeading
                eyebrow="Plan an event"
                title="Need rooms, meals, and a meeting room together?"
                copy={`Call ${hotel.phone} or send a request so staff can confirm space, rooms, and service details.`}
              />
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
