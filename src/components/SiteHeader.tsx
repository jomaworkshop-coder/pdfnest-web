"use client";
import Link from "next/link";
import { useState } from "react";

const TOOL_LINKS = [
  { slug: "merge", label: "Merge PDF" },
  { slug: "split", label: "Split PDF" },
  { slug: "rotate", label: "Rotate PDF" },
  { slug: "jpg-to-pdf", label: "JPG to PDF" },
  { slug: "pdf-to-jpg", label: "PDF to JPG" },
  { slug: "pdf-to-png", label: "PDF to PNG" },
  { slug: "add-page-numbers", label: "Add Page Numbers" },
];

function toggleTheme() {
  const html = document.documentElement;
  const next = html.classList.contains("dark") ? "light" : "dark";
  html.classList.toggle("dark", next === "dark");
  try { localStorage.setItem("theme", next); } catch {}
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">pdfnest<span className="text-emerald-500">.io</span></Link>
        <nav className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="px-3 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
            >
              Tools ▾
            </button>
            {open && (
              <div className="absolute right-0 mt-1 w-44 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
                {TOOL_LINKS.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/${t.slug}`}
                    className="block px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={() => setOpen(false)}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/privacy-tech" className="px-3 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm">Privacy</Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="px-3 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
          >
            🌓
          </button>
        </nav>
      </div>
    </header>
  );
}
