import { PDFDocument, degrees } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError } from "./types";

export interface RotateOpts extends EngineOpts {
  angle: 90 | 180 | 270;
  pages: "all" | number[]; // 1-indexed
}

export const rotatePdf: Engine<RotateOpts> = async (files, opts) => {
  if (!files[0]) throw new InvalidPdfError("No file provided");
  let doc: PDFDocument;
  try { doc = await PDFDocument.load(await files[0].arrayBuffer()); }
  catch { throw new InvalidPdfError(); }
  const target = new Set<number>(
    opts.pages === "all"
      ? doc.getPageIndices()
      : opts.pages.map((p) => p - 1),
  );
  doc.getPages().forEach((p, i) => {
    if (target.has(i)) {
      const current = p.getRotation().angle;
      p.setRotation(degrees((current + opts.angle) % 360));
    }
  });
  opts.onProgress?.(100);
  return new Blob([(await doc.save()) as BlobPart], { type: "application/pdf" });
};
