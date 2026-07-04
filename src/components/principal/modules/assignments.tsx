"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Search, FileText, Award, Calendar, BookOpen, ListChecks,
  CheckCircle2, Clock, Trash2, GraduationCap, Star,
} from "lucide-react"

import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge, KpiCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import {
  ASSIGNMENTS, SUBJECTS, CLASSES, STUDENTS,
  type Assignment,
} from "@/lib/mock/data"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

const SUBJECT_COLOR: Record<string, string> = {
  Mathematics: "emerald", English: "rose", Science: "teal",
  Economics: "amber", "Computer Science": "sky", Hindi: "pink",
}

function subjectColor(s: string) {
  return SUBJECT_COLOR[s] || "violet"
}

interface RubricCriterion { name: string; max: number }

function parseRubric(rubric: string): RubricCriterion[] {
  return rubric
    .split("|")
    .map((part) => {
      const m = part.trim().match(/(.+?)\s*\(?(\d+)\)?$/)
      if (!m) return null
      return { name: m[1].trim(), max: parseInt(m[2], 10) }
    })
    .filter(Boolean) as RubricCriterion[]
}

export function AssignmentsModule() {
  const [list, setList] = useState<Assignment[]>(ASSIGNMENTS)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [evalItem, setEvalItem] = useState<Assignment | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return list
    return list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        a.className.toLowerCase().includes(q)
    )
  }, [list, search])

  const total = list.length
  const open = list.filter((a) => a.status === "Open").length
  const submitted = list.filter((a) => a.status === "Submitted").length
  const evaluated = list.filter((a) => a.status === "Evaluated").length
  const avgScore = (() => {
    const ev = list.filter((a) => a.status === "Evaluated" && a.obtained !== undefined)
    if (!ev.length) return 0
    return Math.round((ev.reduce((s, a) => s + (a.obtained || 0) / a.marks, 0) / ev.length) * 100)
  })()

  const handleCreate = (data: {
    title: string
    subject: string
    className: string
    marks: number
    dueDate: string
    rubric: RubricCriterion[]
  }) => {
    const rubStr = data.rubric.map((r) => `${r.name} (${r.max})`).join(" | ")
    const newA: Assignment = {
      id: `as_${Date.now()}`,
      title: data.title,
      subject: data.subject,
      className: data.className,
      marks: data.marks,
      dueDate: data.dueDate,
      status: "Open",
      rubric: rubStr,
    }
    setList((p) => [newA, ...p])
    setCreateOpen(false)
    toast.success("Assignment created", { description: `${data.title} → ${data.className} (${data.marks} marks)` })
  }

  const handleEvaluate = (assignment: Assignment, studentName: string, scores: number[], total: number) => {
    setList((prev) =>
      prev.map((a) =>
        a.id === assignment.id
          ? { ...a, status: "Evaluated", obtained: total }
          : a
      )
    )
    setEvalItem(null)
    toast.success("Evaluation saved", {
      description: `${studentName}: ${total}/${assignment.marks} (${Math.round((total / assignment.marks) * 100)}%)`,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignment Management"
        description="Create assignments, build rubrics & evaluate student submissions"
        action={
          <Button onClick={() => setCreateOpen(true)} className="shadow-premium">
            <Plus className="h-4 w-4" /> Create Assignment
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Assignments" value={total} icon={FileText} color="emerald" />
        <KpiCard index={1} label="Open" value={open} icon={Clock} color="violet" />
        <KpiCard index={2} label="Submitted" value={submitted} icon={ListChecks} color="sky" />
        <KpiCard index={3} label="Avg Score" value={avgScore} suffix="%" icon={Award} color="teal" trend={{ value: 3.4, up: true }} />
      </div>

      <SectionCard title="All Assignments" subtitle={`${filtered.length} of ${list.length} assignments`} bodyClassName="space-y-4">
        <Toolbar search={search} onSearch={setSearch} placeholder="Search assignments…" />

        {filtered.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            No assignments match your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <AssignmentCard key={a.id} a={a} index={i} onEvaluate={() => setEvalItem(a)} />
            ))}
          </div>
        )}
      </SectionCard>

      <CreateAssignmentDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
      <EvaluationDialog
        a={evalItem}
        onOpenChange={(o) => !o && setEvalItem(null)}
        onSave={handleEvaluate}
      />
    </div>
  )
}

