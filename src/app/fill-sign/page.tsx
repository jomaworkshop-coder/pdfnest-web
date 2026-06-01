import { TOOLS } from "@/lib/tools";
import { FillSignClient } from "./FillSignClient";

export const metadata = TOOLS["fill-sign"].metadata;

export default function FillSignPage() {
  return <FillSignClient />;
}
