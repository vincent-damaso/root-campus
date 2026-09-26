"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/feed";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-surface-card p-8 shadow-card">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-primary">
          Welcome back
        </h1>
        <p className="text-sm text-on-surface-variant">
          Log in to endorse, discuss, and share your projects.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-error-container px-3 py-2 text-sm text-on-error-container">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-surface-container-low px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-surface-container-low px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-on-tertiary-container py-3 text-sm font-semibold text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-badge-valid-text disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        No account?{" "}
        <Link
          href={`/auth/signup?next=${encodeURIComponent(next)}`}
          className="font-semibold text-secondary hover:text-primary"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}