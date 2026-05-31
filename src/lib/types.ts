import type { EventCategory } from "@/lib/constants";

export type EventSummary = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  addressText: string;
  latitude: number;
  longitude: number;
  startAt: string;
  endAt: string;
  capacity: number | null;
  rsvpCount: number;
  creatorName: string;
  creatorAvatarUrl: string | null;
  distanceMiles?: number;
};

export type EventDetail = EventSummary & {
  viewerHasRsvped: boolean;
  hiddenAt: string | null;
};
