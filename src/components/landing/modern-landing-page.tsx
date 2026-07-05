"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type SchoolWebsiteConfig } from "@/lib/mock/landing-page-data"
import { cn } from "@/lib/utils"
import {
  Menu, X, ChevronRight, ArrowRight, Star, MapPin, Phone, Mail,
  CheckCircle2, Calendar, Award, Users, GraduationCap, BookOpen,
  Facebook, Instagram, Youtube, Play, Download, FileText,
} from "lucide-react"

export function ModernLandingPage({ config }: { config: SchoolWebsiteConfig }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const primary = config.theme.primaryColor

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "admissions", label: "Admissions" },
    { id: "academics", label: "Academics" },
    { id: "campus", label: "Campus" },
    { id: "faculty", label: "Faculty" },
    { id: "news", label: "News" },
    { id: "contact", label: "Contact" },
  ]

  const scrollTo = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: config.theme.fontFamily }}>
      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full">
        <div className="glass-strong border-b border-white/10">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${primary}, ${config.theme.secondaryColor})` }}>
                {config.logo}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">{config.shortName}</p>
                <p className="text-[10px] text-muted-foreground">Senior Secondary School</p>
              </div>
            </div>
            <div className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", activeSection === item.id ? "text-white" : "text-muted-foreground hover:text-foreground")} style={activeSection === item.id ? { background: primary } : {}}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => scrollTo("admissions")} className="hidden rounded-xl px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 sm:inline-flex" style={{ background: `linear-gradient(135deg, ${primary}, ${config.theme.secondaryColor})` }}>Apply Now</button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 lg:hidden">{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden">
                <div className="space-y-1 px-4 py-3">
                  {navItems.map((item) => (<button key={item.id} onClick={() => scrollTo(item.id)} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-accent">{item.label}</button>))}
                  <button onClick={() => scrollTo("admissions")} className="mt-2 w-full rounded-xl py-2.5 text-sm font-bold text-white" style={{ background: primary }}>Apply Now</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}15, ${config.theme.secondaryColor}10, ${config.theme.accentColor}05)` }} />
          <div className="aurora-blob absolute -left-40 -top-40 h-[40rem] w-[40rem] rounded-full opacity-20 blur-3xl" style={{ background: primary }} />
          <div className="aurora-blob absolute -right-40 top-1/3 h-[35rem] w-[35rem] rounded-full opacity-15 blur-3xl" style={{ background: config.theme.secondaryColor, animationDelay: "-6s" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              {config.admission.open && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold" style={{ borderColor: `${primary}40`, background: `${primary}10`, color: primary }}>
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: primary }} /><span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: primary }} /></span>
                  Admissions Open — {config.admission.session}
                </motion.div>
              )}
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight lg:text-6xl">
                {config.schoolName.split(" ").slice(0, -2).join(" ")}<br />
                <span style={{ background: `linear-gradient(135deg, ${primary}, ${config.theme.secondaryColor})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{config.schoolName.split(" ").slice(-2).join(" ")}</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">{config.motto}</p>
              <p className="mt-2 text-sm text-muted-foreground">{config.academic.board} School • Est. {config.academic.established} • {config.academic.medium} Medium</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => scrollTo("admissions")} className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${primary}, ${config.theme.secondaryColor})` }}>Apply for Admission <ArrowRight className="h-4 w-4" /></button>
                <button onClick={() => scrollTo("campus")} className="inline-flex items-center gap-2 rounded-xl border-2 px-6 py-3 text-sm font-bold transition-colors hover:bg-accent" style={{ borderColor: `${primary}40` }}><Play className="h-4 w-4" /> Explore Campus</button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className="glass-strong rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {config.stats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="text-center">
                      <p className="text-3xl font-bold" style={{ color: primary }}>{stat.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-center gap-1 border-t border-border/50 pt-4">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  <span className="ml-2 text-xs text-muted-foreground">Rated by 980+ parents</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT / PRINCIPAL */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl opacity-20" style={{ background: primary }} />
                <div className="relative flex aspect-square max-w-sm items-center justify-center rounded-3xl text-6xl font-bold text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${primary}, ${config.theme.secondaryColor})` }}>{config.principal.photo}</div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Principal's Message</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">{config.principal.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{config.principal.qualification}</p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">{config.principal.message}</p>
              <div className="mt-6 flex items-center gap-3"><div className="h-0.5 w-12 rounded-full" style={{ background: primary }} /><span className="text-sm font-medium" style={{ color: primary }}>{config.principal.name}</span></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ADMISSIONS */}
      <section id="admissions" className="py-20" style={{ background: `${primary}08` }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center"><p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Admissions</p><h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Admissions Open for {config.admission.session}</h2><p className="mt-3 text-muted-foreground">Apply before {config.admission.deadline}</p></div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl border border-border/50 bg-white p-8 shadow-lg">
              <h3 className="text-xl font-bold">Admission Process</h3>
              <div className="mt-6 space-y-4">
                {config.admission.process.map((step, i) => (
                  <div key={i} className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: primary }}>{i + 1}</div><p className="text-sm font-medium pt-1">{step}</p></div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl border-2 p-8 shadow-lg" style={{ borderColor: `${primary}30` }}>
              <h3 className="text-xl font-bold">Fee Structure</h3>
              <p className="mt-1 text-sm text-muted-foreground">Annual fees (inclusive of all charges)</p>
              <div className="mt-6 space-y-3">
                {config.admission.feeStructure.map((fee, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-border/50 p-3"><span className="text-sm font-medium">{fee.class}</span><span className="text-sm font-bold" style={{ color: primary }}>₹{fee.amount.toLocaleString("en-IN")}</span></div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${primary}, ${config.theme.secondaryColor})` }}>Start Application</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section id="academics" className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center"><p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Campus & Facilities</p><h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">World-Class Infrastructure</h2></div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {config.facilities.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: `${primary}10` }}>{f.icon}</div>
                <h3 className="mt-4 text-base font-bold">{f.name}</h3><p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-20" style={{ background: `${primary}08` }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center"><p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Our Pride</p><h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Achievements & Awards</h2></div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {config.achievements.map((a, i) => (
              <motion.div key={a.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between"><span className="text-3xl">{a.icon}</span><span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: `${primary}10`, color: primary }}>{a.year}</span></div>
                <h3 className="mt-3 text-base font-bold">{a.title}</h3><p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="campus" className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center"><p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Campus Life</p><h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Photo Gallery</h2></div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {config.gallery.map((g, i) => (
              <motion.div key={g.title} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }} whileHover={{ y: -4 }} className={cn("group relative overflow-hidden rounded-2xl", i % 5 === 0 && "col-span-2 row-span-2")}>
                <div className="flex aspect-square items-center justify-center text-center transition-transform group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${primary}${20 + (i * 10) % 30}, ${config.theme.secondaryColor}${20 + (i * 15) % 30})` }}>
                  <div><p className="px-2 text-sm font-bold text-white">{g.title}</p><p className="mt-0.5 text-[10px] text-white/80">{g.category}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FACULTY */}
      <section id="faculty" className="py-20" style={{ background: `${primary}08` }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center"><p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Our Team</p><h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Experienced Faculty</h2></div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {config.faculty.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} className="rounded-2xl border border-border/50 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-md" style={{ background: `linear-gradient(135deg, ${primary}, ${config.theme.secondaryColor})` }}>{f.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <h3 className="mt-3 text-sm font-bold">{f.name}</h3><p className="text-xs" style={{ color: primary }}>{f.role}</p><p className="mt-1 text-xs text-muted-foreground">{f.subject}</p><p className="text-[10px] text-muted-foreground/70">{f.qualification}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center"><p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Parent Voices</p><h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">What Parents Say</h2></div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {config.testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
                <div className="flex gap-1">{Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3"><div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: primary }}>{t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><p className="text-xs font-bold">{t.name}</p><p className="text-[10px] text-muted-foreground">{t.role}</p></div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="py-20" style={{ background: `${primary}08` }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center"><p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Latest Updates</p><h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">News & Events</h2></div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {config.news.map((n, i) => (
              <motion.div key={n.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm">
                <div className="h-32" style={{ background: `linear-gradient(135deg, ${primary}30, ${config.theme.secondaryColor}30)` }}><div className="flex h-full items-center justify-center text-3xl">📰</div></div>
                <div className="p-5"><div className="flex items-center gap-2"><span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${primary}10`, color: primary }}>{n.category}</span><span className="text-[10px] text-muted-foreground">{n.date}</span></div><h3 className="mt-2 text-sm font-bold">{n.title}</h3><p className="mt-1 text-xs text-muted-foreground">{n.excerpt}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>Get in Touch</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Contact Us</h2>
              <p className="mt-3 text-muted-foreground">We'd love to hear from you. Visit us, call us, or send a message.</p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${primary}10` }}><MapPin className="h-5 w-5" style={{ color: primary }} /></div><div><p className="text-sm font-medium">Address</p><p className="text-sm text-muted-foreground">{config.contact.address}</p></div></div>
                <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${primary}10` }}><Phone className="h-5 w-5" style={{ color: primary }} /></div><div><p className="text-sm font-medium">Phone</p><p className="text-sm text-muted-foreground">{config.contact.phone}</p></div></div>
                <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${primary}10` }}><Mail className="h-5 w-5" style={{ color: primary }} /></div><div><p className="text-sm font-medium">Email</p><p className="text-sm text-muted-foreground">{config.contact.email}</p></div></div>
              </div>
              <div className="mt-6 flex gap-2">
                {config.social.facebook && <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 hover:bg-accent"><Facebook className="h-4 w-4" /></a>}
                {config.social.instagram && <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 hover:bg-accent"><Instagram className="h-4 w-4" /></a>}
                {config.social.youtube && <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 hover:bg-accent"><Youtube className="h-4 w-4" /></a>}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="rounded-3xl border border-border/50 bg-white p-8 shadow-lg">
                <h3 className="text-xl font-bold">Send a Message</h3>
                <div className="mt-6 space-y-4">
                  <input placeholder="Your Name" className="h-11 w-full rounded-xl border border-border/60 px-4 text-sm outline-none focus:border-primary" />
                  <input type="email" placeholder="Email Address" className="h-11 w-full rounded-xl border border-border/60 px-4 text-sm outline-none focus:border-primary" />
                  <input placeholder="Phone Number" className="h-11 w-full rounded-xl border border-border/60 px-4 text-sm outline-none focus:border-primary" />
                  <textarea rows={4} placeholder="Your Message" className="w-full resize-none rounded-xl border border-border/60 p-4 text-sm outline-none focus:border-primary" />
                  <button className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${primary}, ${config.theme.secondaryColor})` }}>Send Message</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white" style={{ background: primary }}>{config.logo}</div><div><p className="text-sm font-bold">{config.shortName}</p><p className="text-[10px] text-white/60">Senior Secondary School</p></div></div>
              <p className="mt-4 text-sm text-white/60">{config.motto}</p>
            </div>
            <div><p className="text-sm font-bold">Quick Links</p><div className="mt-3 space-y-2">{navItems.map((n) => <button key={n.id} onClick={() => scrollTo(n.id)} className="block text-sm text-white/60 hover:text-white">{n.label}</button>)}</div></div>
            <div><p className="text-sm font-bold">Contact</p><div className="mt-3 space-y-2 text-sm text-white/60"><p>{config.contact.address}</p><p>{config.contact.phone}</p><p>{config.contact.email}</p></div></div>
            <div><p className="text-sm font-bold">Login Portals</p><div className="mt-3 space-y-2">{["Student Login", "Parent Login", "Teacher Login", "Admin Login"].map((l) => <button key={l} className="block w-full rounded-lg border border-white/10 px-3 py-1.5 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white">{l}</button>)}</div></div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row"><p className="text-xs text-white/40">© 2025 {config.schoolName}. All rights reserved. • {config.academic.affiliation}</p><p className="text-xs text-white/40">Powered by SCHOLARIO-OS</p></div>
        </div>
      </footer>
    </div>
  )
}
