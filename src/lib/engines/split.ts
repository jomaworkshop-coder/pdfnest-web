import { PDFDocument } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

export interface SplitOpts extends EngineOpts {
  mode: "every-page" | "ranges";
  ranges?: string;
}

function parseRanges(input: string, max: number): number[][] {
  return input.split(",").map((part) => {
    const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new Error(`Bad range: ${part}`);
    const start = Math.max(1, Number(m[1]));
    const end = m[2] ? Math.min(max, Number(m[2])) : start;
    if (end < start) throw new Error(`Bad range: ${part}`);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i - 1);
    return arr;
  }).filter((r) => r.length > 0);
}

export const splitPdf: Engine<SplitOpts> = async (files, opts) => {
  if (!files[0]) throw new InvalidPdfError("No file provided");
  let src: PDFDocument;
  try { src = await PDFDocument.load(await files[0].arrayBuffer()); }
  catch { throw new InvalidPdfError(); }
  const total = src.getPageCount();
  const groups = opts.mode === "every-page"
    ? Array.from({ length: total }, (_, i) => [i])
    : parseRanges(opts.ranges ?? "", total);

  const outputs: Blob[] = [];
  for (let g = 0; g < groups.length; g++) {
    if (opts.signal?.aborted) throw new CancelledError();
    const doc = await PDFDocument.create();
    const pages = await doc.copyPages(src, groups[g]);
    pages.forEach((p) => doc.addPage(p));
    outputs.push(new Blob([(await doc.save()) as BlobPart], { type: "application/pdf" }));
    opts.onProgress?.(Math.round(((g + 1) / groups.length) * 100));
  }
  return outputs;
};
