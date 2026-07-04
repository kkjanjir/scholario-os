"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Mail, Phone, Calendar, Award, GraduationCap,
  Briefcase, User, IdCard, MapPin, Clock, CheckCircle2,
  Download, Sparkles, BadgeCheck,
} from "lucide-react"

import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"

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

import { TEACHERS, SUBJECTS, CLASSES, type Teacher } from "@/lib/mock/data"
import { cn } from "@/lib/utils"

const DEPARTMENTS = Array.from(new Set(TEACHERS.map((t) => t.department)))

export function TeachersModule() {
  const [search, setSearch] = useState("")
  const [dept, setDept] = useState("All")
  const [openTeacher, setOpenTeacher] = useState<Teacher | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    return TEACHERS.filter((t) => {
      const q = search.toLowerCase()
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.department.toLowerCase().includes(q) || t.empId.toLowerCase().includes(q)
      const matchDept = dept === "All" || t.department === dept
      return matchSearch && matchDept
    })
  }, [search, dept])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Management"
        description="Faculty profiles, allocations, attendance & salary"
        action={
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Teacher
          </Button>
        }
      />

      <SectionCard
        title="Faculty Directory"
        subtitle={`${filtered.length} of ${TEACHERS.length} teachers`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="border-b border-border/60 px-5 py-3">
          <Toolbar search={search} onSearch={setSearch} placeholder="Search by name, dept or employee ID…" />
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => {
              const c = colorOf(t.avatarColor)
              return (
                <motion.button
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  onClick={() => setOpenTeacher(t)}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium transition-colors hover:border-primary/30"
                >
                  <div className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-15 transition-opacity group-hover:opacity-30", c.bg)} />
                  <div className="relative flex items-start gap-3">
                    <Avatar name={t.name} color={t.avatarColor} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-semibold">{t.name}</p>
                        {t.designation === "Principal" && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{t.designation}</p>
                      <span className={cn("mt-1.5 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1", c.soft, c.ring, c.text)}>
                        {t.department}
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-4 flex flex-wrap gap-1">
                    {t.subjects.map((s) => (
                      <span key={s} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{s}</span>
                    ))}
                  </div>

                  <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-border/50 pt-3 text-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Exp</p>
                      <p className="text-sm font-bold">{t.experience}y</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Attend</p>
                      <p className={cn("text-sm font-bold", t.attendance >= 95 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>{t.attendance}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Salary</p>
                      <p className="text-sm font-bold">{formatINR(t.salary, true)}</p>
                    </div>
                  </div>

                  <div className="relative mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-mono">{t.empId}</span>
                    <span className="inline-flex items-center gap-1 text-primary transition-transform group-hover:translate-x-0.5">
                      View profile →
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </SectionCard>

      <TeacherDialog teacher={openTeacher} onClose={() => setOpenTeacher(null)} />
      <AddTeacherDialog open={addOpen} onClose={setAddOpen} />
    </div>
  )
}

function TeacherDialog({ teacher, onClose }: { teacher: Teacher | null; onClose: () => void }) {
  const [empConfirmed, setEmpConfirmed] = useState(false)
  const t = teacher
  const c = t ? colorOf(t.avatarColor) : null

  // salary breakdown
  const basic = t ? Math.round(t.salary * 0.55) : 0
  const hra = t ? Math.round(t.salary * 0.2) : 0
  const allowances = t ? Math.round(t.salary * 0.15) : 0
  const deductions = t ? Math.round(t.salary * 0.1) : 0

  return (
    <Dialog open={!!t} onOpenChange={(o) => { if (!o) { onClose(); setEmpConfirmed(false) } }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {t && c && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className={cn("rounded-2xl p-1 ring-1", c.ring)}>
                  <Avatar name={t.name} color={t.avatarColor} size="xl" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    {t.name}
                    {t.designation === "Principal" && <BadgeCheck className="h-5 w-5 text-emerald-500" />}
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    {t.designation} · {t.department} · {t.empId}
                  </DialogDescription>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {t.subjects.map((s) => (
                      <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Monthly Salary</p>
                  <p className="text-xl font-bold">{formatINR(t.salary)}</p>
                </div>
              </div>
            </DialogHeader>

            {/* contact & details */}
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/30 p-4 text-sm">
              <DetailRow icon={Mail} label="Email" value={t.email} />
              <DetailRow icon={Phone} label="Phone" value={t.phone} />
              <DetailRow icon={Calendar} label="Joined" value={new Date(t.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
              <DetailRow icon={Award} label="Experience" value={`${t.experience} years`} />
              <DetailRow icon={GraduationCap} label="Qualification" value={t.qualification} />
              <DetailRow icon={MapPin} label="Address" value={t.address} />
              <DetailRow icon={User} label="Blood Group" value={t.bloodGroup} />
              <DetailRow icon={Briefcase} label="Classes" value={t.classes.join(", ")} />
            </div>

            {/* attendance summary */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attendance Summary (Last 30 days)</p>
              <div className="grid grid-cols-4 gap-2">
                <AttStat label="Present" value={28} color="emerald" />
                <AttStat label="Late" value={1} color="amber" />
                <AttStat label="On Leave" value={1} color="violet" />
                <AttStat label="Absent" value={0} color="rose" />
              </div>
              <div className="mt-2 flex items-center gap-3 rounded-lg bg-emerald-500/5 p-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Attendance Rate</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{t.attendance}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.attendance}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-emerald-500"
                    />
                  </div>
                </div>
                <StatusBadge status={t.attendance >= 95 ? "Good" : "Fair"} />
              </div>
            </div>

            {/* salary slip preview */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Salary Slip Preview · Nov 2025</p>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => toast.success(`Payslip downloaded for ${t.name}`)}>
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
              <div className="overflow-hidden rounded-xl border border-border/60">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-left">
                      <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Component</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Earnings</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deductions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <SlipRow label="Basic" earn={basic} />
                    <SlipRow label="HRA" earn={hra} />
                    <SlipRow label="Allowances" earn={allowances} />
                    <SlipRow label="PF + Prof. Tax + TDS" ded={deductions} />
                    <tr className="bg-muted/20 font-bold">
                      <td className="px-4 py-2.5">Net Pay</td>
                      <td colSpan={2} className="px-4 py-2.5 text-right text-emerald-600 dark:text-emerald-400">{formatINR(basic + hra + allowances - deductions)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* generate employee id */}
            <div className="rounded-xl border border-border/60 bg-card/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2.5 ring-1 ring-emerald-500/20">
                    <IdCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Employee ID Card</p>
                    <p className="text-xs text-muted-foreground">{empConfirmed ? "Card generated & ready for print" : "Generate printable ID card"}</p>
                  </div>
                </div>
                <Button
                  variant={empConfirmed ? "outline" : "default"}
                  size="sm"
                  onClick={() => {
                    if (!empConfirmed) {
                      setEmpConfirmed(true)
                      toast.success(`Employee ID card generated for ${t.name}`)
                    } else {
                      toast.success("ID card sent to printer queue")
                    }
                  }}
                >
                  {empConfirmed ? <><Download className="h-3.5 w-3.5" /> Print</> : "Generate"}
                </Button>
              </div>
              {empConfirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center justify-between rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-3 text-white"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wider opacity-80">Sri Vidya Mandir</p>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-[11px] opacity-90">{t.empId} · {t.department}</p>
                  </div>
                  <Avatar name={t.name} color="emerald" size="md" className="ring-2 ring-white/50" />
                </motion.div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => toast.info(`Message sent to ${t.name}`)}>
                <Mail className="h-4 w-4" /> Send Message
              </Button>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-xs font-medium">{value}</p>
      </div>
    </div>
  )
}

function AttStat({ label, value, color }: { label: string; value: number; color: string }) {
  const c = colorOf(color)
  return (
    <div className={cn("rounded-lg p-2 text-center ring-1", c.soft, c.ring)}>
      <p className={cn("text-lg font-bold", c.text)}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}

function SlipRow({ label, earn, ded }: { label: string; earn?: number; ded?: number }) {
  return (
    <tr>
      <td className="px-4 py-2 text-muted-foreground">{label}</td>
      <td className="px-4 py-2 text-right font-medium">{earn ? formatINR(earn) : "—"}</td>
      <td className="px-4 py-2 text-right font-medium text-rose-600 dark:text-rose-400">{ded ? formatINR(ded) : "—"}</td>
    </tr>
  )
}

function AddTeacherDialog({ open, onClose }: { open: boolean; onClose: (v: boolean) => void }) {
  const [form, setForm] = useState({
    name: "", designation: "TGT", department: "", qualification: "",
    salary: "", experience: "", email: "", phone: "",
  })
  const [subjects, setSubjects] = useState<string[]>([])
  const [classes, setClasses] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  function toggle(arr: string[], v: string, set: (x: string[]) => void) {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  }

  function submit() {
    if (!form.name || !form.department || !form.email) {
      toast.error("Please fill name, department & email")
      return
    }
    setSaving(true)
    setTimeout(() => {
      const empId = `SVM-EMP-${1013 + Math.floor(Math.random() * 99)}`
      toast.success(`Teacher added successfully!`, {
        description: `${form.name} · ${empId}`,
      })
      setSaving(false)
      setForm({ name: "", designation: "TGT", department: "", qualification: "", salary: "", experience: "", email: "", phone: "" })
      setSubjects([]); setClasses([])
      onClose(false)
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Add New Teacher
          </DialogTitle>
          <DialogDescription>Onboard a new faculty member with full profile.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name *">
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Anjali Deshpande" />
            </Field>
            <Field label="Designation">
              <Select value={form.designation} onValueChange={(v) => update("designation", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Principal", "PGT", "TGT", "PRT", "PTI", "Senior PGT"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Department *">
              <Select value={form.department} onValueChange={(v) => update("department", v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Qualification">
              <Input value={form.qualification} onChange={(e) => update("qualification", e.target.value)} placeholder="e.g. M.Sc, B.Ed." />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Monthly Salary (₹)">
              <Input type="number" value={form.salary} onChange={(e) => update("salary", e.target.value)} placeholder="e.g. 60000" />
            </Field>
            <Field label="Experience (years)">
              <Input type="number" value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="e.g. 8" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Email *">
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@srividya-mandir.edu.in" />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98xxx xxxxx" />
            </Field>
          </div>

          <Field label="Subjects">
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
              {SUBJECTS.slice(0, 12).map((s) => {
                const on = subjects.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggle(subjects, s, setSubjects)}
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium transition-all",
                      on ? "bg-primary text-primary-foreground shadow-sm" : "bg-background text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {on && "✓ "}{s}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Class Assignments">
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5 max-h-32 overflow-y-auto">
              {CLASSES.slice(3).map((s) => {
                const on = classes.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggle(classes, s, setClasses)}
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium transition-all",
                      on ? "bg-primary text-primary-foreground shadow-sm" : "bg-background text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {on && "✓ "}{s}
                  </button>
                )
              })}
            </div>
          </Field>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={submit} disabled={saving} className="gap-2">
            {saving ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Clock className="h-4 w-4" /></motion.span> Saving…</> : <><CheckCircle2 className="h-4 w-4" /> Add Teacher</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
