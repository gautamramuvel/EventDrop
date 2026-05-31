import { describe, expect, it } from "vitest";
import { toIsoDateTimeLocal } from "@/lib/events/form";

describe("toIsoDateTimeLocal", () => {
  it("converts browser datetime-local values to ISO strings", () => {
    const value = "2026-06-01T23:30";
    expect(toIsoDateTimeLocal(value)).toBe(new Date(value).toISOString());
  });
});
