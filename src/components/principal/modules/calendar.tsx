"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, CalendarDays, ChevronLeft, ChevronRight, Clock,
  BookOpen, Users, GraduationCap, PartyPopper, Palmtree, Briefcase,
} from "lucide-react"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, KpiCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { cn } from "@/lib/utils"
import { CALENDAR_EVENTS } from "@/lib/mock/data"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface CalEvent {
  id: string
  date: string
  title: string
  type: "exam" | "event" | "ptm" | "birthday" | "holiday" | "meeting"
  time: string
}

const EVENT_TYPES = [
  { id: "exam", label: "Exams", color: "rose", dot: "bg-rose-500", icon: BookOpen },
  { id: "event", label: "Events", color: "violet", dot: "bg-violet-500", icon: PartyPopper },
  { id: "ptm", label: "PTM", color: "amber", dot: "bg-amber-500", icon: Users },
  { id: "birthday", label: "Birthdays", color: "pink", dot: "bg-pink-500", icon: PartyPopper },
  { id: "holiday", label: "Holidays", color: "emerald", dot: "bg-emerald-500", icon: Palmtree },
  { id: "meeting", label: "Meetings", color: "sky", dot: "bg-sky-500", icon: Briefcase },
] as const

function typeColor(type: string) {
  return EVENT_TYPES.find((t) => t.id === type)?.dot || "bg-slate-400"
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function formatDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function buildCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const cells: { date: string | null; day: number | null; isCurrentMonth: boolean }[] = []
  // leading days from previous month
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    const date = new Date(year, month - 1, d)
    cells.push({ date: formatDateStr(date), day: d, isCurrentMonth: false })
  }
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d)
    cells.push({ date: formatDateStr(date), day: d, isCurrentMonth: true })
  }
  // trailing days
  while (cells.length % 7 !== 0) {
    const next = cells.length
    const d = next - totalDays - startWeekday + 1
    const date = new Date(year, month + 1, d)
    cells.push({ date: formatDateStr(date), day: d, isCurrentMonth: false })
  }
  return cells
}

