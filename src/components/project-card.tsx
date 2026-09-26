import Link from "next/link";
import { IntentBadge } from "./intent-badge";
import { VoteControls } from "./vote-controls";
import { initials, timeAgo, type Goal } from "@/lib/format";

export type ProjectCardData = {
  id: number;
  title: string;
  description: string;
  goal: Goal;
  images: string[];
  created_at: string;
  profiles: {
    id: string;
    name: string;
    tech_stack?: string[] | null;
  } | null;
};

export function ProjectCard({
  project,
  score,
  commentCount,
  initialVote,
  isAuthed,
}: {
  project: ProjectCardData;
  score: number;
  commentCount: number;
  initialVote: "up" | "down" | null;
  isAuthed: boolean;
}) {
  const owner = project.profiles;
  const tags = (owner?.tech_stack ?? []).slice(0, 4);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:shadow-card-hover">
      <Link
        href={`/project/${project.id}`}
        className="relative block h-56 overflow-hidden bg-surface-subtle"
      >
        {project.images?.[0] ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <IntentBadge goal={project.goal} className="absolute left-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/project/${project.id}`} className="pr-2">
            <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-secondary">
              {project.title}
            </h3>
          </Link>
          <VoteControls
            projectId={project.id}
            initialScore={score}
            initialVote={initialVote}
            isAuthed={isAuthed}
            variant="dock"
          />
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
          {project.description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-tag-pill-bg px-2.5 py-1 text-xs font-medium text-tag-pill-text"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-surface-subtle pt-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-subtle text-xs font-bold text-primary">
              {owner ? initials(owner.name) : "?"}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-sm font-semibold text-ink">
                {owner?.name ?? "Unknown builder"}
              </p>
              <p className="truncate text-xs text-on-surface-variant">
                {tags[0] ?? "Builder"} • {timeAgo(project.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-lg">chat_bubble</span>
            <span className="text-sm font-medium">{commentCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
}