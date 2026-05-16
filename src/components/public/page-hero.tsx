import Image from "next/image";
import Link from "next/link";
import type { HotelImage } from "@/lib/content/hotel-content";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  image: HotelImage;
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
};

export function PageHero({
  eyebrow,
  title,
  copy,
  image,
  primaryAction,
  secondaryAction,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="hero-image" />
      <div className="hero-shade" />
      <div className="container hero-content">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
        {(primaryAction || secondaryAction) && (
          <div className="hero-actions">
            {primaryAction && (
              <Link className="button button-primary focus-ring" href={primaryAction.href}>
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link className="button button-secondary focus-ring" href={secondaryAction.href}>
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}
