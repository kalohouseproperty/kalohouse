"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

function Select({ className, label, children, value, onChange, disabled }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});
  const options = React.useMemo(() => getOptions(children), [children]);
  const selectedValue = String(value ?? options[0]?.value ?? "");
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0];

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = Math.min(288, options.length * 44 + 8); // max-h-72 = 288px
    const top = spaceBelow >= menuHeight ? rect.bottom + 4 : rect.top - menuHeight - 4;
    setMenuStyle({
      position: "fixed",
      left: rect.left,
      top,
      width: rect.width,
      zIndex: 9999,
    });
  }, [options.length]);

  React.useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [open, updatePosition]);

  const choose = (nextValue: string) => {
    const event = {
      target: { value: nextValue },
      currentTarget: { value: nextValue }
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange?.(event);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative grid gap-2 text-sm text-text-secondary">
      {label ? <span>{label}</span> : null}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-2xl border border-white/10 bg-card-bg px-4 text-left text-sm text-text-primary outline-none transition hover:border-gold/35 focus:border-gold/50 focus:ring-2 focus:ring-gold/15 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span className="truncate">{selectedOption?.label ?? "Select"}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-text transition", open && "rotate-180 text-gold")} />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div ref={menuRef} style={menuStyle} data-select-portal="true" className="max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-card-bg p-1 shadow-2xl shadow-black/40">
              {options.map((option) => (
                <button
                  key={`${option.value}-${option.label}`}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => choose(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-text-secondary transition hover:bg-hover-bg hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40",
                    option.value === selectedValue && "bg-gold/10 text-gold-light"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === selectedValue ? <Check className="size-4 shrink-0" /> : null}
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

function getOptions(children: React.ReactNode): SelectOption[] {
  return React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => {
      const props = child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
      const label = typeof props.children === "string" ? props.children : String(props.value ?? "");

      return {
        value: String(props.value ?? label),
        label,
        disabled: props.disabled
      };
    });
}

export { Select };
