drop function if exists list_visible_events(numeric, numeric, numeric, timestamptz, text);

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
