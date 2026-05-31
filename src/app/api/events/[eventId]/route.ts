import { NextResponse } from "next/server";
import { getEventDetail } from "@/lib/events/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = await getEventDetail(createSupabaseAdminClient(), eventId);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ event });
}
