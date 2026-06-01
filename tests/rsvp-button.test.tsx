import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { RsvpButton } from "@/components/rsvp-button";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() })
}));

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe("RsvpButton", () => {
  it("suggests signing in when RSVP requires authentication", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "Create an account or sign in to RSVP." })
      })
    );

    render(<RsvpButton eventId="event_1" hasRsvped={false} />);
    fireEvent.click(screen.getByRole("button", { name: "RSVP" }));

    await waitFor(() => {
      expect(screen.getByText("Create an account or sign in to RSVP.")).toBeVisible();
    });
    expect(screen.getByRole("button", { name: "Sign in or create account" })).toBeVisible();
  });

  it("disables RSVP when viewer already attends", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<RsvpButton eventId="event_1" hasRsvped={true} />);

    const button = screen.getByRole("button", { name: "You are attending this event" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
