"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, StatPill } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { SimpleLine } from "@/components/shared/charts"
import { STUDENTS, studentResult, EXAMS, SCHOOL } from "@/lib/mock/data"
import { downloadReportCard } from "@/components/shared/skeleton"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Award, TrendingUp, Trophy, Download, Star, FileText, GraduationCap,
  CheckCircle2, Sparkles, ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

const SUBJECT_COLOR: Record<string, string> = {
  English: "rose", Hindi: "pink", Mathematics: "violet", Science: "emerald",
  "Social Science": "amber", "Computer Science": "sky", Physics: "teal",
  Chemistry: "cyan", Biology: "lime", Accountancy: "orange",
  "Business Studies": "fuchsia", Economics: "indigo",
}

function gradeFor(pct: number) {
  if (pct >= 90) return { grade: "A1", color: "emerald" }
  if (pct >= 80) return { grade: "A2", color: "teal" }
  if (pct >= 70) return { grade: "B1", color: "sky" }
  if (pct >= 60) return { grade: "B2", color: "amber" }
  if (pct >= 50) return { grade: "C1", color: "orange" }
  return { grade: "C2", color: "rose" }
}

// Variance per exam — half-yearly slightly higher than first term
function examVariance(examId: string) {
  return examId === "ex1" ? -6 : examId === "ex2" ? 0 : examId === "ex3" ? +3 : 0
}

