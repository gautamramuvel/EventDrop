import { describe, expect, it } from "vitest";
import { readEnv } from "@/lib/env";

describe("readEnv", () => {
  it("returns parsed environment when required values exist", () => {
    const env = readEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
      GMAIL_SMTP_USER: "sender@gmail.com",
      GMAIL_SMTP_APP_PASSWORD: "app-password",
      REMINDER_FROM_EMAIL: "EventDrop <sender@gmail.com>",
      INTERNAL_JOB_SECRET: "secret-value",
      ADMIN_CLERK_USER_IDS: "user_1,user_2",
      REMINDER_TEST_MODE: "false"
    });

    expect(env.adminClerkUserIds).toEqual(["user_1", "user_2"]);
    expect(env.reminderTestMode).toBe(false);
  });

  it("throws when required server env is missing", () => {
    expect(() => readEnv({})).toThrow("NEXT_PUBLIC_SUPABASE_URL");
  });
});
