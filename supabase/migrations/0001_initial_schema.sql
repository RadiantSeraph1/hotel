create extension if not exists pgcrypto;

create type public.staff_role as enum ('manager', 'receptionist', 'editor');
create type public.room_status as enum ('draft', 'active', 'inactive');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.booking_status as enum ('new', 'contacted', 'approved', 'declined', 'cancelled');
create type public.notification_channel as enum ('email', 'sms', 'whatsapp');
create type public.notification_status as enum ('pending', 'sent', 'failed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role public.staff_role not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_not_blank check (length(trim(email)) > 0),
  constraint profiles_full_name_not_blank check (length(trim(full_name)) > 0)
);

create or replace function public.current_staff_role()
returns public.staff_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and active = true
  limit 1;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() is not null;
$$;

create or replace function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() = 'manager'::public.staff_role;
$$;

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  base_price numeric(10, 2) not null default 0,
  capacity integer not null default 1,
  bed_type text,
  size_label text,
  amenities text[] not null default '{}',
  status public.room_status not null default 'draft',
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rooms_slug_not_blank check (length(trim(slug)) > 0),
  constraint rooms_name_not_blank check (length(trim(name)) > 0),
  constraint rooms_base_price_non_negative check (base_price >= 0),
  constraint rooms_capacity_positive check (capacity > 0)
);

create table public.room_images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_featured boolean not null default false,
  status public.room_status not null default 'active',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint room_images_image_url_not_blank check (length(trim(image_url)) > 0)
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  alt_text text,
  category text,
  status public.room_status not null default 'active',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_images_title_not_blank check (length(trim(title)) > 0),
  constraint gallery_images_image_url_not_blank check (length(trim(image_url)) > 0)
);

create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_blocks_key_not_blank check (length(trim(key)) > 0),
  constraint content_blocks_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  guest_location text,
  quote text not null,
  rating integer,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_guest_name_not_blank check (length(trim(guest_name)) > 0),
  constraint testimonials_quote_not_blank check (length(trim(quote)) > 0),
  constraint testimonials_rating_range check (rating is null or rating between 1 and 5)
);

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  guest_country text,
  room_id uuid references public.rooms(id) on delete set null,
  room_name text not null,
  check_in date not null,
  check_out date not null,
  adults integer not null default 1,
  children integer not null default 0,
  message text,
  status public.booking_status not null default 'new',
  internal_notes text,
  contacted_at timestamptz,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_requests_guest_name_not_blank check (length(trim(guest_name)) > 0),
  constraint booking_requests_guest_email_not_blank check (length(trim(guest_email)) > 0),
  constraint booking_requests_guest_phone_not_blank check (length(trim(guest_phone)) > 0),
  constraint booking_requests_room_name_not_blank check (length(trim(room_name)) > 0),
  constraint booking_requests_valid_dates check (check_out > check_in),
  constraint booking_requests_adults_positive check (adults > 0),
  constraint booking_requests_children_non_negative check (children >= 0)
);

create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid references public.booking_requests(id) on delete cascade,
  channel public.notification_channel not null,
  recipient text not null,
  template_key text not null,
  status public.notification_status not null default 'pending',
  provider_message_id text,
  error_message text,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notification_logs_recipient_not_blank check (length(trim(recipient)) > 0),
  constraint notification_logs_template_key_not_blank check (length(trim(template_key)) > 0),
  constraint notification_logs_payload_object check (jsonb_typeof(payload) = 'object')
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  public_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_key_not_blank check (length(trim(key)) > 0)
);

create index profiles_role_idx on public.profiles(role);
create index profiles_active_idx on public.profiles(active);

create index rooms_status_sort_idx on public.rooms(status, sort_order);
create index rooms_slug_idx on public.rooms(slug);

create index room_images_room_sort_idx on public.room_images(room_id, sort_order);
create index room_images_status_idx on public.room_images(status);
create unique index room_images_one_featured_per_room_idx
  on public.room_images(room_id)
  where is_featured = true and status = 'active';

create index gallery_images_status_sort_idx on public.gallery_images(status, sort_order);
create index gallery_images_category_idx on public.gallery_images(category);

create index content_blocks_status_sort_idx on public.content_blocks(status, sort_order);
create index content_blocks_key_idx on public.content_blocks(key);

create index testimonials_status_sort_idx on public.testimonials(status, sort_order);

create index booking_requests_status_created_idx on public.booking_requests(status, created_at desc);
create index booking_requests_room_id_idx on public.booking_requests(room_id);
create index booking_requests_guest_email_idx on public.booking_requests(guest_email);

