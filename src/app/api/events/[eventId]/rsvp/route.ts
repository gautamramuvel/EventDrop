import { NextResponse } from "next/server";
import { AUTH_REQUIRED_MESSAGE } from "@/lib/auth/messages";
import { requireSyncedProfile } from "@/lib/auth/profile";
import { cancelRsvp, rsvpToEvent } from "@/lib/events/repository";
import { cancelPendingStartReminder, enqueueStartReminder } from "@/lib/reminders/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  try {
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
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    throw error;
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  try {
    const profile = await requireSyncedProfile();
    const supabase = createSupabaseAdminClient();

    await cancelRsvp(supabase, eventId, profile.id);
    await cancelPendingStartReminder(supabase, eventId, profile.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    throw error;
  }
}
