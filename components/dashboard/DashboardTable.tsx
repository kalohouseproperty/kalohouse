import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/cards/StatusBadge";
import type { PropertyStatus } from "@/types/property";

export function DashboardTable({
  title,
  columns,
  rows
}: {
  title: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 p-5">
        <h3 className="font-serif text-xl text-text-primary">{title}</h3>
        <ArrowUpRight className="size-5 text-gold" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-white/[0.03] text-muted-text">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {rows.map((row) => (
              <tr key={row.join("-")} className="transition hover:bg-white/[0.03]">
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className="px-5 py-4 text-text-secondary">
                    {index === 2 && isStatus(cell) ? <StatusBadge status={cell} /> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function isStatus(value: string): value is PropertyStatus {
  return ["Pending Verification", "Agent Assigned", "Verified", "Published", "Rejected"].includes(value);
}
