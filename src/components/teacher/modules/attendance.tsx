"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, StatPill } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { Avatar, colorOf } from "@/components/shared/brand"
import { StaggerItem } from "@/components/shared/motion"
import { Button } from "@/components/ui/button"
import { STUDENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  CalendarDays, Check, X, Clock, Plane, Save, CheckCheck, Sparkles, Users,
} from "lucide-react"

type Status = "present" | "absent" | "late" | "leave"

const STATUSES: { key: Status; label: string; color: string; icon: any }[] = [
  { key: "present", label: "Present", color: "emerald", icon: Check },
  { key: "absent", label: "Absent", color: "rose", icon: X },
  { key: "late", label: "Late", color: "amber", icon: Clock },
  { key: "leave", label: "Leave", color: "sky", icon: Plane },
]

const TEACHER_CLASSES = ["Grade 9-A", "Grade 10-A", "Grade 10-B"]

function classKey(c: string) {
  const [grade, section] = c.split("-")
  return { className: grade, section }
}

export function AttendanceModule() {
  const [activeClass, setActiveClass] = useState("Grade 10-A")
  const [marks, setMarks] = useState<Record<string, Status>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const students = useMemo(() => {
    const { className, section } = classKey(activeClass)
    return STUDENTS.filter((s) => s.className === className && s.section === section)
  }, [activeClass])

  // default everyone to present unless explicitly changed
  const summary = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, leave: 0 }
    students.forEach((s) => {
      const status: Status = marks[s.id] ?? "present"
      counts[status]++
    })
    return counts
  }, [students, marks])

  const today = new Date("2025-12-01").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  function setStatus(id: string, status: Status) {
    setMarks((m) => ({ ...m, [id]: status }))
  }

  function markAllPresent() {
    const next: Record<string, Status> = {}
    students.forEach((s) => (next[s.id] = "present"))
    setMarks(next)
    toast.success(`All ${students.length} students marked present`)
  }

  function save() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      toast.success(`Attendance saved for ${activeClass}`, {
        description: `${summary.present} present • ${summary.absent} absent • ${summary.late} late • ${summary.leave} on leave`,
      })
      setTimeout(() => setSaved(false), 2200)
    }, 900)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark Attendance"
        description="Take daily attendance for your classes"
        action={
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2 text-xs">
            <CalendarDays className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{today}</span>
          </div>
        }
      />

      {/* class selector */}
      <StaggerItem index={1}>
        <div className="flex flex-wrap gap-2">
          {TEACHER_CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => { setActiveClass(c); setMarks({}) }}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                activeClass === c
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-sm"
                  : "border-border/60 bg-card/50 text-muted-foreground hover:bg-accent/40"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </StaggerItem>

      {/* summary pills */}
      <StaggerItem index={2}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATUSES.map((s) => {
            const c = colorOf(s.color)
            return (
              <div
                key={s.key}
                className={cn("rounded-2xl border border-border/60 bg-card/50 p-4 shadow-premium")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{s.label}</span>
                  <div className={cn("rounded-lg p-1.5", c.soft)}>
                    <s.icon className={cn("h-3.5 w-3.5", c.text)} />
                  </div>
                </div>
                <p className={cn("mt-1 text-2xl font-bold", c.text)}>{summary[s.key]}</p>
              </div>
            )
          })}
        </div>
      </StaggerItem>

      {/* student list */}
      <StaggerItem index={3}>
        <SectionCard
          title={`${activeClass} — ${students.length} students`}
          subtitle="Tap a status for each student"
          action={
            <Button size="sm" variant="outline" onClick={markAllPresent}>
              <CheckCheck className="h-4 w-4" /> Mark all present
            </Button>
          }
          bodyClassName="p-0"
        >
          <div className="max-h-[640px] overflow-y-auto">
            <div className="divide-y divide-border/40">
              {students.map((s, i) => {
                const status: Status = marks[s.id] ?? "present"
                const c = colorOf(s.avatarColor)
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.015, 0.4), duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <span className="w-6 text-right text-xs font-medium text-muted-foreground">{String(s.rollNo).padStart(2, "0")}</span>
                    <Avatar name={s.name} color={s.avatarColor} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.admissionNo}</p>
                    </div>
                    <div className="flex gap-1">
                      {STATUSES.map((st) => {
                        const sc = colorOf(st.color)
                        const isActive = status === st.key
                        return (
                          <motion.button
                            key={st.key}
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ y: -1 }}
                            onClick={() => setStatus(s.id, st.key)}
                            className={cn(
                              "relative flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                              isActive
                                ? cn(sc.bg, "text-white shadow-sm")
                                : "bg-muted text-muted-foreground hover:bg-accent"
                            )}
                            title={st.label}
                          >
                            <st.icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{st.label}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* save bar */}
      <StaggerItem index={4}>
        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-premium backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{students.length}</span>
            <span className="text-muted-foreground">students • </span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{summary.present}</span>
            <span className="text-muted-foreground">present</span>
          </div>
          <Button onClick={save} disabled={saving || saved} className="bg-amber-600 text-white hover:bg-amber-700">
            <AnimatePresence mode="wait" initial={false}>
              {saved ? (
                <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1.5">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.4 }}>
                    <Check className="h-4 w-4" />
                  </motion.span>
                  Saved!
                </motion.span>
              ) : saving ? (
                <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Sparkles className="h-4 w-4" />
                  </motion.span>
                  Saving…
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                  <Save className="h-4 w-4" /> Save Attendance
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </StaggerItem>

      {/* success burst overlay */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/90 text-white shadow-premium"
            >
              <Check className="h-12 w-12" strokeWidth={3} />
            </motion.div>
            {/* burst particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-full bg-amber-400"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 12) * Math.PI * 2) * 120,
                  y: Math.sin((i / 12) * Math.PI * 2) * 120,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
