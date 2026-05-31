"use client";
import { ToolShell } from "@/components/ToolShell";
import { TOOLS } from "@/lib/tools";
import { mergePdfs } from "@/lib/engines/merge";

export default function MergePage() {
  return <ToolShell tool={TOOLS.merge} engine={mergePdfs} defaultOpts={{}} />;
}
