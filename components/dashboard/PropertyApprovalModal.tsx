"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/models";

interface PropertyApprovalModalProps {
  property: Property;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function PropertyApprovalModal({
  property,
  onConfirm,
  onCancel,
  isLoading,
}: PropertyApprovalModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setError("");
      await onConfirm(reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject property");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-1">Reject Property</h3>
          <p className="text-sm text-muted-text">{property.title}</p>
        </div>

        {/* Reason Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Rejection Reason *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you are rejecting this property..."
            disabled={isLoading}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-muted-text focus:outline-none focus:border-gold/50 resize-none"
            rows={4}
          />
          <p className="text-xs text-muted-text mt-1">
            {reason.length}/500 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            variant="ghost"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="flex-1 bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-900/50"
          >
            {isLoading ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      </div>
    </div>
  );
}
