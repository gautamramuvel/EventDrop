import { describe, expect, it } from "vitest";
import { reminderSendAt } from "@/lib/reminders/time";

describe("reminderSendAt", () => {
  it("returns 30 minutes before event start", () => {
    expect(reminderSendAt(new Date("2026-06-01T20:00:00.000Z")).toISOString()).toBe("2026-06-01T19:30:00.000Z");
  });
});
