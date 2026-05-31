import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(3),
  INTERNAL_JOB_SECRET: z.string().min(8),
  ADMIN_CLERK_USER_IDS: z.string().default(""),
  REMINDER_TEST_MODE: z.enum(["true", "false"]).default("false")
});

export function readEnv(source: Record<string, string | undefined> = process.env) {
  const parsed = envSchema.parse(source);

  return {
    supabaseUrl: parsed.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceRoleKey: parsed.SUPABASE_SERVICE_ROLE_KEY,
    resendApiKey: parsed.RESEND_API_KEY,
    resendFromEmail: parsed.RESEND_FROM_EMAIL,
    internalJobSecret: parsed.INTERNAL_JOB_SECRET,
    adminClerkUserIds: parsed.ADMIN_CLERK_USER_IDS.split(",")
      .map((id) => id.trim())
      .filter(Boolean),
    reminderTestMode: parsed.REMINDER_TEST_MODE === "true"
  };
}
