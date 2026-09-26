"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCampus(formData: FormData) {
  const campusIdRaw = formData.get("campusId");
  const campusId = typeof campusIdRaw === "string" ? parseInt(campusIdRaw, 10) : null;
  if (!campusId) throw new Error("Invalid campus");
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("profiles")
    .update({ campus_id: campusId })
    .eq("id", user.user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/campus");
  revalidatePath("/feed");
}
