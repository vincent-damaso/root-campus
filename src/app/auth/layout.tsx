import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-surface-canvas px-4 py-10">
      <Link href="/feed" className="flex items-center">
        <Logo className="h-12 w-auto" />
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="text-xs text-on-surface-variant">
        Root Campus · Collegiate Builders Lab
      </p>
    </div>
  );
}