"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, EmptyState } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { HOMEWORK, type Homework } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  BookOpen, Calendar, UploadCloud, FileCheck2, MessageSquare,
  CheckCircle2, Clock, Sparkles, X, User,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Augment HOMEWORK with extra Grade 10 A items so each tab has content
const EXTRA: Homework[] = [
  {
    id: "hw_g10_1", title: "Trigonometry — Worksheet 5", subject: "Mathematics", className: "Grade 10 A",
    assignedBy: "Rajesh Kulkarni", dueDate: "2025-12-10", status: "Pending", submissions: 21, total: 38,
    description: "Solve all identities from worksheet 5. Show complete working for each proof.",
  },
  {
    id: "hw_g10_2", title: "Essay — 'My Vision for India @ 2047'", subject: "English", className: "Grade 10 A",
    assignedBy: "Meera Nair", dueDate: "2025-11-28", status: "Reviewed", submissions: 38, total: 38,
    description: "Write a 500-word essay on your vision for India in the year 2047.",
  },
  {
    id: "hw_g10_3", title: "Light — Reflection & Refraction Notes", subject: "Science", className: "Grade 10 A",
    assignedBy: "Suresh Patil", dueDate: "2025-12-12", status: "Pending", submissions: 9, total: 38,
    description: "Make detailed notes on laws of reflection & refraction with ray diagrams.",
  },
  {
    id: "hw_g10_4", title: "French Revolution — Question Bank", subject: "Social Science", className: "Grade 10 A",
    assignedBy: "Priya Sharma", dueDate: "2025-12-02", status: "Submitted", submissions: 38, total: 38,
    description: "Answer all questions from the French Revolution question bank.",
  },
]

const FEEDBACK: Record<string, { rating: number; comment: string; by: string }> = {
  hw_g10_2: { rating: 5, comment: "Excellent structure and thoughtful arguments, Aarav! Your conclusion about sustainability was particularly insightful. Work on sentence variety.", by: "Meera Nair" },
  hw2: { rating: 4, comment: "Good effort and formatting. Make sure to address the editor by designation next time.", by: "Meera Nair" },
}

const TODAY = new Date("2025-12-04")
const SUBJECT_COLOR: Record<string, string> = {
  Mathematics: "violet", English: "rose", Science: "emerald", "Social Science": "amber",
  "Computer Science": "sky", Hindi: "pink", Marathi: "teal",
}

function daysUntil(due: string) {
  const d = new Date(due)
  return Math.ceil((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

export function HomeworkModule() {
  const all = [...HOMEWORK, ...EXTRA].filter((h) => h.className === "Grade 10 A")
  const pending = all.filter((h) => h.status === "Pending")
  const submitted = all.filter((h) => h.status === "Submitted")
  const reviewed = all.filter((h) => h.status === "Reviewed")

  const [submitTarget, setSubmitTarget] = useState<Homework | null>(null)
  const [comment, setComment] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)

  const openSubmit = (hw: Homework) => {
    setSubmitTarget(hw)
    setComment("")
    setFileName(null)
    setSubmitting(false)
    setJustSubmitted(false)
  }

  const doSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setJustSubmitted(true)
      toast.success(`Homework "${submitTarget?.title}" submitted successfully! 🎉`)
    }, 1400)
  }

  const closeDialog = () => {
    setSubmitTarget(null)
    setTimeout(() => {
      setJustSubmitted(false)
      setSubmitting(false)
    }, 250)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Homework" description="Submit your daily homework and view teacher feedback" />

      <StaggerItem index={1}>
        <div className="grid grid-cols-3 gap-3">
          <SummaryPill label="Pending" value={pending.length} color="amber" icon={Clock} />
          <SummaryPill label="Submitted" value={submitted.length} color="sky" icon={FileCheck2} />
          <SummaryPill label="Reviewed" value={reviewed.length} color="emerald" icon={CheckCircle2} />
        </div>
      </StaggerItem>

      <StaggerItem index={2}>
        <Tabs defaultValue="pending">
          <TabsList className="rounded-xl">
            <TabsTrigger value="pending" className="rounded-lg">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="submitted" className="rounded-lg">Submitted ({submitted.length})</TabsTrigger>
            <TabsTrigger value="reviewed" className="rounded-lg">Reviewed ({reviewed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <HomeworkList items={pending} onSubmit={openSubmit} />
          </TabsContent>
          <TabsContent value="submitted" className="mt-4">
            <HomeworkList items={submitted} onSubmit={openSubmit} submitted />
          </TabsContent>
          <TabsContent value="reviewed" className="mt-4">
            <HomeworkList items={reviewed} onSubmit={openSubmit} reviewed />
          </TabsContent>
        </Tabs>
      </StaggerItem>

      {/* Submit dialog */}
      <Dialog open={!!submitTarget} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <AnimatePresence mode="wait">
            {justSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                {/* Burst animation */}
                <div className="relative">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      animate={{ opacity: 0, x: Math.cos((i / 12) * Math.PI * 2) * 80, y: Math.sin((i / 12) * Math.PI * 2) * 80, scale: 0.3 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ background: ["#8b5cf6", "#d946ef", "#ec4899", "#f59e0b"][i % 4] }}
                    />
                  ))}
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.div>
                </div>
                <h3 className="mt-6 text-xl font-bold">Submitted!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your homework has been submitted to {submitTarget?.assignedBy}. You&apos;ll receive feedback once reviewed.
                </p>
                <Button className="mt-6 rounded-xl" onClick={closeDialog}>Done</Button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    Submit Homework
                  </DialogTitle>
                  <DialogDescription>{submitTarget?.title}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Subject</p>
                    <p className="mt-1 text-sm font-medium">{submitTarget?.subject} • {submitTarget?.assignedBy}</p>
                  </div>
                  {/* Dropzone */}
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Upload your work</p>
                    <button
                      onClick={() => { setFileName(`homework_${submitTarget?.id}.pdf`); toast.info("Mock file attached.") }}
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
                          <p className="text-xs text-muted-foreground">PDF, DOCX, JPG up to 10MB</p>
                        </>
                      )}
                    </button>
                  </div>
                  {/* Comment */}
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Comment (optional)</p>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a note to your teacher…"
                      rows={3}
                      className="rounded-xl"
                    />
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
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                        />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Submit Homework
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

