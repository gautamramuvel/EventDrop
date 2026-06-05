delete from events;

insert into profiles (id, clerk_user_id, email, first_name, avatar_url)
values
  ('00000000-0000-0000-0000-000000000001', 'seed_creator_1', 'gautam.ramuvel15@gmail.com', 'Gautam', null),
  ('00000000-0000-0000-0000-000000000002', 'seed_creator_2', 'gautam.ramuvel15@gmail.com', 'Gautam', null),
  ('00000000-0000-0000-0000-000000000003', 'seed_creator_3', 'gautam.ramuvel15@gmail.com', 'Gautam', null)
on conflict (id) do update
set
  clerk_user_id = excluded.clerk_user_id,
  email = excluded.email,
  first_name = excluded.first_name,
  avatar_url = excluded.avatar_url,
  updated_at = now();

insert into launch_zone (id, name, center_latitude, center_longitude, radius_meters)
values ('10000000-0000-0000-0000-000000000001', 'Guduvanchery Launch Area', 12.845200, 80.060800, 16093)
on conflict (id) do update
set
  name = excluded.name,
  center_latitude = excluded.center_latitude,
  center_longitude = excluded.center_longitude,
  radius_meters = excluded.radius_meters,
  updated_at = now();

insert into events (creator_profile_id, title, description, category, address_text, latitude, longitude, start_at, end_at, capacity)
values
  -- Today and tomorrow: dense next-24-hour board.
  ('00000000-0000-0000-0000-000000000001', 'Tea stall meetup', 'Quick neighbor meetup for chai and introductions near the station.', 'Social', 'Guduvanchery Railway Station Tea Stall', 12.845300, 80.060600, now() + interval '30 minutes', now() + interval '1 hour 30 minutes', 12),
  ('00000000-0000-0000-0000-000000000002', 'Apartment terrace hangout', 'Casual terrace chat for renters nearby. Bring snacks if you want.', 'Social', 'Nellikuppam Road Apartments', 12.849000, 80.063200, now() + interval '2 hours', now() + interval '4 hours', 18),
  ('00000000-0000-0000-0000-000000000003', 'Newcomers dinner table', 'Small dinner table for anyone new around Guduvanchery.', 'Social', 'GST Road Family Restaurant', 12.842900, 80.058800, now() + interval '6 hours', now() + interval '8 hours', 10),
  ('00000000-0000-0000-0000-000000000001', 'Morning coffee walk', 'Meet for coffee and a relaxed walk before work or class.', 'Social', 'Urapakkam Coffee Corner', 12.862000, 80.069400, now() + interval '14 hours', now() + interval '15 hours 30 minutes', 14),

  ('00000000-0000-0000-0000-000000000002', 'Badminton doubles', 'Friendly doubles rotation. Beginners welcome.', 'Sports', 'Guduvanchery Indoor Badminton Court', 12.846700, 80.059900, now() + interval '1 hour', now() + interval '3 hours', 16),
  ('00000000-0000-0000-0000-000000000003', 'Evening football five-a-side', 'Short five-a-side games on the turf. Teams made on arrival.', 'Sports', 'SRM Turf Ground', 12.822900, 80.045400, now() + interval '4 hours', now() + interval '6 hours', 20),
  ('00000000-0000-0000-0000-000000000001', 'Sunrise run group', 'Easy 3K loop for anyone trying to restart running.', 'Sports', 'Potheri Lake Road Start Point', 12.826500, 80.046300, now() + interval '12 hours', now() + interval '13 hours', 15),
  ('00000000-0000-0000-0000-000000000002', 'Yoga on the lawn', 'Beginner-friendly stretch and breathing session.', 'Sports', 'SRM Campus Lawn Gate', 12.824800, 80.044900, now() + interval '20 hours', now() + interval '21 hours', 22),

  ('00000000-0000-0000-0000-000000000003', 'Acoustic open mic', 'Two-song slots for singers, guitarists, and spoken word.', 'Creative', 'Guduvanchery Cafe Back Room', 12.843600, 80.061500, now() + interval '3 hours', now() + interval '5 hours', 24),
  ('00000000-0000-0000-0000-000000000001', 'Sketch and chai session', 'Bring a notebook. Simple prompts and pencils available.', 'Creative', 'Potheri Library Steps', 12.823700, 80.045900, now() + interval '7 hours', now() + interval '9 hours', 16),
  ('00000000-0000-0000-0000-000000000002', 'Poster design sprint', 'Quick design jam for campus club posters and event flyers.', 'Creative', 'SRM Design Lab Lobby', 12.822100, 80.046800, now() + interval '16 hours', now() + interval '18 hours', 12),
  ('00000000-0000-0000-0000-000000000003', 'Photo walk challenge', 'One-hour street photo challenge around storefronts and lights.', 'Creative', 'Guduvanchery Bus Stand', 12.844600, 80.059300, now() + interval '22 hours', now() + interval '23 hours 30 minutes', 18),

  ('00000000-0000-0000-0000-000000000001', 'Late-night dosa pop-up', 'Small batch dosa counter open until the batter runs out.', 'Food', 'GST Road Dosa Cart', 12.841900, 80.058100, now() + interval '5 hours', now() + interval '7 hours', null),
  ('00000000-0000-0000-0000-000000000002', 'Library focus sprint', 'Silent study sprint with short breaks every 30 minutes.', 'Study', 'SRM Central Library Table 4', 12.823500, 80.044700, now() + interval '10 hours', now() + interval '12 hours', 18),
  ('00000000-0000-0000-0000-000000000003', 'Mini plant swap', 'Bring cuttings, small pots, or seeds to exchange.', 'Marketplace', 'Guduvanchery Community Garden Gate', 12.848200, 80.062800, now() + interval '18 hours', now() + interval '20 hours', 25),

  -- Beyond 24 hours: tomorrow and later.
  ('00000000-0000-0000-0000-000000000001', 'Tomorrow brunch crew', 'Small brunch table for people who want an easy weekend plan.', 'Social', 'Urapakkam Brunch House', 12.861500, 80.068800, now() + interval '26 hours', now() + interval '28 hours', 12),
  ('00000000-0000-0000-0000-000000000002', 'Cricket nets practice', 'One-hour batting and bowling rotation at the nets.', 'Sports', 'Guduvanchery Cricket Nets', 12.850100, 80.064100, now() + interval '28 hours', now() + interval '30 hours', 18),
  ('00000000-0000-0000-0000-000000000003', 'Short film brainstorm', 'Meet collaborators for a five-minute short film idea.', 'Creative', 'SRM Media Club Room', 12.822600, 80.047100, now() + interval '31 hours', now() + interval '33 hours', 10),
  ('00000000-0000-0000-0000-000000000001', 'Food truck dinner trail', 'Try two food trucks and vote for the best plate.', 'Food', 'Potheri Food Truck Bay', 12.825300, 80.046100, now() + interval '34 hours', now() + interval '37 hours', 20),
  ('00000000-0000-0000-0000-000000000002', 'Resume review table', 'Bring one resume or portfolio page for peer review.', 'Study', 'Campus Commons Table 6', 12.823200, 80.045200, now() + interval '40 hours', now() + interval '42 hours', 8),
  ('00000000-0000-0000-0000-000000000003', 'Hostel room cleanout sale', 'Books, lamps, storage boxes, and small room extras.', 'Marketplace', 'SRM Hostel Road Stalls', 12.820900, 80.043800, now() + interval '46 hours', now() + interval '50 hours', null),
  ('00000000-0000-0000-0000-000000000001', 'Tamil movie night group', 'Group watch for a new release followed by tea.', 'Social', 'Guduvanchery Mini Theatre', 12.846100, 80.061900, now() + interval '52 hours', now() + interval '55 hours', 16),
  ('00000000-0000-0000-0000-000000000002', 'Weekend cycling loop', 'Easy cycling loop toward Maraimalai Nagar and back.', 'Sports', 'Guduvanchery Station Parking', 12.845100, 80.060400, now() + interval '60 hours', now() + interval '63 hours', 12),

  -- Past events: visible under the Past events filter.
  ('00000000-0000-0000-0000-000000000001', 'Completed chai meetup', 'A completed casual meetup for neighbors near the station.', 'Social', 'Guduvanchery Railway Station Tea Stall', 12.845300, 80.060600, now() - interval '2 hours', now() - interval '1 hour', 14),
  ('00000000-0000-0000-0000-000000000002', 'Morning football run', 'Completed friendly morning games at the turf.', 'Sports', 'SRM Turf Ground', 12.822900, 80.045400, now() - interval '8 hours', now() - interval '6 hours', 10),
  ('00000000-0000-0000-0000-000000000003', 'Poster-making jam', 'Completed poster session for a campus club notice board.', 'Creative', 'SRM Design Lab Lobby', 12.822100, 80.046800, now() - interval '18 hours', now() - interval '16 hours', 12),
  ('00000000-0000-0000-0000-000000000001', 'Yesterday book exchange', 'Completed exchange of used books and class notes.', 'Marketplace', 'Potheri Library Steps', 12.823700, 80.045900, now() - interval '28 hours', now() - interval '26 hours', 20);
