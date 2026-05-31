import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — pdfnest",
  description: "pdfnest privacy policy. We don't see your files; standard cookie/analytics disclosures apply.",
  alternates: { canonical: "https://pdfnest.io/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Last updated: 2026-05-31</p>

      <h2 className="mt-8 text-2xl font-semibold">Tools</h2>
      <p className="mt-3 text-neutral-700 dark:text-neutral-300">
        All 5 Wave 1 pdfnest tools (Merge, Split, Rotate, JPG&rarr;PDF, PDF&rarr;JPG) process your files entirely in your browser. We never receive your files, and they are never transmitted to our servers. You can verify this yourself in your browser&apos;s DevTools Network tab — see our <a className="underline" href="/privacy-tech">Privacy &amp; Tech page</a>.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Analytics</h2>
      <p className="mt-3 text-neutral-700 dark:text-neutral-300">
        We use Google Analytics 4 to count anonymous page views and understand which tools people use. GA4 does not see your file contents — only the URLs you visit and standard browser metadata (user-agent, country, screen size). You can block GA4 with any ad blocker or by disabling cookies.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Contact form</h2>
      <p className="mt-3 text-neutral-700 dark:text-neutral-300">
        The contact form submits via Web3Forms, which forwards your message to our email. Web3Forms stores submissions briefly per their privacy policy.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Cookies</h2>
      <p className="mt-3 text-neutral-700 dark:text-neutral-300">
        We set a single localStorage entry for your theme preference (light/dark). GA4 sets standard analytics cookies if not blocked.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Contact</h2>
      <p className="mt-3 text-neutral-700 dark:text-neutral-300">
        Questions? <a className="underline" href="/contact">Get in touch</a>.
      </p>
    </div>
  );
}
