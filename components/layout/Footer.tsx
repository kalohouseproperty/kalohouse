"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useKalohouse } from "@/components/providers/KalohouseProvider";

export function Footer() {
  const { t } = useKalohouse();
  return (
    <footer className="border-t border-white/8 bg-main-bg px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative size-12 overflow-hidden rounded-full border-2 border-gold/30 shadow-[0_0_15px_rgba(201,166,70,0.15)]">
              <Image src="/kalohouse-v2.png" alt="Kalohouse Logo" fill className="object-cover" />
            </div>
            <span className="font-serif text-2xl text-white tracking-tight">Kalohouse</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-8">
            {t("footerDescription")}
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
          <h4 className="font-bold text-gold uppercase tracking-[0.2em] text-[11px] mb-8">{t("company")}</h4>
          <ul className="space-y-4 text-sm text-text-secondary font-medium">
            <li><Link href="/about" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("aboutUs")}</Link></li>
            <li><Link href="/about#contact" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("contactSupport")}</Link></li>
            <li><Link href="/properties" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("browseListings")}</Link></li>
            <li><Link href="/map" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("operationMap")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gold uppercase tracking-[0.2em] text-[11px] mb-8">{t("trustAndSafety")}</h4>
          <ul className="space-y-4 text-sm text-text-secondary font-medium">
            <li><Link href="/auth" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("agentVerification")}</Link></li>
            <li><Link href="/buyer-protection" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("buyerProtection")}</Link></li>
            <li><Link href="/escrow-services" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("escrowServices")}</Link></li>
            <li><Link href="/refund-policy" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("refundPolicy")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gold uppercase tracking-[0.2em] text-[11px] mb-8">{t("legal")}</h4>
          <ul className="space-y-4 text-sm text-text-secondary font-medium">
            <li><Link href="/terms-of-service" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("termsOfService")}</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("privacyPolicy")}</Link></li>
            <li><Link href="/cookie-settings" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("cookieSettings")}</Link></li>
            <li><Link href="/anti-fraud" className="hover:text-gold transition-all flex items-center gap-2 group"><div className="w-0 h-[1px] bg-gold transition-all group-hover:w-3" />{t("antiFraud")}</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-text-secondary/40">
        <p>{t("copyright")}</p>
        <div className="flex gap-6 items-center flex-wrap justify-center">
            <span>{t("kigaliRwanda")}</span>
            <span>{t("protectedBy")}</span>
            <span className="w-px h-3 bg-white/10" />
            <a
              href="https://2moretechs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group/dev inline-flex items-center gap-1.5 hover:text-gold transition-colors duration-300"
            >
              <span>{t("craftedBy")}</span>
              <div className="relative h-4 w-auto rounded overflow-hidden">
                <Image src="/2moretechs.png" alt="2MoreTechs" width={40} height={16} className="object-contain h-4 w-auto" />
              </div>
              <span className="text-gold">2MoreTechs</span>
            </a>
            <a
              href="mailto:admin@2moretechs.com"
              className="group/email inline-flex items-center gap-1 hover:text-gold transition-colors duration-300"
            >
              <svg className="size-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>admin@2moretechs.com</span>
            </a>
        </div>
      </div>
    </footer>
  );
}
