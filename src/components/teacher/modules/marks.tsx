"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { KpiCard, SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { EXAMS, STUDENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  ClipboardList, TrendingUp, TrendingDown, Award, Save, Send, Sparkles, Check,
} from "lucide-react"

const CLASSES = ["Grade 9-A", "Grade 10-A", "Grade 10-B"]
const SUBJECTS = ["Mathematics", "Science", "English", "Social Science", "Hindi", "Computer Science"]

function gradeFor(marks: number) {
  if (marks >= 90) return { grade: "A1", color: "emerald" }
  if (marks >= 80) return { grade: "A2", color: "emerald" }
  if (marks >= 70) return { grade: "B1", color: "teal" }
  if (marks >= 60) return { grade: "B2", color: "amber" }
  if (marks >= 50) return { grade: "C1", color: "orange" }
  if (marks >= 33) return { grade: "C2", color: "orange" }
  return { grade: "F", color: "rose" }
}

export function MarksModule() {
  const [examId, setExamId] = useState(EXAMS[2].id) // Unit Test 2
  const [subject, setSubject] = useState("Mathematics")
  const [className, setClassName] = useState("Grade 10-A")
  const [marks, setMarks] = useState<Record<string, number>>({})
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const exam = EXAMS.find((e) => e.id === examId)!

  const students = useMemo(() => {
    const [g, s] = className.split("-")
    return STUDENTS.filter((st) => st.className === g && st.section === s)
  }, [className])

  // initialise marks from student avg once per class/exam
  const effectiveMarks = useMemo(() => {
    const m: Record<string, number> = {}
    students.forEach((s, i) => {
      m[s.id] = marks[s.id] ?? Math.max(35, Math.min(98, s.avgMarks + ((i * 7) % 12) - 6))
    })
    return m
  }, [students, marks])

  const values = students.map((s) => effectiveMarks[s.id])
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0
  const highest = values.length ? Math.max(...values) : 0
  const lowest = values.length ? Math.min(...values) : 0
  const enteredCount = students.filter((s) => marks[s.id] != null).length

  function setMark(id: string, v: number) {
    setMarks((m) => ({ ...m, [id]: Math.max(0, Math.min(100, v)) }))
  }

  function onMarkBlur(studentName: string) {
    toast.success(`Auto-saved — ${studentName}`, { description: "Marks saved to draft", duration: 1800 })
  }

  function publish() {
    setPublishing(true)
    setTimeout(() => {
      setPublishing(false)
      setPublishOpen(false)
      setPublished(true)
      toast.success("Results published", {
        description: `${subject} • ${exam.name} • ${className} (${students.length} students)`,
      })
      setTimeout(() => setPublished(false), 2500)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marks Entry"
        description="Enter, auto-save and publish exam marks"
        action={
          <Button onClick={() => setPublishOpen(true)} className="bg-amber-600 text-white hover:bg-amber-700">
            <Send className="h-4 w-4" /> Publish Results
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Class Average" value={avg} suffix="%" icon={Award} color="amber" />
        <KpiCard index={1} label="Highest" value={highest} icon={TrendingUp} color="emerald" />
        <KpiCard index={2} label="Lowest" value={lowest} icon={TrendingDown} color="rose" />
        <KpiCard index={3} label="Entered" value={enteredCount} suffix={`/${students.length}`} icon={ClipboardList} color="teal" />
      </div>

      {/* selectors */}
      <StaggerItem index={1}>
        <SectionCard title="Choose exam, subject & class" bodyClassName="p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Exam</Label>
              <Select value={examId} onValueChange={setExamId}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXAMS.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Class</Label>
              <Select value={className} onValueChange={(v) => { setClassName(v); setMarks({}) }}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* marks table */}
      <StaggerItem index={2}>
        <SectionCard
          title={`${exam.name} • ${subject} • ${className}`}
          subtitle={`${students.length} students • marks auto-save on blur`}
          bodyClassName="p-0"
        >
          <div className="max-h-[560px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                <tr className="border-b border-border/60 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Roll</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Student</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admission No</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Marks</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const m = effectiveMarks[s.id]
                  const g = gradeFor(m)
                  const edited = marks[s.id] != null
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.015, 0.4) }}
                      className="border-b border-border/40 transition-colors hover:bg-accent/30"
                    >
                      <td className="px-5 py-2.5 text-xs font-medium text-muted-foreground">{String(s.rollNo).padStart(2, "0")}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar name={s.name} color={s.avatarColor} size="xs" />
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{s.admissionNo}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={m}
                            onChange={(e) => setMark(s.id, Number(e.target.value))}
                            onBlur={() => edited && onMarkBlur(s.name)}
                            className={cn(
                              "h-8 w-20",
                              edited && "border-amber-500/50 ring-1 ring-amber-500/20"
                            )}
                          />
                          <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <span className={cn(
                          "inline-flex min-w-10 justify-center rounded-md px-2 py-0.5 text-xs font-bold",
                          colorOf(g.color).soft, colorOf(g.color).text
                        )}>
                          {g.grade}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* publish dialog */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-4 w-4 text-amber-600" /> Publish Results
            </DialogTitle>
            <DialogDescription>
              Once published, students & parents will be notified. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {publishing ? (
              <motion.div
                key="publishing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="rounded-full bg-amber-500/10 p-3"
                >
                  <Sparkles className="h-6 w-6 text-amber-600" />
                </motion.div>
                <p className="mt-4 text-sm font-medium">Publishing results…</p>
                <p className="mt-1 text-xs text-muted-foreground">Notifying {students.length} students & their parents</p>
              </motion.div>
            ) : published ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.5 }}
                  className="rounded-full bg-emerald-500/15 p-3"
                >
                  <Check className="h-6 w-6 text-emerald-600" />
                </motion.div>
                <p className="mt-4 text-sm font-medium">Results published successfully</p>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exam</span>
                    <span className="font-medium">{exam.name}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Subject</span>
                    <span className="font-medium">{subject}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Class</span>
                    <span className="font-medium">{className}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{students.length}</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-border/60 pt-2 text-sm">
                    <span className="text-muted-foreground">Class average</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300">{avg}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!publishing && !published && (
            <DialogFooter>
              <Button variant="ghost" onClick={() => setPublishOpen(false)}>Cancel</Button>
              <Button onClick={publish} className="bg-amber-600 text-white hover:bg-amber-700">
                <Save className="h-4 w-4" /> Confirm & Publish
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
