import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function VerifiedBadge() {
  return (
    <Badge>
      <ShieldCheck className="size-3.5" />
      Verified
    </Badge>
  );
}
