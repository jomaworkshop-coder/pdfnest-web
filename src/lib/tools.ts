import type { Metadata } from "next";

export interface FAQ { q: string; a: string; }

export interface ToolMeta {
  slug: string;
  title: string;
  cta: string;
  description: string;
  keywords: string[];
  accept: string;
  multi: boolean;
  howItWorks: string[];
  faqs: FAQ[];
  metadata: Metadata;
}

function pageMetadata(slug: string, title: string, description: string, keywords: string[]): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: `https://pdfnest.io/${slug}` },
    openGraph: { title, description, url: `https://pdfnest.io/${slug}`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const TOOLS: Record<string, ToolMeta> = {
  merge: {
    slug: "merge",
    title: "Merge PDF",
    cta: "Merge PDFs",
    description: "Combine multiple PDF files into one. No upload, no signup, no watermark.",
    keywords: ["merge pdf", "combine pdf", "join pdf online free", "merge pdf no upload"],
    accept: "application/pdf",
    multi: true,
    howItWorks: [
      "Drop one or more PDF files into the box above.",
      "Drag to reorder them — top becomes the first page of the merged PDF.",
      "Click Merge PDFs and download the result.",
    ],
    faqs: [
      { q: "Is my PDF uploaded anywhere?", a: "No. Merging runs entirely in your browser. You can verify in DevTools Network tab — zero outbound requests while merging." },
      { q: "Is there a file size limit?", a: "No hard limit. Practical ceiling is your device's available memory. Very large PDFs may slow down on mobile." },
      { q: "How many PDFs can I merge?", a: "As many as fit in memory. We've tested up to 50 files at a time without issues on desktop." },
      { q: "Are there watermarks?", a: "No. Output is the unmodified concatenation of your input PDFs." },
    ],
    metadata: pageMetadata(
      "merge",
      "Merge PDF Online — Free, No Upload, No Signup",
      "Merge PDF files in your browser. No upload, no signup, no watermark. Files never leave your device.",
      ["merge pdf", "combine pdf", "join pdf online free", "merge pdf no upload"],
    ),
  },
  split: {
    slug: "split",
    title: "Split PDF",
    cta: "Split PDF",
    description: "Split a PDF into separate files by page or range. Runs in your browser.",
    keywords: ["split pdf", "extract pages from pdf", "split pdf online free", "pdf page splitter"],
    accept: "application/pdf",
    multi: false,
    howItWorks: [
      "Drop a single PDF file into the box above.",
      "Choose split mode: every page or page ranges (e.g. 1-3, 5, 7-9).",
      "Click Split PDF and download the zip of output PDFs.",
    ],
    faqs: [
      { q: "Is my PDF uploaded anywhere?", a: "No. Splitting runs entirely in your browser." },
      { q: "How do I specify ranges?", a: "Comma-separated, e.g. \"1-3,5,7-9\" gives you three output PDFs." },
      { q: "Can I split a 1000-page PDF?", a: "Yes, though memory use scales with file size and page count. Desktop browsers handle hundreds of pages fine." },
      { q: "Will pages be reordered?", a: "No. Output pages keep the original order; ranges are extracted as-is." },
    ],
    metadata: pageMetadata(
      "split",
      "Split PDF Online — Free, No Upload, No Signup",
      "Split PDFs in your browser. By page or range. No upload, no signup, no watermark.",
      ["split pdf", "extract pages from pdf", "split pdf online free", "pdf page splitter"],
    ),
  },
  rotate: {
    slug: "rotate",
    title: "Rotate PDF",
    cta: "Rotate PDF",
    description: "Rotate PDF pages 90, 180, or 270 degrees. Browser-only, no upload.",
    keywords: ["rotate pdf", "rotate pdf pages", "pdf rotation online", "rotate pdf 90 degrees"],
    accept: "application/pdf",
    multi: false,
    howItWorks: [
      "Drop a single PDF file into the box above.",
      "Pick a rotation angle and which pages to rotate.",
      "Click Rotate PDF and download the result.",
    ],
    faqs: [
      { q: "Is my PDF uploaded anywhere?", a: "No. Rotation runs entirely in your browser." },
      { q: "Is the rotation lossless?", a: "Yes. We modify the PDF's page metadata only, so output quality matches the input." },
      { q: "Can I rotate specific pages only?", a: "Yes — switch to page-list mode and enter the page numbers you want rotated." },
      { q: "Will the file size change?", a: "Minimally. Rotation adds a tiny metadata entry per affected page." },
    ],
    metadata: pageMetadata(
      "rotate",
      "Rotate PDF Online — Free, No Upload, No Signup",
      "Rotate PDF pages 90, 180, or 270 degrees in your browser. No upload, no signup, no watermark.",
      ["rotate pdf", "rotate pdf pages", "pdf rotation online", "rotate pdf 90 degrees"],
    ),
  },
  "jpg-to-pdf": {
    slug: "jpg-to-pdf",
    title: "JPG to PDF",
    cta: "Convert to PDF",
    description: "Convert JPG and PNG images to a single PDF. Browser-only, no upload.",
    keywords: ["jpg to pdf", "image to pdf", "convert jpg to pdf online free", "png to pdf"],
    accept: "image/jpeg,image/png",
    multi: true,
    howItWorks: [
      "Drop JPG or PNG images into the box above.",
      "Reorder them if needed; top becomes page 1.",
      "Pick page size and orientation, then convert and download the PDF.",
    ],
    faqs: [
      { q: "Are my images uploaded anywhere?", a: "No. Conversion runs entirely in your browser." },
      { q: "What image formats are supported?", a: "JPG and PNG. Other formats will be rejected by the file picker." },
      { q: "Can I mix portrait and landscape?", a: "Yes — use orientation \"auto\" to keep each image's natural orientation." },
      { q: "Is image quality preserved?", a: "Yes. Images are embedded as-is, no recompression." },
    ],
    metadata: pageMetadata(
      "jpg-to-pdf",
      "JPG to PDF — Free Online Image-to-PDF Converter, No Upload",
      "Convert JPG and PNG images to PDF in your browser. No upload, no signup, no watermark.",
      ["jpg to pdf", "image to pdf", "convert jpg to pdf online free", "png to pdf"],
    ),
  },
  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    title: "PDF to JPG",
    cta: "Convert to JPG",
    description: "Convert every page of a PDF to a JPG image. Runs in your browser.",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg online free", "pdf to png"],
    accept: "application/pdf",
    multi: false,
    howItWorks: [
      "Drop a single PDF file into the box above.",
      "Pick DPI and JPG quality.",
      "Click Convert to JPG and download the zip of images.",
    ],
    faqs: [
      { q: "Is my PDF uploaded anywhere?", a: "No. Rendering runs entirely in your browser via pdf.js." },
      { q: "What DPI should I pick?", a: "72 for web previews, 150 for general use, 300 for print quality. Higher DPI = larger files and slower rendering." },
      { q: "Can I get PNGs instead of JPGs?", a: "Yes — use the PDF to PNG tool. PNG preserves sharper edges; JPG is smaller for photo-heavy pages." },
      { q: "Will text be searchable?", a: "No — output is rasterized images. Use \"PDF to Word\" for editable text (coming soon)." },
    ],
    metadata: pageMetadata(
      "pdf-to-jpg",
      "PDF to JPG — Free Online PDF-to-Image Converter, No Upload",
      "Convert PDF pages to JPG images in your browser. No upload, no signup, no watermark.",
      ["pdf to jpg", "pdf to image", "convert pdf to jpg online free", "pdf to png"],
    ),
  },
  "pdf-to-png": {
    slug: "pdf-to-png",
    title: "PDF to PNG",
    cta: "Convert to PNG",
    description: "Convert every page of a PDF to a PNG image. Lossless, browser-only.",
    keywords: ["pdf to png", "pdf to image", "convert pdf to png online free", "pdf page to png"],
    accept: "application/pdf",
    multi: false,
    howItWorks: [
      "Drop a single PDF file into the box above.",
      "Pick DPI — higher means sharper, larger files.",
      "Click Convert to PNG and download the zip of images.",
    ],
    faqs: [
      { q: "Is my PDF uploaded anywhere?", a: "No. Rendering runs entirely in your browser via pdf.js." },
      { q: "PNG or JPG — which should I pick?", a: "PNG is lossless and best for screenshots, diagrams, and pages with text. JPG is smaller for photo-heavy pages but adds compression artifacts." },
      { q: "What DPI should I pick?", a: "72 for web previews, 150 for general use, 300 for print quality." },
      { q: "Do PNGs preserve transparency?", a: "Yes — page areas that are transparent in the source PDF stay transparent in the PNG." },
    ],
    metadata: pageMetadata(
      "pdf-to-png",
      "PDF to PNG — Free Online PDF-to-PNG Converter, No Upload",
      "Convert PDF pages to PNG images in your browser. Lossless. No upload, no signup, no watermark.",
      ["pdf to png", "pdf to image", "convert pdf to png online free", "pdf page to png"],
    ),
  },
  "page-numbers": {
    slug: "page-numbers",
    title: "Add Page Numbers",
    cta: "Add Page Numbers",
    description: "Stamp page numbers onto a PDF. Pick position, starting number, skip cover. Browser-only.",
    keywords: ["add page numbers to pdf", "pdf page numbers", "number pdf pages online free"],
    accept: "application/pdf",
    multi: false,
    howItWorks: [
      "Drop a single PDF file into the box above.",
      "Pick where the numbers go, the starting number, and whether to skip the cover.",
      "Click Add Page Numbers and download the result.",
    ],
    faqs: [
      { q: "Is my PDF uploaded anywhere?", a: "No. Stamping runs entirely in your browser." },
      { q: "Can I skip the cover page?", a: "Yes — enable \"Skip first page\" and numbering starts on page 2." },
      { q: "Can I change the starting number?", a: "Yes — set any positive integer (handy for multi-volume documents)." },
      { q: "Are existing page numbers removed?", a: "No. This adds new numbers; it does not edit or strip existing ones." },
    ],
    metadata: pageMetadata(
      "page-numbers",
      "Add Page Numbers to PDF — Free Online, No Upload",
      "Add page numbers to PDF in your browser. Pick position, starting number, skip cover. No upload, no signup, no watermark.",
      ["add page numbers to pdf", "pdf page numbers", "number pdf pages online free"],
    ),
  },
};
