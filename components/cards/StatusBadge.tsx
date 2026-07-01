import type { PropertyStatus } from "@/types/property";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<PropertyStatus, "success" | "warning" | "danger" | "info" | "muted"> = {
  "Pending Verification": "warning",
  "Agent Assigned": "info",
  Verified: "success",
  Published: "success",
  Rejected: "danger"
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
