"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays } from "lucide-react";
import type { Room } from "@/lib/content/hotel-content";

type BookingFormProps = {
  rooms: Room[];
  selectedRoom?: string;
};

type BookingResponse = {
  ok: boolean;
  bookingId?: string;
  message?: string;
  errors?: Record<string, string[]>;
};

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export function BookingForm({ rooms, selectedRoom = "" }: BookingFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "failed">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setErrors({});

    const form = new FormData(event.currentTarget);
    const payload = {
      guestName: value(form, "guestName"),
      email: value(form, "email"),
      phone: value(form, "phone"),
      roomSlug: value(form, "roomSlug"),
      arrivalDate: value(form, "arrivalDate"),
      departureDate: value(form, "departureDate"),
      guests: Number(value(form, "guests") || "1"),
      notes: value(form, "notes") || undefined,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as BookingResponse;

      if (!response.ok || !result.ok) {
        setStatus("failed");
        setErrors(result.errors ?? {});
        setMessage(result.message ?? "Please check the form and try again.");
        return;
      }

      setStatus("sent");
      setMessage(
        result.message ??
          "Your booking request has been received. The hotel will confirm availability shortly.",
      );
      event.currentTarget.reset();
    } catch {
      setStatus("failed");
      setMessage("Unable to submit the request right now. Please try again.");
    }
  }

  function fieldError(name: string) {
    const first = errors[name]?.[0];
    return first ? <span className="form-error">{first}</span> : null;
  }

  return (
    <form className="booking-form" id="booking-form" onSubmit={onSubmit}>
      <div className="form-header">
        <CalendarDays size={24} aria-hidden="true" />
        <div>
          <h2>Stay details</h2>
          <p>
            Submit your preferred dates and contact details. Staff will confirm
            availability before approval.
          </p>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Full name
          <input name="guestName" type="text" autoComplete="name" required />
          {fieldError("guestName")}
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
          {fieldError("email")}
        </label>
        <label>
          Phone
          <input name="phone" type="tel" autoComplete="tel" required />
          {fieldError("phone")}
        </label>
        <label>
          Room type
          <select name="roomSlug" defaultValue={selectedRoom} required>
            <option value="" disabled>
              Select a room
            </option>
            {rooms.map((room) => (
              <option value={room.slug} key={room.slug}>
                {room.name}
              </option>
            ))}
          </select>
          {fieldError("roomSlug")}
        </label>
        <label>
          Arrival
          <input name="arrivalDate" type="date" required />
          {fieldError("arrivalDate")}
        </label>
        <label>
          Departure
          <input name="departureDate" type="date" required />
          {fieldError("departureDate")}
        </label>
        <label>
          Guests
          <input name="guests" type="number" min="1" max="8" defaultValue="1" required />
          {fieldError("guests")}
        </label>
      </div>

      <label>
        Special requests
        <textarea name="notes" rows={5} />
        {fieldError("notes")}
      </label>

      <label className="consent-row">
        <input name="consent" type="checkbox" required />
        <span>
          I agree to be contacted by Luxury Touch Hotel about this booking
          request by email, SMS, or WhatsApp.
        </span>
      </label>

      <button
        className="button button-primary focus-ring"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Submit booking request"}
      </button>

      {message && (
        <p className={status === "sent" ? "form-success" : "form-error-summary"}>
          {message}
        </p>
      )}
    </form>
  );
}
