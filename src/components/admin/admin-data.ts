export type AdminRole = "manager" | "receptionist" | "editor";

export type BookingStatus =
  | "new"
  | "contacted"
  | "approved"
  | "declined"
  | "cancelled";

export type NotificationStatus = "sent" | "failed" | "queued";

export type NotificationChannel = "email" | "sms" | "whatsapp";

export type AdminBooking = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomName: string;
  status: BookingStatus;
  arrivalDate: string;
  departureDate: string;
  guests: number;
  submittedAt: string;
  assignedRole: AdminRole;
  notes: string;
  internalNotes: string[];
};

export type AdminRoom = {
  id: string;
  name: string;
  rate: string;
  occupancy: string;
  status: "active" | "inactive";
  image: string;
  amenities: string[];
  summary: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  status: "visible" | "hidden";
  image: string;
};

export type NotificationLog = {
  id: string;
  bookingId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  recipient: string;
  messageType: string;
  createdAt: string;
  detail: string;
};

export const adminRoles: Record<AdminRole, string> = {
  manager: "Manager - full CMS, booking decisions, and settings access",
  receptionist:
    "Receptionist - booking review, customer contact, and request decisions",
  editor: "Editor - rooms, gallery, and public website content management",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  new: "New request",
  contacted: "Contacted",
  approved: "Approved",
  declined: "Declined",
  cancelled: "Cancelled",
};

export const bookingStatusDescriptions: Record<BookingStatus, string> = {
  new: "Submitted by a customer and waiting for staff review.",
  contacted: "Staff has contacted or attempted to contact the customer.",
  approved: "The hotel has confirmed the booking request.",
  declined: "The hotel cannot accept the request.",
  cancelled: "The request was cancelled after submission or approval.",
};

export const seededBookings: AdminBooking[] = [
  {
    id: "BK-1048",
    guestName: "Ama Mensah",
    email: "ama.mensah@example.com",
    phone: "+233 24 555 0101",
    roomName: "Presidential Suite",
    status: "new",
    arrivalDate: "2026-06-03",
    departureDate: "2026-06-06",
    guests: 2,
    submittedAt: "2026-05-16 08:15",
    assignedRole: "receptionist",
    notes: "Guest requested airport pickup and late check-in.",
    internalNotes: [
      "Confirm suite availability before sending approval.",
      "Ask manager about late checkout option.",
    ],
  },
  {
    id: "BK-1047",
    guestName: "Kojo Asare",
    email: "kojo.asare@example.com",
    phone: "+233 20 555 0102",
    roomName: "Delux Twin Bed",
    status: "contacted",
    arrivalDate: "2026-05-27",
    departureDate: "2026-05-29",
    guests: 3,
    submittedAt: "2026-05-15 17:42",
    assignedRole: "receptionist",
    notes: "Travelling with family for a UMaT event.",
    internalNotes: ["Called once; customer asked for WhatsApp confirmation."],
  },
  {
    id: "BK-1046",
    guestName: "Nana Boateng",
    email: "nana.boateng@example.com",
    phone: "+233 27 555 0103",
    roomName: "Standard Room",
    status: "approved",
    arrivalDate: "2026-05-24",
    departureDate: "2026-05-26",
    guests: 1,
    submittedAt: "2026-05-15 11:08",
    assignedRole: "manager",
    notes: "Business stay. Requested quiet room.",
    internalNotes: ["Approved by manager after availability check."],
  },
  {
    id: "BK-1045",
    guestName: "Esi Owusu",
    email: "esi.owusu@example.com",
    phone: "+233 55 555 0104",
    roomName: "Delux Standard",
    status: "declined",
    arrivalDate: "2026-05-20",
    departureDate: "2026-05-21",
    guests: 2,
    submittedAt: "2026-05-14 19:20",
    assignedRole: "manager",
    notes: "Requested same-day approval for a sold-out night.",
    internalNotes: ["Declined due to no availability."],
  },
];

