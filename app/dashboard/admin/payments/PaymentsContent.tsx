"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";

interface PaymentsContentProps {
  payments: any[];
}

export function PaymentsContent({ payments }: PaymentsContentProps) {
  return (
    <DashboardShell title="Payments" role="admin">
      <h2 className="text-2xl font-serif text-white mb-6">Payment Overview</h2>
      <div className="grid gap-4">
        {payments.length > 0 ? payments.map((payment) => (
          <Card key={payment.id} className="glass-card p-4 flex justify-between items-center bg-white/5 border-white/5">
            <div>
              <p className="font-semibold text-white">{formatMoney(payment.finalDisplayPrice)}</p>
              <p className="text-sm text-muted-text">Status: {payment.status}</p>
            </div>
            <span className="text-sm text-gold">{payment.status}</span>
          </Card>
        )) : (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                <p className="text-muted-text italic">No payment history recorded.</p>
            </div>
        )}
      </div>
    </DashboardShell>
  );
}
