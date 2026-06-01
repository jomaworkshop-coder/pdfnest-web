import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

export type WatermarkPosition = "diagonal" | "center" | "bottom-right";
export type WatermarkColor = "gray" | "red" | "blue" | "black";

export interface WatermarkOpts extends EngineOpts {
  text: string;
  position: WatermarkPosition;
  opacity: number; // 0..1
  fontSize: number;
  color: WatermarkColor;
}

const COLORS: Record<WatermarkColor, [number, number, number]> = {
  gray: [0.5, 0.5, 0.5],
  red: [0.85, 0.1, 0.1],
  blue: [0.1, 0.3, 0.85],
  black: [0, 0, 0],
};

export const watermarkPdf: Engine<WatermarkOpts> = async (files, opts) => {
  if (!files[0]) throw new InvalidPdfError("No file provided");
  if (!opts.text.trim()) throw new InvalidPdfError("Watermark text is required");

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(await files[0].arrayBuffer());
  } catch {
    throw new InvalidPdfError(`Could not read ${files[0].name}`);
  }
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();
  const [r, g, b] = COLORS[opts.color];
  const opacity = Math.max(0, Math.min(1, opts.opacity));

  for (let i = 0; i < pages.length; i++) {
    if (opts.signal?.aborted) throw new CancelledError();
    const page = pages[i];
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(opts.text, opts.fontSize);

    if (opts.position === "diagonal") {
      // 45° across the page, centered on the page midpoint
      const cx = width / 2;
      const cy = height / 2;
      const angleRad = (Math.PI / 4);
      // Offset so the rotated text's centre lands on (cx, cy).
      const x = cx - (textWidth / 2) * Math.cos(angleRad) + (opts.fontSize / 2) * Math.sin(angleRad);
      const y = cy - (textWidth / 2) * Math.sin(angleRad) - (opts.fontSize / 2) * Math.cos(angleRad);
      page.drawText(opts.text, { x, y, size: opts.fontSize, font, color: rgb(r, g, b), opacity, rotate: degrees(45) });
    } else if (opts.position === "center") {
      page.drawText(opts.text, {
        x: (width - textWidth) / 2,
        y: (height - opts.fontSize) / 2,
        size: opts.fontSize,
        font,
        color: rgb(r, g, b),
        opacity,
      });
    } else { // bottom-right
      page.drawText(opts.text, {
        x: width - textWidth - 24,
        y: 24,
        size: opts.fontSize,
        font,
        color: rgb(r, g, b),
        opacity,
      });
    }
    opts.onProgress?.(Math.round(((i + 1) / pages.length) * 100));
  }

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
};
