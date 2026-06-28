import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

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
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:bg-gold/10 transition-all group hover:-translate-y-1">
              <FaFacebookF className="size-4 text-text-secondary group-hover:text-gold transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:bg-gold/10 transition-all group hover:-translate-y-1">
              <FaInstagram className="size-4 text-text-secondary group-hover:text-gold transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:bg-gold/10 transition-all group hover:-translate-y-1">
              <FaLinkedinIn className="size-4 text-text-secondary group-hover:text-gold transition-colors" />
            </a>
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
            <li><Link href="/buyer-protection" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Buyer Protection</Link></li>
            <li><Link href="/escrow-services" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Escrow Services</Link></li>
            <li><Link href="/refund-policy" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />Refund Policy</Link></li>
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
        <div className="flex gap-8 items-center">
            <span>KIGALI, RWANDA</span>
            <span>SECURED BY TRUST OPS</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-8 flex flex-col items-center gap-4 animate-fade-in-up">
        <a
          href="https://2moretechs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 px-8 py-4 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 hover:from-gold/10 hover:via-gold/20 hover:to-gold/10 transition-all duration-500 shadow-[0_0_20px_rgba(201,166,70,0.08)] hover:shadow-[0_0_40px_rgba(201,166,70,0.2)] animate-glow-pulse"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-text-secondary/70 group-hover:text-white transition-colors duration-300">
            Crafted by
          </span>
          <div className="relative h-7 w-auto rounded-lg overflow-hidden animate-breathe">
            <Image
              src="/2moretechs.png"
              alt="2MoreTechs Logo"
              width={100}
              height={28}
              className="object-contain h-7 w-auto"
            />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold group-hover:text-gold-light transition-colors duration-300 drop-shadow-[0_0_8px_rgba(201,166,70,0.4)]">
            2MoreTechs
          </span>
          <svg
            className="w-4 h-4 text-gold/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <a
          href="mailto:hello@2moretechs.com"
          className="text-[10px] uppercase tracking-[0.15em] font-semibold text-text-secondary/40 hover:text-gold transition-colors duration-300"
        >
          Contact 2MoreTechs
        </a>
      </div>
    </footer>
  );
}
