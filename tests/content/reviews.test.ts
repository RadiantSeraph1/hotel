import { describe, expect, it } from "vitest";
import { guestReviews } from "../../src/lib/content/hotel-content";
import { seededReviews } from "../../src/components/admin/admin-data";

describe("guest reviews content", () => {
  it("seeds public guest reviews with ratings and imported avatar images", () => {
    expect(guestReviews).toHaveLength(3);
    expect(guestReviews.map((review) => review.rating)).toEqual([5, 5, 4]);
    expect(guestReviews.every((review) => review.image.src.includes("/imported/luxurytouchhotel/"))).toBe(true);
    expect(guestReviews.map((review) => review.status)).toEqual([
      "published",
      "published",
      "published",
    ]);
  });

  it("keeps CMS review seed data aligned with public reviews", () => {
    expect(seededReviews.map((review) => review.id)).toEqual(
      guestReviews.map((review) => review.id),
    );
    expect(seededReviews.every((review) => review.status === "published")).toBe(true);
  });
});
