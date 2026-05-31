import { TOOLS } from "@/lib/tools";
export const metadata = TOOLS.split.metadata;
export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
