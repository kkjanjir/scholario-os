"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { LESSON_PLANS, type LessonPlan } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import {
  NotebookPen, Plus, Calendar, Clock, Target, BookOpen, ListChecks,
  FileText, CheckCircle2, Circle, PlayCircle, Download, Sparkles,
} from "lucide-react"
import { toast } from "sonner"

const STATUS_CONFIG = {
  completed: { color: "emerald", icon: CheckCircle2, label: "Completed" },
  "in-progress": { color: "amber", icon: PlayCircle, label: "In Progress" },
  planned: { color: "sky", icon: Circle, label: "Planned" },
} as const

export function LessonsModule() {
  const [plans, setPlans] = useState(LESSON_PLANS)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<LessonPlan | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = plans.filter((p) =>
    p.topic.toLowerCase().includes(search.toLowerCase()) ||
    p.subject.toLowerCase().includes(search.toLowerCase()) ||
    p.className.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: plans.length,
    completed: plans.filter((p) => p.status === "completed").length,
    inProgress: plans.filter((p) => p.status === "in-progress").length,
    planned: plans.filter((p) => p.status === "planned").length,
  }

  function markComplete(id: string) {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, status: "completed" } : p))
    toast.success("Lesson marked as completed! 🎉")
    setSelected(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lesson Planner"
        description="Plan, organize & track your lesson plans linked to your timetable"
        action={
          <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105">
            <Plus className="h-4 w-4" /> New Lesson Plan
          </button>
        }
      />

      {/* stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-2.5"><NotebookPen className="h-5 w-5 text-violet-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Plans</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </StaggerItem>
        <StaggerItem index={1}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
          </div>
        </StaggerItem>
        <StaggerItem index={2}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-amber-500/10 p-2.5"><PlayCircle className="h-5 w-5 text-amber-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
          </div>
        </StaggerItem>
        <StaggerItem index={3}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-sky-500/10 p-2.5"><Circle className="h-5 w-5 text-sky-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Planned</p>
            <p className="text-2xl font-bold text-sky-600">{stats.planned}</p>
          </div>
        </StaggerItem>
      </div>

      {/* search */}
      <StaggerItem index={1}>
        <SectionCard>
          <Toolbar search={search} onSearch={setSearch} placeholder="Search lesson plans…" />
        </SectionCard>
      </StaggerItem>

      {/* lesson plan cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((p, i) => {
          const cfg = STATUS_CONFIG[p.status]
          const Icon = cfg.icon
          const c = colorOf(cfg.color)
          return (
            <StaggerItem key={p.id} index={i + 2}>
              <motion.button
                onClick={() => setSelected(p)}
                whileHover={{ y: -3 }}
                className="w-full overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium transition-colors hover:bg-accent/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-xl p-2.5", c.soft)}>
                      <BookOpen className={cn("h-5 w-5", c.text)} />
                    </div>
                    <div>
                      <p className="font-semibold">{p.topic}</p>
                      <p className="text-xs text-muted-foreground">{p.subject} • {p.className}</p>
                    </div>
                  </div>
                  <StatusBadge status={cfg.label} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Period {p.period} • {p.duration}</span>
                  <span className="inline-flex items-center gap-1"><Target className="h-3 w-3" /> {p.objectives.length} objectives</span>
                </div>

                {/* objectives preview */}
                <div className="mt-3 space-y-1">
                  {p.objectives.slice(0, 2).map((o, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className={cn("mt-0.5 h-3 w-3 shrink-0", c.text)} />
                      <span className="line-clamp-1">{o}</span>
                    </div>
                  ))}
                  {p.objectives.length > 2 && <p className="pl-4 text-[10px] text-muted-foreground">+{p.objectives.length - 2} more</p>}
                </div>
              </motion.button>
            </StaggerItem>
          )
        })}
      </div>

      {/* detail dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto scroll-area rounded-3xl border border-border/60 bg-card shadow-premium">
              <LessonDetail lesson={selected} onClose={() => setSelected(null)} onComplete={() => markComplete(selected.id)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* create dialog */}
      <AnimatePresence>
        {createOpen && (
          <CreateLessonDialog onClose={() => setCreateOpen(false)} onCreate={(lesson) => {
            setPlans((prev) => [{ ...lesson, id: `lp${Date.now()}` }, ...prev])
            setCreateOpen(false)
            toast.success("Lesson plan created! 📝")
          }} />
        )}
      </AnimatePresence>
    </div>
  )
}

