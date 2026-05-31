import { NextResponse } from "next/server";
import { requireSyncedProfile } from "@/lib/auth/profile";
import { reportEvent } from "@/lib/events/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const profile = await requireSyncedProfile();
  const body = await request.json();

  await reportEvent(createSupabaseAdminClient(), eventId, profile.id, String(body.reason ?? ""));
  return NextResponse.json({ ok: true });
}
