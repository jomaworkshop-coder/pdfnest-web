import { TOOLS } from "@/lib/tools";
export const metadata = TOOLS.merge.metadata;
export default function MergeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
