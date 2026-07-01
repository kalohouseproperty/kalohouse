"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Camera, Save } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { updateProfile } from "@/app/actions/user";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(session?.user?.name || "");
  const [preview, setPreview] = useState<string | undefined>(session?.user?.image || undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const role = (session?.user as any)?.role || "client";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ fullName: fullName.trim(), image: preview });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title="My Profile" role={role as any}>
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card p-8 border border-white/10">
          <h2 className="text-xl font-serif text-white mb-6">Profile Details</h2>

          <div className="flex items-center gap-8 mb-8">
            <div className="relative size-28 rounded-full bg-navy-primary border-4 border-gold/20 flex items-center justify-center overflow-hidden shadow-xl">
              {preview ? (
                <Image src={preview} alt="Profile" fill className="object-cover rounded-full" />
              ) : (
                <User className="size-16 text-gold/50" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-3 bg-gold rounded-full text-navy-primary cursor-pointer hover:bg-gold-light transition shadow-lg border-4 border-[#07111F]"
              >
                <Camera className="size-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white">Profile Photo</h2>
              <p className="text-sm text-muted-text">Recommended: 400x400px, PNG or JPG.</p>
              {preview && (
                <button
                  type="button"
                  onClick={() => { setPreview(undefined); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-xs text-gold hover:text-gold-light mt-1"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-text mb-1">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-text mb-1">Email</label>
              <Input
                value={session?.user?.email || ""}
                className="bg-white/5 border-white/10"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm text-muted-text mb-1">Role</label>
              <Input
                value={role.charAt(0).toUpperCase() + role.slice(1)}
                className="bg-white/5 border-white/10"
                disabled
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || !fullName.trim()}
              className={cn(
                "mt-4 font-bold",
                saved ? "bg-success text-white" : "bg-gold text-navy-primary hover:bg-gold-light"
              )}
            >
              <Save className="size-4 mr-2" />
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
