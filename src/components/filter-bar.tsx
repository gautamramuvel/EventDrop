"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DISTANCE_MILES, EVENT_CATEGORIES, TIME_WINDOW_LABELS, TIME_WINDOWS } from "@/lib/constants";

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    next.set(key, value);
    router.push(`/?${next.toString()}`);
  }

  const activeCategory = params.get("category") ?? "all";

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {["all", ...EVENT_CATEGORIES].map((category) => (
          <button
            key={category}
            onClick={() => setParam("category", category)}
            className={`rounded-ui border px-3 py-2 text-sm ${
              activeCategory === category ? "border-ink bg-ink text-white" : "border-line bg-white"
            }`}
          >
            {category === "all" ? "All Events" : category}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          defaultValue={params.get("window") ?? "next24h"}
          onChange={(event) => setParam("window", event.target.value)}
          className="rounded-ui border border-line bg-white px-3 py-2 text-sm"
        >
          {TIME_WINDOWS.map((window) => (
            <option key={window} value={window}>
              {TIME_WINDOW_LABELS[window]}
            </option>
          ))}
        </select>
        <select
          defaultValue={params.get("distance") ?? "5"}
          onChange={(event) => setParam("distance", event.target.value)}
          className="rounded-ui border border-line bg-white px-3 py-2 text-sm"
        >
          {DISTANCE_MILES.map((miles) => (
            <option key={miles} value={miles}>
              {miles} mi
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
