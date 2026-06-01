import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { LocalDateTimeRange } from "@/components/local-date-time";
import { BackToEventsLink } from "@/components/page-nav";
import { ReportForm } from "@/components/report-form";
import { RsvpButton } from "@/components/rsvp-button";
import { requireSyncedProfile } from "@/lib/auth/profile";
import { getEventDetail } from "@/lib/events/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const user = await currentUser();
  const profile = user ? await requireSyncedProfile(user) : null;
  const event = await getEventDetail(createSupabaseAdminClient(), eventId, profile?.id);

  if (!event || event.hiddenAt) notFound();

  const eventEnded = new Date(event.endAt) <= new Date();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <BackToEventsLink />
      <p className="text-sm font-semibold uppercase text-accent">{event.category}</p>
      <h1 className="mt-2 text-4xl font-semibold">{event.title}</h1>
      <p className="mt-3 text-neutral-700">{event.description}</p>
      <dl className="mt-6 grid gap-3 rounded-ui border border-line bg-white p-4 text-sm">
        <div>
          <dt className="font-semibold">When</dt>
          <dd>
            <LocalDateTimeRange startAt={event.startAt} endAt={event.endAt} />
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Where</dt>
          <dd>{event.addressText}</dd>
        </div>
        <div>
          <dt className="font-semibold">Going</dt>
          <dd>
            {event.rsvpCount}
            {event.capacity ? `/${event.capacity}` : ""}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Host</dt>
          <dd>{event.creatorName}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <RsvpButton eventId={event.id} hasRsvped={event.viewerHasRsvped} disabledReason={eventEnded ? "This event has ended" : undefined} />
      </div>
      <ReportForm eventId={event.id} />
    </main>
  );
}
