"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, EmptyState } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { ASSIGNMENTS, type Assignment } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  FileText, Calendar, Award, UploadCloud, CheckCircle2, Clock,
  Sparkles, BarChart3, MessageSquare, Star, FileCheck2,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Augment with extra Grade 10 A assignments so each tab is filled
const EXTRA: Assignment[] = [
  {
    id: "as_g1", title: "Mathematics — Coordinate Geometry Project", subject: "Mathematics",
    className: "Grade 10 A", marks: 40, dueDate: "2025-12-22", status: "Open",
    rubric: "Accuracy (15) | Graphs (10) | Application (10) | Presentation (5)",
  },
  {
    id: "as_g2", title: "Science — Working Model of Electric Motor", subject: "Science",
    className: "Grade 10 A", marks: 50, dueDate: "2025-12-18", status: "Submitted",
    rubric: "Functionality (20) | Concept (15) | Creativity (10) | Viva (5)",
  },
  {
    id: "as_g3", title: "English — Story Writing (Mystery Genre)", subject: "English",
    className: "Grade 10 A", marks: 30, dueDate: "2025-11-25", status: "Evaluated", obtained: 26,
    rubric: "Plot (12) | Characterisation (8) | Language (6) | Originality (4)",
  },
]

const TEACHER_COMMENTS: Record<string, { comment: string; by: string }> = {
  as_g3: { comment: "Engaging plot with a clever twist, Aarav! Character voices were distinct. Watch your use of tenses — a few inconsistencies in the middle section.", by: "Meera Nair" },
}

const TODAY = new Date("2025-12-04")
const SUBJECT_COLOR: Record<string, string> = {
  Mathematics: "violet", English: "rose", Science: "emerald",
  Economics: "amber", "Computer Science": "sky",
}

function gradeFor(pct: number) {
  if (pct >= 90) return { grade: "A1", color: "emerald" }
  if (pct >= 80) return { grade: "A2", color: "teal" }
  if (pct >= 70) return { grade: "B1", color: "sky" }
  if (pct >= 60) return { grade: "B2", color: "amber" }
  if (pct >= 50) return { grade: "C1", color: "orange" }
  return { grade: "C2", color: "rose" }
}

