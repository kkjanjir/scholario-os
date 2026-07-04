"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Printer, Clock, MapPin, Calendar, Radio, ArrowRight, Coffee,
} from "lucide-react"

interface Slot {
  period: number
  time: string
  subject: string
  teacher: string
  room: string
}

// Build a weekly grid (Mon–Sat) × (8 periods). Today's TIMETABLE fills Monday; other days vary by offset.
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "amber",
  English: "rose",
  Science: "violet",
  "Social Science": "teal",
  Hindi: "pink",
  "Computer Science": "sky",
  "Physical Education": "lime",
  Art: "orange",
  Chemistry: "cyan",
  Physics: "fuchsia",
}

const PERIODS = [
  { period: 1, time: "08:00–08:45" },
  { period: 2, time: "08:45–09:30" },
  { period: 3, time: "09:30–10:15" },
  { period: 4, time: "10:30–11:15" },
  { period: 5, time: "11:15–12:00" },
  { period: 6, time: "13:00–13:45" },
  { period: 7, time: "13:45–14:30" },
  { period: 8, time: "14:30–15:15" },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const BASE_TIMETABLE: Slot[] = [
  { period: 1, time: "08:00–08:45", subject: "Mathematics", teacher: "Rajesh Kulkarni", room: "B-201" },
  { period: 2, time: "08:45–09:30", subject: "English", teacher: "Meera Nair", room: "B-201" },
  { period: 3, time: "09:30–10:15", subject: "Science", teacher: "Suresh Patil", room: "Lab-1" },
  { period: 4, time: "10:30–11:15", subject: "Social Science", teacher: "Priya Sharma", room: "B-201" },
  { period: 5, time: "11:15–12:00", subject: "Hindi", teacher: "Sneha Joshi", room: "B-201" },
  { period: 6, time: "13:00–13:45", subject: "Computer Science", teacher: "Amit Verma", room: "Lab-2" },
  { period: 7, time: "13:45–14:30", subject: "Physical Education", teacher: "Vikram Singh", room: "Ground" },
  { period: 8, time: "14:30–15:15", subject: "Art", teacher: "Fatima Sheikh", room: "Art Room" },
]

// Rotations per day to vary the grid (so it doesn't look identical)
const ROTATIONS: Record<string, string[]> = {
  Tue: ["English", "Mathematics", "Social Science", "Science", "Computer Science", "Hindi", "Art", "Physical Education"],
  Wed: ["Science", "Hindi", "Mathematics", "English", "Social Science", "Chemistry", "Physical Education", "Computer Science"],
  Thu: ["Hindi", "Science", "English", "Mathematics", "Computer Science", "Social Science", "Art", "Physical Education"],
  Fri: ["Mathematics", "Social Science", "English", "Computer Science", "Science", "Hindi", "Physical Education", "Art"],
  Sat: ["Mathematics", "Mathematics", "Science", "English", "Hindi", "Art", "Physical Education", "—"],
}

const ROOMS: Record<string, string> = {
  Mathematics: "B-201",
  English: "B-201",
  Science: "Lab-1",
  "Social Science": "B-201",
  Hindi: "B-201",
  "Computer Science": "Lab-2",
  "Physical Education": "Ground",
  Art: "Art Room",
  Chemistry: "Lab-1",
}

function buildWeek(): Slot[][] {
  const week: Slot[][] = []
  // Monday = today
  week.push(BASE_TIMETABLE)
  for (let d = 1; d < 6; d++) {
    const day = DAYS[d]
    const rotation = ROTATIONS[day]
    const slots: Slot[] = PERIODS.map((p, i) => {
      const subject = rotation[i]
      return {
        period: p.period,
        time: p.time,
        subject,
        teacher: BASE_TIMETABLE.find((b) => b.subject === subject)?.teacher ?? "—",
        room: ROOMS[subject] ?? "B-201",
      }
    })
    week.push(slots)
  }
  return week
}

const NOW_PERIOD = 3 // current ongoing period

export function TimetableModule() {
  const week = buildWeek()
  const [view, setView] = useState<"today" | "week">("today")

  const today = week[0]
  const upcoming = today.filter((s, i) => i > NOW_PERIOD - 1).slice(0, 4)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable"
        description="Your teaching schedule at a glance"
        action={
          <div className="flex gap-2">
            <div className="flex gap-1 rounded-xl border border-border/60 bg-card/50 p-1">
              {(["today", "week"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    view === v ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {v === "today" ? "Today" : "Weekly"}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => toast.success("Timetable exported to PDF", { description: "Sent to school printer queue" })}>
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        }
      />

      {/* Today's schedule */}
      <StaggerItem index={1}>
        <SectionCard
          title="Today's Schedule"
          subtitle="Monday • 8 periods • 2 free periods"
          action={
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <Radio className="h-3 w-3 animate-pulse" /> Now: P{NOW_PERIOD}
            </div>
          }
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border/40">
            {today.map((s, i) => {
              const isNow = i + 1 === NOW_PERIOD
              const isPast = i + 1 < NOW_PERIOD
              const isBreak = s.period === 4
              const c = colorOf(SUBJECT_COLORS[s.subject] ?? "slate")
              return (
                <motion.div
                  key={s.period}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "relative flex items-center gap-4 px-5 py-3 transition-colors",
                    isNow && "bg-amber-500/5",
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white",
                    isPast ? "bg-muted text-muted-foreground" : isNow ? "bg-amber-600 text-white shadow-md" : cn(c.bg, "text-white")
                  )}>
                    <span className="text-[10px] font-semibold uppercase opacity-80">P{s.period}</span>
                    <span className="text-[9px] opacity-80">{s.time.split("–")[0]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-medium", isPast && "text-muted-foreground line-through")}>{s.subject}</p>
                    <p className="text-xs text-muted-foreground">{s.teacher} • {s.room}</p>
                  </div>
                  {isNow && (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300"
                    >
                      <Radio className="h-3 w-3" /> Live
                    </motion.span>
                  )}
                  {isPast && !isNow && (
                    <span className="text-xs text-muted-foreground">Done</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Weekly grid OR Upcoming list */}
      {view === "week" ? (
        <StaggerItem index={2}>
          <SectionCard
            title="Weekly Timetable"
            subtitle="Monday to Saturday • Periods 1–8"
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="border-b border-border/60 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Clock className="inline h-3 w-3" /> Period
                    </th>
                    {DAYS.map((d) => (
                      <th key={d} className={cn(
                        "border-b border-border/60 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
                        d === "Mon" && "text-amber-700 dark:text-amber-300"
                      )}>
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((p, pIdx) => (
                    <tr key={p.period} className="hover:bg-accent/20">
                      <td className="border-b border-border/40 px-3 py-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">P{p.period}</span>
                          <span className="text-[10px] text-muted-foreground">{p.time}</span>
                        </div>
                      </td>
                      {week.map((daySlots, dIdx) => {
                        const slot = daySlots[pIdx]
                        const c = colorOf(SUBJECT_COLORS[slot.subject] ?? "slate")
                        const isBreakSlot = slot.period === 4 && dIdx === 0
                        if (slot.subject === "—") {
                          return (
                            <td key={dIdx} className="border-b border-border/40 px-2 py-2 text-center">
                              <div className="flex h-16 items-center justify-center rounded-lg bg-muted/40 text-[10px] text-muted-foreground">
                                Free
                              </div>
                            </td>
                          )
                        }
                        return (
                          <td key={dIdx} className="border-b border-border/40 px-2 py-2">
                            <motion.div
                              whileHover={{ scale: 1.04, y: -2 }}
                              className={cn(
                                "flex h-16 flex-col justify-center rounded-lg border p-2",
                                c.soft, "border-transparent"
                              )}
                            >
                              <p className={cn("truncate text-[11px] font-semibold", c.text)}>{slot.subject}</p>
                              <p className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                                <MapPin className="h-2.5 w-2.5" /> {slot.room}
                              </p>
                            </motion.div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  {/* Lunch row */}
                  <tr>
                    <td className="border-b border-border/40 px-3 py-2 text-[10px] font-semibold text-muted-foreground">
                      12:00–13:00
                    </td>
                    {DAYS.map((d) => (
                      <td key={d} className="border-b border-border/40 px-2 py-2">
                        <div className="flex h-8 items-center justify-center gap-1 rounded-lg bg-amber-500/5 text-[10px] font-medium text-amber-700/70 dark:text-amber-300/70">
                          <Coffee className="h-3 w-3" /> Lunch
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </StaggerItem>
      ) : (
        <StaggerItem index={2}>
          <SectionCard title="Upcoming Classes" subtitle="Your next teaching sessions today">
            <div className="space-y-2">
              {upcoming.map((s, i) => {
                const c = colorOf(SUBJECT_COLORS[s.subject] ?? "slate")
                return (
                  <motion.div
                    key={s.period}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3"
                  >
                    <div className={cn("rounded-lg p-2", c.soft)}>
                      <Calendar className={cn("h-4 w-4", c.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.subject}</p>
                      <p className="text-xs text-muted-foreground">Period {s.period} • {s.time} • {s.room}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
      )}
    </div>
  )
}
