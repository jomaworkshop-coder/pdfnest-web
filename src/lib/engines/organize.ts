import { PDFDocument, degrees } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

export interface OrganizeOpts extends EngineOpts {
  /** Ordered list, 1-based, comma + dash syntax. e.g. "3,1,5-7" */
  pageSpec: string;
  rotation: 0 | 90 | 180 | 270;
}

function parseSpec(input: string, max: number): number[] {
  const trimmed = input.trim();
  if (!trimmed) throw new InvalidPdfError("Page selection is required");
  const out: number[] = [];
  for (const part of trimmed.split(",")) {
    const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new InvalidPdfError(`Bad range: "${part.trim()}"`);
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    if (start < 1 || end < 1 || end < start) throw new InvalidPdfError(`Bad range: "${part.trim()}"`);
    if (start > max || end > max) throw new InvalidPdfError(`Page ${end > max ? end : start} is out of range (PDF has ${max} pages)`);
    for (let i = start; i <= end; i++) out.push(i - 1); // 0-based
  }
  if (!out.length) throw new InvalidPdfError("Page selection is empty");
  return out;
}

export const organizePdf: Engine<OrganizeOpts> = async (files, opts) => {
  if (!files[0]) throw new InvalidPdfError("No file provided");
  let src: PDFDocument;
  try {
    src = await PDFDocument.load(await files[0].arrayBuffer());
  } catch {
    throw new InvalidPdfError(`Could not read ${files[0].name}`);
  }
  const total = src.getPageCount();
  const order = parseSpec(opts.pageSpec, total);

  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, order);
  for (let i = 0; i < copied.length; i++) {
    if (opts.signal?.aborted) throw new CancelledError();
    const page = copied[i];
    if (opts.rotation !== 0) {
      // Compose with any existing rotation in source.
      const existing = page.getRotation().angle;
      page.setRotation(degrees((existing + opts.rotation) % 360));
    }
    out.addPage(page);
    opts.onProgress?.(Math.round(((i + 1) / copied.length) * 100));
  }

  const bytes = await out.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
};
