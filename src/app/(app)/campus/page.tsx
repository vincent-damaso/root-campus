import { createClient } from "@/lib/supabase/server";
import { updateCampus } from "@/lib/actions/profile";
import { redirect } from "next/navigation";
import { NodeGraph } from "@/components/logo";

export default async function CampusPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/campus");

  const { data: profile } = await supabase
    .from("profiles")
    .select("campus_id")
    .eq("id", user.id)
    .single();

  const { data: campuses } = await supabase.from("campuses").select("*").order("name");

  const currentCampusId = profile?.campus_id ?? null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <section className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-8 text-center shadow-card">
        <NodeGraph className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 select-none opacity-30 lg:block" />
        <div className="relative z-10 space-y-3">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-badge-collab-bg text-secondary">
            <span className="material-symbols-outlined text-2xl">account_balance</span>
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary">
            Explore &amp; Campuses
          </h1>
          <p className="mx-auto max-w-lg text-base text-on-surface-variant">
            Choose your university to see the local project feed and connect with
            builders at your school.
          </p>
        </div>
      </section>

      <form action={updateCampus} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {campuses?.map((campus) => {
          const selected = campus.id === currentCampusId;
          return (
            <button
              key={campus.id}
              type="submit"
              name="campusId"
              value={campus.id}
              className={`group flex items-center justify-between rounded-2xl border bg-surface-card p-6 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-border-hover hover:shadow-card-hover ${
                selected ? "border-secondary" : "border-border-subtle"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-subtle text-primary">
                  <span className="material-symbols-outlined text-xl">school</span>
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink group-hover:text-secondary">
                    {campus.name}
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    {selected ? "Current campus" : "Select this campus"}
                  </p>
                </div>
              </div>
              <span
                className={`material-symbols-outlined transition-colors group-hover:text-secondary ${
                  selected ? "text-secondary" : "text-on-surface-variant"
                }`}
              >
                {selected ? "check_circle" : "arrow_forward"}
              </span>
            </button>
          );
        })}
      </form>
    </div>
  );
}