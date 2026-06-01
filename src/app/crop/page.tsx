import { TOOLS } from "@/lib/tools";
import { CropClient } from "./CropClient";

export const metadata = TOOLS.crop.metadata;

export default function CropPage() {
  return <CropClient />;
}
