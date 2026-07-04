"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { AT_RISK_STUDENTS, FEE_DEFAULTERS, LESSON_PLANS, HOMEWORK } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import {
  Zap, AlertTriangle, Wallet, NotebookPen, ShieldAlert, ShieldCheck,
  TrendingDown, ArrowUpRight, Send, Calendar, Phone, CheckCircle2,
  Clock, Bell, Sparkles,
} from "lucide-react"
import { toast } from "sonner"

type Tab = "all" | "at-risk" | "defaulters" | "lessons" | "homework"

export function ActionCenterModule() {
  const setModule = useAppStore((s) => s.setModule)
  const [tab, setTab] = useState<Tab>("all")
  const [resolved, setResolved] = useState<Set<string>>(new Set())

  // Build unified action items
  const actions: ActionItem[] = [
    ...AT_RISK_STUDENTS.filter((s) => s.riskLevel === "High").map((s) => ({
      id: s.id, type: "at-risk" as const, priority: "critical" as const,
      title: `${s.name} — High Risk Student`,
      desc: `Attendance ${s.attendancePct}% • Marks ${s.avgMarks}% • ${s.recommendedAction}`,
      action: "Schedule Meeting", icon: AlertTriangle, color: "rose",
      meta: s.className, target: "atrisk" as const,
    })),
    ...FEE_DEFAULTERS.filter((d) => d.status === "critical").map((d) => ({
      id: d.id, type: "defaulter" as const, priority: "critical" as const,
      title: `${d.studentName} — Fee Overdue ${formatINR(d.amount)}`,
      desc: `${d.overdueDays} days overdue • ${d.remindersSent} reminders sent • Guardian: ${d.guardianName}`,
      action: "Send Reminder", icon: Wallet, color: "rose",
      meta: d.className, target: "defaulters" as const,
    })),
    ...LESSON_PLANS.filter((p) => p.status === "in-progress").map((p) => ({
      id: p.id, type: "lesson" as const, priority: "high" as const,
      title: `${p.topic} — Lesson In Progress`,
      desc: `${p.subject} • ${p.className} • Period ${p.period} • ${p.objectives.length} objectives`,
      action: "View Plan", icon: NotebookPen, color: "amber",
      meta: p.date, target: "dashboard" as const,
    })),
    ...HOMEWORK.filter((h) => h.submissions < h.total).slice(0, 2).map((h) => ({
      id: h.id, type: "homework" as const, priority: "medium" as const,
      title: `${h.title} — ${h.total - h.submissions} Pending Submissions`,
      desc: `${h.subject} • ${h.className} • Due ${h.dueDate}`,
      action: "Review", icon: Clock, color: "sky",
      meta: h.className, target: "homework" as const,
    })),
    ...AT_RISK_STUDENTS.filter((s) => s.riskLevel === "Medium").slice(0, 2).map((s) => ({
      id: s.id, type: "at-risk" as const, priority: "high" as const,
      title: `${s.name} — Medium Risk`,
      desc: `Attendance ${s.attendancePct}% • Marks ${s.avgMarks}% • ${s.recommendedAction}`,
      action: "Monitor", icon: ShieldAlert, color: "amber",
      meta: s.className, target: "atrisk" as const,
    })),
  ]

  const filtered = (tab === "all" ? actions : actions.filter((a) => {
    if (tab === "at-risk") return a.type === "at-risk"
    if (tab === "defaulters") return a.type === "defaulter"
    if (tab === "lessons") return a.type === "lesson"
    if (tab === "homework") return a.type === "homework"
    return true
  })).filter((a) => !resolved.has(a.id))

  const counts = {
    critical: actions.filter((a) => a.priority === "critical" && !resolved.has(a.id)).length,
    high: actions.filter((a) => a.priority === "high" && !resolved.has(a.id)).length,
    medium: actions.filter((a) => a.priority === "medium" && !resolved.has(a.id)).length,
  }
  const resolvedCount = resolved.size

  function handleAction(a: ActionItem) {
    const msgs: Record<string, string> = {
      "Schedule Meeting": `Meeting scheduled for ${a.title.split(" — ")[0]}`,
      "Send Reminder": `Reminder sent for ${a.title.split(" — ")[0]}`,
      "View Plan": "Opening lesson plan…",
      "Review": "Opening homework review…",
      "Monitor": "Added to monitoring list",
    }
    toast.success(msgs[a.action] || "Action completed")
    if (a.target === "atrisk") setModule("principal", "atrisk")
    if (a.target === "defaulters") setModule("principal", "defaulters")
    if (a.target === "homework") setModule("principal", "homework")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Action Center"
        description="Unified command center — all critical items needing your attention"
        action={
          <button onClick={() => toast.success("All actions exported!")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105">
            <CheckCircle2 className="h-4 w-4" /> Export Actions
          </button>
        }
      />

      {/* AI summary banner */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-violet-500/15 p-2.5">
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">AI Executive Summary</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You have <b className="text-rose-600 dark:text-rose-400">{counts.critical} critical actions</b> requiring immediate attention — {AT_RISK_STUDENTS.filter((s) => s.riskLevel === "High").length} high-risk students and {FEE_DEFAULTERS.filter((d) => d.status === "critical").length} critical fee defaulters. Total overdue fees: <b className="text-rose-600 dark:text-rose-400">{formatINR(FEE_DEFAULTERS.reduce((a, d) => a + d.amount, 0))}</b>. {resolvedCount > 0 && <span className="text-emerald-600 dark:text-emerald-400 font-medium">{resolvedCount} action{resolvedCount > 1 ? "s" : ""} resolved ✓</span>}
              </p>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* priority KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <StaggerItem index={0}>
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
            <div className="mb-2 inline-flex rounded-xl bg-rose-500/15 p-2.5"><AlertTriangle className="h-5 w-5 text-rose-600" /></div>
            <p className="text-2xl font-bold text-rose-600"><AnimatedCounter value={counts.critical} /></p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Critical</p>
          </div>
        </StaggerItem>
        <StaggerItem index={1}>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
            <div className="mb-2 inline-flex rounded-xl bg-amber-500/15 p-2.5"><ShieldAlert className="h-5 w-5 text-amber-600" /></div>
            <p className="text-2xl font-bold text-amber-600"><AnimatedCounter value={counts.high} /></p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">High Priority</p>
          </div>
        </StaggerItem>
        <StaggerItem index={2}>
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5">
            <div className="mb-2 inline-flex rounded-xl bg-sky-500/15 p-2.5"><Bell className="h-5 w-5 text-sky-600" /></div>
            <p className="text-2xl font-bold text-sky-600"><AnimatedCounter value={counts.medium} /></p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Medium</p>
          </div>
        </StaggerItem>
      </div>

      {/* filter tabs */}
      <StaggerItem index={1}>
        <div className="flex flex-wrap gap-2">
          {([
            { id: "all", label: `All (${actions.length})` },
            { id: "at-risk", label: `At-Risk (${actions.filter((a) => a.type === "at-risk").length})` },
            { id: "defaulters", label: `Defaulters (${actions.filter((a) => a.type === "defaulter").length})` },
            { id: "lessons", label: `Lessons (${actions.filter((a) => a.type === "lesson").length})` },
            { id: "homework", label: `Homework (${actions.filter((a) => a.type === "homework").length})` },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn("rounded-xl px-3 py-1.5 text-xs font-medium transition-colors", tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}
            >
              {t.label}
            </button>
          ))}
        </div>
      </StaggerItem>

      {/* action items list */}
      <div className="space-y-3">
        {filtered.map((a, i) => {
          const c = colorOf(a.color)
          const Icon = a.icon
          const priorityCfg = a.priority === "critical" ? { ring: "ring-rose-500/30", bg: "bg-rose-500/5" } : a.priority === "high" ? { ring: "ring-amber-500/30", bg: "bg-amber-500/5" } : { ring: "ring-sky-500/30", bg: "bg-sky-500/5" }
          return (
            <StaggerItem key={a.id} index={i + 2}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn("flex items-center gap-3 rounded-2xl border p-4 ring-1 transition-colors", priorityCfg.ring, priorityCfg.bg, "border-transparent")}
              >
                <div className={cn("rounded-xl p-2.5 shrink-0", c.soft)}>
                  <Icon className={cn("h-5 w-5", c.text)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{a.title}</p>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase", c.soft, c.text)}>
                      {a.priority}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{a.desc}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/70">{a.meta}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button
                    onClick={() => handleAction(a)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105"
                  >
                    {a.action} <ArrowUpRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => { setResolved((prev) => new Set(prev).add(a.id)); toast.success("Action marked as resolved ✓") }}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <CheckCircle2 className="h-3 w-3" /> Resolve
                  </button>
                </div>
              </motion.div>
            </StaggerItem>
          )
        })}
      </div>

      {/* quick actions footer */}
      <StaggerItem index={filtered.length + 2}>
        <SectionCard title="Batch Operations" subtitle="Execute actions across multiple categories">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Send, color: "rose", label: "Bulk Reminders", desc: "Send to 6 defaulters", action: () => toast.success("Bulk reminders sent to 6 parents!") },
              { icon: Calendar, color: "amber", label: "Schedule PTM", desc: "2 high-risk students", action: () => toast.success("PTM scheduled for 2 students") },
              { icon: Phone, color: "sky", label: "Call Guardians", desc: "4 critical accounts", action: () => toast.success("Calling 4 guardians…") },
              { icon: CheckCircle2, color: "emerald", label: "Mark Reviewed", desc: "3 lesson plans", action: () => toast.success("3 lesson plans marked reviewed") },
            ].map((qa) => {
              const c = colorOf(qa.color)
              return (
                <motion.button
                  key={qa.label}
                  onClick={qa.action}
                  whileHover={{ y: -3 }}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left transition-colors hover:bg-accent/30"
                >
                  <div className={cn("rounded-xl p-2.5", c.soft)}>
                    <qa.icon className={cn("h-5 w-5", c.text)} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{qa.label}</p>
                    <p className="text-xs text-muted-foreground">{qa.desc}</p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

interface ActionItem {
  id: string
  type: "at-risk" | "defaulter" | "lesson" | "homework"
  priority: "critical" | "high" | "medium"
  title: string
  desc: string
  action: string
  icon: any
  color: string
  meta: string
  target: "atrisk" | "defaulters" | "homework" | "dashboard"
}
