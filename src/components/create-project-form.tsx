"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/actions/projects";

const INTENTS = [
  {
    value: "collaboration",
    label: "Collaboration",
    icon: "groups",
    active: "bg-badge-collab-bg text-badge-collab-text",
    dot: "bg-secondary",
  },
  {
    value: "validation",
    label: "Validation",
    icon: "flare",
    active: "bg-badge-valid-bg text-badge-valid-text",
    dot: "bg-badge-valid-text",
  },
  {
    value: "visibility",
    label: "Showcase",
    icon: "visibility",
    active: "bg-badge-visib-bg text-badge-visib-text",
    dot: "bg-badge-visib-text",
  },
] as const;

export function CreateProjectForm({ campusName }: { campusName: string | null }) {
  const [goal, setGoal] = useState<string>("visibility");
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!files || files.length < 3) {
      setError("Please add at least 3 images of your project.");
      return;
    }
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createProject(formData);
      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-badge-collab-bg text-secondary">
            <span className="material-symbols-outlined text-base">eco</span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
            New Growth Entry
          </span>
          {campusName && (
            <span className="text-xs text-on-surface-variant">• {campusName}</span>
          )}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary lg:text-4xl">
          Share what you&apos;re building
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-on-surface-variant">
          Every breakthrough starts as a messy prototype. Share your work in
          progress, find students with the missing puzzle piece, and validate
          hypotheses with real peers on your campus.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-error-container px-4 py-3 text-sm font-medium text-on-error-container">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex flex-col gap-6 rounded-xl border border-border-subtle bg-surface-card p-6 shadow-card lg:p-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-display text-lg font-semibold text-primary">
                Project Title <span className="text-tertiary-container">*</span>
              </label>
              <input
                id="title"
                name="title"
                required
                maxLength={80}
                placeholder="e.g. QuantumNotes, Autonomous Rover, CampusRide..."
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-ink outline-none transition-colors focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-ink">Primary Intent</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {INTENTS.map((intent) => {
                  const selected = goal === intent.value;
                  return (
                    <button
                      key={intent.value}
                      type="button"
                      onClick={() => setGoal(intent.value)}
                      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                        selected
                          ? intent.active
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-subtle"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {intent.icon}
                      </span>
                      {intent.label}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" name="goal" value={goal} />
            </div>

            {goal === "collaboration" && (
              <div className="flex flex-col gap-2">
                <label htmlFor="roles" className="text-sm font-semibold text-ink">
                  Roles needed{" "}
                  <span className="font-normal text-on-surface-variant">
                    (comma separated)
                  </span>
                </label>
                <input
                  id="roles"
                  name="roles"
                  placeholder="e.g. Frontend, Design, Backend"
                  className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-ink outline-none transition-colors focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="font-display text-lg font-semibold text-primary">
                Project Description <span className="text-tertiary-container">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={8}
                placeholder="Describe the problem you are solving, your approach, and what you need next..."
                className="w-full resize-none rounded-xl bg-surface-container-low px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-primary">
                  Screenshots &amp; Media{" "}
                  <span className="text-sm font-normal text-on-surface-variant">
                    (at least 3)
                  </span>
                </span>
                <span className="text-xs text-on-surface-variant">PNG, JPG, or SVG</span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center gap-1 rounded-xl bg-surface-container-low p-8 text-center transition-all hover:bg-surface-subtle"
              >
                <span className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-surface-card shadow-card transition-transform group-hover:scale-105">
                  <span className="material-symbols-outlined text-xl text-secondary">
                    add_photo_alternate
                  </span>
                </span>
                <span className="font-display text-sm font-semibold text-ink">
                  Drag and drop screenshots or diagrams
                </span>
                <span className="text-xs text-on-surface-variant">
                  Upload UI mockups, terminal logs, or architecture schematics.
                </span>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface-card px-4 py-1.5 text-xs font-semibold text-ink shadow-card">
                  <span className="material-symbols-outlined text-base text-secondary">
                    folder_open
                  </span>
                  Browse Files
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                name="files"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
              />
              {files && files.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Array.from(files).map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-surface-container-low p-2 shadow-card"
                    >
                      <span className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-container text-on-primary-container">
                        <span className="material-symbols-outlined text-lg">image</span>
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {file.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {(file.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant">No files selected yet.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4">
          <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary">
                Publication Status
              </h2>
              <span className="rounded-full bg-badge-collab-bg px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-badge-collab-text">
                Ready
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">
              Publishing will instantly share your project to {campusName ?? "your campus"}{" "}
              builders and your campus feed.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-on-tertiary-container px-5 py-3 text-sm font-semibold text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-badge-valid-text disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
              {submitting ? "Publishing..." : "Publish Project"}
            </button>
            <p className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-base text-secondary">
                check_circle
              </span>
              You can edit or unpublish anytime.
            </p>
          </div>

          <div className="rounded-xl bg-surface-subtle p-5">
            <p className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-lg text-secondary">
                lightbulb
              </span>
              <span>
                <strong className="font-semibold text-ink">Keep it simple:</strong> A
                short description and one clear visual are all you need to start
                getting peer feedback.
              </span>
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}