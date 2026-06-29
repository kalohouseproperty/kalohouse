"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendContactMessage } from "@/app/actions/contact";
import { useKalohouse } from "@/components/providers/KalohouseProvider";

export function ContactForm() {
  const { t } = useKalohouse();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await sendContactMessage(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">{t("firstName")}</label>
          <Input
            type="text"
            className="bg-white/5 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">{t("lastName")}</label>
          <Input
            type="text"
            className="bg-white/5 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">{t("emailAddress")}</label>
        <Input
          type="email"
          className="bg-white/5 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">{t("message")}</label>
        <textarea
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors resize-none"
          placeholder={t("messagePlaceholder")}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>

      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-16 rounded-[1.8rem] bg-gold hover:bg-gold-light text-navy-dark font-bold text-lg shadow-xl shadow-gold/20 transition-all hover:scale-[1.01] active:scale-95"
      >
        {isLoading ? t("sending") : t("sendMessage")}
      </Button>
    </form>
  );
}
