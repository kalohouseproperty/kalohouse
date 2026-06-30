export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";


import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  return (
    <DashboardShell title="Account Settings" role="admin">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="glass-card p-8 border border-white/10">
          <h2 className="text-xl font-serif text-white mb-6">Security Settings</h2>
          <div className="space-y-4">
            <label className="block text-sm text-muted-text">Current Password</label>
            <Input type="password" placeholder="Enter current password" className="bg-white/5 border-white/10" />
            <label className="block text-sm text-muted-text">New Password</label>
            <Input type="password" placeholder="Enter new password" className="bg-white/5 border-white/10" />
            <label className="block text-sm text-muted-text">Confirm New Password</label>
            <Input type="password" placeholder="Confirm new password" className="bg-white/5 border-white/10" />
            <Button className="mt-4 bg-gold text-main-bg font-bold hover:bg-gold-light">Update Password</Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
