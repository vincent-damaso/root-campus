"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function VoteControls({
  projectId,
  initialScore,
  initialVote,
  isAuthed,
  variant = "dock",
}: {
  projectId: number;
  initialScore: number;
  initialVote: "up" | "down" | null;
  isAuthed: boolean;
  variant?: "dock" | "bar";
}) {
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState(initialVote);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function requireAuth() {
    router.push(`/auth/login?next=${encodeURIComponent(pathname)}`);
  }

  async function handleVote(value: "up" | "down") {
    if (!isAuthed) {
      requireAuth();
      return;
    }
    if (loading) return;
    setLoading(true);
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (!userId) {
      setLoading(false);
      requireAuth();
      return;
    }

    const { data: existing } = await supabase
      .from("votes")
      .select("id, value")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      if (existing.value === value) {
        await supabase.from("votes").delete().eq("id", existing.id);
        setVote(null);
        setScore((s) => s - (value === "up" ? 1 : -1));
      } else {
        await supabase.from("votes").update({ value }).eq("id", existing.id);
        setVote(value);
        setScore((s) => s + (value === "up" ? 2 : -2));
      }
    } else {
      await supabase
        .from("votes")
        .insert({ project_id: projectId, user_id: userId, value });
      setVote(value);
      setScore((s) => s + (value === "up" ? 1 : -1));
    }
    setLoading(false);
  }

  if (variant === "bar") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-card p-3 shadow-card">
        <button
          onClick={() => handleVote("up")}
          disabled={loading}
          title={isAuthed ? "Endorse" : "Log in to endorse"}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
            vote === "up"
              ? "bg-secondary text-on-secondary"
              : "bg-surface-subtle text-primary hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-xl">arrow_upward</span>
        </button>
        <div className="flex-1">
          <span className="block font-display text-xl font-bold leading-none text-primary">
            {score}
          </span>
          <span className="text-xs text-on-surface-variant">Endorsements</span>
        </div>
        <button
          onClick={() => handleVote("down")}
          disabled={loading}
          title={isAuthed ? "Downvote" : "Log in to vote"}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
            vote === "down"
              ? "bg-error text-on-error"
              : "bg-surface-subtle text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-xl">arrow_downward</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-surface-subtle px-2.5 py-1">
      <button
        onClick={() => handleVote("up")}
        disabled={loading}
        title={isAuthed ? "Upvote" : "Log in to upvote"}
        className={`transition-colors ${
          vote === "up" ? "text-secondary" : "text-on-surface-variant hover:text-secondary"
        }`}
      >
        <span className="material-symbols-outlined text-base leading-none">
          expand_less
        </span>
      </button>
      <span className="py-0.5 font-display text-sm font-bold leading-none text-ink">
        {score}
      </span>
      <button
        onClick={() => handleVote("down")}
        disabled={loading}
        title={isAuthed ? "Downvote" : "Log in to vote"}
        className={`transition-colors ${
          vote === "down" ? "text-error" : "text-on-surface-variant hover:text-error"
        }`}
      >
        <span className="material-symbols-outlined text-base leading-none">
          expand_more
        </span>
      </button>
    </div>
  );
}