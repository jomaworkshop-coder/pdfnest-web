import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { PrivacyBadge } from "@/components/PrivacyBadge";

const TOOL_ORDER = ["merge", "split", "rotate", "jpg-to-pdf", "pdf-to-jpg", "pdf-to-png", "organize", "page-numbers", "watermark"];

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JM Workshop",
  url: "https://pdfnest.io",
  sameAs: [
    "https://kalkfin.com",
    "https://kalkmate.com",
    "https://vitamath.io",
    "https://unitcrate.com",
    "https://wordfox.io",
  ],
};

export default function Home() {
  return (
    <div>
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Free PDF tools. <span className="text-emerald-600 dark:text-emerald-400">Files never leave your browser.</span></h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          No signup. No watermarks. No upload — processed instantly on your device.
        </p>
        <div className="mt-4 flex justify-center"><PrivacyBadge /></div>
      </section>

      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOL_ORDER.map((slug) => {
          const t = TOOLS[slug];
          return (
            <Link
              key={slug}
              href={`/${slug}`}
              className="block border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 hover:border-emerald-500 transition"
            >
              <h3 className="font-semibold text-lg">{t.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{t.description}</p>
            </Link>
          );
        })}
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <h2 className="text-2xl font-bold">Why pdfnest</h2>
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <li className="border border-neutral-200 dark:border-neutral-800 rounded p-4"><strong>No signup.</strong> Every tool works instantly.</li>
          <li className="border border-neutral-200 dark:border-neutral-800 rounded p-4"><strong>No watermarks.</strong> Output is yours, unmarked.</li>
          <li className="border border-neutral-200 dark:border-neutral-800 rounded p-4"><strong>No upload.</strong> Verify in DevTools Network tab.</li>
        </ul>
        <Link
          href="/privacy-tech"
          className="inline-block mt-6 px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
        >
          How we compare to iLovePDF, Smallpdf, Adobe →
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
      />
    </div>
  );
}
