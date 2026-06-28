import { ShieldCheck, Users, Mail, Phone, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <LandingNavbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <h1 className="font-serif text-5xl sm:text-6xl mb-6 leading-tight">
            The most trusted <span className="text-gold">real estate</span> marketplace in Rwanda.
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Kalohouse is dedicated to bringing transparency, security, and efficiency to the Rwandan property market through technology and verified local expertise.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Verified Listings", value: "1,200+" },
            { label: "Active Agents", value: "85+" },
            { label: "Sectors Covered", value: "100%" },
            { label: "Happy Clients", value: "5k+" },
          ].map((stat) => (
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
              <h2 className="font-serif text-4xl mb-6">Our Mission</h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                At Kalohouse, we believe that finding a home should be a joyful experience, not a stressful one. We are building the infrastructure for trust in Rwandan real estate.
              </p>
            </div>
            
            <div className="grid gap-6">
              {[
                { icon: ShieldCheck, title: "Verified Properties", desc: "Every single listing on our platform is physically verified by an authorized sector agent." },
                { icon: Users, title: "Community Driven", desc: "We empower local agents and property owners with tools to reach verified buyers." },
                { icon: Building2, title: "Secure Payments", desc: "Our platform ensures that payments are only released when milestones are met." }
              ].map((item) => (
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
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1000"
                alt="Kigali Real Estate"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                />
            <div className="absolute bottom-8 left-8 z-20">
              <p className="text-white font-serif text-2xl italic">&quot;Innovating Rwanda&apos;s Property Market&quot;</p>
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
                <h2 className="font-serif text-4xl mb-6">Get in Touch</h2>
                <p className="text-text-secondary">Have questions about a listing or want to partner with us? Our team is here to help.</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                    <Mail className="size-4 text-gold" />
                  </div>
                  <span className="text-text-secondary group-hover:text-white transition-colors">support@kalohouse.rw</span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                    <Phone className="size-4 text-gold" />
                  </div>
                  <span className="text-text-secondary group-hover:text-white transition-colors">+250 788 000 000</span>
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
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">First Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">Last Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2 mb-8">
                <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">Message</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors resize-none" placeholder="How can we help you?" />
              </div>
              <Button className="w-full h-16 rounded-[1.8rem] bg-gold hover:bg-gold-light text-navy-dark font-bold text-lg shadow-xl shadow-gold/20 transition-all hover:scale-[1.01] active:scale-95">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-5xl glass-card rounded-[3rem] p-12 sm:p-20 text-center border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <h2 className="font-serif text-4xl sm:text-5xl mb-8 relative z-10">Ready to find your <span className="text-gold">dream home</span>?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/properties">Browse Properties</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-16 px-10 rounded-2xl text-lg">
              <Link href="/auth">Create an Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
