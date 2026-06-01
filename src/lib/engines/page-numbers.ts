import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

export type PageNumberPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export interface PageNumbersOpts extends EngineOpts {
  position: PageNumberPosition;
  start: number;
  fontSize: number;
  skipFirst: boolean;
}

const MARGIN = 24;

export const addPageNumbers: Engine<PageNumbersOpts> = async (files, opts) => {
  if (!files[0]) throw new InvalidPdfError("No file provided");
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(await files[0].arrayBuffer());
  } catch {
    throw new InvalidPdfError(`Could not read ${files[0].name}`);
  }
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    if (opts.signal?.aborted) throw new CancelledError();
    if (opts.skipFirst && i === 0) continue;
    const page = pages[i];
    const { width, height } = page.getSize();
    // When skipFirst: page index 1 (second page) gets `start`, page 2 gets start+1, etc.
    // Otherwise: page index 0 gets `start`.
    const labelN = opts.skipFirst ? i + opts.start - 1 : i + opts.start;
    const label = String(labelN);
    const textWidth = font.widthOfTextAtSize(label, opts.fontSize);
    let x = MARGIN;
    let y = MARGIN;
    switch (opts.position) {
      case "top-left":
        x = MARGIN;
        y = height - MARGIN - opts.fontSize;
        break;
      case "top-right":
        x = width - MARGIN - textWidth;
        y = height - MARGIN - opts.fontSize;
        break;
      case "top-center":
        x = (width - textWidth) / 2;
        y = height - MARGIN - opts.fontSize;
        break;
      case "bottom-left":
        x = MARGIN;
        y = MARGIN;
        break;
      case "bottom-right":
        x = width - MARGIN - textWidth;
        y = MARGIN;
        break;
      case "bottom-center":
        x = (width - textWidth) / 2;
        y = MARGIN;
        break;
    }
    page.drawText(label, { x, y, size: opts.fontSize, font, color: rgb(0, 0, 0) });
    opts.onProgress?.(Math.round(((i + 1) / total) * 100));
  }
  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
};
