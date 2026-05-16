import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users } from "lucide-react";
import type { Room } from "@/lib/content/hotel-content";

export function RoomCard({ room }: { room: Room }) {
  return (
    <article className="room-card">
      <Link className="room-card-image focus-ring" href={`/rooms/${room.slug}`}>
        <Image src={room.heroImage.src} alt={room.heroImage.alt} fill sizes="(min-width: 900px) 33vw, 100vw" />
      </Link>
      <div className="room-card-body">
        <div>
          <p className="room-rate">{room.fromRate}</p>
          <h3>
            <Link className="focus-ring" href={`/rooms/${room.slug}`}>
              {room.name}
            </Link>
          </h3>
          <p>{room.summary}</p>
        </div>
        <div className="room-meta">
          <span>
            <Users size={17} aria-hidden="true" />
            {room.occupancy}
          </span>
          <span>
            <BedDouble size={17} aria-hidden="true" />
            {room.bed}
          </span>
        </div>
        <Link className="text-link focus-ring" href={`/rooms/${room.slug}`}>
          View room
        </Link>
      </div>
    </article>
  );
}

export function RoomGrid({ rooms }: { rooms: Room[] }) {
  return (
    <div className="room-grid">
      {rooms.map((room) => (
        <RoomCard key={room.slug} room={room} />
      ))}
    </div>
  );
}
