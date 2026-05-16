import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import { hotel } from "@/lib/content/hotel-content";

export default function ContactPage() {
  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="Contact"
          title="Reach Luxury Touch Hotel"
          copy="Contact the hotel for current room availability, group bookings, restaurant questions, and event or meeting requests."
          image={hotel.heroImages[1]}
          primaryAction={{ href: "/booking", label: "Request booking" }}
        />

        <section className="section">
          <div className="container contact-grid">
            <div>
              <SectionHeading
                eyebrow="Hotel contact"
                title="Talk to the hotel team"
                copy="Use the contact details below for urgent questions. For room availability, the booking request page captures the stay details staff need."
              />
              <div className="contact-list">
                <a className="contact-row focus-ring" href={`tel:${hotel.phone.replace(/\s/g, "")}`}>
                  <Phone size={22} aria-hidden="true" />
                  <span>{hotel.phone}</span>
                </a>
                <a className="contact-row focus-ring" href={`mailto:${hotel.email}`}>
                  <Mail size={22} aria-hidden="true" />
                  <span>{hotel.email}</span>
                </a>
                <div className="contact-row">
                  <MapPin size={22} aria-hidden="true" />
                  <span>{hotel.address}</span>
                </div>
              </div>
              <Link className="button button-primary focus-ring" href="/booking">
                Request availability
              </Link>
            </div>

            <div className="map-panel" aria-label="Hotel location map placeholder">
              <MapPin size={34} aria-hidden="true" />
              <h2>{hotel.location}</h2>
              <p>{hotel.area}</p>
              <p>Map embed can be connected after the hotel confirms the exact Google Maps place link.</p>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
