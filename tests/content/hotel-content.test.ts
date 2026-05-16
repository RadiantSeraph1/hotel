import { describe, expect, it } from "vitest";
import {
  aboutHighlights,
  conference,
  hotel,
  hotelStats,
  rooms,
  serviceHighlights,
  whyBookWithUs,
} from "../../src/lib/content/hotel-content";
import { seededRooms } from "../../src/components/admin/admin-data";

describe("hotel content seeded from the original website", () => {
  it("uses the original public room rates in both site and admin seed data", () => {
    expect(rooms.map((room) => [room.slug, room.fromRate])).toEqual([
      ["standard-room", "GH320 / night"],
      ["delux-standard", "GH410 / night"],
      ["delux", "GH565 / night"],
      ["delux-twin-bed", "GH665 / night"],
      ["presidential-suite", "GH1,100 / night"],
    ]);

    expect(seededRooms.map((room) => [room.id, room.rate])).toEqual([
      ["standard", "GH320 / night"],
      ["delux-standard", "GH410 / night"],
      ["delux", "GH565 / night"],
      ["delux-twin-bed", "GH665 / night"],
      ["presidential-suite", "GH1,100 / night"],
    ]);
  });

  it("includes original-site stats, reasons to book, and service highlights", () => {
    expect(hotel.phone).toBe("0502921915");
    expect(hotel.email).toBe("info@luxurytouchhotel.com");
    expect(hotelStats).toEqual([
      { value: "20", label: "Rooms" },
      { value: "1", label: "Executive lounge" },
      { value: "1", label: "Restaurant & bar" },
      { value: "1", label: "Pool" },
    ]);
    expect(whyBookWithUs.map((item) => item.title)).toEqual([
      "Best luxury experience in Tarkwa",
      "Staff ready to serve",
      "Value for your money",
    ]);
    expect(serviceHighlights.map((item) => item.title)).toEqual([
      "Restaurant",
      "Executive Lounge",
      "Conference Room",
      "Swimming Pool",
    ]);
  });

  it("keeps richer about and conference content available to the UI", () => {
    expect(aboutHighlights).toContain("Located in the hills for a getaway vibe.");
    expect(aboutHighlights).toContain("Complimentary Wi-Fi, desks, fridges, coffee and tea facilities.");
    expect(conference.title).toBe("Conference Room");
    expect(conference.description).toContain("important meetings");
  });
});
