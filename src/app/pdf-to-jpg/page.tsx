import { TOOLS } from "@/lib/tools";
import { PdfToJpgClient } from "./PdfToJpgClient";

export const metadata = TOOLS["pdf-to-jpg"].metadata;

export default function PdfToJpgPage() {
  return <PdfToJpgClient />;
}