export const seededRooms: AdminRoom[] = [
  {
    id: "standard",
    name: "Standard Room",
    rate: "GHS 450 / night",
    occupancy: "2 guests",
    status: "active",
    image: "/imported/luxurytouchhotel/103-standard-2fd04e6485.jpg",
    amenities: ["Queen bed", "Air conditioning", "Wi-Fi", "Breakfast"],
    summary: "Core room inventory for business and short-stay guests.",
  },
  {
    id: "delux-standard",
    name: "Delux Standard",
    rate: "GHS 620 / night",
    occupancy: "2 guests",
    status: "active",
    image: "/imported/luxurytouchhotel/68-dstand-0ecac200a6.jpg",
    amenities: ["King bed", "Workspace", "Smart TV", "Breakfast"],
    summary: "Upgraded room content ready for public room comparison.",
  },
  {
    id: "delux",
    name: "Delux",
    rate: "GHS 780 / night",
    occupancy: "2 guests",
    status: "active",
    image: "/imported/luxurytouchhotel/35-delux-d11568ff30.jpg",
    amenities: ["King bed", "Lounge chair", "Mini fridge", "Wi-Fi"],
    summary: "Premium single-room category with stronger image set.",
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    rate: "GHS 1,450 / night",
    occupancy: "4 guests",
    status: "inactive",
    image: "/imported/luxurytouchhotel/86-pres-ab8f199b76.jpg",
    amenities: ["Suite lounge", "Executive desk", "Premium bath", "Breakfast"],
    summary: "Hidden until final suite copy, rate, and availability are confirmed.",
  },
];

export const seededGallery: GalleryItem[] = [
  {
    id: "gallery-rooms",
    title: "Guest room detail",
    category: "Rooms",
    status: "visible",
    image: "/imported/luxurytouchhotel/05-gallery1-6104726a41.jpg",
  },
  {
    id: "gallery-pool",
    title: "Swimming pool",
    category: "Facilities",
    status: "visible",
    image: "/imported/luxurytouchhotel/133-swimming-f5c0ea9902.jpg",
  },
  {
    id: "gallery-restaurant",
    title: "Restaurant seating",
    category: "Restaurant",
    status: "visible",
    image: "/imported/luxurytouchhotel/26-restaurant1-0a284cf711.jpg",
  },
  {
    id: "gallery-lounge",
    title: "Executive lounge",
    category: "Lounge",
    status: "hidden",
    image: "/imported/luxurytouchhotel/21-lounge1-8ef19b2ce1.jpg",
  },
];

export const notificationLogs: NotificationLog[] = [
  {
    id: "LOG-9004",
    bookingId: "BK-1048",
    channel: "whatsapp",
    status: "failed",
    recipient: "+233 24 555 0101",
    messageType: "booking_request_received",
    createdAt: "2026-05-16 08:16",
    detail: "Bird template not configured in this environment.",
  },
  {
    id: "LOG-9003",
    bookingId: "BK-1048",
    channel: "email",
    status: "sent",
    recipient: "ama.mensah@example.com",
    messageType: "booking_request_received",
    createdAt: "2026-05-16 08:16",
    detail: "Customer received request acknowledgement.",
  },
  {
    id: "LOG-9002",
    bookingId: "BK-1047",
    channel: "sms",
    status: "queued",
    recipient: "+233 20 555 0102",
    messageType: "booking_contacted",
    createdAt: "2026-05-15 18:03",
    detail: "Waiting for provider delivery callback.",
  },
  {
    id: "LOG-9001",
    bookingId: "BK-1046",
    channel: "email",
    status: "sent",
    recipient: "nana.boateng@example.com",
    messageType: "booking_approved",
    createdAt: "2026-05-15 11:33",
    detail: "Approval confirmation sent.",
  },
];

export function getBookingById(id: string) {
  return seededBookings.find((booking) => booking.id === id);
}

export function getLogsForBooking(id: string) {
  return notificationLogs.filter((log) => log.bookingId === id);
}
