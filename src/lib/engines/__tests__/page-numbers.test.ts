import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { addPageNumbers } from "../page-numbers";

async function makePdf(pages: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([612, 792]);
  const bytes = await doc.save();
  return new File([bytes as BlobPart], "in.pdf", { type: "application/pdf" });
}

describe("addPageNumbers", () => {
  it("preserves page count and returns a PDF blob", async () => {
    const f = await makePdf(5);
    const out = await addPageNumbers([f], { position: "bottom-center", start: 1, fontSize: 12, skipFirst: false });
    expect(out).toBeInstanceOf(Blob);
    const blob = out as Blob;
    expect(blob.type).toBe("application/pdf");
    const reloaded = await PDFDocument.load(await blob.arrayBuffer());
    expect(reloaded.getPageCount()).toBe(5);
  });

  it("supports skipFirst (cover page) without dropping pages", async () => {
    const f = await makePdf(3);
    const out = await addPageNumbers([f], { position: "bottom-right", start: 1, fontSize: 10, skipFirst: true });
    const reloaded = await PDFDocument.load(await (out as Blob).arrayBuffer());
    expect(reloaded.getPageCount()).toBe(3);
  });

  it("rejects invalid PDFs", async () => {
    const bad = new File([new Uint8Array([1, 2, 3])], "x.pdf", { type: "application/pdf" });
    await expect(
      addPageNumbers([bad], { position: "bottom-center", start: 1, fontSize: 12, skipFirst: false }),
    ).rejects.toThrow();
  });
});
