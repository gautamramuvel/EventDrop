"use client";

import { useState } from "react";

export function ReportForm({ eventId }: { eventId: string }) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    const response = await fetch(`/api/events/${eventId}/report`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason })
    });

    setMessage(response.ok ? "Report submitted" : "Report failed");
  }

  return (
    <div className="mt-8 rounded-ui border border-line bg-white p-4">
      <h2 className="font-semibold">Report event</h2>
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className="mt-3 w-full rounded-ui border border-line p-3"
        placeholder="Reason"
      />
      <button onClick={submit} className="mt-3 rounded-ui border border-line px-3 py-2 text-sm">
        Submit report
      </button>
      {message && <p className="mt-2 text-sm text-neutral-600">{message}</p>}
    </div>
  );
}
