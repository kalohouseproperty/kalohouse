"use client";
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";



import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { User, Camera } from "lucide-react";
import Image from "next/image";

export default function AdminProfilePage() {
  const { currentUser } = useKalohouse();
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardShell title="View Profile" role="admin">
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card p-8 border border-white/10">
          <h2 className="text-xl font-serif text-white mb-6">Profile Details</h2>
          <div className="flex items-center gap-8 mb-8">
            <div className="relative size-28 rounded-full bg-navy-primary border-4 border-gold/20 flex items-center justify-center overflow-visible shadow-xl">
                {preview ? (
                    <Image src={preview} alt="Profile" fill className="object-cover rounded-full" />
                ) : (
                    <User className="size-16 text-gold/50" />
                )}
                <label className="absolute -bottom-2 -right-2 p-3 bg-gold rounded-full text-navy-primary cursor-pointer hover:bg-gold-light transition shadow-lg border-4 border-[#07111F]">
                    <Camera className="size-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-serif text-white">Profile Photo</h2>
                <p className="text-sm text-muted-text">Recommended: 400x400px, PNG or JPG.</p>
                <Button variant="ghost" className="w-fit text-gold hover:text-gold-light">Delete photo</Button>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm text-muted-text">Full Name</label>
            <Input defaultValue={currentUser?.name || "Admin"} className="bg-white/5 border-white/10" />
            <label className="block text-sm text-muted-text">Email</label>
            <Input defaultValue={currentUser?.email || "admin@kalohouse.rw"} className="bg-white/5 border-white/10" disabled />
            <Button className="mt-4 bg-gold text-navy-primary font-bold hover:bg-gold-light">Save Changes</Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
