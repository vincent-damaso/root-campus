"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        name,
        campus_id: 1,
        tech_stack: [],
        contact_info: "",
      });
      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }
    router.push("/campus");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-surface-card p-8 shadow-card">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-primary">
          Join Root Campus
        </h1>
        <p className="text-sm text-on-surface-variant">
          Create an account to share your build and back your peers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-error-container px-3 py-2 text-sm text-on-error-container">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-ink">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-surface-container-low px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
          />
        </div>
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-secondary hover:text-primary"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}