export function CalendarModule() {
  // December 2025: starts on Monday (Dec 1, 2025 is a Monday)
  const [viewDate, setViewDate] = useState(new Date(2025, 11, 1)) // Dec 2025
  const [selectedDate, setSelectedDate] = useState<string>("2025-12-08")
  const [activeTypes, setActiveTypes] = useState<string[]>(EVENT_TYPES.map((t) => t.id))
  const [addOpen, setAddOpen] = useState(false)
  const [events, setEvents] = useState<CalEvent[]>(CALENDAR_EVENTS as CalEvent[])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Build calendar grid (with leading/trailing days)
  const grid = buildCalendarGrid(year, month)

  const filteredEvents = useMemo(() => {
    return events.filter((e) => activeTypes.includes(e.type))
  }, [events, activeTypes])

  const eventsForSelected = filteredEvents.filter((e) => e.date === selectedDate)
  const monthEvents = filteredEvents.filter((e) => e.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
  const upcomingEvents = filteredEvents
    .filter((e) => e.date >= formatDateStr(new Date()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)

  const toggleType = (id: string) => {
    setActiveTypes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const handleAdd = (data: { title: string; date: string; time: string; type: CalEvent["type"] }) => {
    const newEv: CalEvent = {
      id: `e_${Date.now()}`,
      date: data.date,
      title: data.title,
      type: data.type,
      time: data.time,
    }
    setEvents((prev) => [...prev, newEv].sort((a, b) => a.date.localeCompare(b.date)))
    setAddOpen(false)
    toast.success("Event added to calendar", { description: `${data.title} · ${data.date}` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Calendar"
        description="Plan events, exams, holidays & meetings across the academic year"
        action={
          <Button onClick={() => setAddOpen(true)} className="shadow-premium">
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Events This Month" value={monthEvents.length} icon={CalendarDays} color="emerald" />
        <KpiCard index={1} label="Upcoming" value={upcomingEvents.length} icon={Clock} color="violet" />
        <KpiCard index={2} label="Holidays" value={events.filter((e) => e.type === "holiday").length} icon={Palmtree} color="teal" />
        <KpiCard index={3} label="Exams" value={events.filter((e) => e.type === "exam").length} icon={BookOpen} color="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Calendar grid */}
        <StaggerItem index={0} className="lg:col-span-2">
          <SectionCard
            title={`${MONTHS[month]} ${year}`}
            subtitle="Click a day to view events"
            action={
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => setViewDate(new Date(2025, 11, 1))}>Today</Button>
                <Button size="icon" variant="ghost" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            }
          >
            {/* Type filter chips */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {EVENT_TYPES.map((t) => {
                const Icon = t.icon
                const active = activeTypes.includes(t.id)
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleType(t.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      active ? "border-border/80 bg-card text-foreground" : "border-border/40 bg-muted/40 text-muted-foreground line-through"
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", t.dot)} />
                    {t.label}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{d}</div>
              ))}
              {grid.map((cell, i) => {
                if (!cell.date) return <div key={i} />
                const dayEvents = filteredEvents.filter((e) => e.date === cell.date)
                const isToday = cell.date === formatDateStr(new Date())
                const isSelected = cell.date === selectedDate
                return (
                  <motion.button
                    key={cell.date}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.005 }}
                    onClick={() => setSelectedDate(cell.date!)}
                    whileHover={{ y: -1 }}
                    className={cn(
                      "relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition-colors",
                      cell.isCurrentMonth ? "border-border/50 bg-card hover:bg-accent/30" : "border-transparent bg-muted/20 text-muted-foreground/50",
                      isSelected && "ring-2 ring-primary",
                      isToday && "border-primary bg-primary/5 font-bold"
                    )}
                  >
                    <span className={cn(isToday && "text-primary")}>{cell.day}</span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 flex flex-wrap items-center justify-center gap-0.5">
                        {dayEvents.slice(0, 3).map((e) => (
                          <span key={e.id} className={cn("h-1.5 w-1.5 rounded-full", typeColor(e.type))} />
                        ))}
                        {dayEvents.length > 3 && <span className="text-[8px] text-muted-foreground">+{dayEvents.length - 3}</span>}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>

        {/* Day events panel */}
        <StaggerItem index={1}>
          <SectionCard
            title={new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            subtitle={`${eventsForSelected.length} event(s) scheduled`}
            bodyClassName="space-y-3"
          >
            {eventsForSelected.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-xl bg-muted p-3">
                  <CalendarDays className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm font-medium">No events</p>
                <p className="text-xs text-muted-foreground">This day is free.</p>
              </div>
            ) : (
              eventsForSelected.map((e, i) => <DayEventCard key={e.id} event={e} index={i} />)
            )}
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Event list with filter */}
      <StaggerItem index={2}>
        <SectionCard title="All Events" subtitle={`${filteredEvents.length} of ${events.length} events`} bodyClassName="space-y-4">
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <label key={t.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs hover:bg-accent/30">
                <Checkbox checked={activeTypes.includes(t.id)} onCheckedChange={() => toggleType(t.id)} />
                <span className={cn("h-2 w-2 rounded-full", t.dot)} />
                <span className="font-medium">{t.label}</span>
              </label>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3"
              >
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl border border-border/60 bg-card">
                  <span className="text-[9px] font-semibold uppercase text-muted-foreground">{e.date.slice(5, 7)}</span>
                  <span className="text-sm font-bold leading-none">{e.date.slice(8)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.time} · <span className="capitalize">{e.type}</span></p>
                </div>
                <span className={cn("h-2.5 w-2.5 rounded-full", typeColor(e.type))} />
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>

      <AddEventDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAdd} />
    </div>
  )
}

function DayEventCard({ event, index }: { event: CalEvent; index: number }) {
  const t = EVENT_TYPES.find((x) => x.id === event.type)
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3"
    >
      <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", typeColor(event.type))} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">{event.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> {event.time}
          <span className="opacity-50">·</span>
          <span className="capitalize">{t?.label || event.type}</span>
        </p>
      </div>
    </motion.div>
  )
}

function AddEventDialog({
  open, onOpenChange, onAdd,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onAdd: (data: { title: string; date: string; time: string; type: CalEvent["type"] }) => void
}) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("2025-12-15")
  const [time, setTime] = useState("09:00")
  const [type, setType] = useState<CalEvent["type"]>("event")

  const submit = () => {
    if (!title) {
      toast.error("Event title is required")
      return
    }
    onAdd({ title, date, time, type })
    setTitle("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Calendar Event</DialogTitle>
          <DialogDescription>Schedule a new event for the school calendar.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Event Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Annual Day Function" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Event Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as CalEvent["type"])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Plus className="h-4 w-4" /> Add Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
