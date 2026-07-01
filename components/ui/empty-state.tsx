import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export function EmptyState({ icon: Icon, title, copy }: { icon: LucideIcon; title: string; copy: string }) {
  return (
    <Card className="grid place-items-center p-10 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/5 text-gold-light">
        <Icon className="size-6" />
      </span>
      <h3 className="font-serif text-2xl text-text-primary">{title}</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-text-secondary">{copy}</p>
    </Card>
  );
}
