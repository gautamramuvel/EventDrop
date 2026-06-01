import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { BackToEventsLink } from "@/components/page-nav";
import { readEnv } from "@/lib/env";
import { listReportedEvents } from "@/lib/events/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await currentUser();
  const env = readEnv();

  if (!user || !env.adminClerkUserIds.includes(user.id)) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <BackToEventsLink />
        <p className="mt-4">Unauthorized</p>
      </main>
    );
  }

  const events = await listReportedEvents(createSupabaseAdminClient());

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <BackToEventsLink />
      <h1 className="text-3xl font-semibold">Admin review</h1>
      <div className="mt-6 grid gap-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-ui border border-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="font-semibold">{event.title}</h2>
              <Link href={`/events/${event.id}`} className="text-sm font-medium text-accent hover:text-ink">
                View event
              </Link>
            </div>
            <p className="text-sm text-neutral-600">
              {event.category} · {event.address_text}
            </p>
            {event.hidden_at && <p className="mt-2 text-sm text-red-700">{event.hidden_reason}</p>}
            <ul className="mt-3 list-disc pl-5 text-sm">
              {(event.reports ?? []).map((report: { id: string; reason: string }) => (
                <li key={report.id}>{report.reason}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </main>
  );
}
