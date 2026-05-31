import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdfs } from "../merge";

async function makePdf(pageCount: number, label: string): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage();
    page.drawText(`${label} page ${i + 1}`);
  }
  const bytes = await doc.save();
  return new File([bytes as BlobPart], `${label}.pdf`, { type: "application/pdf" });
}

describe("mergePdfs", () => {
  it("merges 3 PDFs in order, preserving total page count", async () => {
    const a = await makePdf(2, "A");
    const b = await makePdf(3, "B");
    const c = await makePdf(1, "C");
    const out = await mergePdfs([a, b, c], {});
    expect(out).toBeInstanceOf(Blob);
    const buf = await (out as Blob).arrayBuffer();
    const merged = await PDFDocument.load(buf);
    expect(merged.getPageCount()).toBe(6);
  });
});
