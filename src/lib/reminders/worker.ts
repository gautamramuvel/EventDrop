import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEventReminderEmail } from "@/lib/reminders/email";

type DueReminder = {
  reminder_id: string;
  email: string;
  event_title: string;
  event_address: string;
  event_start_at: string;
};

export async function sendDueReminders(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("claim_due_reminders", { p_limit: 20 });
  if (error) throw new Error(`Claim reminders failed: ${error.message}`);

  const reminders = (data ?? []) as DueReminder[];
  const results = [];

  for (const reminder of reminders) {
    try {
      await sendEventReminderEmail({
        to: reminder.email,
        eventTitle: reminder.event_title,
        eventAddress: reminder.event_address,
        eventStartAt: reminder.event_start_at
      });

      await supabase
        .from("event_reminders")
        .update({ status: "sent", sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", reminder.reminder_id);

      results.push({ id: reminder.reminder_id, status: "sent" });
    } catch (error) {
      await supabase
        .from("event_reminders")
        .update({
          status: "failed",
          last_error: error instanceof Error ? error.message : "Unknown reminder error",
          updated_at: new Date().toISOString()
        })
        .eq("id", reminder.reminder_id);

      results.push({ id: reminder.reminder_id, status: "failed" });
    }
  }

  return results;
}
