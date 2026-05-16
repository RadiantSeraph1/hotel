import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { RoomGrid } from "@/components/public/room-card";
import { PublicShell } from "@/components/public/site-shell";
import { hotel, rooms } from "@/lib/content/hotel-content";

export default function RoomsPage() {
  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="Rooms and suites"
          title="Choose the room category that fits your stay"
          copy="Browse the available room categories, compare comfort level and sleeping arrangement, then request current availability from hotel staff."
          image={hotel.heroImages[2]}
          primaryAction={{ href: "/booking", label: "Request availability" }}
        />
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Room categories"
              title="Five stay options in Tarkwa"
              copy="Rates are confirmed directly by the hotel based on date, room availability, and stay requirements."
            />
            <RoomGrid rooms={rooms} />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
