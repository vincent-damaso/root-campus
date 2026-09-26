import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IntentBadge } from "@/components/intent-badge";
import { VoteControls } from "@/components/vote-controls";
import { CommentsSection } from "@/components/comments-section";
import { ImageGallery } from "@/components/image-gallery";
import { initials, timeAgo, type Goal } from "@/lib/format";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("*, profiles(id, name, tech_stack, contact_info), campuses(name)")
    .eq("id", projectId)
    .single();

  if (!project) notFound();

  const { data: commentsData } = await supabase
    .from("comments")
    .select("*, profiles(name)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  const { data: voteData } = await supabase
    .from("votes")
    .select("value, user_id")
    .eq("project_id", projectId);

  const netScore = (voteData || []).reduce(
    (sum, v) => sum + (v.value === "up" ? 1 : -1),
    0
  );
  const userVote =
    (voteData?.find((v) => v.user_id === user?.id)?.value as "up" | "down") ?? null;

  const owner = project.profiles as {
    id: string;
    name: string;
    tech_stack?: string[] | null;
    contact_info?: string | null;
  } | null;
  const campus = project.campuses as { name: string } | { name: string }[] | null;
  const campusName = (Array.isArray(campus) ? campus[0]?.name : campus?.name) ?? null;
  const tags = owner?.tech_stack ?? [];

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-on-surface-variant">
        <Link href="/feed" className="flex items-center gap-1 hover:text-primary">
          <span className="material-symbols-outlined text-sm">home_work</span>
          Projects
        </Link>
        {campusName && (
          <>
            <span className="text-outline-variant">/</span>
            <span>{campusName}</span>
          </>
        )}
        <span className="text-outline-variant">/</span>
        <span className="font-semibold text-ink">{project.title}</span>
      </nav>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <IntentBadge goal={project.goal as Goal} />
          {project.goal === "collaboration" &&
            project.roles_needed?.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-subtle px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Seeking {project.roles_needed.join(", ")}
              </span>
            )}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary lg:text-4xl">
          {project.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <article className="flex flex-col gap-6 rounded-xl border border-border-subtle bg-surface-card p-6 shadow-card lg:p-8">
            <ImageGallery images={project.images ?? []} title={project.title} />
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
              {project.description}
            </p>
            {tags.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-border-subtle pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-md bg-tag-pill-bg px-2.5 py-1 text-xs font-medium text-tag-pill-text"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          <CommentsSection
            projectId={project.id}
            comments={commentsData || []}
            currentUserId={user?.id ?? null}
            isAuthed={Boolean(user)}
          />
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-20">
          <VoteControls
            projectId={project.id}
            initialScore={netScore}
            initialVote={userVote}
            isAuthed={Boolean(user)}
            variant="bar"
          />

          <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-card p-4 shadow-card">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Created by
            </span>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                {owner ? initials(owner.name) : "?"}
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-ink">
                  {owner?.name ?? "Unknown builder"}
                </p>
                {campusName && (
                  <p className="text-xs font-medium text-secondary">{campusName}</p>
                )}
                <p className="text-xs text-on-surface-variant">
                  Posted {timeAgo(project.created_at)}
                </p>
              </div>
            </div>
            {user && owner?.contact_info && (
              <div className="rounded-lg bg-surface-subtle px-3 py-2 text-xs text-on-surface-variant">
                <span className="font-semibold text-ink">Contact:</span>{" "}
                {owner.contact_info}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}