"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { STUDENTS, studentResult, EXAMS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { Award, Trophy, Medal, Download } from "lucide-react"
import { toast } from "sonner"
import { downloadReportCard } from "@/components/shared/skeleton"

export function ResultsModule() {
  const child = STUDENTS[0]
  const result = studentResult(child.id)
  const total = result.reduce((a, r) => a + r.marks, 0)
  const maxTotal = result.reduce((a, r) => a + r.max, 0)
  const overall = Math.round((total / maxTotal) * 100)
  const rank = 4

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Results"
        description={`${child.name} • ${child.className} ${child.section}`}
        action={
          <button onClick={() => { downloadReportCard(child, result); toast.success("Report card downloaded! 📄") }} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105">
            <Download className="h-4 w-4" /> Download Report Card
          </button>
        }
      />

      {/* hero result card */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 p-6 text-white shadow-premium">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <Trophy className="mx-auto h-8 w-8" />
              <p className="mt-2 text-xs uppercase tracking-wide text-white/80">Class Rank</p>
              <p className="text-4xl font-bold">
                <AnimatedCounter value={rank} />
                <span className="text-lg">/38</span>
              </p>
            </div>
            <div className="text-center">
              <Award className="mx-auto h-8 w-8" />
              <p className="mt-2 text-xs uppercase tracking-wide text-white/80">Overall %</p>
              <p className="text-4xl font-bold">
                <AnimatedCounter value={overall} />%
              </p>
            </div>
            <div className="text-center">
              <Medal className="mx-auto h-8 w-8" />
              <p className="mt-2 text-xs uppercase tracking-wide text-white/80">Grade</p>
              <p className="text-4xl font-bold">{overall >= 90 ? "A1" : overall >= 80 ? "A2" : "B1"}</p>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* subject-wise */}
      <StaggerItem index={1}>
        <SectionCard title="Subject-wise Marks" subtitle="Half-Yearly Examination 2025-26" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  {["Subject", "Marks", "Max", "Grade", "Performance"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((r, i) => {
                  const c = r.marks >= 80 ? "emerald" : r.marks >= 60 ? "amber" : "rose"
                  const col = ["emerald", "rose", "teal", "violet", "amber", "cyan"][i % 6]
                  return (
                    <motion.tr key={r.subject} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/40 hover:bg-accent/30">
                      <td className="px-4 py-3 font-medium">{r.subject}</td>
                      <td className="px-4 py-3 font-semibold">{r.marks}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.max}</td>
                      <td className="px-4 py-3"><span className={cn("rounded-md px-2 py-0.5 text-xs font-bold", colorOf(c).soft, colorOf(c).text)}>{r.grade}</span></td>
                      <td className="px-4 py-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${r.marks}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} className={cn("h-full rounded-full", colorOf(col).bg)} />
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3">{total}</td>
                  <td className="px-4 py-3">{maxTotal}</td>
                  <td className="px-4 py-3">{overall >= 90 ? "A1" : overall >= 80 ? "A2" : "B1"}</td>
                  <td className="px-4 py-3">{overall}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* upcoming exams */}
      <StaggerItem index={2}>
        <SectionCard title="Upcoming Examinations" subtitle="For your child">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMS.filter((e) => e.status !== "Completed").map((e) => (
              <div key={e.id} className="rounded-2xl border border-border/60 bg-card/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{e.name}</p>
                  <StatusBadge status={e.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{e.startDate} → {e.endDate}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.className}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

function colorOf(c: string) {
  return {
    emerald: { soft: "bg-emerald-500/10", text: "text-emerald-600", bg: "bg-emerald-500" },
    amber: { soft: "bg-amber-500/10", text: "text-amber-600", bg: "bg-amber-500" },
    rose: { soft: "bg-rose-500/10", text: "text-rose-600", bg: "bg-rose-500" },
    teal: { soft: "bg-teal-500/10", text: "text-teal-600", bg: "bg-teal-500" },
    violet: { soft: "bg-violet-500/10", text: "text-violet-600", bg: "bg-violet-500" },
    cyan: { soft: "bg-cyan-500/10", text: "text-cyan-600", bg: "bg-cyan-500" },
  }[c] || { soft: "bg-muted", text: "text-muted-foreground", bg: "bg-muted" }
}
