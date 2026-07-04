"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { SimpleLine } from "@/components/shared/charts"
import { AT_RISK_STUDENTS, type AtRiskStudent } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import {
  AlertTriangle, ShieldAlert, ShieldCheck, TrendingDown, TrendingUp,
  Phone, Mail, Calendar, Sparkles, ArrowRight, Activity,
} from "lucide-react"
import { toast } from "sonner"

const RISK_CONFIG = {
  High: { color: "rose", bg: "bg-rose-500", soft: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/20", label: "High Risk" },
  Medium: { color: "amber", bg: "bg-amber-500", soft: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20", label: "Medium Risk" },
  Low: { color: "emerald", bg: "bg-emerald-500", soft: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20", label: "Low Risk" },
}

export function AtRiskModule() {
  const [selected, setSelected] = useState<AtRiskStudent | null>(null)
  const [filter, setFilter] = useState<"all" | "High" | "Medium" | "Low">("all")
  const [search, setSearch] = useState("")

  const filtered = AT_RISK_STUDENTS.filter((s) => {
    const matchFilter = filter === "all" || s.riskLevel === filter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.className.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    total: AT_RISK_STUDENTS.length,
    high: AT_RISK_STUDENTS.filter((s) => s.riskLevel === "High").length,
    medium: AT_RISK_STUDENTS.filter((s) => s.riskLevel === "Medium").length,
    low: AT_RISK_STUDENTS.filter((s) => s.riskLevel === "Low").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="At-Risk Students"
        description="AI-powered predictive analytics — early intervention dashboard"
        action={
          <button onClick={() => toast.success("Report exported to Excel")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105">
            <Activity className="h-4 w-4" /> Export Report
          </button>
        }
      />

      {/* AI insight banner */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-violet-500/15 p-2.5">
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">AI Insight — 2 students need immediate attention</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Our predictive model has identified <b className="text-rose-600 dark:text-rose-400">Kabir Mehta</b> and <b className="text-rose-600 dark:text-rose-400">Ishita Desai</b> as high-risk based on declining attendance, dropping marks, and low homework submission. Recommended: schedule parent meetings this week.
              </p>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-rose-500/10 p-2.5"><AlertTriangle className="h-5 w-5 text-rose-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">High Risk</p>
            <p className="text-2xl font-bold text-rose-600"><AnimatedCounter value={stats.high} /></p>
          </div>
        </StaggerItem>
        <StaggerItem index={1}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-amber-500/10 p-2.5"><ShieldAlert className="h-5 w-5 text-amber-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Medium Risk</p>
            <p className="text-2xl font-bold text-amber-600"><AnimatedCounter value={stats.medium} /></p>
          </div>
        </StaggerItem>
        <StaggerItem index={2}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5"><ShieldCheck className="h-5 w-5 text-emerald-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Low Risk</p>
            <p className="text-2xl font-bold text-emerald-600"><AnimatedCounter value={stats.low} /></p>
          </div>
        </StaggerItem>
        <StaggerItem index={3}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-2.5"><Activity className="h-5 w-5 text-violet-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Monitored</p>
            <p className="text-2xl font-bold"><AnimatedCounter value={stats.total} /></p>
          </div>
        </StaggerItem>
      </div>

      {/* filter toolbar */}
      <StaggerItem index={1}>
        <SectionCard>
          <Toolbar search={search} onSearch={setSearch} placeholder="Search students…">
            {(["all", "High", "Medium", "Low"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>
                {f === "all" ? "All" : `${f} Risk`}
              </button>
            ))}
          </Toolbar>
        </SectionCard>
      </StaggerItem>

      {/* student cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((s, i) => {
          const cfg = RISK_CONFIG[s.riskLevel]
          const trendData = s.trend.map((v, idx) => ({ name: `W${idx + 1}`, marks: v }))
          return (
            <StaggerItem key={s.id} index={i + 2}>
              <motion.button
                onClick={() => setSelected(s)}
                whileHover={{ y: -3 }}
                className={cn("w-full overflow-hidden rounded-2xl border bg-card p-5 text-left shadow-premium transition-colors", cfg.ring, "ring-1")}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar name={s.name} color={s.avatarColor} size="lg" />
                    <span className={cn("absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-card", cfg.bg)}>
                      <AlertTriangle className="h-3.5 w-3.5 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{s.name}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", cfg.soft, cfg.text)}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.className} • Roll {String(s.rollNo).padStart(2, "0")}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase text-muted-foreground">Risk</span>
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${s.riskScore}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} className={cn("h-full rounded-full", cfg.bg)} />
                        </div>
                        <span className={cn("text-xs font-bold", cfg.text)}>{s.riskScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/40 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Attendance</p>
                    <p className={cn("text-sm font-bold", s.attendancePct < 75 ? "text-rose-600" : "text-emerald-600")}>{s.attendancePct}%</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Avg Marks</p>
                    <p className={cn("text-sm font-bold", s.avgMarks < 50 ? "text-rose-600" : s.avgMarks < 60 ? "text-amber-600" : "text-emerald-600")}>{s.avgMarks}%</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Trend</p>
                    <p className={cn("inline-flex items-center gap-0.5 text-sm font-bold", s.trend[s.trend.length - 1] < s.trend[0] ? "text-rose-600" : "text-emerald-600")}>
                      {s.trend[s.trend.length - 1] < s.trend[0] ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                      {Math.abs(s.trend[s.trend.length - 1] - s.trend[0])}%
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                  <p className="text-xs text-muted-foreground">Last absent: {s.lastAbsent}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">View details <ArrowRight className="h-3 w-3" /></span>
                </div>
              </motion.button>
            </StaggerItem>
          )
        })}
      </div>

      {/* detail dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto scroll-area rounded-3xl border border-border/60 bg-card shadow-premium">
              <DetailView student={selected} onClose={() => setSelected(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailView({ student, onClose }: { student: AtRiskStudent; onClose: () => void }) {
  const cfg = RISK_CONFIG[student.riskLevel]
  const trendData = student.trend.map((v, i) => ({ name: `W${i + 1}`, marks: v }))
  return (
    <div>
      {/* header */}
      <div className={cn("relative overflow-hidden p-6 text-white", cfg.bg)}>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <Avatar name={student.name} color={student.avatarColor} size="xl" className="ring-4 ring-white/30" />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-white/80">{cfg.label}</p>
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <p className="text-sm text-white/80">{student.className} • Roll {String(student.rollNo).padStart(2, "0")}</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              <span className="text-xs">Risk Score</span>
              <span className="text-lg font-bold">{student.riskScore}/100</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg bg-white/15 p-2 text-white transition-colors hover:bg-white/25">✕</button>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {/* factors */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">Risk Factors</h3>
          <div className="grid grid-cols-2 gap-2">
            {student.factors.map((f) => {
              const fc = f.severity === "high" ? "rose" : f.severity === "medium" ? "amber" : "emerald"
              const cc = colorOf(fc)
              return (
                <div key={f.label} className={cn("rounded-xl border p-3", cc.ring, "ring-1", cc.soft)}>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{f.label}</p>
                  <p className={cn("text-sm font-bold", cc.text)}>{f.value}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* trend chart */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">Performance Trend (6 weeks)</h3>
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <SimpleLine data={trendData} dataKey="marks" color={cfg.bg.includes("rose") ? "oklch(0.65 0.2 15)" : cfg.bg.includes("amber") ? "oklch(0.7 0.16 70)" : "oklch(0.6 0.14 160)"} height={160} />
          </div>
        </div>

        {/* recommendation */}
        <div className={cn("rounded-xl border p-4", cfg.ring, "ring-1", cfg.soft)}>
          <div className="flex items-start gap-2">
            <Sparkles className={cn("h-4 w-4 shrink-0 mt-0.5", cfg.text)} />
            <div>
              <p className="text-sm font-semibold">Recommended Action</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{student.recommendedAction}</p>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          <button onClick={() => toast.success(`Parent meeting scheduled for ${student.name}`)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
            <Calendar className="h-4 w-4" /> Schedule Meeting
          </button>
          <button onClick={() => toast.success(`Message sent to ${student.name}'s parents`)} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
            <Mail className="h-4 w-4" /> Message Parents
          </button>
          <button onClick={() => toast.success(`Calling ${student.name}'s guardian…`)} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
            <Phone className="h-4 w-4" /> Call
          </button>
          <button onClick={() => toast.success("Mentor assigned")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
            <ShieldCheck className="h-4 w-4" /> Assign Mentor
          </button>
        </div>
      </div>
    </div>
  )
}
