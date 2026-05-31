"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { jpgToPdf, type JpgToPdfOpts } from "@/lib/engines/jpg-to-pdf";

function JpgToPdfOptions({ value, onChange }: { value: JpgToPdfOpts; onChange: (v: JpgToPdfOpts) => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-2 text-sm">
      <div className="flex items-center gap-3">
        <span>Page size:</span>
        {(["fit", "a4", "letter"] as const).map((s) => (
          <label key={s} className="flex items-center gap-1">
            <input type="radio" checked={value.pageSize === s} onChange={() => onChange({ ...value, pageSize: s })} />
            {s}
          </label>
        ))}
      </div>
      {value.pageSize !== "fit" && (
        <div className="flex items-center gap-3">
          <span>Orientation:</span>
          {(["auto", "portrait", "landscape"] as const).map((o) => (
            <label key={o} className="flex items-center gap-1">
              <input type="radio" checked={value.orientation === o} onChange={() => onChange({ ...value, orientation: o })} />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JpgToPdfPage() {
  return (
    <ToolShell
      tool={TOOLS["jpg-to-pdf"]}
      engine={jpgToPdf}
      defaultOpts={{ pageSize: "fit", orientation: "auto" } as JpgToPdfOpts}
      OptionsForm={JpgToPdfOptions}
    />
  );
}
