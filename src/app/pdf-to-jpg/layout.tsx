import { TOOLS } from "@/lib/tools";
export const metadata = TOOLS["pdf-to-jpg"].metadata;
export default function PdfToJpgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
