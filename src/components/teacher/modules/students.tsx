"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { SimpleLine } from "@/components/shared/charts"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { STUDENTS, studentResult, type Student } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Search, Phone, Mail, MapPin, Droplet, Calendar, MessageSquare, FileText, GraduationCap,
} from "lucide-react"

const CLASSES = ["All", "Grade 9-A", "Grade 10-A", "Grade 10-B"]

function attendanceColor(pct: number) {
  if (pct >= 90) return "emerald"
  if (pct >= 75) return "amber"
  return "rose"
}

function marksColor(m: number) {
  if (m >= 80) return "emerald"
  if (m >= 60) return "amber"
  return "rose"
}

export function StudentsModule() {
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("All")
  const [selected, setSelected] = useState<Student | null>(null)

  const list = useMemo(() => {
    return STUDENTS.filter((s) => {
      const key = `${s.className}-${s.section}`
      if (key !== "Grade 9-A" && key !== "Grade 10-A" && key !== "Grade 10-B") return false
      if (classFilter !== "All" && key !== classFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q)
    })
  }, [search, classFilter])

  return (
    <div className="space-y-6">
      <PageHeader title="My Students" description="Profiles, performance & parent communication" />

      <Toolbar search={search} onSearch={setSearch} placeholder="Search by name or admission no…">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CLASSES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{list.length} students</span>
      </Toolbar>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, 60).map((s, i) => {
          const atd = attendanceColor(s.attendancePct)
          const mrk = marksColor(s.avgMarks)
          return (
            <StaggerItem key={s.id} index={Math.min(i, 12)}>
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelected(s)}
                className="w-full text-left"
              >
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium transition-colors hover:bg-accent/20">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} color={s.avatarColor} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">Roll {s.rollNo} • {s.className}-{s.section}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{s.admissionNo}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-accent/40 p-2.5">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Attendance</p>
                      <p className={cn("font-bold", colorOf(atd).text)}>{s.attendancePct}%</p>
                    </div>
                    <div className="rounded-xl bg-accent/40 p-2.5">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg Marks</p>
                      <p className={cn("font-bold", colorOf(mrk).text)}>{s.avgMarks}%</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-[11px] text-muted-foreground">Fee status</span>
                    <StatusBadge status={s.feeStatus} />
                  </div>
                </div>
              </motion.button>
            </StaggerItem>
          )
        })}
      </div>

      <ProfileDialog student={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function ProfileDialog({ student, onClose }: { student: Student | null; onClose: () => void }) {
  if (!student) return null
  const result = studentResult(student.id)
  // last 5 assessment marks from result
  const trendData = result.slice(0, 5).map((r, i) => ({ name: `A${i + 1}`, marks: r.marks }))
  const atd = attendanceColor(student.attendancePct)

  return (
    <Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-amber-600" /> Student Profile
          </DialogTitle>
          <DialogDescription>{student.admissionNo} • {student.className}-{student.section}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* header */}
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-4">
            <Avatar name={student.name} color={student.avatarColor} size="xl" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold tracking-tight">{student.name}</h3>
              <p className="text-xs text-muted-foreground">Roll {student.rollNo} • {student.gender}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <StatusBadge status={student.feeStatus} />
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                  colorOf(atd).soft, colorOf(atd).text, colorOf(atd).ring
                )}>
                  Attendance {student.attendancePct}%
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/20">
                  Avg {student.avgMarks}%
                </span>
              </div>
            </div>
          </div>

          {/* personal details */}
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow icon={Calendar} label="Date of Birth" value={student.dob} />
            <DetailRow icon={Droplet} label="Blood Group" value={student.bloodGroup} />
            <DetailRow icon={Phone} label="Guardian Phone" value={student.guardianPhone} />
            <DetailRow icon={Mail} label="Father's Name" value={student.fatherName} />
            <DetailRow icon={Mail} label="Mother's Name" value={student.motherName} />
            <DetailRow icon={MapPin} label="Address" value={student.address} />
          </div>

          {/* performance chart */}
          <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Academic Performance</p>
                <p className="text-xs text-muted-foreground">Last 5 assessments</p>
              </div>
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Trend: +4%</span>
            </div>
            <SimpleLine data={trendData} dataKey="marks" color="oklch(0.62 0.15 60)" height={140} />
          </div>

          {/* subject breakdown */}
          <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
            <p className="mb-2 text-sm font-medium">Latest Result — Subject-wise</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {result.map((r) => {
                const g = r.marks >= 90 ? "emerald" : r.marks >= 70 ? "amber" : "rose"
                return (
                  <div key={r.subject} className="rounded-xl bg-accent/40 p-2.5">
                    <p className="truncate text-[11px] text-muted-foreground">{r.subject}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{r.marks}</span>
                      <span className={cn("text-xs font-bold", colorOf(g).text)}>{r.grade}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => toast.success(`Results opened for ${student.name}`)}>
            <FileText className="h-4 w-4" /> View Results
          </Button>
          <Button onClick={() => toast.success(`Message sent to ${student.fatherName}`, { description: `Reply-to: ${student.guardianPhone}` })} className="bg-amber-600 text-white hover:bg-amber-700">
            <MessageSquare className="h-4 w-4" /> Message Parent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card/50 p-3">
      <div className="rounded-lg bg-amber-500/10 p-1.5">
        <Icon className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
