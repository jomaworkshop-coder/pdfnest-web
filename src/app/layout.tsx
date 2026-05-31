import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfnest.io"),
  title: {
    default: "pdfnest — Free PDF tools that never leave your browser",
    template: "%s | pdfnest",
  },
  description:
    "Free PDF tools. Files never leave your browser. No signup, no watermarks, no upload — processed instantly on your device.",
  keywords: ["pdf tools", "merge pdf", "split pdf", "rotate pdf", "jpg to pdf", "pdf to jpg", "privacy pdf", "client-side pdf"],
  openGraph: {
    title: "pdfnest — Free PDF tools that never leave your browser",
    description:
      "Free PDF tools processed in your browser. No upload, no signup, no watermark.",
    url: "https://pdfnest.io",
    siteName: "pdfnest",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://pdfnest.io" },
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
