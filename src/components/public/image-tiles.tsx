import Image from "next/image";
import type { GalleryImage, HotelImage } from "@/lib/content/hotel-content";

export function ImageTiles({ images }: { images: HotelImage[] }) {
  return (
    <div className="image-tiles">
      {images.map((image) => (
        <figure className="image-tile" key={image.src}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 900px) 33vw, 100vw" />
        </figure>
      ))}
    </div>
  );
}

export function GalleryTiles({ images }: { images: GalleryImage[] }) {
  return (
    <div className="gallery-grid">
      {images.map((image) => (
        <figure className="gallery-tile" key={image.src}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 900px) 25vw, (min-width: 640px) 50vw, 100vw" />
          <figcaption>{image.category}</figcaption>
        </figure>
      ))}
    </div>
  );
}
