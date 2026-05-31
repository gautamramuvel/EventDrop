import { FilterBar } from "@/components/filter-bar";
import { EventList } from "@/components/event-list";
import { parseEventQuery } from "@/lib/events/query";
import { listEvents } from "@/lib/events/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolved = await searchParams;
  const url = new URL("https://eventdrop.local");

  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "string") url.searchParams.set(key, value);
  }

  const events = await listEvents(createSupabaseAdminClient(), parseEventQuery(url));

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <section>
        <h1 className="text-3xl font-semibold">All Events</h1>
        <p className="mt-2 text-neutral-600">Spontaneous drops happening nearby in the next 24 hours.</p>
      </section>
      <FilterBar />
      <EventList events={events} />
    </main>
  );
}
