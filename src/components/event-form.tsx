"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EVENT_CATEGORIES, EVENT_DURATIONS_MINUTES } from "@/lib/constants";

export function EventForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError(null);

    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        addressText: formData.get("addressText"),
        latitude: Number(formData.get("latitude")),
        longitude: Number(formData.get("longitude")),
        startAt: formData.get("startAt"),
        durationMinutes: Number(formData.get("durationMinutes")),
        capacity: formData.get("capacity") ? Number(formData.get("capacity")) : null
      })
    });

    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(payload.error ?? "Could not create event");
      return;
    }

    router.push(`/events/${payload.event.id}`);
  }

  return (
    <form action={submit} className="grid gap-4">
      {error && <p className="rounded-ui border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <input name="title" required minLength={3} maxLength={80} placeholder="Event title" className="rounded-ui border border-line p-3" />
      <textarea name="description" required minLength={5} maxLength={500} placeholder="What is happening?" className="rounded-ui border border-line p-3" />
      <select name="category" className="rounded-ui border border-line p-3">
        {EVENT_CATEGORIES.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <input name="addressText" required placeholder="Address or place name" className="rounded-ui border border-line p-3" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="latitude" required type="number" step="0.000001" defaultValue="40.730610" className="rounded-ui border border-line p-3" />
        <input name="longitude" required type="number" step="0.000001" defaultValue="-73.935242" className="rounded-ui border border-line p-3" />
      </div>
      <input name="startAt" required type="datetime-local" className="rounded-ui border border-line p-3" />
      <select name="durationMinutes" className="rounded-ui border border-line p-3">
        {EVENT_DURATIONS_MINUTES.map((minutes) => (
          <option key={minutes} value={minutes}>
            {minutes} minutes
          </option>
        ))}
      </select>
      <input name="capacity" type="number" min="1" max="500" placeholder="Capacity optional" className="rounded-ui border border-line p-3" />
      <button disabled={pending} className="rounded-ui bg-ink px-4 py-3 font-medium text-white disabled:opacity-60">
        {pending ? "Creating..." : "Create drop"}
      </button>
    </form>
  );
}
