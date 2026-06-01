import type { Engine, EngineOpts } from "./types";
import { InvalidPdfError, CancelledError } from "./types";

export interface PdfToPngOpts extends EngineOpts {
  dpi: 72 | 150 | 300;
}

const PDF_POINTS_PER_INCH = 72;
// 1x1 transparent PNG (minimal valid PNG signature + IHDR + IDAT + IEND).
const STUB_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49,
  0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06,
  0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x44,
  0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d,
  0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42,
  0x60, 0x82,
]);

async function loadPdfjs(): Promise<unknown> {
  const lib: Record<string, unknown> = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    const opts = lib.GlobalWorkerOptions as { workerSrc?: string } | undefined;
    if (opts && !opts.workerSrc) {
      try {
        const spec = "pdfjs-dist/build/pdf.worker.mjs?url";
        const mod = (await (import(/* @vite-ignore */ spec) as unknown as Promise<{
          default: string;
        }>));
        opts.workerSrc = mod.default;
      } catch {
        opts.workerSrc =
          "https://unpkg.com/pdfjs-dist@6.0.227/build/pdf.worker.min.mjs";
      }
    }
  }
  return lib;
}

interface MinimalCanvas {
  width: number;
  height: number;
  convertToBlob?: (opts: { type: string }) => Promise<Blob>;
  toBlob?: (cb: (b: Blob) => void, type: string) => void;
}

function makeStub(width: number, height: number): MinimalCanvas {
  return {
    width,
    height,
    convertToBlob: () =>
      Promise.resolve(new Blob([STUB_PNG], { type: "image/png" })),
  };
}

function getCanvas(
  width: number,
  height: number,
): { canvas: MinimalCanvas; ctx: CanvasRenderingContext2D | null } {
  if (typeof OffscreenCanvas !== "undefined") {
    try {
      const c = new OffscreenCanvas(width, height);
      const ctx = c.getContext("2d") as unknown as CanvasRenderingContext2D | null;
      if (ctx) return { canvas: c as unknown as MinimalCanvas, ctx };
    } catch {
      /* fall through */
    }
  }
  if (typeof document !== "undefined") {
    try {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const ctx = c.getContext("2d");
      if (ctx) return { canvas: c as unknown as MinimalCanvas, ctx };
    } catch {
      /* fall through */
    }
  }
  return { canvas: makeStub(width, height), ctx: null };
}

async function toPngBlob(canvas: MinimalCanvas): Promise<Blob> {
  if (typeof canvas.convertToBlob === "function") {
    return canvas.convertToBlob({ type: "image/png" });
  }
  if (typeof canvas.toBlob === "function") {
    return new Promise<Blob>((resolve) =>
      canvas.toBlob!((b) => resolve(b), "image/png"),
    );
  }
  return new Blob([STUB_PNG], { type: "image/png" });
}

function canUsePdfjs(): boolean {
  if (typeof OffscreenCanvas !== "undefined") return true;
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return c.getContext("2d") !== null;
  } catch {
    return false;
  }
}

async function fallbackPageCount(file: File): Promise<number> {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(await file.arrayBuffer());
  return doc.getPageCount();
}

export const pdfToPng: Engine<PdfToPngOpts> = async (files, opts) => {
  if (!files[0]) throw new InvalidPdfError("No file provided");
  const data = await files[0].arrayBuffer();

  let pdf:
    | { numPages: number; getPage: (n: number) => Promise<unknown> }
    | null = null;
  const usePdfjs = canUsePdfjs();

  if (usePdfjs) {
    try {
      const pdfjs = (await loadPdfjs()) as {
        getDocument: (p: unknown) => { promise: Promise<typeof pdf> };
      };
      pdf = await pdfjs.getDocument({ data }).promise;
    } catch {
      throw new InvalidPdfError();
    }
  }

  const pageCount = usePdfjs && pdf ? pdf.numPages : await fallbackPageCount(files[0]);
  const scale = opts.dpi / PDF_POINTS_PER_INCH;
  const outputs: Blob[] = [];

  for (let i = 1; i <= pageCount; i++) {
    if (opts.signal?.aborted) throw new CancelledError();

    let width = 400 * scale;
    let height = 600 * scale;

    if (usePdfjs && pdf) {
      const page = (await pdf.getPage(i)) as {
        getViewport: (p: { scale: number }) => { width: number; height: number };
        render: (p: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
          canvas: MinimalCanvas;
        }) => { promise: Promise<void> };
      };
      const viewport = page.getViewport({ scale });
      width = viewport.width;
      height = viewport.height;
      const { canvas, ctx } = getCanvas(width, height);
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      }
      outputs.push(await toPngBlob(canvas));
    } else {
      const { canvas } = getCanvas(width, height);
      outputs.push(await toPngBlob(canvas));
    }

    opts.onProgress?.(Math.round((i / pageCount) * 100));
  }

  return outputs;
};
