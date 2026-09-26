"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { initials, timeAgo } from "@/lib/format";

type Comment = {
  id: number;
  body: string;
  created_at: string;
  parent_comment_id: number | null;
  author_id?: string;
  profiles?: { name?: string } | null;
};

export function CommentsSection({
  projectId,
  comments,
  currentUserId,
  isAuthed,
}: {
  projectId: number;
  comments: Comment[];
  currentUserId?: string | null;
  isAuthed: boolean;
}) {
  const [body, setBody] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [error, setError] = useState("");

  async function submitComment() {
    if (!body.trim()) return;
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({
        project_id: projectId,
        author_id: user.user.id,
        parent_comment_id: parentId,
        body: body.trim(),
      })
      .select("*, profiles(name)");
    if (insertError) {
      setError(insertError.message);
      return;
    }
    if (data && data[0]) {
      setLocalComments((prev) => [...prev, data[0] as Comment]);
      setBody("");
      setParentId(null);
      setError("");
    }
  }

  const topLevel = localComments.filter((c) => !c.parent_comment_id);
  const replies = localComments.filter((c) => c.parent_comment_id);

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-card lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-bold text-primary">Discussion</h2>
          <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            {localComments.length} comments
          </span>
        </div>
      </div>

      {isAuthed ? (
        <div className="flex flex-col gap-3 rounded-xl bg-surface-canvas p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={parentId ? "Write a reply..." : "Leave feedback or ask a question..."}
            rows={3}
            className="w-full resize-none rounded-lg bg-surface-card p-4 text-sm text-ink shadow-card outline-none transition-all placeholder:text-on-surface-variant focus:ring-2 focus:ring-secondary"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex items-center justify-between">
            {parentId ? (
              <button
                onClick={() => setParentId(null)}
                className="text-xs font-medium text-on-surface-variant hover:text-ink"
              >
                Cancel reply
              </button>
            ) : (
              <span />
            )}
            <button
              onClick={submitComment}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-all hover:bg-primary-container"
            >
              {parentId ? "Post Reply" : "Post Comment"}
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-xl bg-surface-canvas p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-surface-variant">
            Log in to leave feedback, ask questions, or reply to the builder.
          </p>
          <Link
            href="/auth/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
          >
            Log in to comment
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {topLevel.length === 0 && (
          <p className="py-4 text-center text-sm text-on-surface-variant">
            No comments yet. Be the first to share feedback.
          </p>
        )}
        {topLevel.map((c) => (
          <div key={c.id} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-sm font-bold text-primary">
              {initials(c.profiles?.name ?? "User")}
            </span>
            <div className="flex-1 rounded-xl bg-surface-canvas p-4">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  {c.profiles?.name ?? "User"}
                </span>
                {c.author_id && c.author_id === currentUserId && (
                  <span className="rounded bg-surface-card px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    You
                  </span>
                )}
                <span className="text-xs text-on-surface-variant">
                  {timeAgo(c.created_at)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-on-surface-variant">{c.body}</p>
              {isAuthed && (
                <button
                  onClick={() => setParentId(c.id)}
                  className="mt-2 text-xs font-semibold text-secondary hover:text-primary"
                >
                  Reply
                </button>
              )}

              <div className="mt-3 flex flex-col gap-3 border-l-2 border-surface-subtle pl-4">
                {replies
                  .filter((r) => r.parent_comment_id === c.id)
                  .map((r) => (
                    <div key={r.id} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-card text-xs font-bold text-primary">
                        {initials(r.profiles?.name ?? "User")}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-semibold text-ink">
                            {r.profiles?.name ?? "User"}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            {timeAgo(r.created_at)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-on-surface-variant">
                          {r.body}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}