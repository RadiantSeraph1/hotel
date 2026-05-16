import Image from "next/image";
import { Star } from "lucide-react";
import type { GuestReview } from "@/lib/content/hotel-content";

export function ReviewCard({ review }: { review: GuestReview }) {
  return (
    <article className="review-card">
      <div className="review-header">
        <Image
          src={review.image.src}
          alt={review.image.alt}
          width={56}
          height={56}
        />
        <div>
          <h3>{review.guestName}</h3>
          <p>{review.guestLocation} · {review.stayType}</p>
        </div>
      </div>
      <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={17}
            aria-hidden="true"
            fill={index < review.rating ? "currentColor" : "none"}
          />
        ))}
      </div>
      <p className="review-quote">“{review.quote}”</p>
    </article>
  );
}

export function ReviewGrid({ reviews }: { reviews: GuestReview[] }) {
  return (
    <div className="review-grid">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
