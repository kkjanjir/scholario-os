"use client"

import { motion } from "framer-motion"
import { KpiCard, SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { SimpleLine, SimpleBar, DonutChart, RadialGauge } from "@/components/shared/charts"
import { type School, SCHOOL_MONITORS, AUDIT_LOG } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import {
  Users, GraduationCap, Wallet, Activity, Cpu, Database, HardDrive,
  Wifi, Sparkles, Smartphone, Bell, CheckCircle2, AlertTriangle,
  Clock, TrendingUp, Building2, Globe, Cloud, Shield,
} from "lucide-react"
import { toast } from "sonner"

export function OverviewSection({ school }: { school: School }) {
  const m = SCHOOL_MONITORS
  const services = [
    { name: "Web App", status: "Operational", color: "emerald" },
    { name: "Database", status: "Operational", color: "emerald" },
    { name: "CDN", status: "Operational", color: "emerald" },
    { name: "SMS Gateway", status: "Degraded", color: "amber" },
    { name: "Payment Gateway", status: "Operational", color: "emerald" },
    { name: "AI Service", status: "Operational", color: "emerald" },
  ]
  return (
    <div className="space-y-6">
      {/* School profile banner */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-premium">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={school.shortName} color={school.avatarColor} size="xl" className="ring-4 ring-white/20" />
              <div>
                <div className="flex items-center gap-2"><span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">{school.plan}</span><StatusBadge status={school.status} /></div>
                <h2 className="mt-1 text-xl font-bold">{school.name}</h2>
                <p className="text-sm text-white/70">{school.city}, {school.state} • {school.domain}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold"><AnimatedCounter value={school.students} /></p><p className="text-[10px] uppercase text-white/60">Students</p></div>
              <div><p className="text-2xl font-bold"><AnimatedCounter value={school.teachers} /></p><p className="text-[10px] uppercase text-white/60">Teachers</p></div>
              <div><p className="text-2xl font-bold">{school.health}%</p><p className="text-[10px] uppercase text-white/60">Health</p></div>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Monthly Active" value={m.mau} icon={Users} color="violet" trend={{ value: 3.2, up: true }} />
        <KpiCard index={1} label="API Calls (24h)" value={m.apiCalls24h} icon={Cpu} color="sky" />
        <KpiCard index={2} label="Fee Collection" value={m.feeCollection / 100000} prefix="₹" suffix="L" icon={Wallet} color="emerald" trend={{ value: 6.8, up: true }} />
        <KpiCard index={3} label="Avg Attendance" value={m.attendanceAvg} suffix="%" icon={CheckCircle2} color="teal" />
      </div>

      {/* Resource usage grid */}
      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Storage", value: (m.storageUsed / school.storageLimit) * 100, icon: HardDrive, color: "violet", detail: `${m.storageUsed}/${school.storageLimit} GB` },
          { label: "Database", value: m.dbUsage, icon: Database, color: "amber", detail: `${m.dbUsage}% used` },
          { label: "Bandwidth", value: m.bandwidth, icon: Wifi, color: "sky", detail: `${m.bandwidth}% used` },
          { label: "AI Credits", value: (m.aiCreditsUsed / m.aiCreditsLimit) * 100, icon: Sparkles, color: "rose", detail: `${m.aiCreditsUsed}/${m.aiCreditsLimit}` },
        ].map((g, i) => {
          const c = colorOf(g.color)
          const colorStr = g.color === "violet" ? "oklch(0.6 0.18 300)" : g.color === "amber" ? "oklch(0.7 0.16 70)" : g.color === "sky" ? "oklch(0.7 0.15 230)" : "oklch(0.65 0.2 15)"
          return (
            <StaggerItem key={g.label} index={i}>
              <div className="rounded-2xl border border-border/60 bg-card p-4 text-center shadow-premium">
                <g.icon className={cn("mx-auto h-5 w-5", c.text)} />
                <div className="mt-2 flex items-center justify-center"><RadialGauge value={Math.round(g.value)} label={g.label} color={colorStr} /></div>
                <p className="mt-1 text-xs text-muted-foreground">{g.detail}</p>
              </div>
            </StaggerItem>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={0}><SectionCard title="Student Growth" subtitle="Last 6 months"><SimpleLine data={m.growthTrend.map((v, i) => ({ name: `M${i + 1}`, students: v }))} dataKey="students" color="oklch(0.55 0.13 160)" height={220} /></SectionCard></StaggerItem>
        <StaggerItem index={1}><SectionCard title="Module Usage" subtitle="Most used modules (%)"><SimpleBar data={m.moduleUsage} dataKey="usage" color="oklch(0.6 0.18 300)" height={220} /></SectionCard></StaggerItem>
      </div>

      {/* Services + recommendations */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={0}>
          <SectionCard title="Connected Services" subtitle="Integration & gateway status">
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((s) => { const c = colorOf(s.color); return (
                <div key={s.name} className="flex items-center gap-2 rounded-xl border border-border/60 p-2.5">
                  <span className={cn("h-2 w-2 rounded-full", c.bg, s.status === "Operational" && "animate-pulse")} />
                  <span className="flex-1 text-sm">{s.name}</span>
                  <span className={cn("text-xs font-medium", c.text)}>{s.status}</span>
                </div>
              )})}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1}>
          <SectionCard title="Warnings & Recommendations" subtitle="AI-powered insights">
            <div className="space-y-2">
              {[
                { icon: AlertTriangle, color: "amber", msg: "SMS gateway latency above threshold (2.4s)", action: "Investigate" },
                { icon: AlertTriangle, color: "rose", msg: `${m.errorCount} API errors in last 24h`, action: "View logs" },
                { icon: Cloud, color: "sky", msg: "Storage at 42% — consider upgrade at 80%", action: "Upgrade" },
                { icon: TrendingUp, color: "emerald", msg: "Student growth up 22% — plan capacity", action: "Review" },
              ].map((a, i) => { const c = colorOf(a.color); return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                  <div className={cn("rounded-lg p-1.5", c.soft)}><a.icon className={cn("h-3.5 w-3.5", c.text)} /></div>
                  <p className="flex-1 text-sm">{a.msg}</p>
                  <button onClick={() => toast.info(a.action)} className="rounded-lg bg-muted px-2 py-1 text-[10px] font-medium hover:bg-accent">{a.action}</button>
                </div>
              )})}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Recent activity */}
      <StaggerItem index={2}>
        <SectionCard title="Recent Activity" subtitle="Audit timeline" bodyClassName="p-0">
          <div className="divide-y divide-border/40">
            {AUDIT_LOG.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <div className="rounded-lg bg-muted p-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /></div>
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
