import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Utensils, Waves } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import { GalleryTiles } from "@/components/public/image-tiles";
import { ReviewGrid } from "@/components/public/review-card";
import { RoomGrid } from "@/components/public/room-card";
import {
  galleryImages,
  guestReviews,
  hotel,
  hotelStats,
  rooms,
  serviceHighlights,
  whyBookWithUs,
} from "@/lib/content/hotel-content";

export default function Home() {
  const featuredRooms = rooms.slice(0, 3);

  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow={`${hotel.location} · ${hotel.area}`}
          title={hotel.name}
          copy="A refined Tarkwa stay with comfortable rooms, dining, lounge spaces, swimming pool, and conference facilities close to the University of Mines and Technology."
          image={hotel.heroImages[0]}
          primaryAction={{ href: "/booking", label: "Request booking" }}
          secondaryAction={{ href: "/rooms", label: "View rooms" }}
        />

        <section className="section">
          <div className="container quick-panel">
            <div>
              <MapPin size={22} aria-hidden="true" />
              <span>{hotel.area}</span>
            </div>
            <div>
              <CalendarDays size={22} aria-hidden="true" />
              <span>Check-in {hotel.checkIn}</span>
            </div>
            <div>
              <Utensils size={22} aria-hidden="true" />
              <span>Restaurant and bar</span>
            </div>
            <div>
              <Waves size={22} aria-hidden="true" />
              <span>Pool and lounge</span>
            </div>
          </div>
        </section>

        <section className="section">
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
          <div className="container">
            <SectionHeading
              eyebrow="Rooms and suites"
              title="Stay options for work, rest, and longer visits"
              copy="Compare the main room categories and send a request for the dates you need. Hotel staff will confirm current availability and rate."
            />
            <RoomGrid rooms={featuredRooms} />
            <div className="center-action">
              <Link className="button button-outline focus-ring" href="/rooms">
                See all rooms
              </Link>
            </div>
          </div>
        </section>

        <section className="split-section">
          <div className="container split-grid">
            <div className="split-media">
              <Image src={serviceHighlights[1].image!.src} alt={serviceHighlights[1].image!.alt} fill sizes="(min-width: 900px) 50vw, 100vw" />
            </div>
            <div className="split-copy">
              <p className="eyebrow">Facilities</p>
              <h2>Dining, lounge, pool, and meeting spaces in one hotel</h2>
              <p>
                Luxury Touch Hotel supports business and leisure guests with practical facilities on site, keeping meetings, meals, and relaxation close to the room.
              </p>
              <div className="facility-list">
                {serviceHighlights.map((facility) => (
                  <div key={facility.title}>
                    <h3>{facility.title}</h3>
                    <p>{facility.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Why book with us"
              title="Royal treatment, practical value, and a true Tarkwa getaway"
              copy="The original hotel promise is now presented as clear, editable content instead of footer-only copy."
            />
            <div className="why-grid">
              {whyBookWithUs.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container">
            <SectionHeading
              eyebrow="Guest reviews"
              title="What guests say about the stay"
              copy="A few guest notes about rooms, dining, conference stays, and the hotel team's service."
            />
            <ReviewGrid reviews={guestReviews.filter((review) => review.status === "published")} />
            <div className="center-action">
              <Link className="button button-outline focus-ring" href="/reviews">
                Read all reviews
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Gallery"
              title="A first look at the hotel"
              copy="Rooms, restaurant, lounge, pool, and shared guest spaces from the imported Luxury Touch Hotel media library."
            />
            <GalleryTiles images={galleryImages.slice(0, 8)} />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
