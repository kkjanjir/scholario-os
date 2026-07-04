"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { KpiCard, SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { SimpleBar, SimpleLine, DonutChart } from "@/components/shared/charts"
import { cn } from "@/lib/utils"
import {
  TrendingUp, BookOpen, GraduationCap, Award, Activity, ArrowUpRight, Sparkles,
} from "lucide-react"

const CLASS_PERF = [
  { name: "G10-A", marks: 78 },
  { name: "G9-A", marks: 74 },
  { name: "G10-B", marks: 71 },
]

const ATTENDANCE_TREND = [
  { name: "W1", attendance: 92 },
  { name: "W2", attendance: 90 },
  { name: "W3", attendance: 94 },
  { name: "W4", attendance: 88 },
  { name: "W5", attendance: 93 },
  { name: "W6", attendance: 95 },
  { name: "W7", attendance: 91 },
  { name: "W8", attendance: 94 },
]

const COMPLETION_DONUT = [
  { name: "Submitted", value: 86, color: "oklch(0.62 0.15 60)" },
  { name: "Pending", value: 14, color: "oklch(0.7 0.04 70)" },
]

const TOP_VS_STRUGGLING = [
  { name: "Aarav", marks: 94 },
  { name: "Diya", marks: 91 },
  { name: "Vivaan", marks: 88 },
  { name: "Ishaan", marks: 85 },
  { name: "Ananya", marks: 64 },
  { name: "Krishna", marks: 58 },
  { name: "Pari", marks: 52 },
]

export function AnalyticsModule() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Analytics"
        description="Insights into your teaching performance & student outcomes"
        action={
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            <Sparkles className="h-3 w-3" /> Updated 2 min ago
          </div>
        }
      />

      {/* KPI insights */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Avg Class Score" value={74.3} decimals={1} suffix="%" icon={Award} color="amber" trend={{ value: 3.2, up: true }} />
        <KpiCard index={1} label="Attendance Rate" value={94} suffix="%" icon={Activity} color="emerald" trend={{ value: 1.1, up: true }} />
        <KpiCard index={2} label="Homework Completion" value={86} suffix="%" icon={BookOpen} color="teal" trend={{ value: 4.5, up: true }} />
        <KpiCard index={3} label="Student Improvement" value={12} suffix="%" icon={TrendingUp} color="violet" trend={{ value: 2.8, up: true }} />
      </div>

      {/* Class performance + Completion donut */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard
            title="Class Performance"
            subtitle="Average marks across classes you teach"
            action={<span className="text-xs text-muted-foreground">Last 30 days</span>}
          >
            <SimpleBar data={CLASS_PERF} dataKey="marks" color="oklch(0.62 0.15 60)" />
            <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border/60 pt-3">
              {CLASS_PERF.map((c) => (
                <div key={c.name} className="text-center">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{c.name}</p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{c.marks}%</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={2}>
          <SectionCard title="Homework Completion" subtitle="Submission rate across your homework">
            <DonutChart data={COMPLETION_DONUT} />
            <div className="mt-2 space-y-2">
              {COMPLETION_DONUT.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </span>
                  <span className="font-semibold">{d.value}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Attendance trend + Growth comparison */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={3}>
          <SectionCard
            title="Attendance Trend"
            subtitle="Your class attendance rate, last 8 weeks"
            action={
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-3 w-3" /> +2% vs start
              </span>
            }
          >
            <SimpleLine data={ATTENDANCE_TREND} dataKey="attendance" color="oklch(0.7 0.16 150)" />
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={4}>
          <SectionCard
            title="Top vs Struggling Students"
            subtitle="Grade 10-A — focus areas for remedial"
            action={
              <span className="text-xs text-muted-foreground">3 need attention</span>
            }
          >
            <div className="space-y-2">
              {TOP_VS_STRUGGLING.map((s, i) => {
                const isStruggling = s.marks < 65
                const c = isStruggling ? "rose" : "emerald"
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                      isStruggling ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    )}>
                      {i + 1}
                    </span>
                    <span className="w-16 text-sm font-medium">{s.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.marks}%` }}
                        transition={{ duration: 1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        className={cn("h-full rounded-full", isStruggling ? "bg-rose-500" : "bg-emerald-500")}
                      />
                    </div>
                    <span className={cn(
                      "w-10 text-right text-sm font-bold",
                      isStruggling ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>{s.marks}%</span>
                  </motion.div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Insight cards */}
      <StaggerItem index={5}>
        <SectionCard title="Smart Insights" subtitle="AI-flagged patterns from your teaching data">
          <div className="grid gap-3 sm:grid-cols-2">
            {INSIGHTS.map((ins, i) => {
              const c = ins.tone === "good" ? "emerald" : ins.tone === "warn" ? "amber" : "violet"
              const col = colorOf2(c)
              return (
                <motion.div
                  key={ins.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                  className={cn("rounded-2xl border border-border/60 bg-card/50 p-4", col.softBg)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={cn("rounded-lg p-2", col.soft)}>
                      <ins.icon className={cn("h-4 w-4", col.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{ins.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{ins.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

const INSIGHTS = [
  { title: "Grade 10-A attendance improving", desc: "Up 4% in last 3 weeks — your morning warm-ups are working.", icon: TrendingUp, tone: "good" },
  { title: "3 students may need remedial support", desc: "Ananya, Krishna & Pari scored below 65% in last 2 assessments.", icon: GraduationCap, tone: "warn" },
  { title: "Homework completion at 86%", desc: "Above school average of 79%. Keep the momentum going.", icon: BookOpen, tone: "good" },
  { title: "Best time to teach: Period 1–2", desc: "Quiz scores peak when new topics are introduced in morning periods.", icon: Sparkles, tone: "info" },
]

// local helper to avoid extra imports for softBg
function colorOf2(c: string) {
  const map: Record<string, { soft: string; softBg: string; text: string }> = {
    emerald: { soft: "bg-emerald-500/10", softBg: "bg-emerald-500/[0.03]", text: "text-emerald-600 dark:text-emerald-400" },
    amber: { soft: "bg-amber-500/10", softBg: "bg-amber-500/[0.03]", text: "text-amber-600 dark:text-amber-400" },
    violet: { soft: "bg-violet-500/10", softBg: "bg-violet-500/[0.03]", text: "text-violet-600 dark:text-violet-400" },
  }
  return map[c] || map.emerald
}