create index notification_logs_booking_request_idx on public.notification_logs(booking_request_id);
create index notification_logs_status_created_idx on public.notification_logs(status, created_at desc);
create index notification_logs_channel_idx on public.notification_logs(channel);

create index site_settings_public_read_idx on public.site_settings(public_read);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger rooms_set_updated_at
before update on public.rooms
for each row execute function public.set_updated_at();

create trigger room_images_set_updated_at
before update on public.room_images
for each row execute function public.set_updated_at();

create trigger gallery_images_set_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

create trigger content_blocks_set_updated_at
before update on public.content_blocks
for each row execute function public.set_updated_at();

create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

create trigger booking_requests_set_updated_at
before update on public.booking_requests
for each row execute function public.set_updated_at();

create trigger notification_logs_set_updated_at
before update on public.notification_logs
for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_images enable row level security;
alter table public.gallery_images enable row level security;
alter table public.content_blocks enable row level security;
alter table public.testimonials enable row level security;
alter table public.booking_requests enable row level security;
alter table public.notification_logs enable row level security;
alter table public.site_settings enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "Managers can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_manager());

create policy "Managers can insert profiles"
on public.profiles
for insert
to authenticated
with check (public.is_manager());

create policy "Managers can update profiles"
on public.profiles
for update
to authenticated
using (public.is_manager())
with check (public.is_manager());

create policy "Public can read active rooms"
on public.rooms
for select
to anon, authenticated
using (status = 'active');

create policy "Staff can manage rooms"
on public.rooms
for all
to authenticated
using (public.current_staff_role() in ('manager', 'editor'))
with check (public.current_staff_role() in ('manager', 'editor'));

create policy "Public can read active room images for active rooms"
on public.room_images
for select
to anon, authenticated
using (
  status = 'active'
  and exists (
    select 1
    from public.rooms
    where rooms.id = room_images.room_id
      and rooms.status = 'active'
  )
);

create policy "Staff can manage room images"
on public.room_images
for all
to authenticated
using (public.current_staff_role() in ('manager', 'editor'))
with check (public.current_staff_role() in ('manager', 'editor'));

create policy "Public can read active gallery images"
on public.gallery_images
for select
to anon, authenticated
using (status = 'active');

create policy "Staff can manage gallery images"
on public.gallery_images
for all
to authenticated
using (public.current_staff_role() in ('manager', 'editor'))
with check (public.current_staff_role() in ('manager', 'editor'));

create policy "Public can read published content blocks"
on public.content_blocks
for select
to anon, authenticated
using (status = 'published');

create policy "Staff can manage content blocks"
on public.content_blocks
for all
to authenticated
using (public.current_staff_role() in ('manager', 'editor'))
with check (public.current_staff_role() in ('manager', 'editor'));

create policy "Public can read published testimonials"
on public.testimonials
for select
to anon, authenticated
using (status = 'published');

create policy "Staff can manage testimonials"
on public.testimonials
for all
to authenticated
using (public.current_staff_role() in ('manager', 'editor'))
with check (public.current_staff_role() in ('manager', 'editor'));

create policy "Public can create booking requests"
on public.booking_requests
for insert
to anon, authenticated
with check (status = 'new');

create policy "Staff can read booking requests"
on public.booking_requests
for select
to authenticated
using (public.current_staff_role() in ('manager', 'receptionist'));

create policy "Managers and receptionists can update booking requests"
on public.booking_requests
for update
to authenticated
using (public.current_staff_role() in ('manager', 'receptionist'))
with check (public.current_staff_role() in ('manager', 'receptionist'));

create policy "Managers can delete booking requests"
on public.booking_requests
for delete
to authenticated
using (public.is_manager());

create policy "Staff can read notification logs"
on public.notification_logs
for select
to authenticated
using (public.current_staff_role() in ('manager', 'receptionist'));

create policy "Staff can create notification logs"
on public.notification_logs
for insert
to authenticated
with check (public.current_staff_role() in ('manager', 'receptionist'));

create policy "Staff can update notification logs"
on public.notification_logs
for update
to authenticated
using (public.current_staff_role() in ('manager', 'receptionist'))
with check (public.current_staff_role() in ('manager', 'receptionist'));

create policy "Public can read public site settings"
on public.site_settings
for select
to anon, authenticated
using (public_read = true);

create policy "Staff can manage site settings"
on public.site_settings
for all
to authenticated
using (public.current_staff_role() in ('manager', 'editor'))
with check (public.current_staff_role() in ('manager', 'editor'));
