"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { CALENDAR_EVENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"

const TYPE_COLORS: Record<string, string> = {
  exam: "bg-rose-500", event: "bg-violet-500", ptm: "bg-amber-500",
  birthday: "bg-pink-500", holiday: "bg-emerald-500", meeting: "bg-sky-500",
}
const TYPE_LABEL: Record<string, string> = { exam: "Exam", event: "Event", ptm: "PTM", birthday: "Birthday", holiday: "Holiday", meeting: "Meeting" }

export function CalendarModule() {
  const [filter, setFilter] = useState<string>("all")
  const events = CALENDAR_EVENTS.filter((e) => filter === "all" || e.type === filter)

  const weeks = [
    ["", "1", "2", "3", "4", "5", "6"],
    ["7", "8", "9", "10", "11", "12", "13"],
    ["14", "15", "16", "17", "18", "19", "20"],
    ["21", "22", "23", "24", "25", "26", "27"],
    ["28", "29", "30", "31", "", "", ""],
  ]
  const eventsByDay: Record<string, typeof CALENDAR_EVENTS> = {}
  CALENDAR_EVENTS.forEach((e) => {
    const d = e.date.slice(8)
    if (!eventsByDay[d]) eventsByDay[d] = []
    eventsByDay[d].push(e)
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="School events, exams & important dates • December 2025" />

      <StaggerItem index={0}>
        <SectionCard title="December 2025" subtitle="Tap a date to see events"
          action={
            <div className="flex flex-wrap gap-1.5">
              {["all", "exam", "event", "ptm", "holiday", "birthday", "meeting"].map((t) => (
                <button key={t} onClick={() => setFilter(t)} className={cn("rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors", filter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>
                  {t === "all" ? "All" : TYPE_LABEL[t] || t}
                </button>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-7 gap-1.5">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="pb-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">{d}</div>
            ))}
            {weeks.flat().map((day, i) => (
              <div key={i} className={cn("min-h-[64px] rounded-lg border p-1.5", day ? "border-border/60 bg-card/40" : "border-transparent")}>
                {day && (
                  <>
                    <p className="text-xs font-semibold text-muted-foreground">{day}</p>
                    <div className="mt-1 space-y-0.5">
                      {(eventsByDay[day] || []).slice(0, 2).map((e) => (
                        <div key={e.id} className={cn("truncate rounded px-1 py-0.5 text-[9px] font-medium text-white", TYPE_COLORS[e.type])} title={e.title}>
                          {e.title}
                        </div>
                      ))}
                      {(eventsByDay[day] || []).length > 2 && <p className="text-[9px] text-muted-foreground">+{(eventsByDay[day] || []).length - 2} more</p>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>

      <StaggerItem index={1}>
        <SectionCard title="All Events" subtitle={`${events.length} events`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-3">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-[9px] font-semibold uppercase">{e.date.slice(5, 7)}</span>
                  <span className="text-base font-bold leading-none">{e.date.slice(8)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.time}</p>
                </div>
                <span className={cn("h-2.5 w-2.5 rounded-full", TYPE_COLORS[e.type])} />
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
