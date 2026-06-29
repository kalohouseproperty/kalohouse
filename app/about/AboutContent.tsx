"use client";

import { ShieldCheck, Users, Mail, Phone, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import Image from "next/image";
import { ContactForm } from "./ContactForm";
import { useKalohouse } from "@/components/providers/KalohouseProvider";

export function AboutContent() {
  const { t } = useKalohouse();

  const stats = [
    { label: t("verifiedListingsStat"), value: "1,200+" },
    { label: t("activeAgentsStat"), value: "85+" },
    { label: t("sectorsCoveredStat"), value: "100%" },
    { label: t("happyClientsStat"), value: "5k+" },
  ];

  const missionItems = [
    { icon: ShieldCheck, title: t("verifiedProperties"), desc: t("verifiedPropertiesDesc") },
    { icon: Users, title: t("communityDriven"), desc: t("communityDrivenDesc") },
    { icon: Building2, title: t("securePayments"), desc: t("securePaymentsDesc") },
  ];

  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            {t("aboutHeroTitle")}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            {t("aboutHeroSubtitle")}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="text-4xl font-bold text-gold mb-2 transition-transform group-hover:scale-110 duration-300">{stat.value}</p>
              <p className="text-sm uppercase tracking-widest text-text-secondary font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 bg-soft-bg/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-4xl mb-6">{t("ourMission")}</h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                {t("aboutMissionDesc")}
              </p>
            </div>
            
            <div className="grid gap-6">
              {missionItems.map((item) => (
                <div key={item.title} className="flex gap-4 p-6 glass-card rounded-2xl border border-white/5 hover:border-gold/30 transition-colors">
                  <div className="size-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <item.icon className="size-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark/80 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1689013398932-b576a11e07a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2lnYWxpJTIwaG91c2VzfGVufDB8fDB8fHww"
              alt="Kigali Real Estate"
              width={600}
              height={400}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <p className="text-white font-serif text-2xl italic">&quot;{t("innovatingPropertyMarket")}&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="font-serif text-4xl mb-6">{t("getInTouch")}</h2>
                <p className="text-text-secondary">{t("contactDescription")}</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                    <Mail className="size-4 text-gold" />
                  </div>
                  <span className="text-text-secondary group-hover:text-white transition-colors">dushimimanaelie@kalohouse.com</span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                    <Phone className="size-4 text-gold" />
                  </div>
                  <span className="text-text-secondary group-hover:text-white transition-colors">+250 780 827 005</span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                    <MapPin className="size-4 text-gold" />
                  </div>
                  <span className="text-text-secondary group-hover:text-white transition-colors">Kigali Heights, Kigali, Rwanda</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 sm:p-12 border border-white/10 bg-main-bg/50 backdrop-blur-xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-5xl glass-card rounded-[3rem] p-12 sm:p-20 text-center border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <h2 className="font-serif text-4xl sm:text-5xl mb-8 relative z-10">{t("readyFindDreamHome")}</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/properties">{t("browseHomes")}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/auth">{t("createAccount")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
