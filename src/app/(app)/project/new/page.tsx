import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateProjectForm } from "@/components/create-project-form";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/project/new");

  const { data: profile } = await supabase
    .from("profiles")
    .select("campus_id, campuses(name)")
    .eq("id", user.id)
    .single();

  if (!profile?.campus_id) redirect("/campus");

  const campus = profile.campuses as { name: string } | { name: string }[] | null;
  const campusName = (Array.isArray(campus) ? campus[0]?.name : campus?.name) ?? null;

  return <CreateProjectForm campusName={campusName} />;
}