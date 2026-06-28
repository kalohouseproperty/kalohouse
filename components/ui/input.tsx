import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function Input({ className, label, id, ...props }: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-text-primary outline-none transition placeholder:text-muted-text focus:border-gold/50 focus:ring-2 focus:ring-gold/15",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
