"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, EmptyState } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { CALENDAR_EVENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  CalendarDays, Clock, Cake, GraduationCap, PartyPopper, PalmtreeIcon,
  Users, Bell, ChevronRight, Sparkles,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const TYPE_META: Record<string, { color: string; label: string; icon: any }> = {
  exam: { color: "rose", label: "Exam", icon: GraduationCap },
  event: { color: "violet", label: "Event", icon: PartyPopper },
  ptm: { color: "amber", label: "PTM", icon: Users },
  birthday: { color: "pink", label: "Birthday", icon: Cake },
  holiday: { color: "emerald", label: "Holiday", icon: PalmtreeIcon },
  meeting: { color: "sky", label: "Meeting", icon: Bell },
}

const FILTER_TABS = [
  { id: "all", label: "All", color: "violet" },
  { id: "exam", label: "Exams", color: "rose" },
  { id: "event", label: "Events", color: "violet" },
  { id: "holiday", label: "Holidays", color: "emerald" },
  { id: "birthday", label: "Birthdays", color: "pink" },
]

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function matchesFilter(type: string, filter: string) {
  if (filter === "all") return true
  if (filter === "event") return type === "event" || type === "ptm" || type === "meeting"
  return type === filter
}

export function CalendarModule() {
  const year = 2025
  const month = 11 // December
  const startWeekday = new Date(year, month, 1).getDay() // 1 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate() // 31
  const today = 8 // demo "today" = Dec 8

  const [filter, setFilter] = useState("all")
  const [selectedDay, setSelectedDay] = useState<number | null>(today)

  // Filter events for December 2025
  const monthEvents = CALENDAR_EVENTS.filter((e) => e.date.startsWith("2025-12"))
  const eventsByDay: Record<number, typeof CALENDAR_EVENTS> = {}
  monthEvents.forEach((e) => {
    const day = Number(e.date.slice(8))
    if (!eventsByDay[day]) eventsByDay[day] = []
    eventsByDay[day].push(e)
  })

  const filteredEvents = (day: number) => (eventsByDay[day] || []).filter((e) => matchesFilter(e.type, filter))

  const selectedEvents = selectedDay ? filteredEvents(selectedDay) : []

  const upcoming = [...monthEvents]
    .filter((e) => Number(e.date.slice(8)) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <PageHeader title="School Calendar" description="December 2025 — events, exams, holidays & birthdays" />

      <StaggerItem index={1}>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="rounded-xl">
            {FILTER_TABS.map((t) => {
              const count = t.id === "all"
                ? monthEvents.length
                : monthEvents.filter((e) => matchesFilter(e.type, t.id)).length
              return (
                <TabsTrigger key={t.id} value={t.id} className="rounded-lg">
                  {t.label} ({count})
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Calendar grid */}
              <div className="lg:col-span-2">
                <SectionCard
                  title="December 2025"
                  subtitle="Click any day to view events"
                  action={
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                      <Sparkles className="h-3 w-3" /> {monthEvents.length} events this month
                    </span>
                  }
                >
                  <div className="grid grid-cols-7 gap-1.5">
                    {DOW.map((d) => (
                      <div key={d} className="pb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {d}
                      </div>
                    ))}
                    {Array.from({ length: startWeekday }).map((_, i) => (
                      <div key={`b-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const events = filteredEvents(day)
                      const isToday = day === today
                      const isSelected = day === selectedDay
                      const isWeekend = ((startWeekday + i) % 7 === 0) || ((startWeekday + i) % 7 === 6)
                      return (
                        <motion.button
                          key={day}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.012, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ scale: 1.06, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => { setSelectedDay(day); toast.info(`December ${day} — ${events.length} event${events.length === 1 ? "" : "s"}`) }}
                          className={cn(
                            "relative flex aspect-square flex-col items-center justify-center rounded-xl border p-1 transition-colors",
                            isSelected ? "border-violet-500 bg-violet-500/10" : "border-border/60 bg-card/40 hover:bg-accent/40",
                            isToday && !isSelected && "ring-2 ring-violet-500/60 ring-offset-1 ring-offset-background",
                            isWeekend && "bg-muted/30",
                          )}
                        >
                          <span className={cn(
                            "text-xs font-semibold",
                            isToday ? "text-violet-600 dark:text-violet-400" : isWeekend ? "text-muted-foreground" : "",
                          )}>
                            {day}
                          </span>
                          {events.length > 0 && (
                            <div className="absolute bottom-1 flex items-center gap-0.5">
                              {events.slice(0, 3).map((e, idx) => (
                                <span key={idx} className={cn("h-1.5 w-1.5 rounded-full", colorOf(TYPE_META[e.type]?.color || "violet").dot)} />
                              ))}
                              {events.length > 3 && <span className="text-[8px] font-bold text-muted-foreground">+{events.length - 3}</span>}
                            </div>
                          )}
                          {isToday && (
                            <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 items-center justify-center">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                            </span>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </SectionCard>
              </div>

              {/* Selected day events */}
              <SectionCard
                title={selectedDay ? `December ${selectedDay}` : "Select a day"}
                subtitle={selectedDay ? new Date(year, month, selectedDay).toLocaleDateString("en-IN", { weekday: "long" }) : "Click a date"}
                bodyClassName="p-4"
              >
                <AnimatePresence mode="wait">
                  {selectedEvents.length > 0 ? (
                    <motion.div
                      key={selectedDay}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2.5"
                    >
                      {selectedEvents.map((e, i) => {
                        const m = TYPE_META[e.type] || TYPE_META.event
                        const c = colorOf(m.color)
                        return (
                          <motion.div
                            key={e.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className={cn("flex items-start gap-3 rounded-xl border p-3 ring-1", c.soft, c.ring, "border-border/60")}
                          >
                            <div className={cn("rounded-lg p-2 bg-background/60", c.text)}>
                              <m.icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold leading-tight">{e.title}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                <span className="capitalize">{e.type}</span> • {e.time}
                              </p>
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  ) : (
                    <EmptyState icon={CalendarDays} title="No events" desc={selectedDay ? "Nothing scheduled for this day." : "Pick a date to view events."} />
                  )}
                </AnimatePresence>
              </SectionCard>
            </div>
          </TabsContent>
        </Tabs>
      </StaggerItem>

      {/* Upcoming + legend */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={2} className="lg:col-span-2">
          <SectionCard title="Upcoming Events" subtitle="Next 6 events from today" bodyClassName="p-0">
            <div className="divide-y divide-border/50">
              {upcoming.map((e, i) => {
                const m = TYPE_META[e.type] || TYPE_META.event
                const c = colorOf(m.color)
                const day = Number(e.date.slice(8))
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/40"
                  >
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-white" style={{ background: `oklch(0.6 0.2 ${c === colorOf("rose") ? 15 : c === colorOf("violet") ? 300 : c === colorOf("emerald") ? 160 : c === colorOf("pink") ? 350 : c === colorOf("amber") ? 70 : 200})` }}>
                      <span className="text-[9px] font-semibold uppercase opacity-90">Dec</span>
                      <span className="text-base font-bold leading-none">{day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{e.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{e.type} • {e.time}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </motion.div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={3}>
          <SectionCard title="Legend" subtitle="Event types">
            <div className="space-y-2.5">
              {Object.entries(TYPE_META).map(([k, m]) => {
                const c = colorOf(m.color)
                return (
                  <div key={k} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-2.5">
                    <div className={cn("rounded-lg p-2", c.soft)}>
                      <m.icon className={cn("h-4 w-4", c.text)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{m.label}</p>
                    </div>
                    <span className={cn("h-3 w-3 rounded-full", c.dot)} />
                  </div>
                )
              })}
              <div className="mt-2 flex items-start gap-2 rounded-xl border border-violet-500/30 bg-violet-500/5 p-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                <p className="text-xs text-muted-foreground">
                  All times are in IST. Subscribe to calendar updates from the settings.
                </p>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}
