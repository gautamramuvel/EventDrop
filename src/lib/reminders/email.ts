import "server-only";
import nodemailer from "nodemailer";
import { formatLocalDateTime } from "@/lib/dates/display";
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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.gmailSmtpUser,
      pass: env.gmailSmtpAppPassword
    }
  });

  const result = await transporter.sendMail({
    from: env.reminderFromEmail,
    to: input.to,
    subject: `Reminder: ${input.eventTitle} starts soon`,
    text: `${input.eventTitle} starts at ${formatLocalDateTime(input.eventStartAt, {
      timeZone: env.reminderTimeZone
    })}.\nLocation: ${input.eventAddress}`
  });

  return { id: result.messageId };
}
