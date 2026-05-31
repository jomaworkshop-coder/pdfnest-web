import { TOOLS } from "@/lib/tools";
import { RotateClient } from "./RotateClient";

export const metadata = TOOLS.rotate.metadata;

export default function RotatePage() {
  return <RotateClient />;
}
