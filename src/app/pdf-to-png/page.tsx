import { TOOLS } from "@/lib/tools";
import { PdfToPngClient } from "./PdfToPngClient";

export const metadata = TOOLS["pdf-to-png"].metadata;

export default function PdfToPngPage() {
  return <PdfToPngClient />;
}
