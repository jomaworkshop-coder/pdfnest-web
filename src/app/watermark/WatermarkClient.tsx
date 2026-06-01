"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { watermarkPdf, type WatermarkOpts, type WatermarkPosition, type WatermarkColor } from "@/lib/engines/watermark";

const POSITIONS: { value: WatermarkPosition; label: string }[] = [
  { value: "diagonal", label: "Diagonal" },
  { value: "center", label: "Center" },
  { value: "bottom-right", label: "Bottom right" },
];
const COLORS: { value: WatermarkColor; label: string }[] = [
  { value: "gray", label: "Gray" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "black", label: "Black" },
];

function WatermarkOptionsForm({ value, onChange }: { value: WatermarkOpts; onChange: (v: WatermarkOpts) => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-3 text-sm">
      <label className="flex items-center gap-2">
        Text:
        <input
          type="text"
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          placeholder="DRAFT"
          className="flex-1 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
        />
      </label>
      <div>
        <span className="block mb-1">Position:</span>
        <div className="flex gap-3 flex-wrap">
          {POSITIONS.map((p) => (
            <label key={p.value} className="flex items-center gap-1">
              <input type="radio" checked={value.position === p.value} onChange={() => onChange({ ...value, position: p.value })} />
              {p.label}
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          Opacity:
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={value.opacity}
            onChange={(e) => onChange({ ...value, opacity: Number(e.target.value) })}
          />
          <span className="tabular-nums w-10">{value.opacity.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2">
          Size:
          <input
            type="number"
            min={12}
            max={144}
            value={value.fontSize}
            onChange={(e) => onChange({ ...value, fontSize: Math.max(12, Math.min(144, Number(e.target.value) || 60)) })}
            className="w-20 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
          />
        </label>
      </div>
      <div>
        <span className="block mb-1">Color:</span>
        <div className="flex gap-3">
          {COLORS.map((c) => (
            <label key={c.value} className="flex items-center gap-1">
              <input type="radio" checked={value.color === c.value} onChange={() => onChange({ ...value, color: c.value })} />
              {c.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WatermarkClient() {
  return (
    <ToolShell
      tool={TOOLS.watermark}
      engine={watermarkPdf}
      defaultOpts={{ text: "DRAFT", position: "diagonal", opacity: 0.3, fontSize: 60, color: "gray" } as WatermarkOpts}
      OptionsForm={WatermarkOptionsForm}
    />
  );
}
