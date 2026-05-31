import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { jpgToPdf } from "../jpg-to-pdf";

// 1x1 red JPG (smallest valid)
const RED_JPG_B64 =
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A//2Q==";

function jpgFile(name: string): File {
  const bin = Uint8Array.from(atob(RED_JPG_B64), (c) => c.charCodeAt(0));
  return new File([bin as BlobPart], name, { type: "image/jpeg" });
}

describe("jpgToPdf", () => {
  it("produces a one-page PDF per image, in order", async () => {
    const out = await jpgToPdf(
      [jpgFile("a.jpg"), jpgFile("b.jpg"), jpgFile("c.jpg")],
      { pageSize: "fit", orientation: "auto" },
    );
    const d = await PDFDocument.load(await (out as Blob).arrayBuffer());
    expect(d.getPageCount()).toBe(3);
  });
});
