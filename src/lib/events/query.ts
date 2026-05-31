import {
  DISTANCE_MILES,
  EVENT_CATEGORIES,
  TIME_WINDOWS,
  type DistanceMiles,
  type EventCategory,
  type TimeWindow
} from "@/lib/constants";

export type EventQuery = {
  category: EventCategory | "all";
  distanceMiles: DistanceMiles;
  window: TimeWindow;
  latitude: number;
  longitude: number;
};

export function parseEventQuery(url: URL): EventQuery {
  const category = url.searchParams.get("category");
  const distance = Number(url.searchParams.get("distance") ?? "5");
  const window = url.searchParams.get("window") ?? "next24h";
  const latitude = Number(url.searchParams.get("lat") ?? process.env.NEXT_PUBLIC_DEFAULT_LAT ?? "40.73061");
  const longitude = Number(url.searchParams.get("lng") ?? process.env.NEXT_PUBLIC_DEFAULT_LNG ?? "-73.935242");

  return {
    category: category && EVENT_CATEGORIES.includes(category as EventCategory) ? (category as EventCategory) : "all",
    distanceMiles: DISTANCE_MILES.includes(distance as DistanceMiles) ? (distance as DistanceMiles) : 5,
    window: TIME_WINDOWS.includes(window as TimeWindow) ? (window as TimeWindow) : "next24h",
    latitude,
    longitude
  };
}
