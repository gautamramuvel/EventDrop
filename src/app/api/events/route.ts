import { NextRequest, NextResponse } from "next/server";
import { requireSyncedProfile } from "@/lib/auth/profile";
import { parseEventQuery } from "@/lib/events/query";
import { createEvent, listEvents } from "@/lib/events/repository";
import { parseEventInput } from "@/lib/events/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClient();
  const query = parseEventQuery(new URL(request.url));
  const events = await listEvents(supabase, query);
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const profile = await requireSyncedProfile();
  const body = await request.json();
  const parsed = parseEventInput(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const event = await createEvent(supabase, profile.id, parsed.data);
  return NextResponse.json({ event }, { status: 201 });
}
