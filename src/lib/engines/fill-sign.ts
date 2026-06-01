import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

export type Placement =
  | {
      kind: "text";
      pageIndex: number; // 0-based
      x: number; // PDF pt, bottom-left origin
      y: number;
      text: string;
      fontSize: number;
    }
  | {
      kind: "signature";
      pageIndex: number;
      x: number;
      y: number;
      imageDataUrl: string; // PNG or JPEG data URL
      width: number; // target draw width in PDF pt; height auto-derived from aspect
    };

export interface FillSignOpts extends EngineOpts {
  placements: Placement[];
}

function decodeDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) throw new InvalidPdfError("Signature image must be a data URL");
  const mime = m[1];
  const b64 = m[2];
  // atob in browsers; Buffer fallback for Node test runners.
  const binary = typeof atob === "function"
    ? atob(b64)
    : Buffer.from(b64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { mime, bytes };
}

export const fillSignPdf: Engine<FillSignOpts> = async (files, opts) => {
  if (!files[0]) throw new InvalidPdfError("No file provided");
  if (!opts.placements.length) throw new InvalidPdfError("Add at least one placement");

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(await files[0].arrayBuffer());
  } catch {
    throw new InvalidPdfError(`Could not read ${files[0].name}`);
  }
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pageCount = doc.getPageCount();

  // Bounds-check up front so we error before any embedding work.
  for (const p of opts.placements) {
    if (p.pageIndex < 0 || p.pageIndex >= pageCount) {
      throw new InvalidPdfError(
        `Placement targets page ${p.pageIndex + 1}, but PDF only has ${pageCount} pages`,
      );
    }
  }

  for (let i = 0; i < opts.placements.length; i++) {
    if (opts.signal?.aborted) throw new CancelledError();
    const p = opts.placements[i];
    const page = doc.getPage(p.pageIndex);
    if (p.kind === "text") {
      page.drawText(p.text, {
        x: p.x,
        y: p.y,
        size: p.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    } else {
      const { mime, bytes } = decodeDataUrl(p.imageDataUrl);
      const img = mime === "image/jpeg" || mime === "image/jpg"
        ? await doc.embedJpg(bytes)
        : await doc.embedPng(bytes);
      const aspect = img.height / img.width;
      page.drawImage(img, { x: p.x, y: p.y, width: p.width, height: p.width * aspect });
    }
    opts.onProgress?.(Math.round(((i + 1) / opts.placements.length) * 100));
  }

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
};
