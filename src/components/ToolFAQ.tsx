import type { FAQ } from "@/lib/tools";

export function ToolFAQ({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="mt-12 max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">FAQ</h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="border border-neutral-200 dark:border-neutral-800 rounded p-3">
            <summary className="font-medium cursor-pointer">{f.q}</summary>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
