"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { SectionCard, StatusBadge, KpiCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { SimpleLine, SimpleBar, DonutChart, RadialGauge } from "@/components/shared/charts"
import { type School, SCHOOL_MONITORS, AUDIT_LOG, PAYMENT_PROVIDERS, TEMPLATE_TYPES } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import {
  X, Building2, CreditCard, Wallet, Globe, Cloud, Sparkles, Palette,
  Activity, History, Users, TrendingUp, TrendingDown, CheckCircle2,
  AlertTriangle, Clock, Cpu, Database, HardDrive, Wifi, Smartphone,
  Server, Download, RotateCcw, Eye, KeyRound, Bell, ArrowUpRight,
} from "lucide-react"
import { toast } from "sonner"

type Tab = "overview" | "config" | "monitoring" | "audit"

export function SchoolControlCenter({ school, onClose }: { school: School; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("overview")

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} onClick={(e) => e.stopPropagation()} className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-premium">
        {/* header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={school.shortName} color={school.avatarColor} size="xl" className="ring-4 ring-white/20" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-wide text-white/60">{school.plan} • {school.status}</p>
                  <StatusBadge status={school.status} />
                </div>
                <h2 className="text-xl font-bold">{school.name}</h2>
                <p className="text-sm text-white/70">{school.city}, {school.state} • {school.domain}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg bg-white/15 p-2 text-white hover:bg-white/25"><X className="h-4 w-4" /></button>
          </div>
          {/* tabs */}
          <div className="relative mt-4 flex gap-1">
            {([["overview", "Overview"], ["config", "Configuration"], ["monitoring", "Monitoring"], ["audit", "Audit Trail"]] as [Tab, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={cn("rounded-lg px-4 py-1.5 text-sm font-medium transition-colors", tab === id ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10")}>{label}</button>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto scroll-area p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {tab === "overview" && <OverviewTab school={school} />}
              {tab === "config" && <ConfigTab school={school} />}
              {tab === "monitoring" && <MonitoringTab school={school} />}
              {tab === "audit" && <AuditTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

function OverviewTab({ school }: { school: School }) {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Students" value={school.students} icon={Users} color="violet" trend={{ value: 2.4, up: true }} />
        <KpiCard index={1} label="Teachers" value={school.teachers} icon={Users} color="amber" />
        <KpiCard index={2} label="MRR" value={school.mrr} prefix="₹" icon={CreditCard} color="emerald" />
        <KpiCard index={3} label="Health" value={school.health} suffix="%" icon={Activity} color="teal" />
      </div>

      {/* growth + usage */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={0}>
          <SectionCard title="Student Growth" subtitle="Last 6 months">
            <SimpleLine data={SCHOOL_MONITORS.growthTrend.map((v, i) => ({ name: `M${i + 1}`, students: v }))} dataKey="students" color="oklch(0.55 0.13 160)" height={220} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1}>
          <SectionCard title="Module Usage" subtitle="Most used modules (%)">
            <SimpleBar data={SCHOOL_MONITORS.moduleUsage} dataKey="usage" color="oklch(0.6 0.18 300)" height={220} />
          </SectionCard>
        </StaggerItem>
      </div>

      {/* quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem index={0}>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Cpu className="h-3.5 w-3.5" /> API Calls (24h)</div>
            <p className="mt-1 text-xl font-bold">{SCHOOL_MONITORS.apiCalls24h.toLocaleString("en-IN")}</p>
          </div>
        </StaggerItem>
        <StaggerItem index={1}>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5" /> AI Credits Used</div>
            <p className="mt-1 text-xl font-bold">{SCHOOL_MONITORS.aiCreditsUsed}/{SCHOOL_MONITORS.aiCreditsLimit}</p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-violet-500" style={{ width: `${(SCHOOL_MONITORS.aiCreditsUsed / SCHOOL_MONITORS.aiCreditsLimit) * 100}%` }} /></div>
          </div>
        </StaggerItem>
        <StaggerItem index={2}>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Smartphone className="h-3.5 w-3.5" /> SMS Sent</div>
            <p className="mt-1 text-xl font-bold">{SCHOOL_MONITORS.smsSent}</p>
          </div>
        </StaggerItem>
        <StaggerItem index={3}>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Bell className="h-3.5 w-3.5" /> Emails Sent</div>
            <p className="mt-1 text-xl font-bold">{SCHOOL_MONITORS.emailsSent.toLocaleString("en-IN")}</p>
          </div>
        </StaggerItem>
      </div>

      {/* recent activity */}
      <StaggerItem index={2}>
        <SectionCard title="Latest Activity" subtitle="Recent events at this school" bodyClassName="p-0">
          <div className="divide-y divide-border/40">
            {AUDIT_LOG.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <div className="rounded-lg bg-muted p-1.5"><History className="h-3.5 w-3.5 text-muted-foreground" /></div>
                <div className="min-w-0 flex-1"><p className="text-sm font-medium">{a.action}</p><p className="text-xs text-muted-foreground">{a.module} • {a.user}</p></div>
                <span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

function ConfigTab({ school }: { school: School }) {
  const sections = [
    { id: "basic", icon: Building2, label: "Basic Information", desc: "Name, address, board, session", color: "emerald" },
    { id: "subscription", icon: CreditCard, label: "Subscription & Billing", desc: "Plan, limits, renewal, GST", color: "violet" },
    { id: "payments", icon: Wallet, label: "Payment Infrastructure", desc: `${PAYMENT_PROVIDERS[0].name} configured`, color: "amber" },
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
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </StaggerItem>
          )
        })}
      </div>
      {/* danger zone */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
        <p className="text-sm font-semibold text-rose-600">Danger Zone</p>
        <p className="text-xs text-muted-foreground">Irreversible actions — proceed with caution</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => toast.success("Backup started")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3 py-1.5 text-xs font-medium hover:bg-accent"><Download className="h-3.5 w-3.5" /> Backup Now</button>
          <button onClick={() => toast.success("Restore point created")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3 py-1.5 text-xs font-medium hover:bg-accent"><RotateCcw className="h-3.5 w-3.5" /> Restore</button>
          <button onClick={() => toast.success("School suspended")} className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20">Suspend School</button>
          <button onClick={() => toast.success("School archived")} className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20">Archive</button>
        </div>
      </div>
    </div>
  )
}

function MonitoringTab({ school }: { school: School }) {
  const m = SCHOOL_MONITORS
  return (
    <div className="space-y-6">
      {/* system metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Monthly Active" value={m.mau} icon={Users} color="violet" />
        <KpiCard index={1} label="Daily Active" value={m.dau} icon={Users} color="emerald" />
        <KpiCard index={2} label="Logins (24h)" value={m.logins24h} icon={Activity} color="sky" />
        <KpiCard index={3} label="Response Time" value={m.responseTime} suffix="ms" icon={Clock} color="teal" />
      </div>

      {/* resource gauges */}
      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Storage", value: (m.storageUsed / school.storageLimit) * 100, icon: HardDrive, color: "violet", detail: `${m.storageUsed}/${school.storageLimit} GB` },
          { label: "Database", value: m.dbUsage, icon: Database, color: "amber", detail: `${m.dbUsage}% used` },
          { label: "Bandwidth", value: m.bandwidth, icon: Wifi, color: "sky", detail: `${m.bandwidth}% used` },
          { label: "AI Credits", value: (m.aiCreditsUsed / m.aiCreditsLimit) * 100, icon: Sparkles, color: "rose", detail: `${m.aiCreditsUsed}/${m.aiCreditsLimit}` },
        ].map((g, i) => {
          const c = colorOf(g.color)
          return (
            <StaggerItem key={g.label} index={i}>
              <div className="rounded-2xl border border-border/60 bg-card p-4 text-center shadow-premium">
                <g.icon className={cn("mx-auto h-5 w-5", c.text)} />
                <div className="mt-2 flex items-center justify-center"><RadialGauge value={Math.round(g.value)} label={g.label} color={`oklch(${c.text.includes("violet") ? "0.6 0.18 300" : c.text.includes("amber") ? "0.7 0.16 70" : c.text.includes("sky") ? "0.7 0.15 230" : "0.65 0.2 15"})`} /></div>
                <p className="mt-1 text-xs text-muted-foreground">{g.detail}</p>
              </div>
            </StaggerItem>
          )
        })}
      </div>

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={0}>
          <SectionCard title="API Usage (24h)" subtitle="Requests over time">
            <SimpleBar data={[{ name: "00h", req: 1200 }, { name: "04h", req: 800 }, { name: "08h", req: 4200 }, { name: "12h", req: 5800 }, { name: "16h", req: 4400 }, { name: "20h", req: 2200 }, { name: "Now", req: 2840 }]} dataKey="req" color="oklch(0.5 0.02 260)" height={200} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1}>
          <SectionCard title="Login Statistics" subtitle="Daily login trends">
            <SimpleLine data={[{ name: "M", logins: 820 }, { name: "T", logins: 940 }, { name: "W", logins: 1020 }, { name: "T", logins: 880 }, { name: "F", logins: 1100 }, { name: "S", logins: 420 }, { name: "S", logins: 280 }]} dataKey="logins" color="oklch(0.55 0.13 160)" height={200} />
          </SectionCard>
        </StaggerItem>
      </div>

      {/* health + alerts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={0}>
          <SectionCard title="System Health" subtitle="Service status">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { name: "Web App", status: "Operational", color: "emerald" },
                { name: "Database", status: "Operational", color: "emerald" },
                { name: "CDN", status: "Operational", color: "emerald" },
                { name: "SMS Gateway", status: "Degraded", color: "amber" },
                { name: "Payment Gateway", status: "Operational", color: "emerald" },
                { name: "AI Service", status: "Operational", color: "emerald" },
              ].map((s) => {
                const c = colorOf(s.color)
                return (
                  <div key={s.name} className="flex items-center gap-2 rounded-xl border border-border/60 p-2.5">
                    <span className={cn("h-2 w-2 rounded-full", c.bg, s.status === "Operational" && "animate-pulse")} />
                    <span className="flex-1 text-sm">{s.name}</span>
                    <span className={cn("text-xs font-medium", c.text)}>{s.status}</span>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1}>
          <SectionCard title="Alerts & Warnings" subtitle="Items needing attention">
            <div className="space-y-2">
              {[
                { icon: AlertTriangle, color: "amber", msg: "SMS gateway latency above threshold (2.4s)", time: "1 hour ago" },
                { icon: AlertTriangle, color: "rose", msg: `${m.errorCount} API errors in last 24h`, time: "2 hours ago" },
                { icon: CheckCircle2, color: "emerald", msg: "Daily backup completed successfully", time: "3 hours ago" },
                { icon: Clock, color: "sky", msg: "Subscription renews in 45 days", time: "Today" },
              ].map((a, i) => {
                const c = colorOf(a.color)
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                    <div className={cn("rounded-lg p-1.5", c.soft)}><a.icon className={cn("h-3.5 w-3.5", c.text)} /></div>
                    <p className="flex-1 text-sm">{a.msg}</p>
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}

function AuditTab() {
  return (
    <div className="space-y-4">
      <SectionCard title="Change Tracking" subtitle="Audit trail of administrative configuration changes" action={<button onClick={() => toast.success("Audit log exported")} className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-accent"><Download className="h-3.5 w-3.5" /> Export</button>} bodyClassName="p-0">
        <div className="divide-y divide-border/40">
          {AUDIT_LOG.map((a) => (
            <div key={a.id} className="px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-muted p-1.5"><History className="h-3.5 w-3.5 text-muted-foreground" /></div>
                <p className="flex-1 text-sm font-medium">{a.action}</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{a.module}</span>
                <span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 pl-9 text-xs">
                <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-rose-600 line-through">{a.oldValue}</span>
                <span>→</span>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-600">{a.newValue}</span>
                <span className="ml-auto text-muted-foreground">by {a.user}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
