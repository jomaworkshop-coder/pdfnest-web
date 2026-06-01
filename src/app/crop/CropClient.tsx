"use client";
import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { cropPdf, type CropOpts } from "@/lib/engines/crop";

type Unit = "in" | "mm" | "pt";

const TO_PT: Record<Unit, number> = {
  in: 72,
  mm: 72 / 25.4,
  pt: 1,
};

function CropOptionsForm({
  value,
  onChange,
}: {
  value: CropOpts;
  onChange: (v: CropOpts) => void;
}) {
  // Display values in the user's chosen unit; internal opts are always pt.
  const [unit, setUnit] = useState<Unit>("in");
  const ptToUnit = (pt: number) => pt / TO_PT[unit];
  const unitToPt = (u: number) => u * TO_PT[unit];

  function setSide(side: keyof Pick<CropOpts, "top" | "right" | "bottom" | "left">, raw: string) {
    const u = Math.max(0, Number(raw) || 0);
    onChange({ ...value, [side]: unitToPt(u) });
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-3 text-sm">
      <div className="flex items-center gap-3">
        <span>Units:</span>
        {(["in", "mm", "pt"] as Unit[]).map((u) => (
          <label key={u} className="flex items-center gap-1">
            <input type="radio" checked={unit === u} onChange={() => setUnit(u)} />
            {u}
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <label key={side} className="flex items-center gap-2 capitalize">
            <span className="w-16">{side}:</span>
            <input
              type="number"
              min={0}
              step={unit === "pt" ? 1 : 0.05}
              value={Number(ptToUnit(value[side]).toFixed(4))}
              onChange={(e) => setSide(side, e.target.value)}
              className="w-24 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
            />
            <span className="text-neutral-500 text-xs">{unit}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-neutral-500">
        Trims from each side of every page. 1 in = 72 pt = 25.4 mm.
      </p>
    </div>
  );
}

export function CropClient() {
  return (
    <ToolShell
      tool={TOOLS.crop}
      engine={cropPdf}
      defaultOpts={{ top: 0, right: 0, bottom: 0, left: 0 } as CropOpts}
      OptionsForm={CropOptionsForm}
    />
  );
}
