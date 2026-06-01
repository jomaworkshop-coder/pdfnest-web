import type { MetadataRoute } from "next";

const BASE = "https://pdfnest.io";

const ROUTES = [
  "",
  "/merge",
  "/split",
  "/rotate",
  "/jpg-to-pdf",
  "/pdf-to-jpg",
  "/pdf-to-png",
  "/page-numbers",
  "/watermark",
  "/privacy-tech",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date("2026-05-31"),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path.length <= 12 ? 0.9 : 0.7,
  }));
}
