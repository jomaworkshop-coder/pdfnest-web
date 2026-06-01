"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { addPageNumbers, type PageNumbersOpts, type PageNumberPosition } from "@/lib/engines/page-numbers";

const POSITIONS: { value: PageNumberPosition; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-center", label: "Top center" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" },
];

function PageNumbersOptions({ value, onChange }: { value: PageNumbersOpts; onChange: (v: PageNumbersOpts) => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-3 text-sm">
      <div>
        <span className="block mb-1">Position:</span>
        <div className="grid grid-cols-3 gap-2">
          {POSITIONS.map((p) => (
            <label key={p.value} className="flex items-center gap-1">
              <input
                type="radio"
                checked={value.position === p.value}
                onChange={() => onChange({ ...value, position: p.value })}
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          Start at:
          <input
            type="number"
            min={1}
            value={value.start}
            onChange={(e) => onChange({ ...value, start: Math.max(1, Number(e.target.value) || 1) })}
            className="w-20 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
          />
        </label>
        <label className="flex items-center gap-2">
          Font size:
          <input
            type="number"
            min={6}
            max={48}
            value={value.fontSize}
            onChange={(e) => onChange({ ...value, fontSize: Math.max(6, Math.min(48, Number(e.target.value) || 12)) })}
            className="w-20 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.skipFirst}
            onChange={(e) => onChange({ ...value, skipFirst: e.target.checked })}
          />
          Skip first page (cover)
        </label>
      </div>
    </div>
  );
}

export function PageNumbersClient() {
  return (
    <ToolShell
      tool={TOOLS["page-numbers"]}
      engine={addPageNumbers}
      defaultOpts={{ position: "bottom-center", start: 1, fontSize: 12, skipFirst: false } as PageNumbersOpts}
      OptionsForm={PageNumbersOptions}
    />
  );
}
