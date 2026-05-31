import { TOOLS } from "@/lib/tools";
import { SplitClient } from "./SplitClient";

export const metadata = TOOLS.split.metadata;

export default function SplitPage() {
  return <SplitClient />;
}
