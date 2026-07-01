import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

function Textarea({ className, label, id, ...props }: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-muted-text focus:border-gold/50 focus:ring-2 focus:ring-gold/15",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Textarea };