function HomeworkList({ items, onSubmit, submitted, reviewed }: { items: Homework[]; onSubmit: (h: Homework) => void; submitted?: boolean; reviewed?: boolean }) {
  if (!items.length) return <EmptyState icon={BookOpen} title="No homework here" desc="You're all caught up!" />
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((hw, i) => (
        <HomeworkCard key={hw.id} hw={hw} index={i} onSubmit={onSubmit} submitted={submitted} reviewed={reviewed} />
      ))}
    </div>
  )
}

function HomeworkCard({ hw, index, onSubmit, submitted, reviewed }: { hw: Homework; index: number; onSubmit: (h: Homework) => void; submitted?: boolean; reviewed?: boolean }) {
  const color = SUBJECT_COLOR[hw.subject] || "violet"
  const c = colorOf(color)
  const days = daysUntil(hw.dueDate)
  const overdue = days < 0
  const urgent = days >= 0 && days <= 2
  const feedback = FEEDBACK[hw.id]

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
              <BookOpen className={cn("h-5 w-5", c.text)} />
            </div>
            <div>
              <p className="font-semibold leading-tight">{hw.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{hw.subject} • {hw.className}</p>
            </div>
          </div>
          <StatusBadge status={hw.status} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{hw.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-muted-foreground">
            <User className="h-3 w-3" /> {hw.assignedBy}
          </span>
          <span className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2 py-1",
            overdue ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : urgent ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          )}>
            <Calendar className="h-3 w-3" />
            {overdue ? `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`
              : days === 0 ? "Due today"
              : urgent ? `Due in ${days} day${days === 1 ? "" : "s"}`
              : `Due ${new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-muted-foreground">
            <FileCheck2 className="h-3 w-3" /> {hw.submissions}/{hw.total} submitted
          </span>
        </div>

        {/* Feedback for reviewed */}
        {reviewed && feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3"
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <MessageSquare className="h-3.5 w-3.5" /> Teacher Feedback
              </p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Sparkles key={i} className={cn("h-3.5 w-3.5", i < feedback.rating ? "text-amber-400" : "text-muted-foreground/30")} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm italic text-foreground/80">&ldquo;{feedback.comment}&rdquo;</p>
            <p className="mt-2 text-xs text-muted-foreground">— {feedback.by}</p>
          </motion.div>
        )}

        {/* Action */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {submitted ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Awaiting review
            </span>
          ) : reviewed ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Reviewed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Awaiting your submission
            </span>
          )}
          {hw.status === "Pending" && (
            <Button size="sm" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90" onClick={() => onSubmit(hw)}>
              <UploadCloud className="h-3.5 w-3.5" /> Submit
            </Button>
          )}
          {hw.status === "Submitted" && (
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.info("Resubmission requires teacher approval.")}>
              Resubmit
            </Button>
          )}
        </div>
      </SectionCard>
    </motion.div>
  )
}
