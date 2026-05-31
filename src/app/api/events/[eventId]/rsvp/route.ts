import { NextResponse } from "next/server";
import { requireSyncedProfile } from "@/lib/auth/profile";
import { cancelRsvp, rsvpToEvent } from "@/lib/events/repository";
import { cancelPendingStartReminder, enqueueStartReminder } from "@/lib/reminders/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const profile = await requireSyncedProfile();
  const supabase = createSupabaseAdminClient();
  const event = await rsvpToEvent(supabase, eventId, profile);

  await enqueueStartReminder(supabase, {
    eventId,
    profileId: profile.id,
    email: profile.email,
    startAt: event.startAt
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const profile = await requireSyncedProfile();
  const supabase = createSupabaseAdminClient();

  await cancelRsvp(supabase, eventId, profile.id);
  await cancelPendingStartReminder(supabase, eventId, profile.id);

  return NextResponse.json({ ok: true });
}
