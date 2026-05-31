import { TOOLS } from "@/lib/tools";
export const metadata = TOOLS["jpg-to-pdf"].metadata;
export default function JpgToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
