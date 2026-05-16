import { importedLuxuryTouchAssets } from "@/lib/assets/imported-assets";

type AssetId = (typeof importedLuxuryTouchAssets)[number]["id"];

export type HotelImage = {
  src: string;
  alt: string;
};

export type Room = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  description: string;
  fromRate: string;
  occupancy: string;
  bed: string;
  size: string;
  heroImage: HotelImage;
  images: HotelImage[];
  amenities: string[];
  highlights: string[];
};

export type GalleryImage = HotelImage & {
  category: "Rooms" | "Restaurant" | "Pool" | "Lounge" | "Hotel";
};

function asset(id: AssetId, alt: string): HotelImage {
  const found = importedLuxuryTouchAssets.find((item) => item.id === id);

  if (!found) {
    throw new Error(`Missing imported Luxury Touch asset: ${id}`);
  }

  return { src: found.src, alt };
}

export const hotel = {
  name: "Luxury Touch Hotel",
  location: "Tarkwa, Ghana",
  area: "Brahabebom, near University of Mines and Technology",
  phone: "+233 24 400 0000",
  alternatePhone: "+233 20 000 0000",
  email: "reservations@luxurytouchhotel.com",
  address: "Brahabebom, Tarkwa, Western Region, Ghana",
  checkIn: "2:00 PM",
  checkOut: "12:00 PM",
  logo: asset("18-lux-touch-d02316f9f6", "Luxury Touch Hotel logo"),
  mark: asset("134-touch-e1a4da1d9a", "Luxury Touch Hotel mark"),
  heroImages: [
    asset("121-full-slider-2-dcea62dfda", "Luxury Touch Hotel exterior and arrival view"),
    asset("122-full-slider-3-b9f5381c5b", "Luxury Touch Hotel pool and leisure area"),
    asset("120-full-slider-1-77a071fea9", "Luxury Touch Hotel room interior"),
  ],
  description:
    "A comfortable hotel in Tarkwa with polished rooms, restaurant and bar service, executive lounge spaces, conference facilities, swimming pool, and attentive hospitality for business and leisure stays.",
};

