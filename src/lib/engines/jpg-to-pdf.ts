import { PDFDocument } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

export interface JpgToPdfOpts extends EngineOpts {
  pageSize: "fit" | "a4" | "letter";
  orientation: "auto" | "portrait" | "landscape";
}

const PAGE_DIMENSIONS: Record<"a4" | "letter", { w: number; h: number }> = {
  a4: { w: 595.28, h: 841.89 },
  letter: { w: 612, h: 792 },
};

export const jpgToPdf: Engine<JpgToPdfOpts> = async (files, opts) => {
  const doc = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    if (opts.signal?.aborted) throw new CancelledError();
    const buf = await files[i].arrayBuffer();
    let img;
    try {
      img = files[i].type === "image/png" ? await doc.embedPng(buf) : await doc.embedJpg(buf);
    } catch {
      throw new InvalidPdfError(`Could not embed ${files[i].name}`);
    }
    let pageW: number, pageH: number, drawW: number, drawH: number;
    if (opts.pageSize === "fit") {
      pageW = img.width;
      pageH = img.height;
      drawW = img.width;
      drawH = img.height;
    } else {
      const dims = PAGE_DIMENSIONS[opts.pageSize];
      const landscape =
        opts.orientation === "landscape" ||
        (opts.orientation === "auto" && img.width > img.height);
      pageW = landscape ? dims.h : dims.w;
      pageH = landscape ? dims.w : dims.h;
      const scale = Math.min(pageW / img.width, pageH / img.height);
      drawW = img.width * scale;
      drawH = img.height * scale;
    }
    const page = doc.addPage([pageW, pageH]);
    page.drawImage(img, {
      x: (pageW - drawW) / 2,
      y: (pageH - drawH) / 2,
      width: drawW,
      height: drawH,
    });
    opts.onProgress?.(Math.round(((i + 1) / files.length) * 95));
  }
  const bytes = await doc.save();
  opts.onProgress?.(100);
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
};
