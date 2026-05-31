insert into profiles (id, clerk_user_id, email, first_name, avatar_url)
values
  ('00000000-0000-0000-0000-000000000001', 'seed_creator_1', 'maya@example.com', 'Maya', null),
  ('00000000-0000-0000-0000-000000000002', 'seed_creator_2', 'noah@example.com', 'Noah', null)
on conflict (clerk_user_id) do nothing;

insert into launch_zone (id, name, center_latitude, center_longitude, radius_meters)
values ('10000000-0000-0000-0000-000000000001', 'Seed Neighborhood', 40.730610, -73.935242, 16093)
on conflict (id) do nothing;

insert into events (creator_profile_id, title, description, category, address_text, latitude, longitude, start_at, end_at, capacity)
values
  ('00000000-0000-0000-0000-000000000001', 'Pickup basketball', 'Casual half-court run. Bring water.', 'Sports', '4th Street Park', 40.731100, -73.936100, now() + interval '2 hours', now() + interval '4 hours', 12),
  ('00000000-0000-0000-0000-000000000002', 'Open mic slots', 'Two open slots left for acoustic sets.', 'Creative', 'Corner Cafe', 40.729800, -73.933900, now() + interval '3 hours', now() + interval '5 hours', 20),
  ('00000000-0000-0000-0000-000000000001', 'Food truck pop-up', 'Tacos parked near the library until evening.', 'Food', 'Library Plaza', 40.730000, -73.934000, now() - interval '15 minutes', now() + interval '2 hours', null)
on conflict do nothing;
