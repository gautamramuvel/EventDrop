"use client";

import { SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";

export function RsvpButton({ eventId, hasRsvped, disabledReason }: { eventId: string; hasRsvped: boolean; disabledReason?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  if (hasRsvped) {
    return (
      <button disabled className="rounded-ui bg-accent px-4 py-3 font-medium text-white disabled:opacity-80">
        You are attending this event
      </button>
    );
  }

  if (disabledReason) {
    return (
      <button disabled className="rounded-ui bg-neutral-300 px-4 py-3 font-medium text-ink disabled:opacity-80">
        {disabledReason}
      </button>
    );
  }

  async function toggle() {
    setPending(true);
    setError(null);
    setShowSignIn(false);

    const response = await fetch(`/api/events/${eventId}/rsvp`, { method: "POST" });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(payload.error ?? "RSVP failed");
      setShowSignIn(response.status === 401);
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-2">
      {error && <p className="text-sm text-red-700">{error}</p>}
      {showSignIn && (
        <SignInButton mode="modal">
          <button className="rounded-ui border border-line px-4 py-3 font-medium text-ink">Sign in or create account</button>
        </SignInButton>
      )}
      <button onClick={toggle} disabled={pending} className="rounded-ui bg-ink px-4 py-3 font-medium text-white disabled:opacity-60">
        {pending ? "Saving..." : "RSVP"}
      </button>
    </div>
  );
}
