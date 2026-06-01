import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GMAIL_SMTP_USER: z.string().email(),
  GMAIL_SMTP_APP_PASSWORD: z.string().min(8),
  REMINDER_FROM_EMAIL: z.string().min(3),
  REMINDER_TIME_ZONE: z.string().min(1).default("Asia/Kolkata"),
  INTERNAL_JOB_SECRET: z.string().min(8),
  ADMIN_CLERK_USER_IDS: z.string().default(""),
  REMINDER_TEST_MODE: z.enum(["true", "false"]).default("false")
});

export function readEnv(source: Record<string, string | undefined> = process.env) {
  const parsed = envSchema.parse(source);

  return {
    supabaseUrl: parsed.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceRoleKey: parsed.SUPABASE_SERVICE_ROLE_KEY,
    gmailSmtpUser: parsed.GMAIL_SMTP_USER,
    gmailSmtpAppPassword: parsed.GMAIL_SMTP_APP_PASSWORD,
    reminderFromEmail: parsed.REMINDER_FROM_EMAIL,
    reminderTimeZone: parsed.REMINDER_TIME_ZONE,
    internalJobSecret: parsed.INTERNAL_JOB_SECRET,
    adminClerkUserIds: parsed.ADMIN_CLERK_USER_IDS.split(",")
      .map((id) => id.trim())
      .filter(Boolean),
    reminderTestMode: parsed.REMINDER_TEST_MODE === "true"
  };
}
