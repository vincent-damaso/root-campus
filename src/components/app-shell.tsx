"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import { createClient } from "@/lib/supabase/client";

export type ShellUser = {
  id: string;
  name: string;
  campusName: string | null;
  email?: string | null;
} | null;

const NAV = [
  { href: "/feed", label: "Home (Feed)", icon: "home" },
  { href: "/campus", label: "Explore & Campuses", icon: "explore" },
  { href: "/profile", label: "My Projects", icon: "video_library" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/feed");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/feed") return pathname === "/feed";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-surface-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border-subtle bg-surface-canvas px-4 py-6 lg:flex">
        <Link href="/feed" className="flex items-center px-2">
          <Logo className="h-11 w-auto" />
        </Link>
        <p className="mt-1 px-3 font-label-md text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Collegiate Builders Lab
        </p>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors ${
                  active
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          {user ? (
            <div className="rounded-2xl border border-border-subtle bg-surface-card p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                  {initials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-ink">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
                    {user.campusName ?? "No campus yet"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-subtle hover:text-ink"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border-subtle bg-surface-card p-4">
              <p className="font-display text-sm font-semibold text-ink">
                Join your campus
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                Post projects and back your peers&apos; work.
              </p>
              <Link
                href="/auth/signup"
                className="mt-3 block rounded-xl bg-primary px-3 py-2 text-center text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
              >
                Create account
              </Link>
              <Link
                href="/auth/login"
                className="mt-2 block rounded-xl border border-border-subtle px-3 py-2 text-center text-sm font-semibold text-ink transition-colors hover:bg-surface-subtle"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface-canvas/85 backdrop-blur">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <Link href="/feed" className="flex items-center lg:hidden">
              <Logo className="h-9 w-auto" />
            </Link>

            {user?.campusName ? (
              <Link
                href="/campus"
                className="hidden items-center gap-2 rounded-full bg-surface-subtle px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container sm:flex"
              >
                <span className="material-symbols-outlined text-base text-secondary">
                  school
                </span>
                <span className="max-w-[220px] truncate">{user.campusName}</span>
                <span className="material-symbols-outlined text-base text-on-surface-variant">
                  arrow_drop_down
                </span>
              </Link>
            ) : (
              <Link
                href={user ? "/campus" : "/auth/login?next=/campus"}
                className="hidden items-center gap-2 rounded-full bg-surface-subtle px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container sm:flex"
              >
                <span className="material-symbols-outlined text-base text-secondary">
                  school
                </span>
                <span className="max-w-[220px] truncate">Choose your campus</span>
              </Link>
            )}

            <div className="flex items-center gap-2">
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-surface-subtle"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                    {initials(user.name)}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block font-display text-sm font-semibold leading-tight text-ink">
                      {user.name}
                    </span>
                    <span className="block text-xs text-on-surface-variant">
                      Builder
                    </span>
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-subtle"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-full bg-on-tertiary-container px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-badge-valid-text"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary-container text-on-primary-container"
                      : "text-on-surface-variant hover:bg-surface-subtle"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-[1280px] px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}