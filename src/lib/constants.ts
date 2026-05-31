export const EVENT_CATEGORIES = ["Social", "Sports", "Creative", "Food", "Study", "Marketplace"] as const;
export const EVENT_DURATIONS_MINUTES = [30, 60, 120, 240] as const;
export const TIME_WINDOWS = ["now", "next4h", "next24h"] as const;
export const DISTANCE_MILES = [1, 5, 10] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export type EventDurationMinutes = (typeof EVENT_DURATIONS_MINUTES)[number];
export type TimeWindow = (typeof TIME_WINDOWS)[number];
export type DistanceMiles = (typeof DISTANCE_MILES)[number];
