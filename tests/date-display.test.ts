import { describe, expect, it } from "vitest";
import { formatLocalDateTimeRange, formatLocalTime } from "@/lib/dates/display";

describe("date display", () => {
  it("formats stored UTC instants in the viewer timezone", () => {
    const startAt = "2026-06-01T04:22:00.000Z";
    const endAt = "2026-06-01T04:52:00.000Z";

    expect(formatLocalTime(startAt, { locale: "en-US", timeZone: "Asia/Kolkata" })).toBe("9:52 AM");
    expect(formatLocalDateTimeRange(startAt, endAt, { locale: "en-US", timeZone: "Asia/Kolkata" })).toBe(
      "Jun 1, 2026, 9:52 AM - 10:22 AM"
    );
  });
});
