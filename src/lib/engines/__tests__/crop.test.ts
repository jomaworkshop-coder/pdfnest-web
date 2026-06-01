import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { cropPdf } from "../crop";

async function makePdf(pages: number, w = 612, h = 792): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([w, h]);
  const bytes = await doc.save();
  return new File([bytes as BlobPart], "in.pdf", { type: "application/pdf" });
}

describe("cropPdf", () => {
  it("trims equal margins on every page", async () => {
    const f = await makePdf(2);
    const out = await cropPdf([f], { top: 36, right: 36, bottom: 36, left: 36 });
    const reloaded = await PDFDocument.load(await (out as Blob).arrayBuffer());
    expect(reloaded.getPageCount()).toBe(2);
    const box = reloaded.getPage(0).getCropBox();
    expect(box.width).toBe(612 - 72);
    expect(box.height).toBe(792 - 72);
    expect(box.x).toBe(36);
    expect(box.y).toBe(36);
  });

  it("supports asymmetric margins", async () => {
    const f = await makePdf(1);
    const out = await cropPdf([f], { top: 10, right: 20, bottom: 30, left: 40 });
    const reloaded = await PDFDocument.load(await (out as Blob).arrayBuffer());
    const box = reloaded.getPage(0).getCropBox();
    expect(box.x).toBe(40);
    expect(box.y).toBe(30);
    expect(box.width).toBe(612 - 40 - 20);
    expect(box.height).toBe(792 - 10 - 30);
  });

  it("rejects margins that consume the whole page", async () => {
    const f = await makePdf(1);
    await expect(
      cropPdf([f], { top: 400, right: 400, bottom: 400, left: 400 }),
    ).rejects.toThrow();
  });
});