function daysUntil(due: string) {
  const d = new Date(due)
  return Math.ceil((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

export function AssignmentsModule() {
  const all = [...ASSIGNMENTS, ...EXTRA].filter((a) => a.className === "Grade 10 A" || a.className === "General")
  const open = all.filter((a) => a.status === "Open")
  const submitted = all.filter((a) => a.status === "Submitted")
  const evaluated = all.filter((a) => a.status === "Evaluated")

  const [submitTarget, setSubmitTarget] = useState<Assignment | null>(null)
  const [note, setNote] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const openSubmit = (a: Assignment) => {
    setSubmitTarget(a)
    setNote("")
    setFileName(null)
    setSubmitting(false)
    setDone(false)
  }
  const doSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setDone(true)
      toast.success(`Assignment "${submitTarget?.title}" submitted! 🎉`)
    }, 1500)
  }
  const closeDialog = () => {
    setSubmitTarget(null)
    setTimeout(() => { setDone(false); setSubmitting(false) }, 250)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Project work, rubric-based evaluation & submissions" />

      <StaggerItem index={1}>
        <div className="grid grid-cols-3 gap-3">
          <SummaryPill label="Open" value={open.length} color="violet" icon={FileText} />
          <SummaryPill label="Submitted" value={submitted.length} color="sky" icon={UploadCloud} />
          <SummaryPill label="Evaluated" value={evaluated.length} color="emerald" icon={Award} />
        </div>
      </StaggerItem>

      <StaggerItem index={2}>
        <Tabs defaultValue="open">
          <TabsList className="rounded-xl">
            <TabsTrigger value="open" className="rounded-lg">Open ({open.length})</TabsTrigger>
            <TabsTrigger value="submitted" className="rounded-lg">Submitted ({submitted.length})</TabsTrigger>
            <TabsTrigger value="evaluated" className="rounded-lg">Evaluated ({evaluated.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-4">
            <AssignmentList items={open} onSubmit={openSubmit} />
          </TabsContent>
          <TabsContent value="submitted" className="mt-4">
            <AssignmentList items={submitted} onSubmit={openSubmit} submitted />
          </TabsContent>
          <TabsContent value="evaluated" className="mt-4">
            <AssignmentList items={evaluated} onSubmit={openSubmit} evaluated />
          </TabsContent>
        </Tabs>
      </StaggerItem>

      {/* Submit dialog */}
      <Dialog open={!!submitTarget} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.div>
                <h3 className="mt-6 text-xl font-bold">Assignment Submitted!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your work is now under review. You&apos;ll be notified once it&apos;s evaluated.
                </p>
                <Button className="mt-6 rounded-xl" onClick={closeDialog}>Done</Button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    Submit Assignment
                  </DialogTitle>
                  <DialogDescription>{submitTarget?.title}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Subject</p>
                      <p className="mt-0.5 font-medium">{submitTarget?.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Marks</p>
                      <p className="mt-0.5 font-medium">{submitTarget?.marks}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rubric</p>
                      <p className="mt-0.5 text-sm">{submitTarget?.rubric}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setFileName(`assignment_${submitTarget?.id}.pdf`); toast.info("Mock file attached.") }}
                    className={cn(
                      "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 transition-colors",
                      fileName ? "border-violet-500/50 bg-violet-500/5" : "border-border/70 hover:border-violet-500/40 hover:bg-violet-500/5",
                    )}
                  >
                    {fileName ? (
                      <>
                        <FileCheck2 className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                        <p className="text-sm font-medium">{fileName}</p>
                        <p className="text-xs text-muted-foreground">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Drag & drop or click to upload</p>
                        <p className="text-xs text-muted-foreground">PDF, DOCX, PPT, ZIP up to 25MB</p>
                      </>
                    )}
                  </button>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Note to teacher (optional)</p>
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note about your submission…" rows={3} className="rounded-xl" />
                  </div>
                </div>
                <DialogFooter className="pt-2">
                  <Button variant="outline" className="rounded-xl" onClick={closeDialog}>Cancel</Button>
                  <Button
                    onClick={doSubmit}
                    disabled={submitting}
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90"
                  >
                    {submitting ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Submit Assignment
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SummaryPill({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  const c = colorOf(color)
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
      <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
        <Icon className={cn("h-5 w-5", c.text)} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function AssignmentList({ items, onSubmit, submitted, evaluated }: { items: Assignment[]; onSubmit: (a: Assignment) => void; submitted?: boolean; evaluated?: boolean }) {
  if (!items.length) return <EmptyState icon={FileText} title="No assignments here" desc="Nothing in this tab right now." />
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((a, i) => (
        <AssignmentCard key={a.id} a={a} index={i} onSubmit={onSubmit} submitted={submitted} evaluated={evaluated} />
      ))}
    </div>
  )
}

function AssignmentCard({ a, index, onSubmit, submitted, evaluated }: { a: Assignment; index: number; onSubmit: (a: Assignment) => void; submitted?: boolean; evaluated?: boolean }) {
  const color = SUBJECT_COLOR[a.subject] || "violet"
  const c = colorOf(color)
  const days = daysUntil(a.dueDate)
  const overdue = days < 0
  const urgent = days >= 0 && days <= 3
  const tc = TEACHER_COMMENTS[a.id]
  const obtained = a.obtained ?? 0
  const pct = Math.round((obtained / a.marks) * 100)
  const g = gradeFor(pct)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
    >
      <SectionCard bodyClassName="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
              <FileText className={cn("h-5 w-5", c.text)} />
            </div>
            <div>
              <p className="font-semibold leading-tight">{a.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.subject} • {a.className}</p>
            </div>
          </div>
          <StatusBadge status={a.status} />
        </div>

        {/* Rubric */}
        <div className="mt-3 rounded-xl border border-border/60 bg-card/50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" /> Rubric
          </p>
          <p className="mt-1 text-sm">{a.rubric}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={cn("inline-flex items-center gap-1 rounded-lg px-2 py-1", c.soft, c.text)}>
            <Award className="h-3 w-3" /> {a.marks} marks
          </span>
          <span className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2 py-1",
            overdue ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : urgent ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-muted text-muted-foreground",
          )}>
            <Calendar className="h-3 w-3" />
            {overdue ? `Overdue by ${Math.abs(days)}d`
              : days === 0 ? "Due today"
              : `Due in ${days}d • ${new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
          </span>
        </div>

        {/* Evaluated — show obtained + grade + teacher comment */}
        {evaluated && a.obtained !== undefined && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 overflow-hidden"
          >
            <div className={cn("rounded-xl border p-3", colorOf(g.color).soft, "border-border/60")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Marks Obtained</p>
                  <p className="text-2xl font-bold">
                    {obtained}<span className="text-base font-medium text-muted-foreground">/{a.marks}</span>
                  </p>
                </div>
                <div className={cn("flex h-12 w-12 flex-col items-center justify-center rounded-xl text-white", colorOf(g.color).bg)}>
                  <span className="text-sm font-bold leading-none">{g.grade}</span>
                  <span className="text-[9px] opacity-90">{pct}%</span>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={pct} className="h-2" />
              </div>
            </div>
            {tc && (
              <div className="mt-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-400">
                  <MessageSquare className="h-3.5 w-3.5" /> Teacher Comments
                </p>
                <p className="mt-2 text-sm italic text-foreground/80">&ldquo;{tc.comment}&rdquo;</p>
                <p className="mt-2 text-xs text-muted-foreground">— {tc.by}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Submitted — progress bar */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 overflow-hidden rounded-xl border border-sky-500/30 bg-sky-500/5 p-3"
          >
            <p className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
              <Clock className="h-3.5 w-3.5" /> Under Evaluation
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Your submission is being reviewed. Results will appear here once evaluated.</p>
            <div className="mt-2 flex items-center gap-2">
              <Progress value={50} className="h-1.5" />
              <span className="text-xs font-medium text-sky-600 dark:text-sky-400">In review</span>
            </div>
          </motion.div>
        )}

        {/* Action */}
        <div className="mt-4 flex items-center justify-end gap-2">
          {a.status === "Open" && (
            <Button size="sm" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90" onClick={() => onSubmit(a)}>
              <UploadCloud className="h-3.5 w-3.5" /> Submit Assignment
            </Button>
          )}
          {a.status === "Submitted" && (
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.info("Resubmission is locked while under review.")}>
              <Star className="h-3.5 w-3.5" /> View Submission
            </Button>
          )}
          {a.status === "Evaluated" && (
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.success("Detailed evaluation report download started.")}>
              <FileCheck2 className="h-3.5 w-3.5" /> Download Report
            </Button>
          )}
        </div>
      </SectionCard>
    </motion.div>
  )
}
