import { addMinutes, isAfter, isBefore } from "date-fns";
import { z } from "zod";
import { EVENT_CATEGORIES } from "@/lib/constants";

const eventInputSchema = z.object({
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().min(5).max(500),
  category: z.enum(EVENT_CATEGORIES),
  addressText: z.string().trim().min(3).max(160),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  startAt: z.string().trim().min(1),
  durationMinutes: z.union([z.literal(30), z.literal(60), z.literal(120), z.literal(240)]),
  capacity: z.number().int().min(1).max(500).nullable()
});

export type EventInput = {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  addressText?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  startAt?: unknown;
  durationMinutes?: unknown;
  capacity?: unknown;
};

export type ParsedEventInput = {
  title: string;
  description: string;
  category: (typeof EVENT_CATEGORIES)[number];
  addressText: string;
  latitude: number;
  longitude: number;
  startAt: Date;
  endAt: Date;
  durationMinutes: 30 | 60 | 120 | 240;
  capacity: number | null;
};

export function parseEventInput(
  input: EventInput,
  now = new Date()
): { success: true; data: ParsedEventInput } | { success: false; error: string } {
  const parsed = eventInputSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid event input" };
  }

  const startAt = new Date(parsed.data.startAt);
  if (Number.isNaN(startAt.getTime())) {
    return { success: false, error: "Start time must be a valid date and time" };
  }

  const latestStart = addMinutes(now, 24 * 60);

  if (isBefore(startAt, now)) {
    return { success: false, error: "Start time must be in the future" };
  }

  if (isAfter(startAt, latestStart) || startAt.getTime() === latestStart.getTime()) {
    return { success: false, error: "Start time must be within the next 24 hours" };
  }

  return {
    success: true,
    data: {
      ...parsed.data,
      startAt,
      endAt: addMinutes(startAt, parsed.data.durationMinutes)
    }
  };
}
