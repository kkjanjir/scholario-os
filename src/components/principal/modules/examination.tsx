"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Calendar, FileText, Download, Award, Trophy, Sparkles,
  CheckCircle2, Loader2, FileBarChart, GraduationCap, ClipboardList,
  Medal, TrendingUp, Printer,
} from "lucide-react"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, KpiCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { DonutChart } from "@/components/shared/charts"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs"

import {
  EXAMS, CLASSES_INFO, SUBJECTS, STUDENTS, studentResult, topPerformers,
  type Exam,
} from "@/lib/mock/data"
import { cn } from "@/lib/utils"

const CLASS_OPTIONS = CLASSES_INFO.map((c) => c.name)

function gradeOf(marks: number) {
  return marks >= 90 ? "A1" : marks >= 80 ? "A2" : marks >= 70 ? "B1" : marks >= 60 ? "B2" : marks >= 50 ? "C1" : "C2"
}

function gradeColor(grade: string) {
  const map: Record<string, string> = {
    A1: "emerald", A2: "emerald", B1: "teal", B2: "sky",
    C1: "amber", C2: "rose",
  }
  return colorOf(map[grade] || "slate")
}

export function ExaminationModule() {
  const [tab, setTab] = useState("exams")
  const [createOpen, setCreateOpen] = useState(false)
  const [openExam, setOpenExam] = useState<Exam | null>(null)
  const [generating, setGenerating] = useState(false)

  // marks entry state
  const [selClass, setSelClass] = useState("Grade 10")
  const [selSubject, setSelSubject] = useState("Mathematics")
  const [selExam, setSelExam] = useState("ex3")
  const [marks, setMarks] = useState<Record<string, string>>({})

  // result dialog
  const [resultStudent, setResultStudent] = useState<typeof STUDENTS[number] | null>(null)

  const classStudents = useMemo(
    () => STUDENTS.filter((s) => s.className === selClass).slice(0, 18),
    [selClass]
  )

  // Grade distribution from results of selClass students
  const gradeDist = useMemo(() => {
    const dist: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 }
    classStudents.forEach((s) => {
      const r = studentResult(s.id)
      const avg = r.reduce((a, x) => a + x.marks, 0) / r.length
      dist[gradeOf(avg)]++
    })
    const colors: Record<string, string> = {
      A1: "oklch(0.6 0.14 160)", A2: "oklch(0.65 0.13 170)",
      B1: "oklch(0.7 0.14 200)", B2: "oklch(0.7 0.15 240)",
      C1: "oklch(0.7 0.16 70)", C2: "oklch(0.65 0.2 15)",
    }
    return Object.entries(dist).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value, color: colors[name] }))
  }, [classStudents])

  const performers = topPerformers(selClass)

  function saveMark(studentId: string, value: string) {
    setMarks((m) => ({ ...m, [studentId]: value }))
  }
  function commitMark(studentName: string, value: string) {
    if (value) toast.success(`Marks saved · ${studentName}`, { description: `${selSubject}: ${value}/100` })
  }

  function generateResult() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      toast.success("Results generated successfully!", {
        description: `${selClass} · ${selExam.toUpperCase()} · ${classStudents.length} students`,
      })
    }, 1800)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination"
        description="Exams, marks entry, report cards & rankings"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success("Exam schedule exported")}>
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Create Exam
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Exams" value={EXAMS.length} icon={ClipboardList} color="emerald" />
        <KpiCard index={1} label="Ongoing" value={EXAMS.filter((e) => e.status === "Ongoing").length} icon={Loader2} color="amber" />
        <KpiCard index={2} label="Scheduled" value={EXAMS.filter((e) => e.status === "Scheduled").length} icon={Calendar} color="violet" />
        <KpiCard index={3} label="Completed" value={EXAMS.filter((e) => e.status === "Completed").length} icon={CheckCircle2} color="teal" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="marks">Marks Entry</TabsTrigger>
          <TabsTrigger value="results">Results & Rankings</TabsTrigger>
        </TabsList>

        {/* EXAMS TAB */}
        <TabsContent value="exams" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMS.map((ex, i) => {
              const c = colorOf(ex.status === "Ongoing" ? "amber" : ex.status === "Scheduled" ? "violet" : "emerald")
              return (
                <StaggerItem key={ex.id} index={i}>
                  <motion.button
                    whileHover={{ y: -4 }}
                    onClick={() => setOpenExam(ex)}
                    className="group relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium transition-colors hover:border-primary/30"
                  >
                    <div className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-15 transition-opacity group-hover:opacity-30", c.bg)} />
                    <div className="relative flex items-start justify-between">
                      <div className={cn("rounded-xl p-3 ring-1", c.soft, c.ring)}>
                        <FileText className={cn("h-6 w-6", c.text)} />
                      </div>
                      <StatusBadge status={ex.status} />
                    </div>
                    <h3 className="relative mt-4 text-lg font-bold tracking-tight">{ex.name}</h3>
                    <p className="relative text-xs text-muted-foreground">{ex.term} · {ex.className}</p>
                    <div className="relative mt-4 grid grid-cols-2 gap-2 border-t border-border/50 pt-3 text-xs">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Start</p>
                        <p className="font-medium">{new Date(ex.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">End</p>
                        <p className="font-medium">{new Date(ex.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      </div>
                    </div>
                  </motion.button>
                </StaggerItem>
              )
            })}
          </div>
        </TabsContent>

        {/* MARKS ENTRY TAB */}
        <TabsContent value="marks" className="mt-4 space-y-4">
          <StaggerItem index={1}>
            <SectionCard title="Marks Entry" subtitle="Select exam, class & subject — marks auto-save on blur">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Exam">
                  <Select value={selExam} onValueChange={setSelExam}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EXAMS.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Class">
                  <Select value={selClass} onValueChange={setSelClass}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CLASS_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Subject">
                  <Select value={selSubject} onValueChange={setSelSubject}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.slice(0, 10).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </SectionCard>
          </StaggerItem>

          <StaggerItem index={2}>
            <SectionCard
              title={`${selSubject} Marks · ${selClass}`}
              subtitle={`${classStudents.length} students · Max 100 · Auto-saves on blur`}
              action={
                <Button onClick={generateResult} disabled={generating} className="gap-2">
                  {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</> : <><Sparkles className="h-4 w-4" /> Generate Result</>}
                </Button>
              }
              bodyClassName="p-0"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30 text-left">
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Roll</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Student</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Marks</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((s, i) => {
                      const v = marks[s.id] ?? ""
                      const num = Number(v) || 0
                      const g = v ? gradeOf(num) : "—"
                      const gc = v ? gradeColor(g) : null
                      return (
                        <motion.tr
                          key={s.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-border/40 hover:bg-accent/30"
                        >
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{String(s.rollNo).padStart(2, "0")}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Avatar name={s.name} color={s.avatarColor} size="xs" />
                              <span className="font-medium">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={v}
                              onChange={(e) => saveMark(s.id, e.target.value)}
                              onBlur={() => commitMark(s.name, v)}
                              placeholder="—"
                              className="h-8 w-20"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            {v ? (
                              <span className={cn("rounded-md px-2 py-0.5 text-xs font-bold ring-1", gc?.soft, gc?.ring, gc?.text)}>
                                {g}
                              </span>
                            ) : <span className="text-xs text-muted-foreground">—</span>}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </StaggerItem>
        </TabsContent>

        {/* RESULTS TAB */}
        <TabsContent value="results" className="mt-4 space-y-4">
          <StaggerItem index={1}>
            <SectionCard
              title="Class Ranking & Top Performers"
              subtitle={`${selClass} · Based on Half-Yearly Examination`}
              action={
                <Select value={selClass} onValueChange={setSelClass}>
                  <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CLASS_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              }
              bodyClassName="p-0"
            >
              <div className="divide-y divide-border/50">
                {performers.map((p, i) => {
                  const c = colorOf(p.avatarColor)
                  const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null
                  return (
                    <motion.button
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ x: 4 }}
                      onClick={() => setResultStudent(p)}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/30"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                        {medal || <span className="text-muted-foreground">{p.rank}</span>}
                      </div>
                      <Avatar name={p.name} color={p.avatarColor} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">Roll #{p.rollNo} · {p.admissionNo}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-lg font-bold", c.text)}>{p.avgMarks}%</p>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg</p>
                      </div>
                      <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-bold ring-1", c.soft, c.ring, c.text)}>
                        {gradeOf(p.avgMarks)}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </SectionCard>
          </StaggerItem>

          <div className="grid gap-4 lg:grid-cols-2">
            <StaggerItem index={2}>
              <SectionCard title="Grade Distribution" subtitle={`${selClass} · Half-Yearly results`}>
                <DonutChart data={gradeDist} />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {gradeDist.map((g) => (
                    <div key={g.name} className="rounded-lg bg-muted/30 p-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />
                        <span className="text-xs font-bold">{g.name}</span>
                      </div>
                      <p className="mt-0.5 text-sm font-semibold">{g.value}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </StaggerItem>

            <StaggerItem index={3}>
              <SectionCard title="Class Statistics" subtitle="Performance metrics">
                <div className="grid grid-cols-2 gap-3">
                  <StatBox icon={Trophy} color="amber" label="Class Average" value={`${Math.round(performers.reduce((a, p) => a + p.avgMarks, 0) / performers.length)}%`} />
                  <StatBox icon={TrendingUp} color="emerald" label="Highest Score" value={`${performers[0]?.avgMarks || 0}%`} />
                  <StatBox icon={Award} color="violet" label="Top Scorer" value={performers[0]?.name.split(" ")[0] || "—"} />
                  <StatBox icon={GraduationCap} color="teal" label="Pass Rate" value="100%" />
                </div>
                <div className="mt-3 rounded-xl bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-300">
                  🎓 {performers.length} students ranked. {gradeDist[0]?.value || 0} students achieved top grade ({gradeDist[0]?.name || "—"}).
                </div>
              </SectionCard>
            </StaggerItem>
          </div>
        </TabsContent>
      </Tabs>

      <CreateExamDialog open={createOpen} onClose={setCreateOpen} />
      <ExamDetailDialog exam={openExam} onClose={() => setOpenExam(null)} />
      <ReportCardDialog student={resultStudent} onClose={() => setResultStudent(null)} />
    </div>
  )
}

function StatBox({ icon: Icon, color, label, value }: { icon: any; color: string; label: string; value: string }) {
  const c = colorOf(color)
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-3">
      <div className={cn("inline-flex rounded-lg p-2", c.soft)}>
        <Icon className={cn("h-4 w-4", c.text)} />
      </div>
      <p className="mt-2 text-xl font-bold tracking-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function CreateExamDialog({ open, onClose }: { open: boolean; onClose: (v: boolean) => void }) {
  const [name, setName] = useState("")
  const [term, setTerm] = useState("Term 2")
  const [cls, setCls] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [saving, setSaving] = useState(false)

  function submit() {
    if (!name || !cls || !start) {
      toast.error("Please fill all required fields")
      return
    }
    setSaving(true)
    setTimeout(() => {
      toast.success("Exam created & scheduled", {
        description: `${name} · ${cls} · ${start} to ${end || start}`,
      })
      setSaving(false)
      setName(""); setCls(""); setStart(""); setEnd("")
      onClose(false)
    }, 1100)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Create New Exam
          </DialogTitle>
          <DialogDescription>Schedule a new examination with date range.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Field label="Exam Name *">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Unit Test 3" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Term">
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Term 1">Term 1</SelectItem>
                  <SelectItem value="Term 2">Term 2</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Class *">
              <Select value={cls} onValueChange={setCls}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select class…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Grades">All Grades</SelectItem>
                  {CLASS_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date *">
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </Field>
            <Field label="End Date">
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </Field>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={submit} disabled={saving} className="gap-2">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : <><CheckCircle2 className="h-4 w-4" /> Create Exam</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ExamDetailDialog({ exam, onClose }: { exam: Exam | null; onClose: () => void }) {
  if (!exam) return <Dialog open={false} onOpenChange={() => {}}><DialogContent /></Dialog>
  const c = colorOf(exam.status === "Ongoing" ? "amber" : exam.status === "Scheduled" ? "violet" : "emerald")
  const days = Math.ceil((new Date(exam.endDate).getTime() - new Date(exam.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

  return (
    <Dialog open={!!exam} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className={cn("h-5 w-5", c.text)} />
            {exam.name}
          </DialogTitle>
          <DialogDescription>
            {exam.term} · {exam.className} · <StatusBadge status={exam.status} />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Start</p>
              <p className="mt-0.5 text-sm font-bold">{new Date(exam.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
            </div>
            <div className="rounded-xl border border-border/60 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">End</p>
              <p className="mt-0.5 text-sm font-bold">{new Date(exam.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
            </div>
            <div className={cn("rounded-xl border p-3 text-center", c.ring, c.soft)}>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Duration</p>
              <p className={cn("mt-0.5 text-sm font-bold", c.text)}>{days} days</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subjects &amp; Schedule</p>
            <div className="space-y-1.5">
              {SUBJECTS.slice(0, 6).map((s, i) => {
                const dt = new Date(exam.startDate)
                dt.setDate(dt.getDate() + i)
                return (
                  <div key={s} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
                    <span className="font-medium">{s}</span>
                    <span className="text-xs text-muted-foreground">
                      {dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · 09:00 AM
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => toast.success("Exam schedule downloaded")}>
            <Download className="h-4 w-4" /> Schedule
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReportCardDialog({ student, onClose }: { student: typeof STUDENTS[number] | null; onClose: () => void }) {
  if (!student) return <Dialog open={false} onOpenChange={() => {}}><DialogContent /></Dialog>
  const result = studentResult(student.id)
  const total = result.reduce((a, r) => a + r.marks, 0)
  const max = result.reduce((a, r) => a + r.max, 0)
  const pct = Math.round((total / max) * 100)
  const grade = gradeOf(pct)
  const c = gradeColor(grade)

  return (
    <Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Report Card · Half-Yearly
          </DialogTitle>
          <DialogDescription>{student.name} · {student.className} {student.section} · Roll #{student.rollNo}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* summary header */}
          <div className={cn("flex items-center justify-between rounded-2xl p-4 text-white shadow-premium bg-gradient-to-br", grade === "A1" || grade === "A2" ? "from-emerald-500 to-teal-600" : grade === "C2" ? "from-rose-500 to-rose-600" : "from-violet-500 to-fuchsia-600")}>
            <div>
              <p className="text-[10px] uppercase tracking-wider opacity-80">Overall Percentage</p>
              <p className="text-3xl font-bold">{pct}%</p>
              <p className="mt-0.5 text-xs opacity-90">Grade: {grade}</p>
            </div>
            <div className="text-right">
              <Medal className="ml-auto h-8 w-8" />
              <p className="mt-1 text-xs opacity-90">Total {total}/{max}</p>
            </div>
          </div>

          {/* subject table */}
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 text-left">
                  {["Subject", "Marks", "Max", "Grade"].map((h) => (
                    <th key={h} className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {result.map((r) => {
                  const gc = gradeColor(r.grade)
                  return (
                    <tr key={r.subject}>
                      <td className="px-4 py-2 font-medium">{r.subject}</td>
                      <td className="px-4 py-2 font-bold">{r.marks}</td>
                      <td className="px-4 py-2 text-muted-foreground">{r.max}</td>
                      <td className="px-4 py-2">
                        <span className={cn("rounded-md px-2 py-0.5 text-xs font-bold ring-1", gc.soft, gc.ring, gc.text)}>
                          {r.grade}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/20 font-bold">
                  <td className="px-4 py-2.5">Total</td>
                  <td className="px-4 py-2.5">{total}</td>
                  <td className="px-4 py-2.5">{max}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn("rounded-md px-2 py-0.5 text-xs", c.soft, c.text)}>{grade}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="rounded-xl bg-muted/30 p-3 text-xs">
            <p className="font-semibold">Teacher's Remarks:</p>
            <p className="mt-1 text-muted-foreground">
              {pct >= 90
                ? "Excellent performance! Keep up the outstanding work and continue to challenge yourself."
                : pct >= 75
                ? "Very good performance. With focused effort, you can achieve distinction next term."
                : pct >= 60
                ? "Good performance. Identify weak areas and practice more for improvement."
                : "Needs improvement. Please attend remedial classes and focus on fundamentals."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => toast.success("Report card downloaded")}>
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button onClick={() => toast.success("Report card sent to parent")}>
            <Printer className="h-4 w-4" /> Print &amp; Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
