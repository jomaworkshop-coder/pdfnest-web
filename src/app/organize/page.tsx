import { TOOLS } from "@/lib/tools";
import { OrganizeClient } from "./OrganizeClient";

export const metadata = TOOLS.organize.metadata;

export default function OrganizePage() {
  return <OrganizeClient />;
}
