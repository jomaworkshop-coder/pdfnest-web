import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { pdfToJpg } from "../pdf-to-jpg";

async function makePdf(pages: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) {
    const p = doc.addPage([400, 600]);
    p.drawText(`page ${i + 1}`, { x: 50, y: 500 });
  }
  return new File([(await doc.save()) as BlobPart], "in.pdf", { type: "application/pdf" });
}

describe("pdfToJpg", () => {
  it("returns one JPG blob per page", async () => {
    const f = await makePdf(2);
    const out = await pdfToJpg([f], { dpi: 72, quality: 0.85 });
    expect(Array.isArray(out)).toBe(true);
    expect((out as Blob[]).length).toBe(2);
    (out as Blob[]).forEach((b) => expect(b.type).toBe("image/jpeg"));
  });
});
