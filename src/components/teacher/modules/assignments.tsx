"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ASSIGNMENTS, STUDENTS, type Assignment } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Plus, FileText, Trash2, ClipboardCheck, Check, Award, CalendarDays, Save, BookMarked,
} from "lucide-react"

interface Criterion {
  id: string
  name: string
  max: number
}

function gradeFor(pct: number) {
  if (pct >= 90) return { grade: "A1", color: "emerald" }
  if (pct >= 80) return { grade: "A2", color: "emerald" }
  if (pct >= 70) return { grade: "B1", color: "teal" }
  if (pct >= 60) return { grade: "B2", color: "amber" }
  if (pct >= 50) return { grade: "C1", color: "orange" }
  return { grade: "C2", color: "rose" }
}

export function AssignmentsModule() {
  const [createOpen, setCreateOpen] = useState(false)
  const [evaluating, setEvaluating] = useState<Assignment | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Create, evaluate and grade assignment submissions"
        action={
          <Button onClick={() => setCreateOpen(true)} className="bg-amber-600 text-white hover:bg-amber-700">
            <Plus className="h-4 w-4" /> Create Assignment
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {ASSIGNMENTS.map((a, i) => {
          const c = colorOf(a.subject === "Mathematics" ? "amber" : a.subject === "English" ? "rose" : a.subject === "Science" ? "violet" : a.subject === "Economics" ? "teal" : "emerald")
          const pct = a.obtained != null ? Math.round((a.obtained / a.marks) * 100) : null
          const g = pct != null ? gradeFor(pct) : null
          return (
            <StaggerItem key={a.id} index={i + 1}>
              <motion.div whileHover={{ y: -3 }} className="h-full">
                <SectionCard bodyClassName="p-5">
                  <div className="flex items-start gap-3">
                    <div className={cn("rounded-xl p-2.5", c.soft)}>
                      <FileText className={cn("h-5 w-5", c.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold tracking-tight">{a.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{a.subject} • {a.className}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>

                  <div className="mt-4 rounded-xl border border-border/60 bg-card/50 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Rubric</p>
                    <p className="mt-1 text-sm">{a.rubric}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Award className="h-3.5 w-3.5" /> Max <b className="text-foreground">{a.marks}</b>
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" /> Due <b className="text-foreground">{a.dueDate}</b>
                    </span>
                    {pct != null && g && (
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="text-muted-foreground">Avg</span>
                        <span className={cn("font-bold", colorOf(g.color).text)}>{a.obtained}/{a.marks}</span>
                        <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold", colorOf(g.color).soft, colorOf(g.color).text)}>{g.grade}</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <Button size="sm" variant="ghost" onClick={() => toast.info("Submission details viewed")}>View submissions</Button>
                    <Button size="sm" onClick={() => setEvaluating(a)} className="bg-amber-600 text-white hover:bg-amber-700">
                      <ClipboardCheck className="h-4 w-4" /> Evaluate
                    </Button>
                  </div>
                </SectionCard>
              </motion.div>
            </StaggerItem>
          )
        })}
      </div>

      <CreateAssignmentDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EvaluationDialog assignment={evaluating} onClose={() => setEvaluating(null)} />
    </div>
  )
}

function CreateAssignmentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("Mathematics")
  const [className, setClassName] = useState("Grade 10-A")
  const [maxMarks, setMaxMarks] = useState(50)
  const [dueDate, setDueDate] = useState("2025-12-20")
  const [description, setDescription] = useState("")
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: "c1", name: "Content & Understanding", max: 20 },
    { id: "c2", name: "Presentation", max: 15 },
    { id: "c3", name: "Accuracy", max: 15 },
  ])

  function addCriterion() {
    setCriteria((c) => [...c, { id: `c${c.length + 1}-${Date.now()}`, name: "", max: 5 }])
  }
  function removeCriterion(id: string) {
    setCriteria((c) => c.filter((x) => x.id !== id))
  }
  function updateCriterion(id: string, field: "name" | "max", value: string | number) {
    setCriteria((c) => c.map((x) => x.id === id ? { ...x, [field]: value } : x))
  }

  function submit() {
    if (!title.trim()) { toast.error("Please enter a title"); return }
    const valid = criteria.filter((c) => c.name.trim() && c.max > 0)
    if (valid.length === 0) { toast.error("Add at least one rubric criterion"); return }
    onOpenChange(false)
    toast.success("Assignment created", { description: `"${title}" with ${valid.length} rubric criteria` })
    setTitle(""); setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-amber-600" /> Create Assignment
          </DialogTitle>
          <DialogDescription>Build a rubric for fair, criterion-based grading.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="as-title">Title</Label>
            <Input id="as-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Investigatory Project — Renewable Energy" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Mathematics", "Science", "English", "Economics", "Computer Science"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Class</Label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Grade 9-A", "Grade 10-A", "Grade 10-B"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="as-max">Max marks</Label>
              <Input id="as-max" type="number" value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="as-due">Due date</Label>
            <Input id="as-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          {/* rubric builder */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5"><BookMarked className="h-3.5 w-3.5" /> Rubric Criteria</Label>
              <span className="text-xs text-muted-foreground">Total: <b className="text-foreground">{criteria.reduce((a, c) => a + (c.max || 0), 0)} marks</b></span>
            </div>
            <div className="space-y-2">
              {criteria.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-center gap-2"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-700 dark:text-amber-300">{idx + 1}</span>
                  <Input
                    value={c.name}
                    onChange={(e) => updateCriterion(c.id, "name", e.target.value)}
                    placeholder="Criterion name (e.g. Research)"
                    className="flex-1"
                  />
                  <div className="relative w-24">
                    <Input
                      type="number"
                      value={c.max}
                      onChange={(e) => updateCriterion(c.id, "max", Number(e.target.value))}
                      className="pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">max</span>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeCriterion(c.id)}>
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </motion.div>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={addCriterion} className="w-full border-dashed">
              <Plus className="h-3.5 w-3.5" /> Add criterion
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="as-desc">Description (optional)</Label>
            <Textarea id="as-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the assignment…" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-amber-600 text-white hover:bg-amber-700">
            <Check className="h-4 w-4" /> Create Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EvaluationDialog({ assignment, onClose }: { assignment: Assignment | null; onClose: () => void }) {
  const [studentId, setStudentId] = useState<string>("")
  const [scores, setScores] = useState<Record<string, number>>({})

  const criteria = useMemo(() => {
    if (!assignment) return []
    return assignment.rubric.split("|").map((r) => {
      const m = r.trim().match(/^(.+?)\s*\((\d+)\)$/)
      return m ? { name: m[1].trim(), max: Number(m[2]) } : { name: r.trim(), max: 0 }
    }).filter((c) => c.max > 0)
  }, [assignment])

  const students = useMemo(() => {
    if (!assignment) return []
    const [g, s] = assignment.className.split(" ")
    return STUDENTS.filter((st) => st.className === g && st.section === s).slice(0, 10)
  }, [assignment])

  const total = criteria.reduce((acc, c) => acc + (scores[c.name] || 0), 0)
  const maxTotal = criteria.reduce((acc, c) => acc + c.max, 0) || assignment?.marks || 1
  const pct = Math.round((total / maxTotal) * 100)
  const g = gradeFor(pct)

  if (!assignment) return null

  function save() {
    if (!studentId) { toast.error("Please select a student"); return }
    const st = students.find((s) => s.id === studentId)
    toast.success(`Evaluation saved for ${st?.name}`, { description: `${total}/${maxTotal} • ${pct}% • Grade ${g.grade}` })
    setScores({})
    setStudentId("")
    onClose()
  }

  return (
    <Dialog open={!!assignment} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-amber-600" /> Evaluate — {assignment.title}
          </DialogTitle>
          <DialogDescription>Enter marks per rubric criterion. Grade auto-calculates.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Select student</Label>
            <Select value={studentId} onValueChange={(v) => { setStudentId(v); setScores({}) }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose a student…" /></SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name} • Roll {s.rollNo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {studentId && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              {criteria.map((c) => (
                <div key={c.name} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Max {c.max} marks</p>
                  </div>
                  <div className="relative w-24">
                    <Input
                      type="number"
                      min={0}
                      max={c.max}
                      value={scores[c.name] ?? ""}
                      onChange={(e) => setScores((s) => ({ ...s, [c.name]: Math.min(c.max, Math.max(0, Number(e.target.value))) }))}
                      className="pr-10 text-right"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">/{c.max}</span>
                  </div>
                </div>
              ))}

              {/* total / pct / grade */}
              <div className="grid grid-cols-3 gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">{total}<span className="text-sm text-muted-foreground">/{maxTotal}</span></p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Percentage</p>
                  <p className="text-lg font-bold">{pct}%</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Grade</p>
                  <p className={cn("text-lg font-bold", colorOf(g.color).text)}>{g.grade}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={!studentId} className="bg-amber-600 text-white hover:bg-amber-700">
            <Save className="h-4 w-4" /> Save Evaluation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
