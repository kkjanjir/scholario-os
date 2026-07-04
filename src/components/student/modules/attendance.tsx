"use client"

import { motion } from "framer-motion"
import { PageHeader, StatPill } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { RadialGauge, SimpleLine } from "@/components/shared/charts"
import { STUDENTS, studentAttendanceHeatmap } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  CalendarCheck, Check, X, Clock, Plane, Info, TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const STATUS_STYLES: Record<string, { cell: string; ring: string; label: string }> = {
  present: { cell: "bg-emerald-500 text-white", ring: "ring-emerald-500/30", label: "Present" },
  late: { cell: "bg-amber-500 text-white", ring: "ring-amber-500/30", label: "Late" },
  absent: { cell: "bg-rose-500 text-white", ring: "ring-rose-500/30", label: "Absent" },
  leave: { cell: "bg-violet-500 text-white", ring: "ring-violet-500/30", label: "On Leave" },
  holiday: { cell: "bg-muted text-muted-foreground", ring: "ring-border/40", label: "Weekend / Holiday" },
}

export function AttendanceModule() {
  const me = STUDENTS[0]
  const heatmap = studentAttendanceHeatmap(me.id)
  const statuses = heatmap.filter((c) => c.status !== "holiday").map((c) => c.status)

  // Build December 2025 calendar grid
  const year = 2025
  const month = 11 // December (0-indexed)
  const startWeekday = new Date(year, month, 1).getDay() // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: { day: number; status: keyof typeof STATUS_STYLES; isToday?: boolean }[] = []
  let weekdayIdx = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay()
    const isWeekend = dow === 0 || dow === 6
    cells.push({
      day: d,
      status: isWeekend ? "holiday" : (statuses[weekdayIdx++ % statuses.length] as keyof typeof STATUS_STYLES),
      isToday: d === 8,
    })
  }

  const counts = cells.reduce(
    (acc, c) => { if (c.status !== "holiday") acc[c.status] = (acc[c.status] || 0) + 1; return acc },
    {} as Record<string, number>,
  )
  const present = counts.present || 0
  const absent = counts.absent || 0
  const late = counts.late || 0
  const leave = counts.leave || 0
  const totalSchoolDays = present + absent + late + leave
  const pct = totalSchoolDays ? Math.round((present / totalSchoolDays) * 100) : 0

  const trend = [
    { name: "Aug", value: 88 },
    { name: "Sep", value: 92 },
    { name: "Oct", value: 85 },
    { name: "Nov", value: 90 },
    { name: "Dec", value: pct },
  ]

  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance"
        description="December 2025 — daily attendance heatmap & stats"
        action={
          <Button variant="outline" className="rounded-xl" onClick={() => toast.info("Attendance certificate request sent to class teacher.")}>
            Request Certificate
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Gauge */}
        <StaggerItem index={1}>
          <SectionCard title="Overall Attendance" subtitle="Current term" className="h-full">
            <div className="flex flex-col items-center">
              <RadialGauge value={me.attendancePct} label="Present" color="oklch(0.6 0.21 300)" />
              <div className="mt-4 flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" /> +2.4% vs last term
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                You&apos;ve maintained above 75% attendance — required for board exams ✅
              </p>
            </div>
          </SectionCard>
        </StaggerItem>

        {/* Stats pills */}
        <StaggerItem index={2} className="lg:col-span-2">
          <SectionCard title="December Breakdown" subtitle={`${totalSchoolDays} school days`}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile icon={Check} label="Present" value={present} color="emerald" />
              <StatTile icon={Clock} label="Late" value={late} color="amber" />
              <StatTile icon={X} label="Absent" value={absent} color="rose" />
              <StatTile icon={Plane} label="On Leave" value={leave} color="violet" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">This Month Rate</p>
                <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">
                  <AnimatedCounter value={pct} suffix="%" />
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-violet-500" />
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Consecutive Present</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  <AnimatedCounter value={12} /> <span className="text-sm font-medium text-muted-foreground">days 🔥</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Personal best this term!</p>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Heatmap calendar */}
      <StaggerItem index={3}>
        <SectionCard title="December 2025 Heatmap" subtitle="Color-coded daily attendance">
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-2">
              {DOW.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {d}
                </div>
              ))}
              {Array.from({ length: startWeekday }).map((_, i) => (
                <div key={`b-${i}`} className="aspect-square" />
              ))}
              {cells.map((c) => {
                const s = STATUS_STYLES[c.status]
                return (
                  <motion.div
                    key={c.day}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: c.day * 0.015, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    title={`${c.day} Dec — ${s.label}`}
                    className={cn(
                      "relative flex aspect-square cursor-pointer items-center justify-center rounded-xl text-xs font-semibold ring-1 transition-shadow",
                      s.cell, s.ring,
                      c.isToday && "ring-2 ring-violet-500 ring-offset-2 ring-offset-background",
                    )}
                  >
                    {c.day}
                    {c.isToday && (
                      <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {Object.entries(STATUS_STYLES).map(([k, s]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className={cn("h-3 w-3 rounded", s.cell.split(" ")[0])} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Trend + info */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={4} className="lg:col-span-2">
          <SectionCard title="Monthly Trend" subtitle="Attendance % over last 5 months">
            <SimpleLine data={trend} dataKey="value" color="oklch(0.6 0.21 300)" height={240} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={5}>
          <SectionCard title="Quick Stats" subtitle="At a glance">
            <div className="space-y-3">
              <StatPill label="Total School Days" value={String(totalSchoolDays)} color="violet" />
              <StatPill label="Days Present" value={String(present)} color="emerald" />
              <StatPill label="Days Absent" value={String(absent)} color="rose" />
              <div className="flex items-start gap-2 rounded-xl border border-violet-500/30 bg-violet-500/5 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                <p className="text-xs text-muted-foreground">
                  Attendance is calculated based on daily morning & afternoon roll calls.
                </p>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}

function StatTile({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20",
  }
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("rounded-2xl border border-border/60 p-4 ring-1", colors[color])}
    >
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5" />
        <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">
        <AnimatedCounter value={value} />
      </p>
    </motion.div>
  )
}
