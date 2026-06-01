create extension if not exists postgis;
create extension if not exists pg_cron;
create extension if not exists pgcrypto;

create table profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  email text not null,
  first_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table launch_zone (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  center_latitude numeric(9,6) not null,
  center_longitude numeric(9,6) not null,
  radius_meters integer not null check (radius_meters > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 80),
  description text not null check (char_length(description) between 5 and 500),
  category text not null check (category in ('Social', 'Sports', 'Creative', 'Food', 'Study', 'Marketplace')),
  address_text text not null,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  location geography(point, 4326) generated always as (st_setsrid(st_makepoint(longitude::float8, latitude::float8), 4326)::geography) stored,
  start_at timestamptz not null,
  end_at timestamptz not null,
  capacity integer check (capacity is null or capacity > 0),
  hidden_at timestamptz,
  hidden_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

create table event_reminders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  email text not null,
  reminder_type text not null default 'start_30m',
  send_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  attempt_count integer not null default 0,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, profile_id, reminder_type)
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 500),
  created_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

create index events_location_gix on events using gist (location);
create index events_start_end_idx on events (start_at, end_at);
create index events_visible_idx on events (end_at, start_at) where hidden_at is null;
create index reminders_due_idx on event_reminders (send_at, status);
create index reports_event_idx on reports (event_id);

create or replace function distance_miles(a geography, b geography)
returns numeric
language sql
stable
as $$
  select round((st_distance(a, b) / 1609.344)::numeric, 2);
$$;

create or replace function point_in_launch_zone(lat numeric, lng numeric)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from launch_zone
    where st_dwithin(
      st_setsrid(st_makepoint(lng::float8, lat::float8), 4326)::geography,
      st_setsrid(st_makepoint(center_longitude::float8, center_latitude::float8), 4326)::geography,
      radius_meters
    )
  );
$$;

create or replace function list_visible_events(
  p_lat numeric,
  p_lng numeric,
  p_radius_meters numeric,
  p_time_window text,
  p_category text
)
returns table (
  id uuid,
  title text,
  description text,
  category text,
  address_text text,
  latitude numeric,
  longitude numeric,
  start_at timestamptz,
  end_at timestamptz,
  capacity integer,
  rsvp_count bigint,
  creator_name text,
  creator_avatar_url text,
  distance_miles numeric
)
language sql
stable
as $$
  select
    e.id,
    e.title,
    e.description,
    e.category,
    e.address_text,
    e.latitude,
    e.longitude,
    e.start_at,
    e.end_at,
    e.capacity,
    count(r.id) as rsvp_count,
    p.first_name as creator_name,
    p.avatar_url as creator_avatar_url,
    distance_miles(e.location, st_setsrid(st_makepoint(p_lng::float8, p_lat::float8), 4326)::geography) as distance_miles
  from events e
  join profiles p on p.id = e.creator_profile_id
  left join rsvps r on r.event_id = e.id
  where e.hidden_at is null
    and (
      (p_time_window = 'past' and e.end_at <= now())
      or (p_time_window = 'now' and e.end_at > now() and e.start_at <= now() + interval '1 hour')
      or (p_time_window = 'next4h' and e.end_at > now() and e.start_at <= now() + interval '4 hours')
      or (p_time_window = 'next24h' and e.end_at > now() and e.start_at <= now() + interval '24 hours')
      or (p_time_window = 'beyond24h' and e.start_at > now() + interval '24 hours')
    )
    and (p_category is null or e.category = p_category)
    and st_dwithin(e.location, st_setsrid(st_makepoint(p_lng::float8, p_lat::float8), 4326)::geography, p_radius_meters)
  group by e.id, p.first_name, p.avatar_url
  order by
    case when p_time_window = 'past' then e.start_at end desc,
    case when p_time_window <> 'past' then e.start_at end asc;
$$;

create or replace function get_event_detail(
  p_event_id uuid,
  p_viewer_profile_id uuid
)
returns table (
  id uuid,
  title text,
  description text,
  category text,
  address_text text,
  latitude numeric,
  longitude numeric,
  start_at timestamptz,
  end_at timestamptz,
  capacity integer,
  hidden_at timestamptz,
  rsvp_count bigint,
  creator_name text,
  creator_avatar_url text,
  viewer_has_rsvped boolean
)
language sql
stable
as $$
  select
    e.id,
    e.title,
    e.description,
    e.category,
    e.address_text,
    e.latitude,
    e.longitude,
    e.start_at,
    e.end_at,
    e.capacity,
    e.hidden_at,
    count(r.id) as rsvp_count,
    p.first_name as creator_name,
    p.avatar_url as creator_avatar_url,
    exists (
      select 1 from rsvps vr
      where vr.event_id = e.id and vr.profile_id = p_viewer_profile_id
    ) as viewer_has_rsvped
  from events e
  join profiles p on p.id = e.creator_profile_id
  left join rsvps r on r.event_id = e.id
  where e.id = p_event_id
  group by e.id, p.first_name, p.avatar_url;
$$;

create or replace function claim_due_reminders(p_limit integer default 20)
returns table (
  reminder_id uuid,
  email text,
  event_title text,
  event_address text,
  event_start_at timestamptz
)
language plpgsql
as $$
begin
  return query
  with claimed as (
    select er.id
    from event_reminders er
    join events e on e.id = er.event_id
    where er.status = 'pending'
      and er.send_at <= now()
      and e.hidden_at is null
      and e.end_at > now()
    order by er.send_at asc
    limit p_limit
    for update skip locked
  ),
  updated as (
    update event_reminders er
    set status = 'processing',
        attempt_count = er.attempt_count + 1,
        updated_at = now()
    from claimed
    where er.id = claimed.id
    returning er.id, er.email, er.event_id
  )
  select
    updated.id as reminder_id,
    updated.email,
    e.title as event_title,
    e.address_text as event_address,
    e.start_at as event_start_at
  from updated
  join events e on e.id = updated.event_id;
end;
$$;

-- Configure after deployment, replacing URL and secret:
-- select cron.schedule(
--   'eventdrop-reminders-every-minute',
--   '* * * * *',
--   $$
--   select net.http_post(
--     url := 'https://YOUR_VERCEL_APP.vercel.app/api/internal/reminders/send',
--     headers := jsonb_build_object('authorization', 'Bearer YOUR_INTERNAL_JOB_SECRET')
--   );
--   $$
-- );
