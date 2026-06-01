import Link from "next/link";
import { LocalTime } from "@/components/local-date-time";
import type { EventSummary } from "@/lib/types";

export function EventCard({ event }: { event: EventSummary }) {
  const full = event.capacity !== null && event.rsvpCount >= event.capacity;

  return (
    <Link href={`/events/${event.id}`} className="block rounded-ui border border-line bg-white p-4 hover:border-ink">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-accent">{event.category}</p>
          <h2 className="mt-1 text-xl font-semibold">{event.title}</h2>
        </div>
        <span className="rounded-ui bg-paper px-2 py-1 text-xs">
          <LocalTime value={event.startAt} />
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{event.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-700">
        <span>{event.addressText}</span>
        {event.distanceMiles !== undefined && <span>{event.distanceMiles} mi</span>}
        <span>
          {event.rsvpCount}
          {event.capacity ? `/${event.capacity}` : ""} going
        </span>
        {full && <span className="text-red-700">Full</span>}
      </div>
    </Link>
  );
}