function LessonDetail({ lesson, onClose, onComplete }: { lesson: LessonPlan; onClose: () => void; onComplete: () => void }) {
  const cfg = STATUS_CONFIG[lesson.status]
  const c = colorOf(cfg.color)
  return (
    <div>
      <div className={cn("relative overflow-hidden p-6 text-white", c.bg.includes("emerald") ? "bg-gradient-to-br from-emerald-500 to-teal-600" : c.bg.includes("amber") ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-sky-500 to-cyan-600")}>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/80">{lesson.subject} • {lesson.className}</p>
            <h2 className="mt-1 text-2xl font-bold">{lesson.topic}</h2>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/80">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {lesson.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Period {lesson.period} • {lesson.duration}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg bg-white/15 p-2 text-white transition-colors hover:bg-white/25">✕</button>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {/* objectives */}
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Target className="h-4 w-4 text-primary" /> Learning Objectives</h3>
          <div className="space-y-1.5">
            {lesson.objectives.map((o, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-muted/40 p-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </div>

        {/* activities */}
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><ListChecks className="h-4 w-4 text-primary" /> Class Activities</h3>
          <div className="space-y-1">
            {lesson.activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* resources */}
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><BookOpen className="h-4 w-4 text-primary" /> Resources Required</h3>
          <div className="flex flex-wrap gap-2">
            {lesson.resources.map((r, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                <FileText className="h-3 w-3" /> {r}
              </span>
            ))}
          </div>
        </div>

        {/* homework */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-amber-500" /> Homework Assigned</h3>
          <p className="text-sm text-muted-foreground">{lesson.homework}</p>
        </div>

        {/* actions */}
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {lesson.status !== "completed" && (
            <button onClick={onComplete} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
              <CheckCircle2 className="h-4 w-4" /> Mark as Completed
            </button>
          )}
          <button onClick={() => toast.success("Lesson plan downloaded")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
            <Download className="h-4 w-4" /> Download
          </button>
          <button onClick={() => toast.success("Linked to homework")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
            <BookOpen className="h-4 w-4" /> Assign as Homework
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateLessonDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (lesson: LessonPlan) => void }) {
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("Mathematics")
  const [className, setClassName] = useState("Grade 10 A")
  const [date, setDate] = useState("2025-12-05")
  const [objectives, setObjectives] = useState("")
  const [activities, setActivities] = useState("")
  const [homework, setHomework] = useState("")

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto scroll-area rounded-3xl border border-border/60 bg-card shadow-premium">
        <div className="border-b border-border/60 p-5">
          <h2 className="text-lg font-semibold">Create Lesson Plan</h2>
          <p className="text-xs text-muted-foreground">Plan your next class with objectives, activities & resources</p>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground">TOPIC</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Trigonometry — Basic Identities" className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">SUBJECT</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50">
                <option>Mathematics</option><option>Science</option><option>English</option><option>Social Science</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">CLASS</label>
              <select value={className} onChange={(e) => setClassName(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50">
                <option>Grade 9 A</option><option>Grade 10 A</option><option>Grade 10 B</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">DATE</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">LEARNING OBJECTIVES (one per line)</label>
            <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder={"Understand basic trigonometric identities\nApply identities to solve problems"} rows={3} className="mt-1 w-full resize-none rounded-xl border border-border/70 bg-background/60 p-3 text-sm outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">CLASS ACTIVITIES (one per line)</label>
            <textarea value={activities} onChange={(e) => setActivities(e.target.value)} placeholder={"Introduction (10 min)\nWorked examples (20 min)\nPractice (10 min)"} rows={3} className="mt-1 w-full resize-none rounded-xl border border-border/70 bg-background/60 p-3 text-sm outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">HOMEWORK</label>
            <input value={homework} onChange={(e) => setHomework(e.target.value)} placeholder="e.g. Exercise 8.1 — Q1 to Q10" className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50" />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border/60 p-5">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
          <button
            onClick={() => onCreate({
              id: "", topic, subject, className, date, period: 1, duration: "45 min", status: "planned",
              objectives: objectives.split("\n").filter(Boolean), resources: ["NCERT Textbook", "Whiteboard"],
              activities: activities.split("\n").filter(Boolean), homework: homework || "—",
            })}
            disabled={!topic.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Create Plan
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
