import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/project-card";
import { NodeGraph } from "@/components/logo";
import type { Goal } from "@/lib/format";
import { countRecentProjects } from "@/lib/format";

export default async function FeedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let campusId: number | null = null;
  let campusName: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("campus_id, campuses(name)")
      .eq("id", user.id)
      .single();
    campusId = profile?.campus_id ?? null;
    const campus = profile?.campuses as { name: string } | { name: string }[] | null;
    campusName = (Array.isArray(campus) ? campus[0]?.name : campus?.name) ?? null;
  }

  let query = supabase
    .from("projects")
    .select("*, profiles(id, name, tech_stack), campuses(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (campusId) query = query.eq("campus_id", campusId);

  const { data: projects } = await query;

  const voteMap: Record<number, number> = {};
  const userVoteMap: Record<number, "up" | "down" | null> = {};
  const commentMap: Record<number, number> = {};

  if (projects && projects.length > 0) {
    const ids = projects.map((p) => p.id);
    const { data: votes } = await supabase
      .from("votes")
      .select("project_id, value, user_id")
      .in("project_id", ids);
    votes?.forEach((v) => {
      voteMap[v.project_id] =
        (voteMap[v.project_id] || 0) + (v.value === "up" ? 1 : -1);
      if (user && v.user_id === user.id) {
        userVoteMap[v.project_id] = v.value as "up" | "down";
      }
    });

    const { data: comments } = await supabase
      .from("comments")
      .select("project_id")
      .in("project_id", ids);
    comments?.forEach((c) => {
      commentMap[c.project_id] = (commentMap[c.project_id] || 0) + 1;
    });
  }

  const projectsThisMonth = countRecentProjects(projects);
  const builders = new Set(projects?.map((p) => p.owner_id)).size;

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-card lg:p-8">
        <NodeGraph className="pointer-events-none absolute right-0 top-0 hidden h-full w-2/5 select-none opacity-40 lg:block" />
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-primary lg:text-4xl">
              What&apos;s growing at your campus?
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-on-surface-variant">
              Discover what your peers are building, get inspired, and connect with
              like-minded students.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
              <Link
                href="/campus"
                className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1.5 font-display text-sm font-semibold text-primary transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-base text-secondary">
                  school
                </span>
                {campusName ?? "All campuses"}
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  arrow_drop_down
                </span>
              </Link>
              <span className="text-outline-variant">•</span>
              <span>
                <strong className="font-semibold text-ink">{builders}</strong> builders
              </span>
              <span className="text-outline-variant">•</span>
              <span>
                <strong className="font-semibold text-ink">{projectsThisMonth}</strong>{" "}
                projects this month
              </span>
            </div>
          </div>

          <Link
            href={user ? "/project/new" : "/auth/login?next=/project/new"}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-on-tertiary-container px-6 py-3 text-sm font-semibold text-on-primary shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-badge-valid-text"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create project
          </Link>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-xl bg-surface-subtle px-4 py-3">
        <span className="material-symbols-outlined text-lg text-secondary">
          lightbulb
        </span>
        <p className="text-sm text-on-surface-variant">
          <strong className="font-semibold text-ink">Pro tip:</strong> Projects
          looking for co-founders get faster responses when detailed tech stacks are
          tagged.
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                profiles: p.profiles,
              }}
              score={voteMap[p.id] ?? 0}
              commentCount={commentMap[p.id] ?? 0}
              initialVote={userVoteMap[p.id] ?? null}
              isAuthed={Boolean(user)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface-card p-12 text-center shadow-card">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-badge-collab-bg text-secondary">
            <span className="material-symbols-outlined text-4xl">energy_savings_leaf</span>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              Nothing has sprouted here yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
              Be the first to share what you&apos;re building with your campus.
            </p>
          </div>
          <Link
            href={user ? "/project/new" : "/auth/login?next=/project/new"}
            className="inline-flex items-center gap-2 rounded-xl bg-on-tertiary-container px-5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-badge-valid-text"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create the first project
          </Link>
        </div>
      )}
    </div>
  );
}