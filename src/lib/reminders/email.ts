import "server-only";
import { Resend } from "resend";
import { readEnv } from "@/lib/env";

export async function sendEventReminderEmail(input: {
  to: string;
  eventTitle: string;
  eventAddress: string;
  eventStartAt: string;
}) {
  const env = readEnv();

  if (env.reminderTestMode) {
    return { id: `test-${Date.now()}` };
  }

  const resend = new Resend(env.resendApiKey);
  const result = await resend.emails.send({
    from: env.resendFromEmail,
    to: input.to,
    subject: `Reminder: ${input.eventTitle} starts soon`,
    text: `${input.eventTitle} starts at ${new Date(input.eventStartAt).toLocaleString()}.\nLocation: ${input.eventAddress}`
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { id: result.data?.id ?? "sent" };
}
