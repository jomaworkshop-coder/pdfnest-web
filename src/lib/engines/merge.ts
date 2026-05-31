import { PDFDocument } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

export const mergePdfs: Engine<EngineOpts> = async (files, opts) => {
  const out = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    if (opts.signal?.aborted) throw new CancelledError();
    let src: PDFDocument;
    try {
      src = await PDFDocument.load(await files[i].arrayBuffer());
    } catch {
      throw new InvalidPdfError(`Could not read ${files[i].name}`);
    }
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    opts.onProgress?.(Math.round(((i + 1) / files.length) * 95));
  }
  const bytes = await out.save();
  opts.onProgress?.(100);
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
};
