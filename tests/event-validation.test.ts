import { addHours } from "date-fns";
import { describe, expect, it } from "vitest";
import { parseEventInput } from "@/lib/events/validation";

const baseDate = new Date("2026-06-01T12:00:00.000Z");

describe("parseEventInput", () => {
  it("computes end time from duration preset", () => {
    const parsed = parseEventInput(
      {
        title: "Pickup hoops",
        description: "Half-court run",
        category: "Sports",
        addressText: "4th Street Park",
        latitude: 40.73061,
        longitude: -73.935242,
        startAt: addHours(baseDate, 2).toISOString(),
        durationMinutes: 120,
        capacity: 12
      },
      baseDate
    );

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.endAt.toISOString()).toBe("2026-06-01T16:00:00.000Z");
    }
  });

  it("accepts events starting more than 24 hours ahead", () => {
    const parsed = parseEventInput(
      {
        title: "Weekend study meetup",
        description: "Planning session for Saturday",
        category: "Social",
        addressText: "Library",
        latitude: 40.73061,
        longitude: -73.935242,
        startAt: addHours(baseDate, 25).toISOString(),
        durationMinutes: 60,
        capacity: null
      },
      baseDate
    );

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.startAt.toISOString()).toBe("2026-06-02T13:00:00.000Z");
    }
  });

  it("accepts past event dates for archive visibility", () => {
    const parsed = parseEventInput(
      {
        title: "Yesterday open mic",
        description: "Archive entry for a completed event",
        category: "Creative",
        addressText: "Corner Cafe",
        latitude: 40.73061,
        longitude: -73.935242,
        startAt: "2026-05-31T20:00:00.000Z",
        durationMinutes: 120,
        capacity: 25
      },
      baseDate
    );

    expect(parsed.success).toBe(true);
  });

  it("rejects unsupported categories and durations", () => {
    const parsed = parseEventInput(
      {
        title: "Bad event",
        description: "Nope",
        category: "Conference",
        addressText: "Main Hall",
        latitude: 40.73061,
        longitude: -73.935242,
        startAt: addHours(baseDate, 2).toISOString(),
        durationMinutes: 180,
        capacity: null
      },
      baseDate
    );

    expect(parsed.success).toBe(false);
  });

  it("accepts datetime-local values from the event form", () => {
    const parsed = parseEventInput(
      {
        title: "Study group",
        description: "Calculus review before finals",
        category: "Study",
        addressText: "Main Library",
        latitude: 40.73061,
        longitude: -73.935242,
        startAt: "2026-06-01T23:30",
        durationMinutes: 60,
        capacity: null
      },
      baseDate
    );

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.startAt.toISOString()).toBe(new Date("2026-06-01T23:30").toISOString());
    }
  });
});
