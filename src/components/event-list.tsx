import { EventCard } from "@/components/event-card";
import type { EventSummary } from "@/lib/types";

export function EventList({ events }: { events: EventSummary[] }) {
  if (events.length === 0) {
    return <div className="rounded-ui border border-line bg-white p-8 text-center text-neutral-600">No events match these filters.</div>;
  }

  return (
    <div className="grid gap-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
