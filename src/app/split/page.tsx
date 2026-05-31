"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { splitPdf, type SplitOpts } from "@/lib/engines/split";

function SplitOptions({ value, onChange }: { value: SplitOpts; onChange: (v: SplitOpts) => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-2">
      <label className="flex items-center gap-2 text-sm">
        <input type="radio" checked={value.mode === "every-page"} onChange={() => onChange({ ...value, mode: "every-page" })} />
        Split every page into its own PDF
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="radio" checked={value.mode === "ranges"} onChange={() => onChange({ ...value, mode: "ranges" })} />
        Split by ranges
      </label>
      {value.mode === "ranges" && (
        <input
          type="text"
          placeholder="e.g. 1-3,5,7-9"
          value={value.ranges ?? ""}
          onChange={(e) => onChange({ ...value, ranges: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
        />
      )}
    </div>
  );
}

export default function SplitPage() {
  return (
    <ToolShell
      tool={TOOLS.split}
      engine={splitPdf}
      defaultOpts={{ mode: "every-page" } as SplitOpts}
      OptionsForm={SplitOptions}
    />
  );
}
