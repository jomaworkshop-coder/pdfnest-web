import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Tech — How pdfnest compares to iLovePDF, Smallpdf, Adobe",
  description: "Side-by-side comparison: which PDF tool sites upload your files, require signup, add watermarks, or throttle usage.",
  alternates: { canonical: "https://pdfnest.io/privacy-tech" },
};

const ROWS: Array<{ site: string; uploaded: string; signup: string; watermarks: string; limit: string; offline: string }> = [
  { site: "pdfnest.io",   uploaded: "No",      signup: "No",      watermarks: "No",   limit: "None",          offline: "Coming Wave 2 (PWA)" },
  { site: "iLovePDF",     uploaded: "Yes",     signup: "Free tier limited", watermarks: "Some ops",  limit: "Daily throttle", offline: "Desktop app (paid)" },
  { site: "Smallpdf",     uploaded: "Yes",     signup: "Pushed",  watermarks: "Some ops",  limit: "2 tasks/hr",     offline: "Desktop app (paid)" },
  { site: "Adobe Acrobat",uploaded: "Yes",     signup: "Required",watermarks: "N/A (paywalled)", limit: "Paywall",       offline: "Desktop app (paid)" },
  { site: "TinyWow",      uploaded: "Yes",     signup: "Optional",watermarks: "No",   limit: "Heavy ads",       offline: "No" },
];

export default function PrivacyTechPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Privacy &amp; Tech</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        Every Wave 1 pdfnest tool runs entirely in your browser. We never see your files. Here&apos;s how the major PDF sites compare.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-sm border border-neutral-200 dark:border-neutral-800">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              <th className="text-left px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">Site</th>
              <th className="text-left px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">Files uploaded?</th>
              <th className="text-left px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">Signup required?</th>
              <th className="text-left px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">Watermarks?</th>
              <th className="text-left px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">Hourly limit?</th>
              <th className="text-left px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">Works offline?</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.site} className={i === 0 ? "bg-emerald-50 dark:bg-emerald-950/30" : ""}>
                <td className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 font-medium">{r.site}</td>
                <td className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">{r.uploaded}</td>
                <td className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">{r.signup}</td>
                <td className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">{r.watermarks}</td>
                <td className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">{r.limit}</td>
                <td className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">{r.offline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">How to verify in Chrome DevTools</h2>
        <ol className="mt-3 list-decimal pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>Open any pdfnest tool (e.g. <a className="underline" href="/merge">Merge PDF</a>).</li>
          <li>Press <kbd className="px-1.5 py-0.5 border rounded text-xs">F12</kbd>, switch to the <strong>Network</strong> tab, filter to <strong>Fetch/XHR</strong>, and click the <strong>clear</strong> icon.</li>
          <li>Drop in your file and click the action button. You&apos;ll see zero outbound requests during processing — your file never leaves the browser.</li>
        </ol>
      </section>
    </div>
  );
}
