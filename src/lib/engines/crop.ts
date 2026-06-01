import { PDFDocument } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

/**
 * Margins are in PDF points (1pt = 1/72 inch). They trim the existing
 * MediaBox of each page on the named side. The CropBox is set to the
 * resulting rectangle; the underlying page content is not modified, so
 * the crop is reversible by any reader that respects the original
 * MediaBox.
 */
export interface CropOpts extends EngineOpts {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const MIN_DIMENSION = 1; // refuse to crop to <1pt × <1pt

export const cropPdf: Engine<CropOpts> = async (files, opts) => {
  if (!files[0]) throw new InvalidPdfError("No file provided");
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(await files[0].arrayBuffer());
  } catch {
    throw new InvalidPdfError(`Could not read ${files[0].name}`);
  }
  const pages = doc.getPages();
  for (let i = 0; i < pages.length; i++) {
    if (opts.signal?.aborted) throw new CancelledError();
    const page = pages[i];
    const { width: w, height: h } = page.getSize();
    const cropW = w - opts.left - opts.right;
    const cropH = h - opts.top - opts.bottom;
    if (cropW < MIN_DIMENSION || cropH < MIN_DIMENSION) {
      throw new InvalidPdfError(
        `Margins remove the entire page (page ${i + 1}: ${w}×${h}pt). Reduce margins.`,
      );
    }
    page.setCropBox(opts.left, opts.bottom, cropW, cropH);
    opts.onProgress?.(Math.round(((i + 1) / pages.length) * 100));
  }
  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
};
