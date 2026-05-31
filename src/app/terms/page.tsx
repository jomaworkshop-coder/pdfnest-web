import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — pdfnest",
  description: "pdfnest terms of use.",
  alternates: { canonical: "https://pdfnest.io/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Terms of Use</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Last updated: 2026-05-31</p>

      <p className="mt-6 text-neutral-700 dark:text-neutral-300">
        pdfnest is provided as-is, free of charge, for personal and commercial use. By using the site you agree to:
      </p>
      <ul className="mt-3 list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
        <li>Use the tools only for content you have rights to process.</li>
        <li>Not attempt to attack, overload, or reverse-engineer the site.</li>
        <li>Accept that pdfnest is not liable for any loss arising from use of the tools (though, since everything runs in your browser, this risk is small).</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">License</h2>
      <p className="mt-3 text-neutral-700 dark:text-neutral-300">
        The pdfnest source code is proprietary; the open-source libraries we depend on retain their respective licenses (pdf-lib MIT, pdf.js Apache-2.0, JSZip MIT).
      </p>
    </div>
  );
}
