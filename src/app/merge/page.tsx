import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { mergePdfs } from "@/lib/engines/merge";

export const metadata = TOOLS.merge.metadata;

export default function MergePage() {
  return <ToolShell tool={TOOLS.merge} engine={mergePdfs} defaultOpts={{}} />;
}
