"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { organizePdf, type OrganizeOpts } from "@/lib/engines/organize";

function OrganizeOptionsForm({ value, onChange }: { value: OrganizeOpts; onChange: (v: OrganizeOpts) => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-3 text-sm">
      <label className="block">
        <span className="block mb-1">New page order:</span>
        <input
          type="text"
          value={value.pageSpec}
          onChange={(e) => onChange({ ...value, pageSpec: e.target.value })}
          placeholder="e.g. 3,1,4-5,7"
          className="w-full px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent font-mono"
        />
        <span className="block mt-1 text-xs text-neutral-500">
          Comma-separated. Use a dash for ranges. Pages not listed are removed. Order matters.
        </span>
      </label>
      <div>
        <span className="block mb-1">Rotate selected pages:</span>
        <div className="flex gap-3">
          {[0, 90, 180, 270].map((r) => (
            <label key={r} className="flex items-center gap-1">
              <input
                type="radio"
                checked={value.rotation === r}
                onChange={() => onChange({ ...value, rotation: r as 0 | 90 | 180 | 270 })}
              />
              {r === 0 ? "no rotation" : `${r}°`}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrganizeClient() {
  return (
    <ToolShell
      tool={TOOLS.organize}
      engine={organizePdf}
      defaultOpts={{ pageSpec: "", rotation: 0 } as OrganizeOpts}
      OptionsForm={OrganizeOptionsForm}
    />
  );
}