export const rooms: Room[] = [
  {
    slug: "standard-room",
    name: "Standard Room",
    shortName: "Standard",
    summary:
      "A practical, well-kept room for short business stays and comfortable overnight visits in Tarkwa.",
    description:
      "The Standard Room keeps the essentials close: a calm sleeping area, private bathroom, work-friendly surfaces, and quick access to the hotel's restaurant, pool, and lounge facilities.",
    fromRate: "Contact for rate",
    occupancy: "Up to 2 guests",
    bed: "Queen bed",
    size: "Classic guest room",
    heroImage: asset("103-standard-2fd04e6485", "Standard room at Luxury Touch Hotel"),
    images: [
      asset("112-single-room1-1c8845ae79", "Standard room bed and sitting area"),
      asset("113-single-room2-95923b8e2f", "Standard room interior detail"),
      asset("114-single-room3-13149c10d2", "Standard room bathroom and vanity"),
      asset("118-single-room7-40067867a2", "Standard room guest amenities"),
    ],
    amenities: ["Air conditioning", "Private bathroom", "Television", "Work desk", "Wi-Fi access"],
    highlights: ["Efficient layout", "Good for solo or paired stays", "Near hotel facilities"],
  },
  {
    slug: "delux-standard",
    name: "Delux Standard",
    shortName: "Delux Standard",
    summary:
      "A step up in finish and comfort with more room to settle in after work or travel.",
    description:
      "The Delux Standard room suits guests who want a little more presence than the standard category while keeping the stay simple, private, and easy to manage.",
    fromRate: "Contact for rate",
    occupancy: "Up to 2 guests",
    bed: "Queen bed",
    size: "Enhanced guest room",
    heroImage: asset("68-dstand-0ecac200a6", "Delux Standard room at Luxury Touch Hotel"),
    images: [
      asset("78-single-room1-483768aed0", "Delux Standard bed layout"),
      asset("79-single-room2-b68b7cb129", "Delux Standard sitting area"),
      asset("80-single-room3-96c2b2c4d9", "Delux Standard room detail"),
      asset("85-single-room8-eaa76aa7c9", "Delux Standard bathroom detail"),
    ],
    amenities: ["Air conditioning", "Private bathroom", "Television", "Work desk", "Wardrobe"],
    highlights: ["Upgraded room finish", "Comfortable business stay", "Quiet guest setting"],
  },
  {
    slug: "delux",
    name: "Delux Room",
    shortName: "Delux",
    summary:
      "A refined room category with warm finishes and a stronger sense of space.",
    description:
      "The Delux Room is designed for guests who want a more polished stay, with layered room imagery, comfortable furnishings, and easy access to the hotel's dining and leisure facilities.",
    fromRate: "Contact for rate",
    occupancy: "Up to 2 guests",
    bed: "Queen bed",
    size: "Premium guest room",
    heroImage: asset("35-delux-d11568ff30", "Delux room at Luxury Touch Hotel"),
    images: [
      asset("44-single-room1-88502421df", "Delux room bed and headboard"),
      asset("45-single-room2-67b19a2d42", "Delux room seating area"),
      asset("46-single-room3-28a6653b2a", "Delux room interior"),
      asset("51-single-room8-cdf641f478", "Delux room bathroom and amenities"),
    ],
    amenities: ["Air conditioning", "Private bathroom", "Television", "Work desk", "Room service access"],
    highlights: ["Premium feel", "Comfort-focused layout", "Ideal for longer visits"],
  },
  {
    slug: "delux-twin-bed",
    name: "Delux Twin Bed",
    shortName: "Twin Bed",
    summary:
      "A twin-bed setup for colleagues, friends, or family members sharing a room.",
    description:
      "The Delux Twin Bed category provides a shared-room option without sacrificing comfort, making it suitable for project teams, visiting families, and guests attending events in Tarkwa.",
    fromRate: "Contact for rate",
    occupancy: "Up to 2 guests",
    bed: "Twin beds",
    size: "Shared guest room",
    heroImage: asset("69-dtwin-4e58c0b300", "Delux Twin Bed room at Luxury Touch Hotel"),
    images: [
      asset("60-single-room1-15b6530e85", "Delux Twin Bed room interior"),
      asset("61-single-room2-fe1e1b9e9e", "Delux Twin Bed room seating"),
      asset("62-single-room3-f8a7528ebf", "Delux Twin Bed room detail"),
      asset("67-single-room8-e70bbf9ee2", "Delux Twin Bed bathroom detail"),
    ],
    amenities: ["Air conditioning", "Private bathroom", "Television", "Work desk", "Twin sleeping"],
    highlights: ["Separate beds", "Good for shared business trips", "Easy access to restaurant"],
  },
  {
    slug: "presidential-suite",
    name: "Presidential Suite",
    shortName: "Presidential",
    summary:
      "The hotel's most spacious room category for guests who need privacy, comfort, and presence.",
    description:
      "The Presidential Suite gives guests a more generous stay experience, with room to host, rest, and prepare for meetings or events while remaining close to the hotel's lounge, pool, and restaurant.",
    fromRate: "Contact for rate",
    occupancy: "Up to 2 guests",
    bed: "King bed",
    size: "Suite",
    heroImage: asset("86-pres-ab8f199b76", "Presidential Suite at Luxury Touch Hotel"),
    images: [
      asset("95-single-room1-4167835033", "Presidential Suite sleeping area"),
      asset("96-single-room2-bdd1139473", "Presidential Suite seating area"),
      asset("97-single-room3-ab8efc7ff4", "Presidential Suite interior detail"),
      asset("102-single-room8-27b810e7ac", "Presidential Suite bathroom detail"),
    ],
    amenities: ["Air conditioning", "Private bathroom", "Television", "Lounge seating", "Premium room finish"],
    highlights: ["Most spacious category", "Best for executive stays", "Private suite feel"],
  },
];

