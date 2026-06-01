import { describe, expect, it } from "vitest";
import { parseEventQuery } from "@/lib/events/query";

describe("parseEventQuery", () => {
  it("defaults to all categories, 5 miles, next 24h", () => {
    const query = parseEventQuery(new URL("https://app.test/api/events"));

    expect(query.category).toBe("all");
    expect(query.distanceMiles).toBe(5);
    expect(query.window).toBe("next24h");
  });

  it("parses explicit filters", () => {
    const query = parseEventQuery(
      new URL("https://app.test/api/events?category=Food&distance=1&window=next4h&lat=40.7&lng=-73.9")
    );

    expect(query).toMatchObject({
      category: "Food",
      distanceMiles: 1,
      window: "next4h",
      latitude: 40.7,
      longitude: -73.9
    });
  });

  it("parses beyond 24 hours and past event filters", () => {
    const beyond = parseEventQuery(new URL("https://app.test/api/events?window=beyond24h"));
    const past = parseEventQuery(new URL("https://app.test/api/events?window=past"));

    expect(beyond.window).toBe("beyond24h");
    expect(past.window).toBe("past");
  });
});
