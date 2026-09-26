import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Root Campus — Collegiate Builders Lab",
  description:
    "Discover what your peers are building, get inspired, and connect with like-minded students.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* eslint-disable @next/next/no-page-custom-font -- Inter, Sora, and Material Symbols are loaded from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        {/* eslint-enable @next/next/no-page-custom-font */}
      </head>
      <body className="min-h-full bg-surface-canvas text-ink font-sans">
        {children}
      </body>
    </html>
  );
}