"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { pdfToJpg, type PdfToJpgOpts } from "@/lib/engines/pdf-to-jpg";

function PdfToJpgOptions({ value, onChange }: { value: PdfToJpgOpts; onChange: (v: PdfToJpgOpts) => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-2 text-sm">
      <div className="flex items-center gap-3">
        <span>DPI:</span>
        {[72, 150, 300].map((d) => (
          <label key={d} className="flex items-center gap-1">
            <input type="radio" checked={value.dpi === d} onChange={() => onChange({ ...value, dpi: d as 72 | 150 | 300 })} />
            {d}
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span>Quality:</span>
        {[0.7, 0.85, 0.95].map((q) => (
          <label key={q} className="flex items-center gap-1">
            <input type="radio" checked={value.quality === q} onChange={() => onChange({ ...value, quality: q })} />
            {(q * 100).toFixed(0)}%
          </label>
        ))}
      </div>
    </div>
  );
}

export default function PdfToJpgPage() {
  return (
    <ToolShell
      tool={TOOLS["pdf-to-jpg"]}
      engine={pdfToJpg}
      defaultOpts={{ dpi: 150, quality: 0.85 } as PdfToJpgOpts}
      OptionsForm={PdfToJpgOptions}
    />
  );
}
