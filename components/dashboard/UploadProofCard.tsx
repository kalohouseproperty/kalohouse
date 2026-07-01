import { CheckCircle2, FileVideo, ImagePlus, StickyNote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function UploadProofCard() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Verification proof</p>
        <h3 className="mt-2 font-serif text-2xl text-text-primary">Upload site visit evidence</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["4 images", ImagePlus],
          ["1 video", FileVideo],
          ["Notes", StickyNote]
        ].map(([label, Icon]) => (
          <div key={label as string} className="rounded-2xl border border-dashed border-white/14 bg-white/[0.03] p-5">
            <Icon className="mb-4 size-6 text-gold-light" />
            <p className="font-semibold text-text-primary">{label as string}</p>
            <p className="mt-2 text-sm text-text-secondary">Required before approval</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button>
          <CheckCircle2 className="size-4" />
          Approve
        </Button>
        <Button variant="danger">Reject</Button>
      </div>
    </Card>
  );
}
