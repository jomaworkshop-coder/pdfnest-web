"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { rotatePdf, type RotateOpts } from "@/lib/engines/rotate";

function RotateOptions({ value, onChange }: { value: RotateOpts; onChange: (v: RotateOpts) => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-2">
      <div className="flex items-center gap-3 text-sm">
        <span>Rotate:</span>
        {[90, 180, 270].map((a) => (
          <label key={a} className="flex items-center gap-1">
            <input type="radio" checked={value.angle === a} onChange={() => onChange({ ...value, angle: a as 90 | 180 | 270 })} />
            {a}°
          </label>
        ))}
      </div>
      <div className="text-sm">
        <span className="mr-2">Pages:</span>
        <label className="mr-3">
          <input type="radio" checked={value.pages === "all"} onChange={() => onChange({ ...value, pages: "all" })} /> all
        </label>
        <label>
          <input type="radio" checked={value.pages !== "all"} onChange={() => onChange({ ...value, pages: [1] })} /> specific
        </label>
        {value.pages !== "all" && (
          <input
            type="text"
            placeholder="e.g. 1,3,5"
            value={(value.pages as number[]).join(",")}
            onChange={(e) => onChange({
              ...value,
              pages: e.target.value.split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0),
            })}
            className="ml-2 px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
          />
        )}
      </div>
    </div>
  );
}

export function RotateClient() {
  return (
    <ToolShell
      tool={TOOLS.rotate}
      engine={rotatePdf}
      defaultOpts={{ angle: 90, pages: "all" } as RotateOpts}
      OptionsForm={RotateOptions}
    />
  );
}
