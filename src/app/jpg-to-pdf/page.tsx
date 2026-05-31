import { TOOLS } from "@/lib/tools";
import { JpgToPdfClient } from "./JpgToPdfClient";

export const metadata = TOOLS["jpg-to-pdf"].metadata;

export default function JpgToPdfPage() {
  return <JpgToPdfClient />;
}
