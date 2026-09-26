import type { Goal } from "@/lib/format";

const STYLES: Record<Goal, { icon: string; label: string; className: string }> = {
  collaboration: {
    icon: "groups",
    label: "Collaboration",
    className: "bg-badge-collab-bg text-badge-collab-text",
  },
  validation: {
    icon: "flare",
    label: "Validation",
    className: "bg-badge-valid-bg text-badge-valid-text",
  },
  visibility: {
    icon: "visibility",
    label: "Visibility",
    className: "bg-badge-visib-bg text-badge-visib-text",
  },
};

export function IntentBadge({
  goal,
  className = "",
}: {
  goal: Goal;
  className?: string;
}) {
  const style = STYLES[goal] ?? STYLES.visibility;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${style.className} ${className}`}
    >
      <span className="material-symbols-outlined text-sm">{style.icon}</span>
      {style.label}
    </span>
  );
}

export function GoalLabel({ goal }: { goal: Goal }) {
  return STYLES[goal]?.label ?? "Visibility";
}