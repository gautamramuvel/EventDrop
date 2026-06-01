delete from events;

insert into profiles (id, clerk_user_id, email, first_name, avatar_url)
values
  ('00000000-0000-0000-0000-000000000001', 'seed_creator_1', 'maya@example.com', 'Maya', null),
  ('00000000-0000-0000-0000-000000000002', 'seed_creator_2', 'noah@example.com', 'Noah', null),
  ('00000000-0000-0000-0000-000000000003', 'seed_creator_3', 'anika@example.com', 'Anika', null)
on conflict (id) do update
set
  clerk_user_id = excluded.clerk_user_id,
  email = excluded.email,
  first_name = excluded.first_name,
  avatar_url = excluded.avatar_url,
  updated_at = now();

insert into launch_zone (id, name, center_latitude, center_longitude, radius_meters)
values ('10000000-0000-0000-0000-000000000001', 'Seed Neighborhood', 40.730610, -73.935242, 16093)
on conflict (id) do update
set
  name = excluded.name,
  center_latitude = excluded.center_latitude,
  center_longitude = excluded.center_longitude,
  radius_meters = excluded.radius_meters,
  updated_at = now();

insert into events (creator_profile_id, title, description, category, address_text, latitude, longitude, start_at, end_at, capacity)
values
  -- Next 24 hours: two events each under Social, Sports, and Creative.
  ('00000000-0000-0000-0000-000000000001', 'Rooftop board game mixer', 'Low-key board games and quick introductions for neighbors.', 'Social', 'Ridgewood Rooftop Lounge', 40.730900, -73.934900, now() + interval '1 hour', now() + interval '3 hours', 18),
  ('00000000-0000-0000-0000-000000000002', 'Coffee walk for new renters', 'Meet outside the cafe for a relaxed neighborhood loop.', 'Social', 'Corner Bean Cafe', 40.731500, -73.933700, now() + interval '4 hours', now() + interval '5 hours 30 minutes', 12),
  ('00000000-0000-0000-0000-000000000003', 'Pickup basketball run', 'Casual half-court games. Bring water and a dark shirt.', 'Sports', '4th Street Park Courts', 40.729900, -73.936200, now() + interval '2 hours', now() + interval '4 hours', 14),
  ('00000000-0000-0000-0000-000000000001', 'Sunset yoga in the park', 'Beginner-friendly outdoor yoga session near the lawn.', 'Sports', 'McCarren Lawn Gate', 40.732000, -73.935500, now() + interval '8 hours', now() + interval '9 hours', 20),
  ('00000000-0000-0000-0000-000000000002', 'Open mic two-song slots', 'Acoustic and spoken-word slots for anyone ready to try.', 'Creative', 'Corner Cafe Back Room', 40.730200, -73.932900, now() + interval '3 hours', now() + interval '5 hours', 24),
  ('00000000-0000-0000-0000-000000000003', 'Sketch night at the library', 'Bring a notebook. Prompts and pencils will be shared.', 'Creative', 'Main Library Steps', 40.728900, -73.934400, now() + interval '20 hours', now() + interval '22 hours', 16),

  -- Beyond 24 hours: six discoverable future events.
  ('00000000-0000-0000-0000-000000000001', 'Friday dumpling crawl', 'Small group walk through three nearby dumpling spots.', 'Food', 'Lantern Market Entrance', 40.733000, -73.936100, now() + interval '30 hours', now() + interval '33 hours', 10),
  ('00000000-0000-0000-0000-000000000002', 'Breakfast taco pop-up', 'Early batch of breakfast tacos from a neighborhood cook.', 'Food', 'Library Plaza Food Truck Bay', 40.729500, -73.933300, now() + interval '42 hours', now() + interval '45 hours', null),
  ('00000000-0000-0000-0000-000000000003', 'Finals focus sprint', 'Two-hour silent study block with breaks every 30 minutes.', 'Study', 'Main Library Room 204', 40.730400, -73.934100, now() + interval '50 hours', now() + interval '52 hours', 18),
  ('00000000-0000-0000-0000-000000000001', 'Portfolio review circle', 'Bring one project and get friendly peer feedback.', 'Study', 'Campus Commons Table 6', 40.731200, -73.932700, now() + interval '68 hours', now() + interval '70 hours', 8),
  ('00000000-0000-0000-0000-000000000002', 'Apartment plant swap', 'Bring cuttings, pots, or starter plants to exchange.', 'Marketplace', 'Community Garden Gate', 40.728400, -73.936000, now() + interval '76 hours', now() + interval '78 hours', 30),
  ('00000000-0000-0000-0000-000000000003', 'Closet cleanout sidewalk sale', 'Small rotating rack of clothes, books, and kitchen extras.', 'Marketplace', 'North 5th Sidewalk Stands', 40.732400, -73.933800, now() + interval '96 hours', now() + interval '100 hours', null),

  -- Past events: visible under the Past events filter.
  ('00000000-0000-0000-0000-000000000001', 'Yesterday chai meetup', 'A completed casual meetup for neighbors who wanted a warm drink.', 'Social', 'Chai Stop Patio', 40.730800, -73.935900, now() - interval '26 hours', now() - interval '24 hours', 14),
  ('00000000-0000-0000-0000-000000000002', 'Morning five-a-side', 'Completed friendly football run at the turf field.', 'Sports', 'Turf Field Entrance', 40.729200, -73.935100, now() - interval '14 hours', now() - interval '12 hours', 10),
  ('00000000-0000-0000-0000-000000000003', 'Poster-making jam', 'Completed poster session for a campus club notice board.', 'Creative', 'Art Room 1B', 40.731900, -73.934200, now() - interval '4 hours', now() - interval '2 hours', 12);
