"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Users, UserCheck, UserX, Clock, Download, CalendarCheck,
  TrendingUp,
} from "lucide-react"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, KpiCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { AttendanceBarChart } from "@/components/shared/charts"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"

import { CLASSES_INFO, SECTIONS, STUDENTS, attendanceForClass } from "@/lib/mock/data"
import { cn } from "@/lib/utils"

const CLASS_OPTIONS = CLASSES_INFO.map((c) => c.name)

export function AttendanceModule() {
  const [className, setClassName] = useState("Grade 10")
  const [section, setSection] = useState("A")
  const [tab, setTab] = useState("daily")

  const att = useMemo(() => attendanceForClass(className, section), [className, section])
  const today = att.data[att.data.length - 1]
  const presentPct = Math.round((today.present / att.total) * 100)

  // 30-day averages
  const totals = att.data.reduce(
    (acc, d) => ({
      present: acc.present + d.present,
      absent: acc.absent + d.absent,
      late: acc.late + d.late,
      leave: acc.leave + d.leave,
    }),
    { present: 0, absent: 0, late: 0, leave: 0 }
  )
  const avgPresent = Math.round(totals.present / att.data.filter((d) => d.present > 0).length)
  const avgAbsent = Math.round(totals.absent / att.data.filter((d) => d.present > 0).length)
  const avgLate = Math.round(totals.late / att.data.filter((d) => d.present > 0).length)

  const classStudents = STUDENTS.filter((s) => s.className === className && s.section === section).slice(0, 14)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Daily, monthly & calendar view with class-wise insights"
        action={
          <Button variant="outline" onClick={() => toast.success("Attendance report exported to PDF")}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        }
      />

      {/* class selector */}
      <StaggerItem index={0}>
        <SectionCard title="Select Class & Section" subtitle="Choose the class to view attendance">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Class</label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Section</label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto flex items-center gap-2 rounded-xl bg-muted/40 px-4 py-2.5">
              <CalendarCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Today</p>
                <p className="text-sm font-bold">{new Date(today.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {presentPct}% present</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* today's KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Present Today" value={today.present} icon={UserCheck} color="emerald" trend={{ value: 1.4, up: true }} />
        <KpiCard index={1} label="Absent" value={today.absent} icon={UserX} color="rose" trend={{ value: 0.6, up: false }} />
        <KpiCard index={2} label="Late Arrivals" value={today.late} icon={Clock} color="amber" />
        <KpiCard index={3} label="On Leave" value={today.leave} icon={Users} color="violet" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <p className="text-xs text-muted-foreground">Showing {className} – Section {section} · {att.total} students</p>
        </div>

        {/* Daily */}
        <TabsContent value="daily" className="mt-4 space-y-4">
          <StaggerItem index={1}>
            <SectionCard
              title="Today's Attendance"
              subtitle={`${className} – Section ${section} · ${new Date(today.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {classStudents.map((s, i) => {
                  const st = i % 9 === 0 ? "Absent" : i % 7 === 0 ? "Late" : i % 11 === 0 ? "Leave" : "Present"
                  const c = colorOf(s.avatarColor)
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3"
                    >
                      <Avatar name={s.name} color={s.avatarColor} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground">Roll #{s.rollNo} · {s.libraryId}</p>
                      </div>
                      <StatusBadge status={st === "Present" ? "Good" : st === "Absent" ? "Absent" : st === "Late" ? "Late" : "Open"} />
                    </motion.div>
                  )
                })}
              </div>
            </SectionCard>
          </StaggerItem>

          <StaggerItem index={2}>
            <SectionCard title="30-Day Attendance Trend" subtitle="Present, late & absent counts per day">
              <AttendanceBarChart data={att.data} />
            </SectionCard>
          </StaggerItem>
        </TabsContent>

        {/* Monthly */}
        <TabsContent value="monthly" className="mt-4 space-y-4">
          <StaggerItem index={1}>
            <SectionCard title="Monthly Summary" subtitle="30-day aggregates for this class">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <MonthStat color="emerald" icon={UserCheck} label="Avg Present / Day" value={avgPresent} total={att.total} />
                <MonthStat color="rose" icon={UserX} label="Avg Absent / Day" value={avgAbsent} total={att.total} />
                <MonthStat color="amber" icon={Clock} label="Avg Late / Day" value={avgLate} total={att.total} />
                <MonthStat color="violet" icon={TrendingUp} label="Avg Attendance %" value={Math.round((avgPresent / att.total) * 100)} total={100} suffix="%" />
              </div>
            </SectionCard>
          </StaggerItem>

          <StaggerItem index={2}>
            <SectionCard title="Daily Breakdown" subtitle="Per-day attendance records (last 30 days)">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {att.data.slice().reverse().map((d, i) => {
                  const pct = Math.round((d.present / att.total) * 100)
                  const c = pct >= 90 ? "emerald" : pct >= 75 ? "amber" : "rose"
                  const cc = colorOf(c)
                  return (
                    <motion.div
                      key={d.date}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.015 }}
                      className={cn("rounded-xl border border-border/60 p-2.5 text-center", cc.soft)}
                    >
                      <p className="text-[10px] font-medium text-muted-foreground">{new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                      <p className={cn("mt-0.5 text-lg font-bold", cc.text)}>{pct}%</p>
                      <p className="text-[10px] text-muted-foreground">{d.present}/{att.total}</p>
                    </motion.div>
                  )
                })}
              </div>
            </SectionCard>
          </StaggerItem>
        </TabsContent>

        {/* Calendar heatmap */}
        <TabsContent value="calendar" className="mt-4">
          <StaggerItem index={1}>
            <SectionCard title="Calendar Heatmap" subtitle="Color-coded by attendance status · last 30 days">
              <CalendarHeatmap data={att.data} total={att.total} />
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px]">
                <LegendDot color="emerald" label="≥90% Present" />
                <LegendDot color="amber" label="75–89% Late-heavy" />
                <LegendDot color="rose" label="<75% Absent-heavy" />
                <LegendDot color="slate" label="Weekend / Holiday" />
              </div>
            </SectionCard>
          </StaggerItem>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MonthStat({ color, icon: Icon, label, value, total, suffix = "" }: {
  color: string; icon: any; label: string; value: number; total: number; suffix?: string
}) {
  const c = colorOf(color)
  const pct = Math.round((value / total) * 100)
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
      <div className={cn("inline-flex rounded-lg p-2", c.soft)}>
        <Icon className={cn("h-4 w-4", c.text)} />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}{suffix}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={cn("h-full rounded-full", c.bg)}
        />
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const c = colorOf(color)
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-sm", c.bg)} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}

function CalendarHeatmap({ data, total }: {
  data: { date: string; present: number; absent: number; late: number; leave: number }[]
  total: number
}) {
  // Build a calendar grid: weeks as rows, weekdays as columns
  // Map over data and find day-of-week for each entry, then fill grid
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const cells: (typeof data[number] | null)[] = []

  // Pad beginning to align with weekday
  const first = new Date(data[0].date)
  const firstDow = first.getDay()
  for (let i = 0; i < firstDow; i++) cells.push(null)
  data.forEach((d) => cells.push(d))

  // Pad end to fill weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (typeof data[number] | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  function colorFor(d: typeof data[number]): string {
    const dow = new Date(d.date).getDay()
    if (dow === 0 || dow === 6) return "bg-slate-400/20 text-muted-foreground"
    const pct = (d.present / total) * 100
    const lateRatio = d.late / total
    if (pct >= 90) return "bg-emerald-500/80 text-white"
    if (pct < 75) return "bg-rose-500/80 text-white"
    if (lateRatio > 0.05) return "bg-amber-500/80 text-white"
    return "bg-emerald-500/50 text-emerald-50"
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1.5 text-[10px]">
          <div />
          {weekdayLabels.map((d) => (
            <div key={d} className="px-1 text-center font-semibold text-muted-foreground">{d}</div>
          ))}
          {weeks.map((week, wi) => (
            <WeekRow key={wi} week={week} wi={wi} colorFor={colorFor} total={total} />
          ))}
        </div>
      </div>
    </div>
  )
}

function WeekRow({ week, wi, colorFor, total }: {
  week: any[]; wi: number; colorFor: (d: any) => string; total: number
}) {
  return (
    <>
      <div className="flex items-center justify-center text-[10px] text-muted-foreground">W{wi + 1}</div>
      {week.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (wi * 7 + i) * 0.01, duration: 0.3 }}
          whileHover={{ scale: 1.15 }}
          className={cn(
            "flex aspect-square min-h-[44px] flex-col items-center justify-center rounded-lg text-[10px] font-medium",
            !d && "bg-transparent",
            d && colorFor(d)
          )}
          title={d ? `${d.date} · Present ${d.present}/${total} · Absent ${d.absent} · Late ${d.late}` : ""}
        >
          {d && (
            <>
              <span className="text-xs font-bold">{new Date(d.date).getDate()}</span>
              <span className="opacity-80">{d.present}/{total}</span>
            </>
          )}
        </motion.div>
      ))}
    </>
  )
}
