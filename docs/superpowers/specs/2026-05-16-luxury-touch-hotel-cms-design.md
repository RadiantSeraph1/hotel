# Luxury Touch Hotel CMS Redesign Design

Date: 2026-05-16

## Goal

Rebuild `https://luxurytouchhotel.com/` as a modern hotel website with a built-in CMS and booking request workflow. The first version should improve the public user experience, make room and content updates manageable by staff, and route booking requests through email, SMS, and WhatsApp notifications.

## Recommended Stack

- Next.js for the public website and admin dashboard.
- Supabase for authentication, Postgres database, and image storage.
- Resend for email notifications.
- mNotify for SMS notifications.
- Bird for WhatsApp notifications using approved WhatsApp templates.
- Vercel for hosting the Next.js app.

This keeps the public site and CMS in one deployable app while still using managed services for database, auth, files, and messaging.

## Public Website

The public site will include:

- Home page with a stronger hotel-first hero, room search/booking call to action, featured rooms, services, gallery preview, guest trust section, and contact/location section.
- Rooms and Suites page listing room types, prices, occupancy, amenities, and images.
- Room detail pages for Standard, Delux Standard, Delux, Delux Twin Bed, and Presidential Suite.
- Restaurant and Lounge page with editable content and optional menu sections.
- Gallery page with filterable images for rooms, restaurant/bar, swimming pool, executive lounge, and general hotel shots.
- About page with cleaned-up copy, facilities, location context, and hotel highlights.
- Contact page with phone, email, location, map embed, and inquiry form.
- Booking page with a request form for customer details, room type, arrival date, departure date, number of guests, special requests, and consent to receive booking messages.

The public copy will preserve the hotel's current positioning: a luxury hotel in Tarkwa near UMaT/Brahabebom with rooms, restaurant/bar, executive lounge, conference room, and swimming pool.

The rebuild should pull the existing Luxury Touch Hotel logo and usable hotel images from the current website, store them locally in the new project, and seed the first content set with those assets. Imported assets should keep source metadata so staff can replace or reorganize them later from the CMS.

## CMS/Admin

The admin dashboard will support multiple staff accounts. Initial roles:

- `manager`: full access to all CMS sections, booking decisions, and settings.
- `receptionist`: view and update booking requests, contact customers, approve or decline bookings if allowed by hotel policy.
- `editor`: manage public website content such as rooms, gallery, pages, restaurant/lounge, and testimonials.

Admin sections:

- Dashboard summary: new booking requests, approved bookings, declined bookings, recent notification failures, and content shortcuts.
- Rooms: create/edit room names, descriptions, prices, occupancy, amenities, images, and active/inactive state.
- Gallery: upload, categorize, caption, reorder, and hide/show images.
- Restaurant and Lounge: edit page copy, sections, images, and menu items when available.
- Testimonials: create/edit/hide guest reviews and remove placeholder content.
- Pages: edit core copy blocks for home, about, services, and footer contact information.
- Booking Requests: list, filter, inspect, approve, decline, cancel, mark contacted, and add internal notes.
- Notification Logs: view email/SMS/WhatsApp send attempts and failures.
- Settings: hotel contact details, notification recipients, provider configuration status, and default message templates.

## Booking Workflow

Booking requests will be treated as requests until a staff member approves them.

Statuses:

- `new`: submitted by customer.
- `contacted`: staff has contacted or attempted to contact the customer.
- `approved`: hotel has confirmed the booking.
- `declined`: hotel cannot accept the request.
- `cancelled`: booking was cancelled after submission or approval.

On public form submission:

1. Validate customer name, email, phone, room type, arrival date, departure date, and guest count.
2. Save the booking request in Supabase.
3. Send the customer an automatic "request received" message by email, SMS, and WhatsApp.
4. Send the hotel an internal booking alert by email, SMS, and WhatsApp.
5. Store all notification attempts in the notification log.
6. Show the customer a confirmation screen explaining that staff will confirm availability.

On admin approval:

