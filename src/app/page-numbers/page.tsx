import { TOOLS } from "@/lib/tools";
import { PageNumbersClient } from "./PageNumbersClient";

export const metadata = TOOLS["page-numbers"].metadata;

export default function PageNumbersPage() {
  return <PageNumbersClient />;
}
