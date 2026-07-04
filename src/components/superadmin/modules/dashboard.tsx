"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { KpiCard, SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { RevenueAreaChart, DonutChart, RadialGauge, SimpleLine } from "@/components/shared/charts"
import { PLATFORM_STATS, REVENUE_TREND_SA, SCHOOL_GROWTH, LIVE_ACTIVITY, RECENT_LOGINS, SCHOOLS } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import {
  Building2, Users, GraduationCap, Wallet, Activity, Server, Cpu,
  HardDrive, Wifi, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  ArrowUpRight, Sparkles, ShieldCheck, Smartphone, Database,
} from "lucide-react"
import { toast } from "sonner"

export function SuperAdminDashboard() {
  const setModule = useAppStore((s) => s.setModule)

  const planDist = [
    { name: "Enterprise", value: 42, color: "oklch(0.55 0.13 160)" },
    { name: "Professional", value: 68, color: "oklch(0.6 0.18 300)" },
    { name: "Starter", value: 28, color: "oklch(0.7 0.16 70)" },
    { name: "Trial", value: 18, color: "oklch(0.65 0.15 200)" },
  ]

  return (
    <div className="space-y-6">
      {/* hero banner */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-6 text-white shadow-premium lg:p-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-slate-500/20 blur-3xl" />
          <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="h-3 w-3" /> Platform Control Center • {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">Welcome, Arjun 👋</h2>
              <p className="mt-1 max-w-lg text-sm text-white/70">
                Platform is <b className="text-emerald-400">{PLATFORM_STATS.platformHealth}% healthy</b>. {PLATFORM_STATS.activeSchools} active schools, {PLATFORM_STATS.activeSessions.toLocaleString("en-IN")} live sessions, ₹{(PLATFORM_STATS.mrr / 100000).toFixed(2)}L MRR.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setModule("superadmin", "schools")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-transform hover:scale-105">
                <Building2 className="h-4 w-4" /> Manage Schools
              </button>
              <button onClick={() => setModule("superadmin", "monitoring")} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-105">
                <Activity className="h-4 w-4" /> System Health
              </button>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Row 1: Schools & Revenue KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Schools" value={PLATFORM_STATS.totalSchools} icon={Building2} color="emerald" trend={{ value: 3.2, up: true }} onClick={() => setModule("superadmin", "schools")} />
        <KpiCard index={1} label="Active Schools" value={PLATFORM_STATS.activeSchools} icon={CheckCircle2} color="teal" trend={{ value: 2.1, up: true }} />
        <KpiCard index={2} label="Trial Schools" value={PLATFORM_STATS.trialSchools} icon={Clock} color="amber" />
        <KpiCard index={3} label="Suspended" value={PLATFORM_STATS.suspendedSchools} icon={AlertTriangle} color="rose" />
      </div>

      {/* Row 2: Users KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={4} label="Total Students" value={PLATFORM_STATS.totalStudents} icon={GraduationCap} color="violet" trend={{ value: 4.8, up: true }} />
        <KpiCard index={5} label="Total Teachers" value={PLATFORM_STATS.totalTeachers} icon={Users} color="sky" trend={{ value: 3.5, up: true }} />
        <KpiCard index={6} label="Total Parents" value={PLATFORM_STATS.totalParents} icon={Users} color="cyan" trend={{ value: 5.2, up: true }} />
        <KpiCard index={7} label="Active Sessions" value={PLATFORM_STATS.activeSessions} icon={Activity} color="emerald" />
      </div>

      {/* Row 3: Revenue & System */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={8} label="MRR" value={PLATFORM_STATS.mrr / 100000} prefix="₹" suffix="L" decimals={2} icon={Wallet} color="emerald" trend={{ value: 6.8, up: true }} onClick={() => setModule("superadmin", "billing")} />
        <KpiCard index={9} label="ARR" value={PLATFORM_STATS.arr / 10000000} prefix="₹" suffix="Cr" decimals={2} icon={TrendingUp} color="teal" trend={{ value: 8.2, up: true }} />
        <KpiCard index={10} label="API Usage" value={PLATFORM_STATS.apiUsage} suffix="%" icon={Cpu} color="violet" />
        <KpiCard index={11} label="Storage" value={PLATFORM_STATS.storageUsage} suffix="%" icon={HardDrive} color="amber" />
      </div>

      {/* Revenue chart + plan distribution */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard
            title="Revenue Trend (MRR & ARR)"
            subtitle="Monthly recurring revenue & annual run rate"
            action={<button onClick={() => setModule("superadmin", "billing")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Billing <ArrowUpRight className="h-3 w-3" /></button>}
          >
            <RevenueAreaChart data={REVENUE_TREND_SA.map((r) => ({ month: r.month, revenue: r.arr / 1000000, collection: r.mrr / 100000 }))} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={2}>
          <SectionCard title="Plan Distribution" subtitle="Schools by subscription plan">
            <DonutChart data={planDist} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              {planDist.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-muted-foreground">{d.name}</span>
                  </div>
                  <p className="mt-0.5 text-sm font-bold">{d.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* School growth + platform health */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={3} className="lg:col-span-2">
          <SectionCard title="School Growth" subtitle="Total schools on platform (12 months)">
            <SimpleLine data={SCHOOL_GROWTH} dataKey="schools" color="oklch(0.5 0.02 260)" height={240} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={4}>
          <SectionCard title="Platform Health" subtitle="System status">
            <div className="flex items-center justify-center">
              <RadialGauge value={PLATFORM_STATS.platformHealth} label="Healthy" color="oklch(0.55 0.13 160)" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border/60 bg-card/40 p-2.5">
                <div className="flex items-center gap-1.5 text-xs"><Cpu className="h-3 w-3 text-emerald-500" /> CPU</div>
                <p className="mt-0.5 text-sm font-bold">{MONITORING_METRICS.cpu}%</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-2.5">
                <div className="flex items-center gap-1.5 text-xs"><Database className="h-3 w-3 text-amber-500" /> RAM</div>
                <p className="mt-0.5 text-sm font-bold">{MONITORING_METRICS.ram}%</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-2.5">
                <div className="flex items-center gap-1.5 text-xs"><HardDrive className="h-3 w-3 text-violet-500" /> Disk</div>
                <p className="mt-0.5 text-sm font-bold">{MONITORING_METRICS.disk}%</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-2.5">
                <div className="flex items-center gap-1.5 text-xs"><Wifi className="h-3 w-3 text-sky-500" /> Net</div>
                <p className="mt-0.5 text-sm font-bold">{MONITORING_METRICS.bandwidth}%</p>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Live activity feed + recent logins */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={5}>
          <SectionCard title="Live Activity Feed" subtitle="Real-time platform events" bodyClassName="p-0">
            <div className="max-h-[400px] divide-y divide-border/40 overflow-y-auto scroll-area">
              {LIVE_ACTIVITY.map((a) => {
                const c = colorOf(a.color)
                const icon = a.type === "login" ? CheckCircle2 : a.type === "payment" ? Wallet : a.type === "registration" ? Building2 : a.type === "error" ? AlertTriangle : a.type === "alert" ? AlertTriangle : Activity
                const Icon = icon
                return (
                  <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                    <div className={cn("rounded-lg p-2 shrink-0", c.soft)}>
                      <Icon className={cn("h-4 w-4", c.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{a.detail}</p>
                      <p className="text-xs text-muted-foreground">{a.school} • {a.user}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={6}>
          <SectionCard title="Recent Logins" subtitle="Latest authentication events" bodyClassName="p-0">
            <div className="max-h-[400px] divide-y divide-border/40 overflow-y-auto scroll-area">
              {RECENT_LOGINS.map((l) => (
                <div key={l.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={l.user} color={l.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{l.user}</p>
                    <p className="text-xs text-muted-foreground">{l.role} • {l.school}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-[10px] text-muted-foreground">{l.device}</p>
                    <p className="text-[10px] text-muted-foreground">{l.ip}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {l.status === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-rose-500" />}
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{l.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Top schools table */}
      <StaggerItem index={7}>
        <SectionCard title="Top Schools by Revenue" subtitle="Highest MRR schools on platform" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  {["School", "Plan", "Students", "MRR", "Health", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...SCHOOLS].sort((a, b) => b.mrr - a.mrr).slice(0, 6).map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/40 hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={s.shortName} color={s.avatarColor} size="sm" />
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.city}, {s.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", colorOf(s.plan === "Enterprise" ? "amber" : s.plan === "Professional" ? "violet" : s.plan === "Starter" ? "emerald" : "slate").soft, colorOf(s.plan === "Enterprise" ? "amber" : s.plan === "Professional" ? "violet" : s.plan === "Starter" ? "emerald" : "slate").text)}>{s.plan}</span></td>
                    <td className="px-4 py-3">{s.students.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold">{formatINR(s.mrr)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div className={cn("h-full rounded-full", s.health >= 90 ? "bg-emerald-500" : s.health >= 75 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${s.health}%` }} />
                        </div>
                        <span className="text-xs font-medium">{s.health}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3"><button onClick={() => setModule("superadmin", "schools")} className="text-xs font-medium text-primary hover:underline">Manage</button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

const MONITORING_METRICS = {
  cpu: 34.2,
  ram: 58.7,
  disk: 62.8,
  bandwidth: 41.3,
}
