import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { organizePdf } from "../organize";

async function makePdf(pages: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([612, 792]);
  const bytes = await doc.save();
  return new File([bytes as BlobPart], "in.pdf", { type: "application/pdf" });
}

describe("organizePdf", () => {
  it("reorders pages and drops omitted ones", async () => {
    const f = await makePdf(5);
    const out = await organizePdf([f], { pageSpec: "3,1,5", rotation: 0 });
    const reloaded = await PDFDocument.load(await (out as Blob).arrayBuffer());
    expect(reloaded.getPageCount()).toBe(3);
  });

  it("supports range syntax", async () => {
    const f = await makePdf(7);
    const out = await organizePdf([f], { pageSpec: "4-6,1", rotation: 0 });
    const reloaded = await PDFDocument.load(await (out as Blob).arrayBuffer());
    expect(reloaded.getPageCount()).toBe(4);
  });

  it("applies rotation to all selected pages", async () => {
    const f = await makePdf(2);
    const out = await organizePdf([f], { pageSpec: "1,2", rotation: 90 });
    const reloaded = await PDFDocument.load(await (out as Blob).arrayBuffer());
    expect(reloaded.getPageCount()).toBe(2);
    expect(reloaded.getPage(0).getRotation().angle).toBe(90);
  });

  it("rejects out-of-range page references", async () => {
    const f = await makePdf(3);
    await expect(organizePdf([f], { pageSpec: "5", rotation: 0 })).rejects.toThrow();
  });

  it("rejects empty spec", async () => {
    const f = await makePdf(3);
    await expect(organizePdf([f], { pageSpec: "", rotation: 0 })).rejects.toThrow();
  });
});
