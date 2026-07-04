"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Search, FileText, Calendar, User, BookOpen, Paperclip,
  ClipboardCheck, CheckCircle2, Clock, AlertCircle, Users,
} from "lucide-react"

import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge, KpiCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import {
  HOMEWORK, SUBJECTS, CLASSES, STUDENTS,
  type Homework,
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
import { Progress } from "@/components/ui/progress"

const SUBJECT_COLOR: Record<string, string> = {
  Mathematics: "emerald", English: "rose", Science: "teal",
  "Social Science": "amber", "Computer Science": "sky", Hindi: "pink",
  Chemistry: "violet", Physics: "cyan", Biology: "lime",
}

function subjectColor(s: string) {
  return SUBJECT_COLOR[s] || "violet"
}

export function HomeworkModule() {
  const [list, setList] = useState<Homework[]>(HOMEWORK)
  const [search, setSearch] = useState("")
  const [subject, setSubject] = useState<string>("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [trackItem, setTrackItem] = useState<Homework | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return list.filter((h) => {
      const matchesSearch =
        !q ||
        h.title.toLowerCase().includes(q) ||
        h.className.toLowerCase().includes(q) ||
        h.assignedBy.toLowerCase().includes(q)
      const matchesSubject = subject === "all" || h.subject === subject
      return matchesSearch && matchesSubject
    })
  }, [list, search, subject])

  const totalAssigned = list.length
  const pendingReview = list.filter((h) => h.status === "Submitted" || h.status === "Late").length
  const totalSubmissions = list.reduce((a, b) => a + b.submissions, 0)
  const totalSlots = list.reduce((a, b) => a + b.total, 0)
  const submissionRate = totalSlots ? Math.round((totalSubmissions / totalSlots) * 100) : 0

  const handleCreate = (data: { title: string; subject: string; className: string; dueDate: string; description: string }) => {
    const newHw: Homework = {
      id: `hw_${Date.now()}`,
      title: data.title,
      subject: data.subject,
      className: data.className,
      assignedBy: "Dr. Anjali Deshpande",
      dueDate: data.dueDate,
      status: "Pending",
      submissions: 0,
      total: 40,
      description: data.description,
    }
    setList((prev) => [newHw, ...prev])
    setCreateOpen(false)
    toast.success("Homework assigned successfully", { description: `${data.title} → ${data.className}` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homework Management"
        description="Assign, track & review homework submissions across all classes"
        action={
          <Button onClick={() => setCreateOpen(true)} className="shadow-premium">
            <Plus className="h-4 w-4" /> Assign Homework
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Active Homework" value={totalAssigned} icon={FileText} color="emerald" />
        <KpiCard index={1} label="Pending Review" value={pendingReview} icon={ClipboardCheck} color="amber" />
        <KpiCard index={2} label="Total Submissions" value={totalSubmissions} icon={Users} color="violet" />
        <KpiCard index={3} label="Submission Rate" value={submissionRate} suffix="%" icon={CheckCircle2} color="teal" trend={{ value: 4.1, up: true }} />
      </div>

      <SectionCard
        title="All Homework"
        subtitle={`${filtered.length} of ${list.length} assignments`}
        bodyClassName="space-y-4"
      >
        <Toolbar
          search={search}
          onSearch={setSearch}
          placeholder="Search by title, class or teacher…"
        >
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {SUBJECTS.slice(0, 10).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Toolbar>

        {filtered.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            No homework matches your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((hw, i) => (
              <HomeworkCard key={hw.id} hw={hw} index={i} onClick={() => setTrackItem(hw)} />
            ))}
          </div>
        )}
      </SectionCard>

      <CreateHomeworkDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />

      <TrackingDialog
        hw={trackItem}
        onOpenChange={(o) => !o && setTrackItem(null)}
      />
    </div>
  )
}

function HomeworkCard({ hw, index, onClick }: { hw: Homework; index: number; onClick: () => void }) {
  const c = colorOf(subjectColor(hw.subject))
  const pct = hw.total ? Math.round((hw.submissions / hw.total) * 100) : 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-border/60 bg-card p-5 shadow-premium transition-colors hover:bg-accent/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
          <BookOpen className={cn("h-4 w-4", c.text)} />
        </div>
        <StatusBadge status={hw.status} />
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold leading-snug">{hw.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{hw.description}</p>

      <div className="mt-3 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <BookOpen className="h-3 w-3" /> {hw.subject}
          <span className="mx-1 opacity-40">•</span>
          <User className="h-3 w-3" /> {hw.className}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3 w-3" /> Due {new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          <span className="mx-1 opacity-40">•</span>
          <span className="truncate">by {hw.assignedBy}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium">Submissions</span>
          <span className={cn("font-semibold", c.text)}>
            {hw.submissions}/{hw.total} · {pct}%
          </span>
        </div>
        <Progress value={pct} className={cn("h-1.5", c.soft)} />
      </div>
    </motion.div>
  )
}

function CreateHomeworkDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (data: { title: string; subject: string; className: string; dueDate: string; description: string }) => void
}) {
  const [title, setTitle] = useState("")
  const [subj, setSubj] = useState("")
  const [cls, setCls] = useState("")
  const [due, setDue] = useState("")
  const [desc, setDesc] = useState("")

  const reset = () => {
    setTitle(""); setSubj(""); setCls(""); setDue(""); setDesc("")
  }

  const submit = () => {
    if (!title || !subj || !cls || !due) {
      toast.error("Please fill all required fields")
      return
    }
    onCreate({ title, subject: subj, className: cls, dueDate: due, description: desc })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Assign New Homework</DialogTitle>
          <DialogDescription>Create a homework assignment for a class.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="hw-title">Title</Label>
            <Input id="hw-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Algebra — Exercise 5.2" />
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

          <div className="grid gap-2">
            <Label htmlFor="hw-due">Due Date</Label>
            <Input id="hw-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hw-desc">Description</Label>
            <Textarea id="hw-desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Instructions, chapters, problems to solve…" rows={3} />
          </div>

          <button
            type="button"
            onClick={() => toast.info("File upload is mocked in this demo")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-muted/40 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent/40"
          >
            <Paperclip className="h-4 w-4" /> Attach file (PDF, image, doc)
          </button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Publish Homework</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TrackingDialog({ hw, onOpenChange }: { hw: Homework | null; onOpenChange: (v: boolean) => void }) {
  if (!hw) return null
  const c = colorOf(subjectColor(hw.subject))
  const pct = hw.total ? Math.round((hw.submissions / hw.total) * 100) : 0

  // pick a deterministic slice of students for this homework
  const startIdx = (hw.id.charCodeAt(2) || 0) % Math.max(1, STUDENTS.length - hw.total)
  const students = STUDENTS.slice(startIdx, startIdx + hw.total).map((s, i) => {
    const submitted = i < hw.submissions
    return { student: s, submitted }
  })

  return (
    <Dialog open={!!hw} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={cn("rounded-lg p-1.5", c.soft)}>
              <BookOpen className={cn("h-4 w-4", c.text)} />
            </span>
            {hw.title}
          </DialogTitle>
          <DialogDescription>
            {hw.subject} · {hw.className} · Due {hw.dueDate}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/60 bg-card/50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Submitted</p>
            <p className="text-xl font-bold text-emerald-600">{hw.submissions}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pending</p>
            <p className="text-xl font-bold text-amber-600">{hw.total - hw.submissions}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Rate</p>
            <p className={cn("text-xl font-bold", c.text)}>{pct}%</p>
          </div>
        </div>

        <div className="max-h-[280px] overflow-y-auto rounded-xl border border-border/60">
          {students.map(({ student, submitted }, idx) => (
            <div
              key={student.id}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5",
                idx !== students.length - 1 && "border-b border-border/40",
                !submitted && "bg-amber-500/5"
              )}
            >
              <Avatar name={student.name} color={student.avatarColor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.className} {student.section} · Roll {student.rollNo}</p>
              </div>
              {submitted ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Submitted
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Review opened for ${student.name}`, { description: "Mark reviewed after evaluation." })}
                  >
                    Review
                  </Button>
                </>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                  <Clock className="h-3 w-3" /> Pending
                </span>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button
            onClick={() => {
              toast.success("Submission report exported", { description: `${hw.submissions}/${hw.total} students have submitted.` })
              onOpenChange(false)
            }}
          >
            <AlertCircle className="h-4 w-4" /> Mark All Reviewed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
