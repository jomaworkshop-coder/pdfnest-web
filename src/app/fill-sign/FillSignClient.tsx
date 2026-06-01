"use client";
import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { fillSignPdf, type FillSignOpts, type Placement } from "@/lib/engines/fill-sign";
import { SignaturePad } from "@/components/SignaturePad";

function Builder({ value, onChange }: { value: FillSignOpts; onChange: (v: FillSignOpts) => void }) {
  const [kind, setKind] = useState<"text" | "signature">("text");
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [page, setPage] = useState(1);
  const [x, setX] = useState(72);
  const [y, setY] = useState(72);
  const [sigUrl, setSigUrl] = useState<string | null>(null);
  const [sigWidth, setSigWidth] = useState(140);

  function add() {
    let p: Placement | null = null;
    if (kind === "text") {
      if (!text.trim()) return;
      p = { kind: "text", pageIndex: page - 1, x, y, text, fontSize };
    } else {
      if (!sigUrl) return;
      p = { kind: "signature", pageIndex: page - 1, x, y, imageDataUrl: sigUrl, width: sigWidth };
    }
    onChange({ ...value, placements: [...value.placements, p] });
    if (kind === "text") setText("");
  }
  function remove(idx: number) {
    onChange({ ...value, placements: value.placements.filter((_, i) => i !== idx) });
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded p-3 space-y-4 text-sm">
      <div className="flex gap-3">
        {(["text", "signature"] as const).map((k) => (
          <label key={k} className="flex items-center gap-1">
            <input type="radio" checked={kind === k} onChange={() => setKind(k)} />
            {k === "text" ? "Type text" : "Draw signature"}
          </label>
        ))}
      </div>

      {kind === "text" ? (
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            Text:
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="John Doe"
              className="flex-1 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2">
            Font size:
            <input
              type="number"
              min={6}
              max={72}
              value={fontSize}
              onChange={(e) => setFontSize(Math.max(6, Math.min(72, Number(e.target.value) || 14)))}
              className="w-20 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <SignaturePad onChange={setSigUrl} />
          <label className="flex items-center gap-2">
            Stamp width (pt):
            <input
              type="number"
              min={20}
              max={400}
              value={sigWidth}
              onChange={(e) => setSigWidth(Math.max(20, Math.min(400, Number(e.target.value) || 140)))}
              className="w-24 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
            />
          </label>
        </div>
      )}

      <fieldset className="border border-neutral-200 dark:border-neutral-800 rounded p-2 space-y-2">
        <legend className="px-1 text-xs text-neutral-500">Where to place it</legend>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2">
            Page:
            <input
              type="number"
              min={1}
              value={page}
              onChange={(e) => setPage(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2">
            X (pt from left):
            <input
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value) || 0)}
              className="w-24 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2">
            Y (pt from bottom):
            <input
              type="number"
              value={y}
              onChange={(e) => setY(Number(e.target.value) || 0)}
              className="w-24 px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
            />
          </label>
        </div>
        <p className="text-xs text-neutral-500">
          US letter page = 612 × 792 pt. A4 = 595 × 842 pt. 1 inch = 72 pt. Bottom-left of page is (0, 0).
        </p>
      </fieldset>

      <button
        type="button"
        onClick={add}
        className="px-3 py-1.5 rounded border border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950"
      >
        Add placement
      </button>

      {value.placements.length > 0 && (
        <div>
          <div className="text-xs text-neutral-500 mb-1">Placements ({value.placements.length}):</div>
          <ul className="space-y-1">
            {value.placements.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded p-2">
                <span className="flex-1">
                  {p.kind === "text"
                    ? `"${p.text}" (${p.fontSize}pt) on page ${p.pageIndex + 1} at (${p.x}, ${p.y})`
                    : `signature on page ${p.pageIndex + 1} at (${p.x}, ${p.y}), ${p.width}pt wide`}
                </span>
                <button onClick={() => remove(i)} className="text-red-500 px-2" aria-label="Remove">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function FillSignClient() {
  return (
    <ToolShell
      tool={TOOLS["fill-sign"]}
      engine={fillSignPdf}
      defaultOpts={{ placements: [] } as FillSignOpts}
      OptionsForm={Builder}
    />
  );
}
