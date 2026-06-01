import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { pdfToPng } from "../pdf-to-png";

async function makePdf(pages: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) {
    const p = doc.addPage();
    p.drawText(`page ${i + 1}`);
  }
  const bytes = await doc.save();
  return new File([bytes as BlobPart], "in.pdf", { type: "application/pdf" });
}

describe("pdfToPng", () => {
  it("emits one image/png blob per page", async () => {
    const f = await makePdf(3);
    const out = await pdfToPng([f], { dpi: 150 });
    expect(Array.isArray(out)).toBe(true);
    const arr = out as Blob[];
    expect(arr).toHaveLength(3);
    arr.forEach((b) => expect(b.type).toBe("image/png"));
  });

  it("returns 1 blob for single-page PDF", async () => {
    const f = await makePdf(1);
    const out = await pdfToPng([f], { dpi: 72 });
    expect((out as Blob[])).toHaveLength(1);
  });
});
