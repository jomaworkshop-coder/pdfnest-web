import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { fillSignPdf } from "../fill-sign";

async function makePdf(pages: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([612, 792]);
  const bytes = await doc.save();
  return new File([bytes as BlobPart], "in.pdf", { type: "application/pdf" });
}

// 1×1 transparent PNG (valid signature image stub).
const PNG_1X1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4//8/AwAI/AL+yU0+7gAAAABJRU5ErkJggg==";

describe("fillSignPdf", () => {
  it("stamps a text placement on the specified page", async () => {
    const f = await makePdf(2);
    const out = await fillSignPdf([f], {
      placements: [
        { pageIndex: 1, x: 100, y: 200, kind: "text", text: "John Doe", fontSize: 14 },
      ],
    });
    const blob = out as Blob;
    expect(blob.type).toBe("application/pdf");
    const reloaded = await PDFDocument.load(await blob.arrayBuffer());
    expect(reloaded.getPageCount()).toBe(2);
  });

  it("stamps a signature image on the specified page", async () => {
    const f = await makePdf(1);
    const out = await fillSignPdf([f], {
      placements: [
        { pageIndex: 0, x: 50, y: 50, kind: "signature", imageDataUrl: PNG_1X1, width: 100 },
      ],
    });
    const reloaded = await PDFDocument.load(await (out as Blob).arrayBuffer());
    expect(reloaded.getPageCount()).toBe(1);
  });

  it("supports multiple placements across pages", async () => {
    const f = await makePdf(3);
    const out = await fillSignPdf([f], {
      placements: [
        { pageIndex: 0, x: 10, y: 10, kind: "text", text: "A", fontSize: 12 },
        { pageIndex: 2, x: 20, y: 20, kind: "text", text: "B", fontSize: 12 },
        { pageIndex: 1, x: 30, y: 30, kind: "signature", imageDataUrl: PNG_1X1, width: 80 },
      ],
    });
    const reloaded = await PDFDocument.load(await (out as Blob).arrayBuffer());
    expect(reloaded.getPageCount()).toBe(3);
  });

  it("rejects placement on a non-existent page", async () => {
    const f = await makePdf(1);
    await expect(
      fillSignPdf([f], {
        placements: [{ pageIndex: 5, x: 0, y: 0, kind: "text", text: "x", fontSize: 12 }],
      }),
    ).rejects.toThrow();
  });

  it("rejects empty placements", async () => {
    const f = await makePdf(1);
    await expect(fillSignPdf([f], { placements: [] })).rejects.toThrow();
  });
});
