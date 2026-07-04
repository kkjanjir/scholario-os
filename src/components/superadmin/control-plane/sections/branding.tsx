"use client"

import { useState } from "react"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { TEMPLATE_TYPES, WEBSITE_SECTIONS, type School } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { Upload, Eye, Copy, Check, Palette, Globe2, Type, Mail } from "lucide-react"
import { toast } from "sonner"

export function BrandingSection({ school }: { school: School }) {
  const [primaryColor, setPrimaryColor] = useState("#10b981")
  const [sections, setSections] = useState(WEBSITE_SECTIONS)
  const colorPresets = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444", "#06b6d4", "#6366f1"]

  return (
    <div className="space-y-6">
      {/* Brand assets */}
      <StaggerItem index={0}>
        <SectionCard title="Brand Assets" subtitle="Logos, signatures, seals & stamps">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "School Logo", emoji: "🏫" },
              { label: "Principal Signature", emoji: "✍️" },
              { label: "Official Seal", emoji: "🛡️" },
              { label: "School Stamp", emoji: "🔖" },
            ].map((u) => (
              <button key={u.label} onClick={() => toast.success(`${u.label} uploaded`)} className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border/60 p-4 hover:bg-accent/30">
                <span className="text-3xl">{u.emoji}</span><Upload className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium">{u.label}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Theme */}
      <StaggerItem index={1}>
        <SectionCard title="Theme Configuration" subtitle="Primary, secondary & accent colors">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">PRIMARY</label>
              <div className="flex items-center gap-2">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded-lg border border-border/60" />
                <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 flex-1 rounded-xl border border-border/70 bg-background/60 px-3 text-sm font-mono outline-none" />
              </div>
            </div>
            <div><label className="mb-2 block text-xs font-medium text-muted-foreground">SECONDARY</label><input type="color" defaultValue="#0d9488" className="h-10 w-full cursor-pointer rounded-lg border border-border/60" /></div>
            <div><label className="mb-2 block text-xs font-medium text-muted-foreground">ACCENT</label><input type="color" defaultValue="#f59e0b" className="h-10 w-full cursor-pointer rounded-lg border border-border/60" /></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {colorPresets.map((c) => <button key={c} onClick={() => setPrimaryColor(c)} className={cn("h-8 w-8 rounded-lg ring-2 ring-offset-2 ring-offset-background", primaryColor === c ? "ring-foreground" : "ring-transparent")} style={{ background: c }} />)}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Document templates */}
      <StaggerItem index={2}>
        <SectionCard title="Document Templates" subtitle="Certificates, report cards, marksheets & more">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATE_TYPES.map((t) => {
              const c = colorOf(t.color)
              return (
                <div key={t.id} className="rounded-xl border border-border/60 p-3">
                  <div className="flex items-center gap-2"><span className="text-xl">{t.icon}</span><span className="text-sm font-medium">{t.name}</span></div>
                  <p className="mt-1 text-[10px] text-muted-foreground">{t.versions} version{t.versions > 1 ? "s" : ""}</p>
                  <div className="mt-2 flex gap-1">
                    <button onClick={() => toast.info(`Previewing ${t.name}`)} className="flex-1 rounded-lg bg-muted py-1 text-[10px] font-medium hover:bg-accent"><Eye className="inline h-3 w-3" /> Preview</button>
                    <button onClick={() => toast.success("Duplicated")} className="rounded-lg bg-muted px-2 py-1 text-[10px] hover:bg-accent"><Copy className="h-3 w-3" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Website builder */}
      <StaggerItem index={3}>
        <SectionCard title="Website Builder" subtitle="Configure school's public landing page">
          <div className="grid gap-2 sm:grid-cols-2">
            {sections.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <button onClick={() => setSections((prev) => prev.map((x) => x.id === s.id ? { ...x, enabled: !x.enabled } : x))} className={cn("relative h-6 w-11 rounded-full transition-colors", s.enabled ? "bg-emerald-500" : "bg-muted")}><span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", s.enabled ? "left-[22px]" : "left-0.5")} /></button>
                <span className="flex-1 text-sm font-medium">{s.name}</span>
                <button onClick={() => toast.info(`Editing ${s.name}`)} className="rounded-lg bg-muted px-2 py-1 text-xs hover:bg-accent">Edit</button>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="text-xs font-medium text-muted-foreground">SEO META TITLE</label><input className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" placeholder="Sri Vidya Mandir — Best CBSE School in Pune" /></div>
            <div><label className="text-xs font-medium text-muted-foreground">META DESCRIPTION</label><input className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" placeholder="Admissions open 2026-27..." /></div>
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
