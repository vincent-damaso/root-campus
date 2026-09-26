"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");

  const profileRes = await supabase
    .from("profiles")
    .select("campus_id")
    .eq("id", user.user.id)
    .single();
  const campusId = profileRes.data?.campus_id;
  if (!campusId) throw new Error("No campus selected");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const goal = formData.get("goal") as string;
  const roles =
    (formData.get("roles") as string)
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  if (!title || !description || !goal) throw new Error("Missing fields");
  if (goal === "collaboration" && roles.length === 0)
    throw new Error("Roles required for collaboration");

  // Handle images
  const images: string[] = [];
  const files = formData.getAll("files") as File[];
  if (files.length < 3) throw new Error("At least 3 images required");

  for (const file of files) {
    if (!file || file.size === 0) continue;
    const fileName = `${user.user.id}/${crypto.randomUUID()}-${file.name}`;
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, { upsert: false });
    if (uploadErr) console.error(uploadErr);
    if (uploadData) {
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(uploadData.path);
      if (urlData?.publicUrl) images.push(urlData.publicUrl);
    }
  }

  if (images.length < 3) throw new Error("Image upload failed");

  const { error } = await supabase.from("projects").insert({
    owner_id: user.user.id,
    campus_id: campusId,
    title,
    description,
    goal,
    roles_needed: goal === "collaboration" ? roles : [],
    images,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/feed");
  revalidatePath("/project/new");
}
