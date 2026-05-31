import "server-only";
import type { User } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string;
  avatar_url: string | null;
};

export async function requireSyncedProfile(userOverride?: User | null): Promise<Profile> {
  const user = userOverride ?? (await currentUser());
  if (!user) {
    throw new Error("Authentication required");
  }

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) {
    throw new Error("Verified email required");
  }

  const firstName = user.firstName ?? user.username ?? "Neighbor";
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        clerk_user_id: user.id,
        email,
        first_name: firstName,
        avatar_url: user.imageUrl ?? null,
        updated_at: new Date().toISOString()
      },
      { onConflict: "clerk_user_id" }
    )
    .select("id, clerk_user_id, email, first_name, avatar_url")
    .single();

  if (error) {
    throw new Error(`Profile sync failed: ${error.message}`);
  }

  return data;
}
