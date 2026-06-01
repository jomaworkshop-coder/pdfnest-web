import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { watermarkPdf } from "../watermark";

async function makePdf(pages: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([612, 792]);
  const bytes = await doc.save();
  return new File([bytes as BlobPart], "in.pdf", { type: "application/pdf" });
}

describe("watermarkPdf", () => {
  it("stamps watermark on every page and returns a PDF blob", async () => {
    const f = await makePdf(4);
    const out = await watermarkPdf([f], { text: "DRAFT", position: "diagonal", opacity: 0.3, fontSize: 60, color: "gray" });
    const blob = out as Blob;
    expect(blob.type).toBe("application/pdf");
    const reloaded = await PDFDocument.load(await blob.arrayBuffer());
    expect(reloaded.getPageCount()).toBe(4);
  });

  it("rejects empty watermark text", async () => {
    const f = await makePdf(1);
    await expect(
      watermarkPdf([f], { text: "", position: "diagonal", opacity: 0.3, fontSize: 60, color: "gray" }),
    ).rejects.toThrow();
  });
});
