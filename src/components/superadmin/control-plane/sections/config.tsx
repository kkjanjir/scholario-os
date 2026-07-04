"use client"

import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { PAYMENT_PROVIDERS, TEMPLATE_TYPES, type School } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import {
  Building2, CreditCard, Wallet, Globe, Cloud, Sparkles, Palette,
  KeyRound, Save, Check, Eye, Upload, RotateCcw, Download, Archive,
  Power, PowerOff, Trash2,
} from "lucide-react"
import { toast } from "sonner"

export function ConfigSection({ school }: { school: School }) {
  const sections = [
    { id: "basic", icon: Building2, label: "Basic Information", desc: "Name, address, board, session, contact", color: "emerald" },
    { id: "subscription", icon: CreditCard, label: "Subscription & Billing", desc: `Plan: ${school.plan} • MRR: ₹${school.mrr.toLocaleString("en-IN")}`, color: "violet" },
    { id: "payments", icon: Wallet, label: "Payment Infrastructure", desc: `${PAYMENT_PROVIDERS[0].name} configured • Production mode`, color: "amber" },
    { id: "domain", icon: Globe, label: "Domain & Deployment", desc: `${school.domain} • SSL active`, color: "sky" },
    { id: "storage", icon: Cloud, label: "Storage & Backup", desc: `${school.storageUsed}/${school.storageLimit} GB • Daily backup`, color: "teal" },
    { id: "ai", icon: Sparkles, label: "AI Configuration", desc: "5 modules enabled • 1,240/5,000 credits", color: "rose" },
    { id: "branding", icon: Palette, label: "Branding & Templates", desc: `${TEMPLATE_TYPES.length} templates • Logo set`, color: "fuchsia" },
    { id: "credentials", icon: KeyRound, label: "Admin Credentials", desc: "Reset password • 2FA enabled", color: "orange" },
  ]
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Every configuration set during provisioning remains editable. Click any section to modify.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((s, i) => {
          const c = colorOf(s.color)
          return (
            <StaggerItem key={s.id} index={i}>
              <button onClick={() => toast.info(`Editing ${s.label}…`)} className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-premium transition-colors hover:bg-accent/30">
                <div className={cn("rounded-xl p-2.5", c.soft)}><s.icon className={cn("h-5 w-5", c.text)} /></div>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{s.label}</p><p className="truncate text-xs text-muted-foreground">{s.desc}</p></div>
                <span className="text-xs text-primary hover:underline">Edit →</span>
              </button>
            </StaggerItem>
          )
        })}
      </div>

      {/* Payment gateway detail */}
      <StaggerItem index={1}>
        <SectionCard title="Payment Gateway Configuration" subtitle="Secure provider settings">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENT_PROVIDERS.map((p) => {
              const c = colorOf(p.color)
              const active = p.id === "razorpay"
              return (
                <div key={p.id} className={cn("rounded-2xl border-2 p-4", active ? cn(c.ring, c.soft, "ring-1") : "border-border/60")}>
                  <div className="flex items-center justify-between"><span className="text-2xl">{p.logo}</span>{active && <Check className={cn("h-4 w-4", c.text)} />}</div>
                  <p className="mt-2 text-sm font-semibold">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{active ? "Active • Production" : "Not configured"}</p>
                  <button onClick={() => toast.info(`Configuring ${p.name}`)} className={cn("mt-2 w-full rounded-lg py-1.5 text-xs font-medium", active ? "bg-muted hover:bg-accent" : cn(c.soft, c.text))}>{active ? "Manage" : "Configure"}</button>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Danger zone */}
      <StaggerItem index={2}>
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
          <p className="text-sm font-semibold text-rose-600">Danger Zone</p>
          <p className="text-xs text-muted-foreground">Irreversible actions — proceed with caution</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => toast.success("Backup started")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3 py-1.5 text-xs font-medium hover:bg-accent"><Download className="h-3.5 w-3.5" /> Backup Now</button>
            <button onClick={() => toast.success("Restore point created")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3 py-1.5 text-xs font-medium hover:bg-accent"><RotateCcw className="h-3.5 w-3.5" /> Restore</button>
            <button onClick={() => toast.success("School suspended")} className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20"><PowerOff className="h-3.5 w-3.5" /> Suspend</button>
            <button onClick={() => toast.success("School archived")} className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20"><Archive className="h-3.5 w-3.5" /> Archive</button>
          </div>
        </div>
      </StaggerItem>
    </div>
  )
}
