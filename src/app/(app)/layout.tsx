import { createClient } from "@/lib/supabase/server";
import { AppShell, type ShellUser } from "@/components/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let shellUser: ShellUser = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, campuses(name)")
      .eq("id", user.id)
      .single();

    const campus = profile?.campuses as { name: string } | { name: string }[] | null;
    const campusName = Array.isArray(campus) ? campus[0]?.name : campus?.name;

    shellUser = {
      id: user.id,
      email: user.email,
      name: profile?.name ?? user.email ?? "Builder",
      campusName: campusName ?? null,
    };
  }

  return <AppShell user={shellUser}>{children}</AppShell>;
}