export const facilities = [
  {
    title: "Restaurant and Bar",
    description:
      "On-site dining and bar service for hotel guests, meetings, and relaxed evenings in Tarkwa.",
    image: asset("20-restaurant-974bba60aa", "Luxury Touch Hotel restaurant"),
  },
  {
    title: "Executive Lounge",
    description:
      "Comfortable lounge spaces for informal meetings, drinks, and quieter guest moments.",
    image: asset("17-lounge-a1d39442f1", "Luxury Touch Hotel lounge"),
  },
  {
    title: "Swimming Pool",
    description:
      "A leisure pool area for cooling off, relaxing between appointments, and weekend stays.",
    image: asset("133-swimming-f5c0ea9902", "Luxury Touch Hotel swimming pool"),
  },
  {
    title: "Conference Facilities",
    description:
      "Meeting and conference space for business sessions, training, and private events.",
    image: asset("02-conference-c5e971bde6", "Luxury Touch Hotel conference room"),
  },
];

export const restaurant = {
  hero: asset("25-restaurant_hero-b89f11c299", "Restaurant and lounge at Luxury Touch Hotel"),
  intro:
    "The restaurant and lounge serve guests throughout the day with a comfortable setting for meals, drinks, and informal meetings.",
  sections: [
    {
      title: "Restaurant",
      text: "A warm dining room for hotel breakfasts, lunch meetings, dinner, and private group service.",
      image: asset("26-restaurant1-0a284cf711", "Luxury Touch Hotel dining room"),
    },
    {
      title: "Bar and Lounge",
      text: "A relaxed space for evening drinks, casual conversations, and a quieter break from the day.",
      image: asset("21-lounge1-8ef19b2ce1", "Luxury Touch Hotel bar lounge"),
    },
    {
      title: "Guest Service",
      text: "Dining is integrated with the hotel stay, making it easy for guests to move between rooms, meetings, and leisure spaces.",
      image: asset("29-restaurant4-85f1bf767f", "Luxury Touch Hotel restaurant seating"),
    },
  ],
};

export const galleryImages: GalleryImage[] = [
  { ...asset("05-gallery1-6104726a41", "Hotel gallery image"), category: "Hotel" },
  { ...asset("06-gallery10-761db610b1", "Hotel exterior gallery image"), category: "Hotel" },
  { ...asset("07-gallery11-7f15a1fe20", "Hotel grounds gallery image"), category: "Hotel" },
  { ...asset("08-gallery12-bbd863ceac", "Hotel guest area gallery image"), category: "Hotel" },
  { ...asset("09-gallery2-51628f9807", "Hotel reception gallery image"), category: "Hotel" },
  { ...asset("10-gallery3-b579c7c8e2", "Hotel lounge gallery image"), category: "Lounge" },
  { ...asset("11-gallery4-303c2670fa", "Hotel room gallery image"), category: "Rooms" },
  { ...asset("12-gallery5-25376f6ab2", "Hotel guest room gallery image"), category: "Rooms" },
  { ...asset("13-gallery6-2182d8a565", "Hotel corridor gallery image"), category: "Hotel" },
  { ...asset("14-gallery7-b5172a2def", "Hotel pool gallery image"), category: "Pool" },
  { ...asset("15-gallery8-75fa08b129", "Hotel dining gallery image"), category: "Restaurant" },
  { ...asset("16-gallery9-c502b75b07", "Hotel restaurant gallery image"), category: "Restaurant" },
  { ...asset("24-lounge4-b2a91e32e3", "Luxury Touch Hotel executive lounge"), category: "Lounge" },
  { ...asset("27-restaurant2-1f03c77da5", "Luxury Touch Hotel restaurant detail"), category: "Restaurant" },
  { ...asset("124-spa-99fbef256e", "Luxury Touch Hotel spa and wellness image"), category: "Hotel" },
  { ...asset("133-swimming-f5c0ea9902", "Luxury Touch Hotel swimming pool"), category: "Pool" },
];

export function getRoom(slug: string) {
  return rooms.find((room) => room.slug === slug);
}