function AssignmentCard({ a, index, onEvaluate }: { a: Assignment; index: number; onEvaluate: () => void }) {
  const c = colorOf(subjectColor(a.subject))
  const criteria = parseRubric(a.rubric)
  const pct = a.obtained !== undefined ? Math.round((a.obtained / a.marks) * 100) : 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
          <FileText className={cn("h-4 w-4", c.text)} />
        </div>
        <StatusBadge status={a.status} />
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold leading-snug">{a.title}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> {a.subject}</span>
        <span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" /> {a.className}</span>
        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {a.dueDate}</span>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium">Rubric</span>
          <span className={cn("font-semibold", c.text)}>{a.marks} marks</span>
        </div>
        <div className="space-y-1.5">
          {criteria.map((cr) => (
            <div key={cr.name} className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--chart-1)` }} />
              <span className="flex-1 truncate">{cr.name}</span>
              <span className="font-semibold text-muted-foreground">{cr.max} pts</span>
            </div>
          ))}
        </div>
      </div>

      {a.status === "Evaluated" && a.obtained !== undefined && (
        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <Star className="h-3 w-3" /> Obtained
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">
              {a.obtained}/{a.marks} · {pct}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-emerald-500/20">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        onClick={onEvaluate}
        disabled={a.status === "Evaluated"}
      >
        {a.status === "Evaluated" ? (
          <><CheckCircle2 className="h-4 w-4" /> Evaluated</>
        ) : (
          <><Award className="h-4 w-4" /> Evaluate</>
        )}
      </Button>
    </motion.div>
  )
}

function CreateAssignmentDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (data: { title: string; subject: string; className: string; marks: number; dueDate: string; rubric: RubricCriterion[] }) => void
}) {
  const [title, setTitle] = useState("")
  const [subj, setSubj] = useState("")
  const [cls, setCls] = useState("")
  const [marks, setMarks] = useState(20)
  const [due, setDue] = useState("")
  const [criteria, setCriteria] = useState<RubricCriterion[]>([
    { name: "Content Knowledge", max: 8 },
    { name: "Application", max: 7 },
    { name: "Presentation", max: 5 },
  ])

  const totalMax = criteria.reduce((a, b) => a + b.max, 0)

  const updateCriterion = (i: number, key: keyof RubricCriterion, value: string) => {
    setCriteria((prev) => prev.map((c, idx) => {
      if (idx !== i) return c
      if (key === "max") return { ...c, max: parseInt(value || "0", 10) }
      return { ...c, [key]: value }
    }))
  }

  const addCriterion = () => setCriteria((p) => [...p, { name: "", max: 5 }])
  const removeCriterion = (i: number) => setCriteria((p) => p.filter((_, idx) => idx !== i))

  const submit = () => {
    if (!title || !subj || !cls || !due) {
      toast.error("Please fill all required fields")
      return
    }
    if (criteria.length === 0 || criteria.some((c) => !c.name)) {
      toast.error("Add at least one valid rubric criterion")
      return
    }
    if (totalMax !== marks) {
      toast.error(`Rubric total (${totalMax}) must equal assignment marks (${marks})`)
      return
    }
    onCreate({ title, subject: subj, className: cls, marks, dueDate: due, rubric: criteria })
    // reset
    setTitle(""); setSubj(""); setCls(""); setMarks(20); setDue("")
    setCriteria([{ name: "Content Knowledge", max: 8 }, { name: "Application", max: 7 }, { name: "Presentation", max: 5 }])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
          <DialogDescription>Build a rubric-based assignment for evaluation.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Investigatory Project — Solar Energy" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Subject</Label>
              <Select value={subj} onValueChange={setSubj}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.slice(0, 12).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Class</Label>
              <Select value={cls} onValueChange={setCls}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {CLASSES.slice(3).map((c) => <SelectItem key={c} value={`${c} A`}>{c} A</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Total Marks</Label>
              <Input type="number" value={marks} onChange={(e) => setMarks(parseInt(e.target.value || "0", 10))} />
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Rubric Builder</Label>
              <span className={cn("text-xs font-medium", totalMax === marks ? "text-emerald-600" : "text-rose-600")}>
                Total: {totalMax} / {marks}
              </span>
            </div>
            <div className="space-y-2">
              {criteria.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder="Criterion name"
                    value={c.name}
                    onChange={(e) => updateCriterion(i, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={c.max}
                    onChange={(e) => updateCriterion(i, "max", e.target.value)}
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground">pts</span>
                  <Button size="icon" variant="ghost" onClick={() => removeCriterion(i)}>
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addCriterion} className="w-full">
              <Plus className="h-4 w-4" /> Add Criterion
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Publish Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EvaluationDialog({
  a, onOpenChange, onSave,
}: {
  a: Assignment | null
  onOpenChange: (v: boolean) => void
  onSave: (a: Assignment, studentName: string, scores: number[], total: number) => void
}) {
  if (!a) return null
  return (
    <EvaluationDialogInner
      key={a.id}
      a={a}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  )
}

function EvaluationDialogInner({
  a, onOpenChange, onSave,
}: {
  a: Assignment
  onOpenChange: (v: boolean) => void
  onSave: (a: Assignment, studentName: string, scores: number[], total: number) => void
}) {
  const [studentId, setStudentId] = useState<string>("")
  const [scores, setScores] = useState<number[]>(() => parseRubric(a.rubric).map(() => 0))

  const criteria = parseRubric(a.rubric)
  const total = scores.reduce((s, v) => s + v, 0)
  const pct = a.marks ? Math.round((total / a.marks) * 100) : 0
  const student = STUDENTS.find((s) => s.id === studentId)

  // Get class students
  const clsMatch = a.className.split(" ")[0]
  const sectionMatch = a.className.split(" ")[1] || "A"
  const classStudents = STUDENTS.filter(
    (s) => s.className === clsMatch && s.section === sectionMatch
  ).slice(0, 15)

  const submit = () => {
    if (!student) {
      toast.error("Select a student to evaluate")
      return
    }
    onSave(a, student.name, scores, total)
  }

  return (
    <Dialog open={!!a} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Evaluate Assignment</DialogTitle>
          <DialogDescription>{a.title} · {a.subject} · {a.className}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Select Student</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger className="w-full"><SelectValue placeholder={`${classStudents.length} students`} /></SelectTrigger>
              <SelectContent>
                {classStudents.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} · Roll {s.rollNo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {student && (
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
              <Avatar name={student.name} color={student.avatarColor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.admissionNo} · {student.className} {student.section}</p>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Rubric Scores</Label>
            <div className="space-y-2">
              {criteria.map((cr, i) => (
                <div key={cr.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cr.name}</p>
                    <p className="text-xs text-muted-foreground">Max {cr.max} pts</p>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={cr.max}
                    value={scores[i] || 0}
                    onChange={(e) => {
                      const v = Math.min(cr.max, Math.max(0, parseInt(e.target.value || "0", 10)))
                      setScores((p) => p.map((x, idx) => (idx === i ? v : x)))
                    }}
                    className="w-20"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={cn(
            "rounded-xl border p-4",
            pct >= 90 ? "border-emerald-500/30 bg-emerald-500/5" :
            pct >= 75 ? "border-sky-500/30 bg-sky-500/5" :
            pct >= 50 ? "border-amber-500/30 bg-amber-500/5" :
            "border-rose-500/30 bg-rose-500/5"
          )}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Score</span>
              <span className="text-lg font-bold">
                {total} / {a.marks}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>{pct}% · {pct >= 90 ? "A1" : pct >= 80 ? "A2" : pct >= 70 ? "B1" : pct >= 60 ? "B2" : pct >= 50 ? "C1" : "C2"}</span>
              <span>Auto-calculated</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save Evaluation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
