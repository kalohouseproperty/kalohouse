import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#07111F] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative size-12 overflow-hidden rounded-full border-2 border-gold/30 shadow-[0_0_15px_rgba(201,166,70,0.15)]">
              <Image src="/kalohouse.png" alt="Kalohouse Logo" fill className="object-cover" />
            </div>
            <span className="font-serif text-2xl text-white tracking-tight">Kalohouse</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-8">
            Rwanda&apos;s most trusted real estate marketplace. We provide verified property listings with secure payment protection and local agent support.
          </p>
          <div className="flex gap-4">
            {/* Social Icons with interactions */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:bg-white/10 transition-all cursor-pointer group hover:-translate-y-1">
                <div className="size-2 rounded-full bg-text-secondary group-hover:bg-gold transition-colors" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:pl-8">
          <h4 className="font-bold text-gold uppercase tracking-[0.2em] text-[11px] mb-8">Company</h4>
          <ul className="space-y-4 text-sm text-text-secondary font-medium">
            <li><Link href="/about" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />About Us</Link></li>
            <li><Link href="/about#contact" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Contact Support</Link></li>
            <li><Link href="/properties" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Browse Listings</Link></li>
            <li><Link href="/map" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Operation Map</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gold uppercase tracking-[0.2em] text-[11px] mb-8">Trust & Safety</h4>
          <ul className="space-y-4 text-sm text-text-secondary font-medium">
            <li><Link href="/auth" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Agent Verification</Link></li>
            <li><Link href="#" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Buyer Protection</Link></li>
            <li><Link href="#" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Escrow Services</Link></li>
            <li><Link href="#" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gold uppercase tracking-[0.2em] text-[11px] mb-8">Legal</h4>
          <ul className="space-y-4 text-sm text-text-secondary font-medium">
            <li><Link href="#" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Cookie Settings</Link></li>
            <li><Link href="#" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Anti-Fraud</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-text-secondary/40">
        <p>© 2026 NYUMBANI MARKETPLACE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
            <span>KIGALI, RWANDA</span>
            <span>SECURED BY TRUST OPS</span>
        </div>
      </div>
    </footer>
  );
}
