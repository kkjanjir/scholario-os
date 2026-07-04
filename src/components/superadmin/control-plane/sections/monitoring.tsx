"use client"

import { KpiCard, SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { SimpleLine, SimpleBar, DonutChart } from "@/components/shared/charts"
import { SCHOOL_MONITORS, type School } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { Users, Activity, Clock, Cpu, Database, HardDrive, Wifi, Sparkles, Smartphone, Bell, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import { toast } from "sonner"

export function MonitoringSection({ school }: { school: School }) {
  const m = SCHOOL_MONITORS
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Monthly Active" value={m.mau} icon={Users} color="violet" trend={{ value: 3.2, up: true }} />
        <KpiCard index={1} label="Daily Active" value={m.dau} icon={Users} color="emerald" trend={{ value: 1.8, up: true }} />
        <KpiCard index={2} label="Logins (24h)" value={m.logins24h} icon={Activity} color="sky" />
        <KpiCard index={3} label="Response Time" value={m.responseTime} suffix="ms" icon={Clock} color="teal" trend={{ value: 0.5, up: false }} />
      </div>

      {/* Resource consumption */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "CPU", value: 34, icon: Cpu, color: "emerald" },
          { label: "Memory", value: 59, icon: Database, color: "amber" },
          { label: "Storage", value: (m.storageUsed / school.storageLimit) * 100, icon: HardDrive, color: "violet" },
          { label: "Bandwidth", value: m.bandwidth, icon: Wifi, color: "sky" },
        ].map((g, i) => {
          const c = colorOf(g.color)
          return (
            <StaggerItem key={g.label} index={i}>
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
                <div className="flex items-center justify-between"><g.icon className={cn("h-5 w-5", c.text)} /><span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", c.soft, c.text)}>{g.value > 80 ? "HIGH" : g.value > 60 ? "ELEVATED" : "NORMAL"}</span></div>
                <p className="mt-2 text-2xl font-bold">{Math.round(g.value)}%</p>
                <p className="text-xs text-muted-foreground">{g.label}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${g.value}%` }} transition={{ duration: 1 }} className={cn("h-full rounded-full", c.bg)} /></div>
              </div>
            </StaggerItem>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={0}><SectionCard title="API Calls (24h)" subtitle="Requests over time"><SimpleBar data={[{ name: "00h", req: 1200 }, { name: "04h", req: 800 }, { name: "08h", req: 4200 }, { name: "12h", req: 5800 }, { name: "16h", req: 4400 }, { name: "20h", req: 2200 }, { name: "Now", req: 2840 }]} dataKey="req" color="oklch(0.5 0.02 260)" height={220} /></SectionCard></StaggerItem>
        <StaggerItem index={1}><SectionCard title="Login Statistics" subtitle="Daily login trends"><SimpleLine data={[{ name: "M", logins: 820 }, { name: "T", logins: 940 }, { name: "W", logins: 1020 }, { name: "T", logins: 880 }, { name: "F", logins: 1100 }, { name: "S", logins: 420 }, { name: "S", logins: 280 }]} dataKey="logins" color="oklch(0.55 0.13 160)" height={220} /></SectionCard></StaggerItem>
      </div>

      {/* Usage breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={0}><SectionCard title="AI Consumption" subtitle="Credits by module"><DonutChart data={[{ name: "Insights", value: 420, color: "oklch(0.6 0.21 300)" }, { name: "Auto-Grade", value: 380, color: "oklch(0.65 0.16 60)" }, { name: "Chatbot", value: 280, color: "oklch(0.6 0.14 160)" }, { name: "Content", value: 160, color: "oklch(0.7 0.16 200)" }]} /></SectionCard></StaggerItem>
        <StaggerItem index={1}><SectionCard title="Communication" subtitle="SMS & Email usage"><div className="space-y-3"><div><div className="flex items-center gap-2 text-sm"><Smartphone className="h-4 w-4 text-emerald-500" /><span>SMS Sent</span><span className="ml-auto font-bold">{m.smsSent}/10,000</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-emerald-500" style={{ width: "4.2%" }} /></div></div><div><div className="flex items-center gap-2 text-sm"><Bell className="h-4 w-4 text-sky-500" /><span>Emails Sent</span><span className="ml-auto font-bold">{m.emailsSent.toLocaleString("en-IN")}/50,000</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-sky-500" style={{ width: "3.6%" }} /></div></div><div><div className="flex items-center gap-2 text-sm"><Sparkles className="h-4 w-4 text-violet-500" /><span>AI Credits</span><span className="ml-auto font-bold">{m.aiCreditsUsed}/{m.aiCreditsLimit}</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-violet-500" style={{ width: "24.8%" }} /></div></div></div></SectionCard></StaggerItem>
        <StaggerItem index={2}><SectionCard title="Payment Transactions" subtitle="Last 24 hours"><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Transactions</span><span className="font-bold">{m.payments24h}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Success Rate</span><span className="font-bold text-emerald-600">98.4%</span></div><div className="flex justify-between"><span className="text-muted-foreground">Avg Amount</span><span className="font-bold">₹12,450</span></div><div className="flex justify-between"><span className="text-muted-foreground">Refunds</span><span className="font-bold text-rose-600">2</span></div></div></SectionCard></StaggerItem>
      </div>

      {/* Alerts */}
      <StaggerItem index={3}>
        <SectionCard title="Alerts & Warnings" subtitle="Items needing attention">
          <div className="space-y-2">
            {[
              { icon: AlertTriangle, color: "amber", msg: "SMS gateway latency above threshold (2.4s)", time: "1 hour ago" },
              { icon: AlertTriangle, color: "rose", msg: `${m.errorCount} API errors in last 24h`, time: "2 hours ago" },
              { icon: CheckCircle2, color: "emerald", msg: "Daily backup completed successfully", time: "3 hours ago" },
              { icon: Clock, color: "sky", msg: "Subscription renews in 45 days", time: "Today" },
            ].map((a, i) => { const c = colorOf(a.color); return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <div className={cn("rounded-lg p-1.5", c.soft)}><a.icon className={cn("h-3.5 w-3.5", c.text)} /></div>
                <p className="flex-1 text-sm">{a.msg}</p><span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
            )})}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

import { motion } from "framer-motion"
