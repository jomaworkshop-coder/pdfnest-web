import { TOOLS } from "@/lib/tools";
import { MergeClient } from "./MergeClient";

export const metadata = TOOLS.merge.metadata;

export default function MergePage() {
  return <MergeClient />;
}
