import { afterEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();
const createTransport = vi.fn(() => ({ sendMail }));

vi.mock("nodemailer", () => ({
  default: { createTransport }
}));

vi.mock("server-only", () => ({}));

describe("sendEventReminderEmail", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("sends reminder email through Gmail SMTP", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role");
    vi.stubEnv("GMAIL_SMTP_USER", "sender@gmail.com");
    vi.stubEnv("GMAIL_SMTP_APP_PASSWORD", "app-password");
    vi.stubEnv("REMINDER_FROM_EMAIL", "EventDrop <sender@gmail.com>");
    vi.stubEnv("REMINDER_TIME_ZONE", "Asia/Kolkata");
    vi.stubEnv("INTERNAL_JOB_SECRET", "secret-value");
    vi.stubEnv("REMINDER_TEST_MODE", "false");
    sendMail.mockResolvedValue({ messageId: "gmail-message-id" });

    const { sendEventReminderEmail } = await import("@/lib/reminders/email");
    const result = await sendEventReminderEmail({
      to: "guest@example.com",
      eventTitle: "Pickup hoops",
      eventAddress: "4th Street Park",
      eventStartAt: "2026-06-01T04:22:00.000Z"
    });

    expect(createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: "sender@gmail.com",
        pass: "app-password"
      }
    });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "EventDrop <sender@gmail.com>",
        to: "guest@example.com",
        subject: "Reminder: Pickup hoops starts soon",
        text: "Pickup hoops starts at 6/1/26, 9:52:00 AM.\nLocation: 4th Street Park"
      })
    );
    expect(result).toEqual({ id: "gmail-message-id" });
  });
});
