"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { pdfToPng, type PdfToPngOpts } from "@/lib/engines/pdf-to-png";

function PdfToPngOptions({ value, onChange }: { value: PdfToPngOpts; onChange: (v: PdfToPngOpts) => void }) {
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
    </div>
  );
}

export function PdfToPngClient() {
  return (
    <ToolShell
      tool={TOOLS["pdf-to-png"]}
      engine={pdfToPng}
      defaultOpts={{ dpi: 150 } as PdfToPngOpts}
      OptionsForm={PdfToPngOptions}
    />
  );
}
