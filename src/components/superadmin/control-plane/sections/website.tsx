"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { SCHOOL_WEBSITE, type SchoolWebsiteConfig } from "@/lib/mock/landing-page-data"
import { ModernLandingPage } from "@/components/landing/modern-landing-page"
import { cn } from "@/lib/utils"
import {
  Globe, Eye, Code2, Save, Palette, Layout, Settings, FileText,
  Image, Calendar, Users, Download, Star, Smartphone, Monitor,
} from "lucide-react"
import { toast } from "sonner"

export function WebsiteSection() {
  const [config, setConfig] = useState<SchoolWebsiteConfig>(SCHOOL_WEBSITE)
  const [preview, setPreview] = useState(false)
  const [tab, setTab] = useState<"content" | "design" | "preview">("content")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["content", "design", "preview"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors", tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>
              {t === "content" ? "CMS Content" : t === "design" ? "Theme & Design" : "Live Preview"}
            </button>
          ))}
        </div>
        <button onClick={() => toast.success("Website published! Changes are now live.")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Save className="h-4 w-4" /> Publish Changes
        </button>
      </div>

      {/* Content Tab — CMS */}
      {tab === "content" && (
        <div className="space-y-4">
          <StaggerItem index={0}>
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-4">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Landing Page Engine — CMS</p>
                  <p className="text-xs text-muted-foreground">All content below is dynamically rendered on the school's public website. Changes here instantly update the live site — no code changes required.</p>
                </div>
              </div>
            </div>
          </StaggerItem>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, label: "Homepage", desc: "Hero, stats, CTAs", color: "emerald" },
              { icon: Users, label: "Principal Message", desc: "Name, photo, message", color: "violet" },
              { icon: FileText, label: "About Page", desc: "School history, mission, vision", color: "sky" },
              { icon: Calendar, label: "Events", desc: "Upcoming events & calendar", color: "amber" },
              { icon: Image, label: "Gallery", desc: "12 photos, categories", color: "rose" },
              { icon: FileText, label: "News", desc: "Articles & announcements", color: "teal" },
              { icon: Star, label: "Achievements", desc: "Awards & accolades", color: "orange" },
              { icon: Users, label: "Faculty", desc: "Teacher profiles", color: "pink" },
              { icon: Settings, label: "Admissions", desc: "Process, fees, deadlines", color: "cyan" },
              { icon: Download, label: "Downloads", desc: "Forms, brochures, results", color: "indigo" },
              { icon: FileText, label: "Notices", desc: "Circulars & notifications", color: "lime" },
              { icon: Settings, label: "SEO & Meta", desc: "Title, description, OG tags", color: "slate" },
            ].map((c, i) => {
              const c2 = colorOfHelper(c.color)
              return (
                <StaggerItem key={c.label} index={i + 1}>
                  <button onClick={() => toast.info(`Editing ${c.label}…`)} className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent/30">
                    <div className={cn("rounded-xl p-2.5", c2.soft)}><c.icon className={cn("h-5 w-5", c2.text)} /></div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{c.label}</p><p className="truncate text-xs text-muted-foreground">{c.desc}</p></div>
                    <span className="text-xs text-primary">Edit →</span>
                  </button>
                </StaggerItem>
              )
            })}
          </div>

          {/* Quick stats */}
          <StaggerItem index={13}>
            <SectionCard title="Website Content Summary" subtitle="Current published content">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Gallery Photos", value: config.gallery.length },
                  { label: "Faculty Profiles", value: config.faculty.length },
                  { label: "News Articles", value: config.news.length },
                  { label: "Events", value: config.events.length },
                  { label: "Achievements", value: config.achievements.length },
                  { label: "Testimonials", value: config.testimonials.length },
                  { label: "Facilities", value: config.facilities.length },
                  { label: "Fee Tiers", value: config.admission.feeStructure.length },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border/50 p-3 text-center">
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </StaggerItem>
        </div>
      )}

      {/* Design Tab — Theme */}
      {tab === "design" && (
        <div className="space-y-4">
          <StaggerItem index={0}>
            <SectionCard title="Theme Configuration" subtitle="Colors, fonts & layout — all applied dynamically">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">PRIMARY COLOR</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={config.theme.primaryColor} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, primaryColor: e.target.value } })} className="h-10 w-16 cursor-pointer rounded-lg border border-border/60" />
                    <input value={config.theme.primaryColor} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, primaryColor: e.target.value } })} className="h-10 flex-1 rounded-xl border border-border/70 bg-background/60 px-3 text-sm font-mono outline-none" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">SECONDARY COLOR</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={config.theme.secondaryColor} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, secondaryColor: e.target.value } })} className="h-10 w-16 cursor-pointer rounded-lg border border-border/60" />
                    <input value={config.theme.secondaryColor} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, secondaryColor: e.target.value } })} className="h-10 flex-1 rounded-xl border border-border/70 bg-background/60 px-3 text-sm font-mono outline-none" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">ACCENT COLOR</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={config.theme.accentColor} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, accentColor: e.target.value } })} className="h-10 w-16 cursor-pointer rounded-lg border border-border/60" />
                    <input value={config.theme.accentColor} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, accentColor: e.target.value } })} className="h-10 flex-1 rounded-xl border border-border/70 bg-background/60 px-3 text-sm font-mono outline-none" />
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">FONT FAMILY</label>
                  <select value={config.theme.fontFamily} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, fontFamily: e.target.value } })} className="h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none">
                    <option>Inter</option><option>Poppins</option><option>Roboto</option><option>Open Sans</option><option>Lato</option><option>Montserrat</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">BORDER RADIUS</label>
                  <select value={config.theme.borderRadius} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, borderRadius: e.target.value } })} className="h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none">
                    <option value="0.375rem">Sharp (6px)</option><option value="0.5rem">Subtle (8px)</option><option value="0.75rem">Default (12px)</option><option value="1rem">Round (16px)</option><option value="1.5rem">Very Round (24px)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">TEMPLATE</label>
                  <select value={config.template} onChange={(e) => setConfig({ ...config, template: e.target.value as any })} className="h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none">
                    <option value="modern">Modern (Glass UI)</option><option value="traditional">Traditional (Classic)</option>
                  </select>
                </div>
              </div>
              {/* Color presets */}
              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium text-muted-foreground">QUICK PRESETS</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Emerald", primary: "#10b981", secondary: "#0d9488", accent: "#f59e0b" },
                    { name: "Royal Blue", primary: "#3b82f6", secondary: "#1d4ed8", accent: "#f59e0b" },
                    { name: "Purple", primary: "#8b5cf6", secondary: "#6d28d9", accent: "#ec4899" },
                    { name: "Crimson", primary: "#dc2626", secondary: "#991b1b", accent: "#f59e0b" },
                    { name: "Teal", primary: "#0d9488", secondary: "#0f766e", accent: "#f59e0b" },
                    { name: "Slate", primary: "#475569", secondary: "#1e293b", accent: "#0ea5e9" },
                  ].map((p) => (
                    <button key={p.name} onClick={() => setConfig({ ...config, theme: { ...config.theme, primaryColor: p.primary, secondaryColor: p.secondary, accentColor: p.accent } })} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium hover:bg-accent">
                      <span className="flex gap-0.5"><span className="h-3 w-3 rounded-full" style={{ background: p.primary }} /><span className="h-3 w-3 rounded-full" style={{ background: p.secondary }} /><span className="h-3 w-3 rounded-full" style={{ background: p.accent }} /></span>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>
          </StaggerItem>

          {/* School info */}
          <StaggerItem index={1}>
            <SectionCard title="School Information" subtitle="Basic details shown on the website">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-xs font-medium text-muted-foreground">SCHOOL NAME</label><input value={config.schoolName} onChange={(e) => setConfig({ ...config, schoolName: e.target.value })} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">SHORT NAME</label><input value={config.shortName} onChange={(e) => setConfig({ ...config, shortName: e.target.value })} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">MOTTO</label><input value={config.motto} onChange={(e) => setConfig({ ...config, motto: e.target.value })} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">BOARD</label><input value={config.academic.board} onChange={(e) => setConfig({ ...config, academic: { ...config.academic, board: e.target.value } })} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">PHONE</label><input value={config.contact.phone} onChange={(e) => setConfig({ ...config, contact: { ...config.contact, phone: e.target.value } })} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">EMAIL</label><input value={config.contact.email} onChange={(e) => setConfig({ ...config, contact: { ...config.contact, email: e.target.value } })} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" /></div>
              </div>
              <div className="mt-4"><label className="text-xs font-medium text-muted-foreground">ADDRESS</label><input value={config.contact.address} onChange={(e) => setConfig({ ...config, contact: { ...config.contact, address: e.target.value } })} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" /></div>
            </SectionCard>
          </StaggerItem>
        </div>
      )}

      {/* Preview Tab — Live Landing Page */}
      {tab === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /><p className="text-sm font-semibold">Live Preview</p><span className="text-xs text-muted-foreground">— This is exactly how the school's public website looks</span></div>
            <div className="flex gap-1">
              <button className="rounded-lg bg-muted p-2 hover:bg-accent"><Monitor className="h-4 w-4" /></button>
              <button className="rounded-lg bg-muted p-2 hover:bg-accent"><Smartphone className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/50">
            <div className="max-h-[800px] overflow-y-auto scroll-area">
              <ModernLandingPage config={config} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function colorOfHelper(c: string) {
  return {
    emerald: { soft: "bg-emerald-500/10", text: "text-emerald-600" },
    violet: { soft: "bg-violet-500/10", text: "text-violet-600" },
    sky: { soft: "bg-sky-500/10", text: "text-sky-600" },
    amber: { soft: "bg-amber-500/10", text: "text-amber-600" },
    rose: { soft: "bg-rose-500/10", text: "text-rose-600" },
    teal: { soft: "bg-teal-500/10", text: "text-teal-600" },
    orange: { soft: "bg-orange-500/10", text: "text-orange-600" },
    pink: { soft: "bg-pink-500/10", text: "text-pink-600" },
    cyan: { soft: "bg-cyan-500/10", text: "text-cyan-600" },
    indigo: { soft: "bg-indigo-500/10", text: "text-indigo-600" },
    lime: { soft: "bg-lime-500/10", text: "text-lime-600" },
    slate: { soft: "bg-slate-500/10", text: "text-slate-600" },
  }[c] || { soft: "bg-muted", text: "text-muted-foreground" }
}
