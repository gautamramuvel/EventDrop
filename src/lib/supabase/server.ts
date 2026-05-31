import "server-only";
import { createClient } from "@supabase/supabase-js";
import { readEnv } from "@/lib/env";

export function createSupabaseAdminClient() {
  const env = readEnv();

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
