"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export function Modal({
  open,
  title,
  children,
  onClose,
  className
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-main-bg/78 p-4 backdrop-blur-sm">
      <div className={cn("glass-card max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl", className)}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-card-bg/95 p-5 backdrop-blur">
          <h2 className="font-serif text-2xl text-text-primary">{title}</h2>
          <Button variant="secondary" size="icon" onClick={onClose} aria-label="Close modal">
            <X className="size-5" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onClose
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="leading-7 text-text-secondary">{message}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
