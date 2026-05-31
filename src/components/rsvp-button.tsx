"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RsvpButton({ eventId, hasRsvped }: { eventId: string; hasRsvped: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setPending(true);
    setError(null);

    const response = await fetch(`/api/events/${eventId}/rsvp`, { method: hasRsvped ? "DELETE" : "POST" });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(payload.error ?? "RSVP failed");
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-2">
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button onClick={toggle} disabled={pending} className="rounded-ui bg-ink px-4 py-3 font-medium text-white disabled:opacity-60">
        {pending ? "Saving..." : hasRsvped ? "Cancel RSVP" : "RSVP"}
      </button>
    </div>
  );
}