1. Update the request to `approved`.
2. Send customer approval confirmation by email, SMS, and WhatsApp.
3. Record notification attempts.

On admin decline:

1. Update the request to `declined`.
2. Send customer decline message by email, SMS, and WhatsApp.
3. Record notification attempts.

## Notification Providers

Notifications must be implemented through a provider wrapper so the app does not hard-code third-party APIs inside page or form code.

Email:

- Provider: Resend.
- Secret: `RESEND_API_KEY`.
- Sender should eventually be a verified hotel-domain sender such as `bookings@luxurytouchhotel.com`.
- Development can use Resend's allowed onboarding sender only for test emails.

SMS:

- Provider: mNotify.
- Secrets should be stored in environment variables.
- Messages should be concise and include hotel name, request status, and contact number.

WhatsApp:

- Provider: Bird.
- Secrets and IDs should be stored in environment variables.
- Use approved WhatsApp templates for business-initiated messages, including request received, hotel alert, booking approved, and booking declined.
- The app should store Bird message IDs when available.

All notification sends should be best-effort: a failed notification should not delete or lose a booking request. Failures should be visible in admin.

## Data Model

Core tables:

- `profiles`: user profile, role, display name, active state.
- `rooms`: room content, price, occupancy, amenities, active state, sort order.
- `room_images`: room image records stored in Supabase Storage.
- `gallery_images`: gallery images, category, caption, sort order, active state.
- `content_blocks`: editable page sections keyed by page and block name.
- `testimonials`: guest review content and active state.
- `booking_requests`: customer details, room, dates, guests, status, notes, and timestamps.
- `notification_logs`: channel, provider, recipient, template/message type, status, provider response, and related booking request.
- `site_settings`: hotel contact details, notification recipient defaults, and display settings.

Row-level security should restrict admin data to authenticated staff. Public reads should only expose active website content.

## UI/UX Direction

The public website should feel like a real hotel booking experience, not a generic template. The first screen should clearly show Luxury Touch Hotel, location, room/booking action, and quality imagery. The booking action should remain easy to reach on mobile.

The admin dashboard should be quiet, practical, and fast for hotel staff. Receptionists should be able to see new requests quickly, open a request, call/message the customer, update status, and see whether notifications were delivered.

Design priorities:

- Mobile-first public booking flow.
- Clear room comparison.
- Strong image presentation without heavy visual clutter.
- Accessible forms with visible validation errors.
- Admin tables and detail views built for repeated daily use.
- Avoid placeholder reviews, placeholder staff, and "coming soon" dead sections unless intentionally hidden.

## Error Handling

- Booking form validation errors should be shown inline.
- Database save failure should show a retry-friendly error and avoid claiming the request was received.
- Notification failure after a booking is saved should not block the customer success screen, but it must be logged for staff.
- Admin actions should show success/failure states and keep the previous status if an update fails.
- Missing provider environment variables should show admin configuration warnings and fail notification sends with clear logs.

## Testing

Initial tests should cover:

- Booking form validation.
- Booking request creation.
- Status transitions from `new` to `contacted`, `approved`, `declined`, and `cancelled`.
- Notification orchestration for submit, approve, and decline events.
- Provider wrapper behavior when one channel fails.
- Admin authorization rules for manager, receptionist, and editor roles.

Manual verification should cover:

- Public mobile and desktop layouts.
- Booking submission flow.
- Admin login and booking status update flow.
- Email, SMS, and WhatsApp provider configuration with test credentials.

## Open Setup Requirements

Before production launch, the hotel must provide or configure:

- Supabase project URL and anon/service keys.
- Resend API key and verified sender domain.
- mNotify API credentials.
- Bird access key, workspace ID, WhatsApp channel ID, and approved templates.
- Final hotel room inventory, prices, images, and contact recipients.
- Confirmation that imported images and logo assets from the existing website are approved for reuse in the rebuilt site.

No API keys should be committed to source code. Local secrets belong in `.env.local`; production secrets belong in Vercel environment variables.
