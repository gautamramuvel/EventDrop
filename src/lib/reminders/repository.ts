import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { reminderSendAt } from "@/lib/reminders/time";

export async function enqueueStartReminder(
  supabase: SupabaseClient,
  input: {
    eventId: string;
    profileId: string;
    email: string;
    startAt: string;
  }
) {
  const { error } = await supabase.from("event_reminders").upsert(
    {
      event_id: input.eventId,
      profile_id: input.profileId,
      email: input.email,
      reminder_type: "start_30m",
      send_at: reminderSendAt(new Date(input.startAt)).toISOString(),
      status: "pending",
      updated_at: new Date().toISOString()
    },
    { onConflict: "event_id,profile_id,reminder_type" }
  );

  if (error) throw new Error(`Reminder enqueue failed: ${error.message}`);
}

export async function cancelPendingStartReminder(supabase: SupabaseClient, eventId: string, profileId: string) {
  const { error } = await supabase
    .from("event_reminders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("event_id", eventId)
    .eq("profile_id", profileId)
    .eq("reminder_type", "start_30m")
    .eq("status", "pending");

  if (error) throw new Error(`Reminder cancel failed: ${error.message}`);
}

export { reminderSendAt } from "@/lib/reminders/time";
