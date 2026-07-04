"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { colorOf } from "@/components/shared/brand"
import { StaggerItem } from "@/components/shared/motion"
import { cn } from "@/lib/utils"
import { Palette, Upload, Type, Mail, MessageSquare, Monitor, Globe, Check, Eye } from "lucide-react"
import { toast } from "sonner"

export function WhiteLabelModule() {
  const [primaryColor, setPrimaryColor] = useState("#10b981")
  const [schoolName, setSchoolName] = useState("SCHOLARIO-OS")
  const [font, setFont] = useState("Inter")

  const colorPresets = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444", "#06b6d4", "#6366f1"]
  const fonts = ["Inter", "Roboto", "Poppins", "Open Sans", "Lato", "Montserrat"]

  return (
    <div className="space-y-6">
      <PageHeader title="White Label" description="Custom branding, themes, templates & domains for schools" action={<button onClick={() => toast.success("White label settings saved")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Check className="h-4 w-4" /> Save Changes</button>} />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* branding */}
        <StaggerItem index={0}>
          <SectionCard title="Brand Identity" subtitle="Logo, name & visual identity">
            <div className="space-y-4">
              {/* logo upload */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">PLATFORM LOGO</label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-2xl font-bold text-white">S</div>
                  <button onClick={() => toast.success("Logo uploaded")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm font-medium hover:bg-accent"><Upload className="h-4 w-4" /> Upload New</button>
                </div>
              </div>
              {/* name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">PLATFORM NAME</label>
                <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50" />
              </div>
              {/* color */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">PRIMARY COLOR</label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((c) => (
                    <button key={c} onClick={() => { setPrimaryColor(c); toast.success("Color applied") }} className={cn("h-9 w-9 rounded-xl ring-2 ring-offset-2 ring-offset-background transition-all", primaryColor === c ? "ring-foreground scale-110" : "ring-transparent")} style={{ background: c }} />
                  ))}
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-9 w-9 cursor-pointer rounded-xl border border-border/60" />
                </div>
              </div>
              {/* font */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">FONT FAMILY</label>
                <select value={font} onChange={(e) => setFont(e.target.value)} className="h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50">
                  {fonts.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>

        {/* preview */}
        <StaggerItem index={1}>
          <SectionCard title="Live Preview" subtitle="How schools will see the platform">
            <div className="overflow-hidden rounded-2xl border border-border/60">
              {/* mock browser */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-2.5">
                <div className="flex gap-1.5"><span className="h-3 w-3 rounded-full bg-rose-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" /></div>
                <div className="flex-1 rounded-md bg-background px-3 py-1 text-[10px] text-muted-foreground">https://{schoolName.toLowerCase().replace(/\s/g, "")}.scholario-os.com</div>
              </div>
              {/* mock login */}
              <div className="space-y-4 p-6" style={{ background: `linear-gradient(135deg, ${primaryColor}15, transparent)` }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold" style={{ background: primaryColor }}>{schoolName[0]}</div>
                  <div>
                    <p className="text-sm font-bold">{schoolName}</p>
                    <p className="text-[10px] text-muted-foreground">School Operating System</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input placeholder="Username" className="h-10 w-full rounded-xl border border-border/70 px-3 text-sm" style={{ fontFamily: font }} />
                  <input placeholder="Password" type="password" className="h-10 w-full rounded-xl border border-border/70 px-3 text-sm" style={{ fontFamily: font }} />
                  <button className="h-10 w-full rounded-xl text-sm font-semibold text-white" style={{ background: primaryColor, fontFamily: font }}>Sign In</button>
                </div>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* templates & domains */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={2}>
          <SectionCard title="Template Customization" subtitle="Email, SMS & certificate templates">
            <div className="space-y-2">
              {[
                { icon: Mail, label: "Email Templates", desc: "Welcome, payment, report card", color: "violet" },
                { icon: MessageSquare, label: "SMS Templates", desc: "Attendance, fee reminder, PTM", color: "emerald" },
                { icon: Palette, label: "Certificate Templates", desc: "Bonafide, TC, character, achievement", color: "amber" },
                { icon: Monitor, label: "Login Screen", desc: "Custom login page branding", color: "sky" },
              ].map((t) => {
                const c = colorOf(t.color)
                return (
                  <button key={t.label} onClick={() => toast.info(`Editing ${t.label}`)} className="flex w-full items-center gap-3 rounded-xl border border-border/60 p-3 text-left transition-colors hover:bg-accent/30">
                    <div className={cn("rounded-lg p-2", c.soft)}><t.icon className={cn("h-4 w-4", c.text)} /></div>
                    <div className="flex-1"><p className="text-sm font-medium">{t.label}</p><p className="text-xs text-muted-foreground">{t.desc}</p></div>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={3}>
          <SectionCard title="Custom Domains" subtitle="School-specific subdomains & custom domains">
            <div className="space-y-2">
              {[
                { domain: "svm.scholario-os.com", school: "Sri Vidya Mandir", status: "Active", ssl: true },
                { domain: "dps.scholario-os.com", school: "Delhi Public School", status: "Active", ssl: true },
                { domain: "bss.scholario-os.com", school: "Bombay Scottish", status: "Active", ssl: true },
                { domain: "portal.greenwood.edu.in", school: "Greenwood High", status: "Active", ssl: true },
                { domain: "mps.scholario-os.com", school: "Modern Public School", status: "Suspended", ssl: true },
              ].map((d) => (
                <div key={d.domain} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs font-medium">{d.domain}</p>
                    <p className="text-[10px] text-muted-foreground">{d.school}</p>
                  </div>
                  {d.ssl && <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">SSL</span>}
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", d.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>{d.status}</span>
                </div>
              ))}
              <button onClick={() => toast.success("Add domain dialog opened")} className="w-full rounded-xl border border-dashed border-border/60 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent/30">+ Add Custom Domain</button>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}
