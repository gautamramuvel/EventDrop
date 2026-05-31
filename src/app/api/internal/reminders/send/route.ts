import { NextRequest, NextResponse } from "next/server";
import { readEnv } from "@/lib/env";
import { sendDueReminders } from "@/lib/reminders/worker";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const env = readEnv();
  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${env.internalJobSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await sendDueReminders(createSupabaseAdminClient());
  return NextResponse.json({ processed: results.length, results });
}
