import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { rotatePdf } from "../rotate";

async function makePdf(pages: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage();
  return new File([(await doc.save()) as BlobPart], "in.pdf", { type: "application/pdf" });
}

describe("rotatePdf", () => {
  it("rotates all pages by the requested angle", async () => {
    const f = await makePdf(3);
    const out = await rotatePdf([f], { angle: 90, pages: "all" });
    const d = await PDFDocument.load(await (out as Blob).arrayBuffer());
    d.getPages().forEach((p) => expect(p.getRotation().angle).toBe(90));
  });
  it("rotates only specified pages (1-indexed)", async () => {
    const f = await makePdf(4);
    const out = await rotatePdf([f], { angle: 180, pages: [2, 4] });
    const d = await PDFDocument.load(await (out as Blob).arrayBuffer());
    const angles = d.getPages().map((p) => p.getRotation().angle);
    expect(angles).toEqual([0, 180, 0, 180]);
  });
});
