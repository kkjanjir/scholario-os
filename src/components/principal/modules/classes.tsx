"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Users, GraduationCap, BookOpen,
  CalendarDays, ChevronRight, Layers, Sparkles,
} from "lucide-react"

import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"

import {
  CLASSES_INFO, TEACHERS, SUBJECTS, CLASSES, SECTIONS, TIMETABLE,
  type Teacher,
} from "@/lib/mock/data"
import { cn } from "@/lib/utils"

const SUBJECT_BY_GRADE: Record<string, string[]> = {
  "Grade 6": ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Science", "Physical Education", "Art"],
  "Grade 7": ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Science", "Physical Education", "Music"],
  "Grade 8": ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Science", "Physical Education", "Art"],
  "Grade 9": ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Science", "Physical Education"],
  "Grade 10": ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Science", "Physical Education"],
}

function teacherName(id: string): Teacher | undefined {
  return TEACHERS.find((t) => t.id === id)
}

export function ClassesModule() {
  const [search, setSearch] = useState("")
  const [openClass, setOpenClass] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) return CLASSES_INFO
    const q = search.toLowerCase()
    return CLASSES_INFO.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.sections.some((s) => teacherName(s.classTeacher)?.name.toLowerCase().includes(q))
    )
  }, [search])

  const totalStrength = CLASSES_INFO.reduce(
    (acc, c) => acc + c.sections.reduce((a, s) => a + s.strength, 0),
    0
  )
  const totalSections = CLASSES_INFO.reduce((a, c) => a + c.sections.length, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Management"
        description="Classes, sections, subject allocations & timetables"
        action={
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Create Class
          </Button>
        }
      />

      {/* quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStatBig icon={Layers} color="emerald" label="Active Classes" value={String(CLASSES_INFO.length)} sub="Grades 6–10" index={0} />
        <MiniStatBig icon={Users} color="violet" label="Total Sections" value={String(totalSections)} sub="Across all grades" index={1} />
        <MiniStatBig icon={GraduationCap} color="amber" label="Total Strength" value={String(totalStrength)} sub="Enrolled students" index={2} />
        <MiniStatBig icon={BookOpen} color="teal" label="Subjects Offered" value={String(SUBJECTS.length)} sub="Across curriculum" index={3} />
      </div>

      <SectionCard
        title="All Classes"
        subtitle="Click a class to view sections, subjects & timetable"
        action={
          <Toolbar search={search} onSearch={setSearch} placeholder="Search class or teacher…" />
        }
        bodyClassName="p-0"
      >
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => {
              const totalStr = c.sections.reduce((a, s) => a + s.strength, 0)
              const subjectList = SUBJECT_BY_GRADE[c.name] || SUBJECTS.slice(0, 6)
              const lead = teacherName(c.sections[0].classTeacher)
              const c1 = colorOf(lead?.avatarColor || "emerald")
              return (
                <motion.button
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  onClick={() => setOpenClass(c.id)}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium transition-colors hover:border-primary/30"
                >
                  <div className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-15 transition-opacity group-hover:opacity-30", c1.bg)} />
                  <div className="relative flex items-start justify-between">
                    <div className={cn("rounded-2xl p-3 ring-1", c1.soft, c1.ring)}>
                      <GraduationCap className={cn("h-6 w-6", c1.text)} />
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {c.sections.length} section{c.sections.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3 className="relative mt-4 text-lg font-bold tracking-tight">{c.name}</h3>
                  <p className="relative text-xs text-muted-foreground">{totalStr} students • {subjectList.length} subjects</p>

                  <div className="relative mt-4 flex flex-wrap gap-1.5">
                    {c.sections.map((s) => {
                      const t = teacherName(s.classTeacher)
                      const sc = colorOf(t?.avatarColor || "slate")
                      return (
                        <span key={s.name} className={cn("inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium ring-1", sc.soft, sc.ring, sc.text)}>
                          <span className="font-bold">Sec {s.name}</span> · {s.strength} · {s.room}
                        </span>
                      )
                    })}
                  </div>

                  <div className="relative mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                    <div className="flex items-center gap-2">
                      {lead && <Avatar name={lead.name} color={lead.avatarColor} size="xs" />}
                      <span className="text-xs text-muted-foreground">{lead?.name.split(" ").slice(-1)[0]} et al.</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-0.5">
                      View <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </SectionCard>

      <ClassDetailDialog classId={openClass} onClose={() => setOpenClass(null)} />
      <CreateClassDialog open={createOpen} onClose={setCreateOpen} />
    </div>
  )
}

function MiniStatBig({ icon: Icon, color, label, value, sub, index }: {
  icon: any; color: string; label: string; value: string; sub: string; index: number
}) {
  const c = colorOf(color)
  return (
    <StaggerItem index={index}>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
        <div className="flex items-center justify-between">
          <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
            <Icon className={cn("h-5 w-5", c.text)} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </StaggerItem>
  )
}

function ClassDetailDialog({ classId, onClose }: { classId: string | null; onClose: () => void }) {
  const c = CLASSES_INFO.find((x) => x.id === classId)
  if (!c) return <Dialog open={false} onOpenChange={(o) => !o && onClose()}><DialogContent /></Dialog>
  const totalStrength = c.sections.reduce((a, s) => a + s.strength, 0)
  const subjectList = SUBJECT_BY_GRADE[c.name] || SUBJECTS.slice(0, 6)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  const tt = TIMETABLE

  return (
    <Dialog open={!!classId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
              <GraduationCap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">{c.name}</DialogTitle>
              <DialogDescription>
                {c.sections.length} sections · {totalStrength} students · {subjectList.length} subjects
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Sections table */}
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Sections</h4>
            <div className="overflow-hidden rounded-xl border border-border/60">
              <Table
                headers={["Section", "Class Teacher", "Room", "Strength", "Status"]}
                rows={c.sections.map((s) => {
                  const t = teacherName(s.classTeacher)
                  return {
                    Section: <span className="font-bold">{s.name}</span>,
                    "Class Teacher": t ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={t.name} color={t.avatarColor} size="xs" />
                        <span>{t.name}</span>
                      </div>
                    ) : "—",
                    Room: <Badge variant="outline" className="font-mono">{s.room}</Badge>,
                    Strength: <span className="font-semibold">{s.strength}</span>,
                    Status: <StatusBadge status="Good" />,
                  }
                })}
              />
            </div>
          </div>

          {/* Subject allocation per section */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subjects ({subjectList.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {subjectList.map((s, i) => {
                  const sc = colorOf(["emerald", "violet", "amber", "rose", "teal", "sky", "cyan", "orange"][i % 8])
                  return (
                    <span key={s} className={cn("inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium ring-1", sc.soft, sc.ring, sc.text)}>
                      <BookOpen className="h-3 w-3" /> {s}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Class Teacher Allocation
              </p>
              <div className="space-y-2">
                {c.sections.map((s) => {
                  const t = teacherName(s.classTeacher)
                  if (!t) return null
                  const sc = colorOf(t.avatarColor)
                  return (
                    <div key={s.name} className="flex items-center justify-between rounded-lg bg-background/60 px-2.5 py-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={t.name} color={t.avatarColor} size="sm" />
                        <div>
                          <p className="text-xs font-semibold">{t.name}</p>
                          <p className="text-[11px] text-muted-foreground">{t.designation} · {t.department}</p>
                        </div>
                      </div>
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold ring-1", sc.soft, sc.ring, sc.text)}>
                        Sec {s.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Timetable preview */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Weekly Timetable Preview
            </h4>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Period</th>
                    {days.map((d) => (
                      <th key={d} className="px-2 py-2 text-center font-semibold text-muted-foreground">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tt.map((p, idx) => (
                    <tr key={p.period} className={cn("border-b border-border/40", idx % 2 === 1 && "bg-muted/20")}>
                      <td className="px-2 py-2">
                        <p className="text-[11px] font-bold">P{p.period}</p>
                        <p className="text-[10px] text-muted-foreground">{p.time}</p>
                      </td>
                      {days.map((d, di) => {
                        // rotate subject slightly per day for variety
                        const subj = tt[(idx + di) % tt.length].subject
                        const sc = colorOf(["emerald", "violet", "amber", "rose", "teal", "sky", "cyan", "orange"][(idx + di) % 8])
                        return (
                          <td key={d} className="px-1.5 py-1.5">
                            <div className={cn("rounded-md px-1.5 py-1 text-center text-[10px] font-medium ring-1", sc.soft, sc.ring, sc.text)}>
                              {subj.length > 10 ? subj.slice(0, 8) + "…" : subj}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => toast.info("Timetable exported to PDF")}>
            Export Timetable
          </Button>
          <Button onClick={() => { toast.success(`Allocation changes saved for ${c.name}`); onClose() }}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: Record<string, React.ReactNode>[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/60 bg-muted/30 text-left">
          {headers.map((h) => (
            <th key={h} className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-border/40 last:border-0 transition-colors hover:bg-accent/30">
            {headers.map((h) => (
              <td key={h} className="whitespace-nowrap px-4 py-2.5">{r[h]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CreateClassDialog({ open, onClose }: { open: boolean; onClose: (v: boolean) => void }) {
  const [name, setName] = useState("")
  const [section, setSection] = useState("A")
  const [teacher, setTeacher] = useState("")
  const [room, setRoom] = useState("")
  const [strength, setStrength] = useState("")
  const [subjects, setSubjects] = useState<string[]>([])

  function toggleSubject(s: string) {
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  function handleSubmit() {
    if (!name || !teacher || !room) {
      toast.error("Please fill class name, teacher & room")
      return
    }
    toast.success(`Class ${name} - ${section} created successfully`, {
      description: `Class Teacher: ${TEACHERS.find((t) => t.id === teacher)?.name}`,
    })
    setName(""); setTeacher(""); setRoom(""); setStrength(""); setSubjects([])
    onClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Create New Class
          </DialogTitle>
          <DialogDescription>Provision a new class section with teacher & subject allocation.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Class Name</Label>
              <Select value={name} onValueChange={setName}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Section</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Class Teacher</Label>
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Assign teacher…" /></SelectTrigger>
              <SelectContent>
                {TEACHERS.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} · {t.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Room Number</Label>
              <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. B-205" />
            </div>
            <div className="space-y-1.5">
              <Label>Expected Strength</Label>
              <Input type="number" value={strength} onChange={(e) => setStrength(e.target.value)} placeholder="e.g. 38" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Subject Allocation</Label>
            <div className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
              {SUBJECTS.slice(0, 12).map((s) => {
                const on = subjects.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubject(s)}
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium transition-all",
                      on
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-background text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {on && "✓ "}{s}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-muted-foreground">{subjects.length} subjects selected</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Create Class</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
