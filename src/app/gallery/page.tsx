import { GalleryTiles } from "@/components/public/image-tiles";
import { PageHero, SectionHeading } from "@/components/public/page-hero";
import { PublicShell } from "@/components/public/site-shell";
import { galleryImages, hotel } from "@/lib/content/hotel-content";

const categories = ["Hotel", "Rooms", "Restaurant", "Lounge", "Pool"] as const;

export default function GalleryPage() {
  return (
    <PublicShell>
      <main>
        <PageHero
          eyebrow="Gallery"
          title="Explore the hotel before you arrive"
          copy="A curated view of Luxury Touch Hotel rooms, dining areas, lounge spaces, pool, and shared guest facilities."
          image={hotel.heroImages[1]}
          primaryAction={{ href: "/booking", label: "Request booking" }}
        />
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Imported media"
              title="Hotel imagery by area"
              copy="These images are seeded from the existing Luxury Touch Hotel website and organized for the public MVP."
            />
            <div className="category-row" aria-label="Gallery categories">
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
            <GalleryTiles images={galleryImages} />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
