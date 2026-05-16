import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, Maximize2, Users } from "lucide-react";
import { ImageTiles } from "@/components/public/image-tiles";
import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import { getRoom, rooms } from "@/lib/content/hotel-content";

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = getRoom(slug);

  if (!room) {
    notFound();
  }

  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="Rooms and suites"
          title={room.name}
          copy={room.description}
          image={room.heroImage}
          primaryAction={{ href: `/booking?room=${room.slug}`, label: "Request this room" }}
          secondaryAction={{ href: "/rooms", label: "All rooms" }}
        />

        <section className="section">
          <div className="container room-detail-grid">
            <div>
              <SectionHeading eyebrow="Room details" title={room.summary} />
              <div className="detail-list">
                <span>
                  <Users size={18} aria-hidden="true" />
                  {room.occupancy}
                </span>
                <span>
                  <BedDouble size={18} aria-hidden="true" />
                  {room.bed}
                </span>
                <span>
                  <Maximize2 size={18} aria-hidden="true" />
                  {room.size}
                </span>
              </div>
              <h2 className="subheading">Amenities</h2>
              <ul className="check-list">
                {room.amenities.map((amenity) => (
                  <li key={amenity}>
                    <Check size={18} aria-hidden="true" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="booking-panel">
              <p className="room-rate">{room.fromRate}</p>
              <h2>Confirm availability</h2>
              <p>
                Send a booking request with your travel dates. The hotel team will confirm room availability and current rate before approval.
              </p>
              <Link className="button button-primary focus-ring" href={`/booking?room=${room.slug}`}>
                Request booking
              </Link>
            </aside>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container">
            <SectionHeading eyebrow="Room images" title={`Inside the ${room.name}`} />
            <ImageTiles images={room.images} />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
