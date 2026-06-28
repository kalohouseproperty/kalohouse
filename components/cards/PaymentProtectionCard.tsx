import { motion } from "framer-motion";
import { BadgeCheck, CreditCard, RotateCcw } from "lucide-react";

import { Card } from "@/components/ui/card";

const items = [
  {
    icon: CreditCard,
    title: "Pay before visit",
    copy: "Client funds are held by Kalohouse until the visit outcome is confirmed."
  },
  {
    icon: BadgeCheck,
    title: "Verified visit",
    copy: "Only agent-verified homes can receive protected visit payments."
  },
  {
    icon: RotateCcw,
    title: "Refund protection",
    copy: "If the client rejects the property after visiting, refund is processed minus commission."
  }
];

export function PaymentProtectionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Payment protection</p>
          <h3 className="mt-2 font-serif text-2xl text-text-primary">A safer way to visit properties</h3>
        </div>
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gold/12 text-gold-light">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-text-primary">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-text-secondary">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
