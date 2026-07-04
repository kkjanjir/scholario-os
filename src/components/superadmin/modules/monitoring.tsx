"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { colorOf } from "@/components/shared/brand"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { SimpleLine, SimpleBar, DonutChart, RadialGauge } from "@/components/shared/charts"
import { MONITORING_METRICS, CPU_HISTORY, API_TRAFFIC, SYSTEM_LOGS } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { Cpu, Database, HardDrive, Wifi, Activity, AlertTriangle, CheckCircle2, AlertCircle, Info, Server } from "lucide-react"
import { toast } from "sonner"

const LOG_CONFIG = {
  info: { color: "sky", icon: Info },
  warning: { color: "amber", icon: AlertTriangle },
  error: { color: "rose", icon: AlertCircle },
}

export function MonitoringModule() {
  const serviceHealth = [
    { name: "API Gateway", status: "Operational", uptime: 99.97, color: "emerald" },
    { name: "Database", status: "Operational", uptime: 99.99, color: "emerald" },
    { name: "CDN", status: "Operational", uptime: 99.95, color: "emerald" },
    { name: "SMS Gateway", status: "Degraded", uptime: 98.2, color: "amber" },
    { name: "Email Service", status: "Operational", uptime: 99.9, color: "emerald" },
    { name: "Payment Gateway", status: "Operational", uptime: 99.8, color: "emerald" },
    { name: "Backup Service", status: "Operational", uptime: 100, color: "emerald" },
    { name: "WhatsApp API", status: "Down", uptime: 0, color: "rose" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Monitoring" description="Real-time system health, performance & logs" action={<button onClick={() => toast.success("Monitoring report exported")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Activity className="h-4 w-4" /> Export Report</button>} />

      {/* metric gauges */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex rounded-xl bg-emerald-500/10 p-2.5"><Cpu className="h-5 w-5 text-emerald-600" /></div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">NORMAL</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CPU Usage</p>
            <p className="text-2xl font-bold"><AnimatedCounter value={MONITORING_METRICS.cpu} decimals={1} suffix="%" /></p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${MONITORING_METRICS.cpu}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-emerald-500" /></div>
          </div>
        </StaggerItem>
        <StaggerItem index={1}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex rounded-xl bg-amber-500/10 p-2.5"><Database className="h-5 w-5 text-amber-600" /></div>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">ELEVATED</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">RAM Usage</p>
            <p className="text-2xl font-bold"><AnimatedCounter value={MONITORING_METRICS.ram} decimals={1} suffix="%" /></p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${MONITORING_METRICS.ram}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-amber-500" /></div>
          </div>
        </StaggerItem>
        <StaggerItem index={2}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex rounded-xl bg-violet-500/10 p-2.5"><HardDrive className="h-5 w-5 text-violet-600" /></div>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">ELEVATED</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Disk Usage</p>
            <p className="text-2xl font-bold"><AnimatedCounter value={MONITORING_METRICS.disk} decimals={1} suffix="%" /></p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${MONITORING_METRICS.disk}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-violet-500" /></div>
          </div>
        </StaggerItem>
        <StaggerItem index={3}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex rounded-xl bg-sky-500/10 p-2.5"><Wifi className="h-5 w-5 text-sky-600" /></div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">NORMAL</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bandwidth</p>
            <p className="text-2xl font-bold"><AnimatedCounter value={MONITORING_METRICS.bandwidth} decimals={1} suffix="%" /></p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${MONITORING_METRICS.bandwidth}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-sky-500" /></div>
          </div>
        </StaggerItem>
      </div>

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={4}>
          <SectionCard title="CPU Usage (24h)" subtitle="Average across all servers">
            <SimpleLine data={CPU_HISTORY} dataKey="cpu" color="oklch(0.55 0.13 160)" height={220} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={5}>
          <SectionCard title="API Traffic (24h)" subtitle="Requests per hour">
            <SimpleBar data={API_TRAFFIC} dataKey="requests" color="oklch(0.5 0.02 260)" height={220} />
          </SectionCard>
        </StaggerItem>
      </div>

      {/* service health + system stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={6} className="lg:col-span-2">
          <SectionCard title="Service Health" subtitle="Status of all platform services">
            <div className="grid gap-2 sm:grid-cols-2">
              {serviceHealth.map((s) => {
                const c = colorOf(s.color)
                return (
                  <div key={s.name} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                    <span className={cn("h-2.5 w-2.5 rounded-full", c.bg, s.status === "Operational" && "animate-pulse")} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.status} • {s.uptime}% uptime</p>
                    </div>
                    <Server className={cn("h-4 w-4", c.text)} />
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={7}>
          <SectionCard title="Uptime" subtitle="Last 30 days">
            <div className="flex items-center justify-center"><RadialGauge value={MONITORING_METRICS.uptime} label="Uptime" color="oklch(0.55 0.13 160)" /></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">API Errors</p><p className="text-sm font-bold text-rose-600">{MONITORING_METRICS.apiErrors}</p></div>
              <div className="rounded-lg bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">Avg Response</p><p className="text-sm font-bold">{MONITORING_METRICS.avgResponseTime}ms</p></div>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* system logs */}
      <StaggerItem index={8}>
        <SectionCard title="System Logs" subtitle="Real-time platform events" bodyClassName="p-0">
          <div className="max-h-[400px] divide-y divide-border/40 overflow-y-auto scroll-area">
            {SYSTEM_LOGS.map((log) => {
              const cfg = LOG_CONFIG[log.level]
              const Icon = cfg.icon
              const c = colorOf(cfg.color)
              return (
                <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                  <div className={cn("rounded-lg p-1.5 shrink-0", c.soft)}><Icon className={cn("h-3.5 w-3.5", c.text)} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{log.message}</p>
                    <p className="text-xs text-muted-foreground">{log.service} • {log.time}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", c.soft, c.text)}>{log.level}</span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
