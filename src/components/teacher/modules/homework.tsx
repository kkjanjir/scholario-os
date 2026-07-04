"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { HOMEWORK, STUDENTS, type Homework } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Plus, BookOpen, CalendarDays, Paperclip, Check, Clock, AlertCircle, FileText, ChevronRight,
} from "lucide-react"

const TEACHER = "Rajesh Kulkarni"

function completionPct(h: Homework) {
  return Math.round((h.submissions / h.total) * 100)
}

export function HomeworkModule() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "mine">("mine")
  const [createOpen, setCreateOpen] = useState(false)
  const [tracking, setTracking] = useState<Homework | null>(null)

  const list = useMemo(() => {
    return HOMEWORK.filter((h) => filter === "mine" ? h.assignedBy === TEACHER : true).filter((h) => {
      if (!search) return true
      const q = search.toLowerCase()
      return h.title.toLowerCase().includes(q) || h.subject.toLowerCase().includes(q) || h.className.toLowerCase().includes(q)
    })
  }, [search, filter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homework"
        description="Assign, track and review homework submissions"
        action={
          <Button onClick={() => setCreateOpen(true)} className="bg-amber-600 text-white hover:bg-amber-700">
            <Plus className="h-4 w-4" /> Create Homework
          </Button>
        }
      />

      <Toolbar search={search} onSearch={setSearch} placeholder="Search by title, subject or class…">
        <div className="flex gap-1 rounded-xl border border-border/60 bg-card/50 p-1">
          {(["mine", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "mine" ? "My Homework" : "All"}
            </button>
          ))}
        </div>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((h, i) => {
          const pct = completionPct(h)
          const c = colorOf(h.subject === "Mathematics" ? "amber" : h.subject === "English" ? "rose" : h.subject === "Science" ? "violet" : h.subject === "Computer Science" ? "sky" : h.subject === "Social Science" ? "teal" : "emerald")
          return (
            <StaggerItem key={h.id} index={i + 1}>
              <motion.div whileHover={{ y: -3 }} className="h-full">
                <SectionCard
                  title=""
                  bodyClassName="p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("rounded-xl p-2.5", c.soft)}>
                      <BookOpen className={cn("h-5 w-5", c.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold tracking-tight">{h.title}</h3>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {h.subject} • {h.className} {h.assignedBy === TEACHER && <span className="ml-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300">You</span>}
                      </p>
                    </div>
                    <StatusBadge status={h.status} />
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{h.description}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Submissions</span>
                      <span className="font-semibold">{h.submissions}/{h.total} • {pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" /> Due {h.dueDate}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setTracking(h)}>
                      Track Submissions <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </SectionCard>
              </motion.div>
            </StaggerItem>
          )
        })}
      </div>

      <CreateHomeworkDialog open={createOpen} onOpenChange={setCreateOpen} />
      <TrackingDialog homework={tracking} onClose={() => setTracking(null)} />
    </div>
  )
}

function CreateHomeworkDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("Mathematics")
  const [className, setClassName] = useState("Grade 10-A")
  const [dueDate, setDueDate] = useState("2025-12-15")
  const [description, setDescription] = useState("")

  function submit() {
    if (!title.trim()) { toast.error("Please enter a title"); return }
    onOpenChange(false)
    toast.success("Homework assigned", { description: `"${title}" → ${className} • due ${dueDate}` })
    setTitle(""); setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-amber-600" /> Create Homework
          </DialogTitle>
          <DialogDescription>Assign a new homework task to a class.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="hw-title">Title</Label>
            <Input id="hw-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Quadratic Equations — Exercise 4.4" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Mathematics", "Science", "English", "Social Science", "Computer Science", "Hindi"].map((s) => (
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
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hw-due">Due date</Label>
            <Input id="hw-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hw-desc">Description</Label>
            <Textarea id="hw-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Instructions, page numbers, problems to solve…" />
          </div>
          <button
            type="button"
            onClick={() => toast.info("File attachment is a demo-only feature")}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-3 text-xs text-muted-foreground transition-colors hover:bg-accent/40"
          >
            <Paperclip className="h-3.5 w-3.5" /> Attach file (PDF, image, worksheet)
          </button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-amber-600 text-white hover:bg-amber-700">
            <Check className="h-4 w-4" /> Assign Homework
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TrackingDialog({ homework, onClose }: { homework: Homework | null; onClose: () => void }) {
  if (!homework) return null
  const { className } = homework
  const [grade, section] = className.split(" ")
  const students = STUDENTS.filter((s) => s.className === grade && s.section === section)
  const submissionStatuses = students.map((s, i) => {
    const r = (i + s.rollNo + s.name.length) % 5
    const status = r === 0 ? "Late" : r === 1 ? "Pending" : "Submitted"
    return { student: s, status: status as "Submitted" | "Pending" | "Late" }
  })

  return (
    <Dialog open={!!homework} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-600" /> Submissions — {homework.title}
          </DialogTitle>
          <DialogDescription>
            {homework.className} • Due {homework.dueDate} • {submissionStatuses.filter((s) => s.status === "Submitted").length} of {students.length} submitted
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-border/60">
          <div className="divide-y divide-border/40">
            {submissionStatuses.map(({ student, status }) => (
              <div key={student.id} className="flex items-center gap-3 px-4 py-2.5">
                <Avatar name={student.name} color={student.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">Roll {student.rollNo} • {student.admissionNo}</p>
                </div>
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                  status === "Submitted" && "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
                  status === "Late" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
                  status === "Pending" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
                )}>
                  {status === "Submitted" && <Check className="h-3 w-3" />}
                  {status === "Late" && <AlertCircle className="h-3 w-3" />}
                  {status === "Pending" && <Clock className="h-3 w-3" />}
                  {status}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={status === "Pending"}
                  onClick={() => toast.success(`Reviewed ${student.name}'s submission`, { description: `Marks recorded for "${homework.title}"` })}
                >
                  Review
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button onClick={() => { toast.success("Bulk review completed"); onClose() }} className="bg-amber-600 text-white hover:bg-amber-700">
            Mark all reviewed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
