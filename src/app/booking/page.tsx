import Link from "next/link";
import { CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/public/booking-form";
import { PageHero } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import { hotel, rooms } from "@/lib/content/hotel-content";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;
  const selectedRoom = rooms.find((item) => item.slug === room)?.slug ?? "";

  return (
    <PublicShell showFloatingBooking={false}>
      <main>
        <PageHero
          eyebrow="Booking request"
          title="Request room availability"
          copy="Send the hotel your stay details. Staff will confirm availability, current rate, and next steps before the booking is approved."
          image={hotel.heroImages[2]}
          primaryAction={{ href: "#booking-form", label: "Start request" }}
        />

        <section className="section">
          <div className="container booking-grid">
            <BookingForm rooms={rooms} selectedRoom={selectedRoom} />

            <aside className="booking-help">
              <div>
                <Info size={24} aria-hidden="true" />
                <h2>How booking requests work</h2>
                <p>
                  A request is not a confirmed booking until hotel staff approves
                  it. The system stores the request first, then staff confirm
                  availability and send the final confirmation.
                </p>
              </div>
              <ul className="check-list">
                <li>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  Staff confirm availability before approval
                </li>
                <li>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  Current rates are confirmed directly by the hotel
                </li>
                <li>
                  <ShieldCheck size={18} aria-hidden="true" />
                  Notification providers stay outside the page shell
                </li>
              </ul>
              <Link className="text-link focus-ring" href="/contact">
                Contact the hotel instead
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