export function ResultsModule() {
  const me = STUDENTS[0]
  const completedExams = EXAMS.filter((e) => e.status === "Completed")
  const [examId, setExamId] = useState(completedExams[1]?.id || completedExams[0]?.id)
  const exam = EXAMS.find((e) => e.id === examId)!
  const v = examVariance(exam.id)

  const subjects = studentResult(me.id).map((s) => ({
    ...s,
    marks: Math.max(35, Math.min(100, s.marks + v)),
  }))
  const total = subjects.reduce((a, s) => a + s.marks, 0)
  const maxTotal = subjects.reduce((a, s) => a + s.max, 0)
  const pct = Math.round((total / maxTotal) * 100)
  const g = gradeFor(pct)
  const rank = Math.max(1, 3 - (v >= 0 ? 1 : 0))

  const topSubjects = [...subjects].sort((a, b) => b.marks - a.marks).slice(0, 3)

  const termProgress = [
    { name: "Apr", marks: 68 },
    { name: "May", marks: 72 },
    { name: "Jul", marks: 75 },
    { name: "Aug", marks: 73 },
    { name: "Sep", marks: 78 },
    { name: "Oct", marks: 82 },
    { name: "Dec", marks: pct },
  ]

  const [showReport, setShowReport] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Results"
        description="Exam scores, subject-wise breakdown & progress over time"
        action={
          <div className="flex items-center gap-2">
            <Select value={examId} onValueChange={setExamId}>
              <SelectTrigger className="w-[220px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {completedExams.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90" onClick={() => { downloadReportCard(me, subjects); toast.success("Report card downloaded! 📄") }}>
              <Download className="h-4 w-4" /> Download Report Card
            </Button>
          </div>
        }
      />

      {/* Result hero card */}
      <StaggerItem index={1}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 p-6 text-white shadow-premium lg:p-8">
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-44 w-44 rounded-full bg-fuchsia-300/20 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={me.name} color="violet" size="xl" className="ring-4 ring-white/30" />
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                  <GraduationCap className="h-3 w-3" /> {exam.name}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{me.name}</h2>
                <p className="text-sm text-white/85">{me.className} • Section {me.section} • Roll No. {String(me.rollNo).padStart(2, "0")}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">Overall</p>
                <p className="text-4xl font-bold">
                  <AnimatedCounter value={pct} suffix="%" />
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">Grade</p>
                <p className="text-4xl font-bold">{g.grade}</p>
              </div>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white text-violet-600 shadow-xl"
                >
                  <Trophy className="h-5 w-5" />
                  <p className="mt-0.5 text-2xl font-bold leading-none">
                    <AnimatedCounter value={rank} />
                  </p>
                  <p className="text-[9px] uppercase tracking-wide">Rank</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Top subjects + summary stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={2} className="lg:col-span-2">
          <SectionCard title="Top Subjects" subtitle="Your strongest performers this exam 🌟">
            <div className="grid gap-3 sm:grid-cols-3">
              {topSubjects.map((s, i) => {
                const sc = colorOf(SUBJECT_COLOR[s.subject] || "violet")
                const medals = ["🥇", "🥈", "🥉"]
                return (
                  <motion.div
                    key={s.subject}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={{ y: -3 }}
                    className={cn("relative overflow-hidden rounded-2xl border p-4 ring-1", sc.soft, sc.ring, "border-border/60")}
                  >
                    <div className="absolute right-2 top-2 text-2xl">{medals[i]}</div>
                    <div className={cn("rounded-lg p-2 w-fit", "bg-background/60", sc.text)}>
                      <Star className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{s.subject}</p>
                    <p className="mt-1 text-2xl font-bold">
                      <AnimatedCounter value={s.marks} />
                      <span className="text-sm font-medium text-muted-foreground">/{s.max}</span>
                    </p>
                    <p className="mt-1 text-xs font-medium" style={{ color: `var(--chart-${(i % 5) + 1})` }}>
                      Grade {s.grade}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={3}>
          <SectionCard title="Summary" subtitle="At a glance">
            <div className="space-y-2.5">
              <StatPill label="Total Marks" value={`${total} / ${maxTotal}`} color="violet" />
              <StatPill label="Percentage" value={`${pct}%`} color="fuchsia" />
              <StatPill label="Overall Grade" value={g.grade} color="amber" />
              <StatPill label="Class Rank" value={`#${rank} of 38`} color="emerald" />
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Subject-wise table */}
      <StaggerItem index={4}>
        <SectionCard title="Subject-wise Marks" subtitle={`${exam.name} • ${exam.term}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subject</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Marks</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grade</th>
                  <th className="min-w-[180px] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Performance</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, i) => {
                  const sc = colorOf(SUBJECT_COLOR[s.subject] || "violet")
                  const p = Math.round((s.marks / s.max) * 100)
                  return (
                    <motion.tr
                      key={s.subject}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/40 transition-colors hover:bg-accent/40"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2 w-2 rounded-full", sc.dot)} />
                          <span className="font-medium">{s.subject}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-semibold">{s.marks}<span className="text-muted-foreground">/{s.max}</span></td>
                      <td className="px-3 py-3">
                        <span className={cn("inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ring-1", sc.soft, sc.ring, sc.text)}>
                          {s.grade}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${p}%` }}
                              transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                              className={cn("h-full rounded-full", sc.bg)}
                            />
                          </div>
                          <span className="w-10 text-right text-xs font-medium">{p}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="px-3 py-3 font-bold">Total</td>
                  <td className="px-3 py-3 font-bold">{total}<span className="text-muted-foreground">/{maxTotal}</span></td>
                  <td className="px-3 py-3">
                    <span className={cn("inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ring-1", colorOf(g.color).soft, colorOf(g.color).ring, colorOf(g.color).text)}>
                      {g.grade}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-bold">{pct}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Progress chart */}
      <StaggerItem index={5}>
        <SectionCard title="My Progress" subtitle="Average marks across the term 📈" action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +14% since April
          </span>
        }>
          <SimpleLine data={termProgress} dataKey="marks" color="oklch(0.6 0.21 300)" height={260} />
        </SectionCard>
      </StaggerItem>

      {/* Report card dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              Report Card Preview
            </DialogTitle>
            <DialogDescription>{exam.name} • {SCHOOL.session}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-border/60 bg-white p-6 text-foreground">
            {/* Official letterhead */}
            <div className="flex items-center justify-between border-b-2 border-violet-600 pb-3">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-violet-700">{SCHOOL.name}</h3>
                <p className="text-xs text-muted-foreground">{SCHOOL.address}</p>
                <p className="text-xs text-muted-foreground">{SCHOOL.affiliation} • Estd. {SCHOOL.estd}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Session</p>
                <p className="font-semibold">{SCHOOL.session}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Student</p>
                <p className="font-semibold">{me.name}</p>
                <p className="text-xs text-muted-foreground">{me.className} • {me.section} • Roll {String(me.rollNo).padStart(2, "0")} • {me.admissionNo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Examination</p>
                <p className="font-semibold">{exam.name}</p>
                <p className="text-xs text-muted-foreground">{exam.term}</p>
              </div>
            </div>

            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="bg-violet-50 text-left text-xs uppercase tracking-wide text-violet-700">
                  <th className="px-3 py-2 rounded-l-lg">Subject</th>
                  <th className="px-3 py-2">Max</th>
                  <th className="px-3 py-2">Obtained</th>
                  <th className="px-3 py-2 rounded-r-lg">Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s.subject} className="border-b border-border/40">
                    <td className="px-3 py-2 font-medium">{s.subject}</td>
                    <td className="px-3 py-2">{s.max}</td>
                    <td className="px-3 py-2 font-semibold">{s.marks}</td>
                    <td className="px-3 py-2">{s.grade}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-violet-600 font-bold">
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2">{maxTotal}</td>
                  <td className="px-3 py-2">{total}</td>
                  <td className="px-3 py-2">{g.grade} ({pct}%)</td>
                </tr>
              </tfoot>
            </table>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-violet-50 p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Percentage</p>
                <p className="text-lg font-bold text-violet-700">{pct}%</p>
              </div>
              <div className="rounded-xl bg-fuchsia-50 p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Grade</p>
                <p className="text-lg font-bold text-fuchsia-700">{g.grade}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rank</p>
                <p className="text-lg font-bold text-emerald-700">#{rank}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-muted/40 p-3 text-xs">
              <p className="font-semibold">Result: <span className="text-emerald-600">PASSED WITH DISTINCTION</span></p>
              <p className="mt-1 text-muted-foreground">Aarav has shown excellent progress this term. Consistent performance across all subjects with notable strength in {topSubjects[0].subject}.</p>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Class Teacher</p>
                <div className="mt-6 h-px w-32 bg-foreground/40" />
                <p className="mt-1 text-xs font-medium">Meera Nair</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Principal</p>
                <div className="mt-6 h-px w-32 bg-foreground/40 ml-auto" />
                <p className="mt-1 text-xs font-medium">Dr. Anjali Deshpande</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setShowReport(false)}>Close</Button>
            <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90" onClick={() => { downloadReportCard(me, subjects); toast.success("Report card PDF downloaded! 📄") }}>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
