import { TOOLS } from "@/lib/tools";
import { WatermarkClient } from "./WatermarkClient";

export const metadata = TOOLS.watermark.metadata;

export default function WatermarkPage() {
  return <WatermarkClient />;
}
