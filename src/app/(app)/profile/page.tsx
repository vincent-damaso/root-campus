import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectCard, type ProjectCardData } from "@/components/project-card";
import { NodeGraph } from "@/components/logo";
import { initials, type Goal } from "@/lib/format";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, campuses(name)")
    .eq("id", user.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, goal, images, created_at, profiles(id, name, tech_stack)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const voteMap: Record<number, number> = {};
  const commentMap: Record<number, number> = {};

  if (projects && projects.length > 0) {
    const ids = projects.map((p) => p.id);
    const { data: votes } = await supabase
      .from("votes")
      .select("project_id, value")
      .in("project_id", ids);
    votes?.forEach((v) => {
      voteMap[v.project_id] =
        (voteMap[v.project_id] || 0) + (v.value === "up" ? 1 : -1);
    });
    const { data: comments } = await supabase
      .from("comments")
      .select("project_id")
      .in("project_id", ids);
    comments?.forEach((c) => {
      commentMap[c.project_id] = (commentMap[c.project_id] || 0) + 1;
    });
  }

  const totalEndorsements = Object.values(voteMap).reduce((a, b) => a + b, 0);
  const totalComments = Object.values(commentMap).reduce((a, b) => a + b, 0);
  const campus = profile?.campuses as { name: string } | { name: string }[] | null;
  const campusName = (Array.isArray(campus) ? campus[0]?.name : campus?.name) ?? null;
  const techStack: string[] = profile?.tech_stack ?? [];

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-card lg:p-8">
        <NodeGraph className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 select-none opacity-30 lg:block" />
        <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row">
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-on-primary shadow-sm">
            {initials(profile?.name ?? "Builder")}
          </span>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-ink">
                {profile?.name ?? "Builder"}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-badge-collab-bg px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-badge-collab-text">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Active Builder
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1 font-medium text-ink">
                <span className="material-symbols-outlined text-base text-secondary">
                  school
                </span>
                {campusName ?? "No campus selected"}
              </span>
            </div>

            {profile?.contact_info && (
              <p className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base">mail</span>
                {profile.contact_info}
              </p>
            )}

            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {techStack.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md bg-tag-pill-bg px-2.5 py-1 text-xs font-medium text-tag-pill-text"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/project/new"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Node
          </Link>
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 rounded-xl bg-surface-canvas p-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Nodes Cultivated
            </p>
            <p className="mt-1 font-display text-xl font-bold text-ink">
              {projects?.length ?? 0}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Endorsements
            </p>
            <p className="mt-1 font-display text-xl font-bold text-ink">
              {totalEndorsements}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Discussions
            </p>
            <p className="mt-1 font-display text-xl font-bold text-ink">
              {totalComments}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Campus
            </p>
            <p className="mt-1 truncate font-display text-sm font-semibold text-secondary">
              {campusName ?? "—"}
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">
          My Projects ({projects?.length ?? 0})
        </h2>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={{
                id: p.id,
                title: p.title,
                description: p.description,
                goal: p.goal as Goal,
                images: p.images ?? [],
                created_at: p.created_at,
                profiles: p.profiles as unknown as ProjectCardData["profiles"],
              }}
              score={voteMap[p.id] ?? 0}
              commentCount={commentMap[p.id] ?? 0}
              initialVote={null}
              isAuthed
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface-card p-12 text-center shadow-card">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-badge-collab-bg text-secondary">
            <span className="material-symbols-outlined text-4xl">energy_savings_leaf</span>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-ink">
              No projects posted yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
              Your best ideas shouldn&apos;t stay buried in your notes app. Share one
              and find your missing puzzle piece.
            </p>
          </div>
          <Link
            href="/project/new"
            className="inline-flex items-center gap-2 rounded-xl bg-on-tertiary-container px-5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-badge-valid-text"
          >
            <span className="material-symbols-outlined text-lg">rocket_launch</span>
            Start a Project
          </Link>
        </div>
      )}
    </div>
  );
}