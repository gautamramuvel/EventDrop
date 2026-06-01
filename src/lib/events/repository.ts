import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { EventCategory } from "@/lib/constants";
import type { EventQuery } from "@/lib/events/query";
import type { ParsedEventInput } from "@/lib/events/validation";
import type { EventDetail, EventSummary } from "@/lib/types";

export async function listEvents(supabase: SupabaseClient, query: EventQuery): Promise<EventSummary[]> {
  const meters = query.distanceMiles * 1609.344;

  const { data, error } = await supabase.rpc("list_visible_events", {
    p_lat: query.latitude,
    p_lng: query.longitude,
    p_radius_meters: meters,
    p_time_window: query.window,
    p_category: query.category === "all" ? null : query.category
  });

  if (error) throw new Error(`Event query failed: ${error.message}`);
  return (data ?? []).map(mapEventSummary);
}

export async function getEventDetail(
  supabase: SupabaseClient,
  eventId: string,
  viewerProfileId?: string
): Promise<EventDetail | null> {
  const { data, error } = await supabase.rpc("get_event_detail", {
    p_event_id: eventId,
    p_viewer_profile_id: viewerProfileId ?? null
  });

  if (error) throw new Error(`Event detail query failed: ${error.message}`);
  const row = Array.isArray(data) ? data[0] : data;
  return row ? mapEventDetail(row) : null;
}

export async function createEvent(supabase: SupabaseClient, profileId: string, input: ParsedEventInput) {
  const { data: inZone, error: zoneError } = await supabase.rpc("point_in_launch_zone", {
    lat: input.latitude,
    lng: input.longitude
  });

  if (zoneError) throw new Error(`Launch zone check failed: ${zoneError.message}`);
  if (!inZone) throw new Error("Event must be inside the launch zone");

  const { data, error } = await supabase
    .from("events")
    .insert({
      creator_profile_id: profileId,
      title: input.title,
      description: input.description,
      category: input.category,
      address_text: input.addressText,
      latitude: input.latitude,
      longitude: input.longitude,
      start_at: input.startAt.toISOString(),
      end_at: input.endAt.toISOString(),
      capacity: input.capacity
    })
    .select("id")
    .single();

  if (error) throw new Error(`Create event failed: ${error.message}`);
  return { id: data.id as string };
}

export async function rsvpToEvent(supabase: SupabaseClient, eventId: string, profile: { id: string; email: string }) {
  const detail = await getEventDetail(supabase, eventId, profile.id);
  if (!detail || detail.hiddenAt) throw new Error("Event not found");
  if (new Date(detail.endAt) <= new Date()) throw new Error("Event has expired");
  if (detail.capacity !== null && detail.rsvpCount >= detail.capacity && !detail.viewerHasRsvped) {
    throw new Error("Event is full");
  }

  const { error } = await supabase.from("rsvps").upsert(
    { event_id: eventId, profile_id: profile.id },
    { onConflict: "event_id,profile_id" }
  );

  if (error) throw new Error(`RSVP failed: ${error.message}`);
  return detail;
}

export async function cancelRsvp(supabase: SupabaseClient, eventId: string, profileId: string) {
  const { error } = await supabase.from("rsvps").delete().eq("event_id", eventId).eq("profile_id", profileId);
  if (error) throw new Error(`Cancel RSVP failed: ${error.message}`);
}

export async function reportEvent(supabase: SupabaseClient, eventId: string, profileId: string, reason: string) {
  if (reason.trim().length < 3) throw new Error("Report reason is required");

  const { error } = await supabase.from("reports").upsert(
    { event_id: eventId, profile_id: profileId, reason: reason.trim() },
    { onConflict: "event_id,profile_id" }
  );

  if (error) throw new Error(`Report failed: ${error.message}`);

  const { count, error: countError } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (countError) throw new Error(`Report count failed: ${countError.message}`);

  if ((count ?? 0) >= 3) {
    const { error: hideError } = await supabase
      .from("events")
      .update({ hidden_at: new Date().toISOString(), hidden_reason: "Auto-hidden after 3 reports" })
      .eq("id", eventId)
      .is("hidden_at", null);

    if (hideError) throw new Error(`Auto-hide failed: ${hideError.message}`);
  }
}

export async function listReportedEvents(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("events")
    .select("id,title,category,address_text,hidden_at,hidden_reason,reports(id,reason,created_at)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Reported events query failed: ${error.message}`);
  return (data ?? []).filter((event: { reports?: unknown[]; hidden_at?: string | null }) => event.reports?.length || event.hidden_at);
}

export { parseEventQuery } from "@/lib/events/query";

function mapEventSummary(row: Record<string, unknown>): EventSummary {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    category: row.category as EventCategory,
    addressText: String(row.address_text),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    startAt: String(row.start_at),
    endAt: String(row.end_at),
    capacity: row.capacity === null ? null : Number(row.capacity),
    rsvpCount: Number(row.rsvp_count ?? 0),
    creatorName: String(row.creator_name ?? "Neighbor"),
    creatorAvatarUrl: row.creator_avatar_url ? String(row.creator_avatar_url) : null,
    distanceMiles: row.distance_miles === null || row.distance_miles === undefined ? undefined : Number(row.distance_miles)
  };
}

function mapEventDetail(row: Record<string, unknown>): EventDetail {
  return {
    ...mapEventSummary(row),
    viewerHasRsvped: Boolean(row.viewer_has_rsvped),
    hiddenAt: row.hidden_at ? String(row.hidden_at) : null
  };
}
