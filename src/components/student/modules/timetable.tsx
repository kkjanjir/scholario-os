"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { TIMETABLE } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Clock, MapPin, User, Printer, CalendarClock, Sparkles, Coffee, CircleDot,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const SUBJECT_COLOR: Record<string, string> = {
  Mathematics: "violet", English: "rose", Science: "emerald", "Social Science": "amber",
  "Computer Science": "sky", Hindi: "pink", Marathi: "teal", "Physical Education": "lime",
  Art: "fuchsia", Music: "cyan", Physics: "indigo", Chemistry: "teal", Biology: "lime",
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Generate a weekly grid by varying subjects per day using rotation
function buildWeekly() {
  return DAYS.map((day, di) => {
    return TIMETABLE.map((slot, pi) => {
      const subs = ["Mathematics", "English", "Science", "Social Science", "Hindi", "Computer Science", "Physical Education", "Art"]
      // rotate subjects per day so each day is different
      const subj = subs[(pi + di) % subs.length]
      const teachers: Record<string, string> = {
        Mathematics: "Rajesh Kulkarni", English: "Meera Nair", Science: "Suresh Patil",
        "Social Science": "Priya Sharma", Hindi: "Sneha Joshi", "Computer Science": "Amit Verma",
        "Physical Education": "Vikram Singh", Art: "Fatima Sheikh",
      }
      const rooms: Record<string, string> = {
        Mathematics: "B-201", English: "B-201", Science: "Lab-1", "Social Science": "B-201",
        Hindi: "B-201", "Computer Science": "Lab-2", "Physical Education": "Ground", Art: "Art Room",
      }
      return { ...slot, subject: subj, teacher: teachers[subj], room: rooms[subj] }
    })
  })
}

export function TimetableModule() {
  const weekly = buildWeekly()
  const todayIdx = 0 // Monday
  const nowPeriod = 1 // 2nd period ongoing for demo

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Timetable"
        description="Daily schedule & full weekly grid"
        action={
          <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Timetable sent to print queue 🖨️")}>
            <Printer className="h-4 w-4" /> Print Timetable
          </Button>
        }
      />

      {/* Today's timeline */}
      <StaggerItem index={1}>
        <SectionCard title="Today's Classes" subtitle={`${DAYS[todayIdx]} • ${new Date("2025-12-04").toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`}>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-transparent" />
            <div className="space-y-3">
              {weekly[todayIdx].map((slot, i) => {
                const isNow = i === nowPeriod
                const isLunch = slot.period === 4 && slot.time.startsWith("10:30") === false
                const c = colorOf(SUBJECT_COLOR[slot.subject] || "violet")
                return (
                  <motion.div
                    key={slot.period}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex items-center gap-4 pl-2"
                  >
                    {/* dot */}
                    <div className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
                      isNow ? "bg-violet-500 text-white" : cn(c.bg, "text-white"),
                    )}>
                      {isNow ? (
                        <span className="absolute inset-0 animate-ping rounded-full bg-violet-500 opacity-60" />
                      ) : null}
                      <CircleDot className="relative h-5 w-5" />
                    </div>
                    {/* card */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={cn(
                        "flex flex-1 items-center gap-3 rounded-2xl border p-3 transition-colors",
                        isNow ? "border-violet-500/40 bg-violet-500/5 ring-1 ring-violet-500/20" : "border-border/60 bg-card/50",
                      )}
                    >
                      <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
                        <Clock className={cn("h-4 w-4", c.text)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold">{slot.subject}</p>
                          {isNow && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" /> Now
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {slot.time}</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {slot.room}</span>
                          <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {slot.teacher}</span>
                        </div>
                      </div>
                      <span className="hidden shrink-0 rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground sm:inline">
                        P{slot.period}
                      </span>
                    </motion.div>
                  </motion.div>
                )
              })}
              {/* Lunch break */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: weekly[todayIdx].length * 0.05, duration: 0.4 }}
                className="relative flex items-center gap-4 pl-2"
              >
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white ring-4 ring-background">
                  <Coffee className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-3">
                  <div className="rounded-xl bg-amber-500/15 p-2.5">
                    <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-700 dark:text-amber-400">Lunch Break 🍱</p>
                    <p className="text-xs text-muted-foreground">12:00 – 13:00 • Recharge for afternoon classes</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Weekly grid */}
      <StaggerItem index={2}>
        <SectionCard
          title="Weekly Timetable"
          subtitle="Monday to Saturday • 8 periods per day"
          bodyClassName="p-0"
          action={
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" /> Color-coded by subject
            </span>
          }
        >
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              {/* header */}
              <div className="grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-1 border-b border-border/60 bg-muted/30 px-4 py-2">
                <div className="flex items-center justify-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <CalendarClock className="h-4 w-4" />
                </div>
                {DAYS.map((d) => (
                  <div key={d} className={cn(
                    "rounded-lg px-2 py-1.5 text-center text-xs font-semibold uppercase tracking-wide",
                    d === DAYS[todayIdx] ? "bg-violet-500/15 text-violet-600 dark:text-violet-400" : "text-muted-foreground",
                  )}>
                    {d.slice(0, 3)}
                  </div>
                ))}
              </div>
              {/* rows: 8 periods */}
              {Array.from({ length: 8 }).map((_, pi) => (
                <div key={pi} className="grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-1 px-4 py-1.5">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-muted/30 px-1 py-1 text-center">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">P{pi + 1}</span>
                    <span className="text-[9px] text-muted-foreground">{weekly[0][pi]?.time.split("–")[0]}</span>
                  </div>
                  {DAYS.map((d, di) => {
                    const slot = weekly[di][pi]
                    const c = colorOf(SUBJECT_COLOR[slot.subject] || "violet")
                    const isToday = di === todayIdx
                    return (
                      <motion.div
                        key={d}
                        whileHover={{ scale: 1.04, y: -2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        title={`${slot.subject} • ${slot.teacher} • ${slot.room}`}
                        className={cn(
                          "rounded-xl p-2 ring-1",
                          c.soft, c.ring,
                          isToday && "ring-2 ring-violet-500/50",
                        )}
                      >
                        <p className={cn("truncate text-xs font-semibold", c.text)}>{slot.subject}</p>
                        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{slot.room}</p>
                      </motion.div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Subject legend */}
      <StaggerItem index={3}>
        <SectionCard title="Subject Colors" subtitle="Legend for the weekly grid">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(SUBJECT_COLOR).map(([s, c]) => {
              const ic = colorOf(c)
              return (
                <div key={s} className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2">
                  <span className={cn("h-3 w-3 rounded", ic.dot)} />
                  <span className="text-xs font-medium">{s}</span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
