import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { splitPdf } from "../split";

async function makePdf(pageCount: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) doc.addPage().drawText(`p${i + 1}`);
  return new File([(await doc.save()) as BlobPart], "in.pdf", { type: "application/pdf" });
}

describe("splitPdf", () => {
  it("every-page mode returns one PDF per page", async () => {
    const f = await makePdf(4);
    const out = await splitPdf([f], { mode: "every-page" });
    expect(Array.isArray(out)).toBe(true);
    expect((out as Blob[]).length).toBe(4);
  });
  it("ranges mode returns one PDF per range, with correct page counts", async () => {
    const f = await makePdf(10);
    const out = (await splitPdf([f], { mode: "ranges", ranges: "1-3,5,7-9" })) as Blob[];
    expect(out.length).toBe(3);
    const sizes = await Promise.all(out.map(async (b) => {
      const d = await PDFDocument.load(await b.arrayBuffer());
      return d.getPageCount();
    }));
    expect(sizes).toEqual([3, 1, 3]);
  });
});
