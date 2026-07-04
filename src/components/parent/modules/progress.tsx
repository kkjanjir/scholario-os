"use client"

import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { SimpleBar, SimpleLine, DonutChart } from "@/components/shared/charts"
import { STUDENTS, studentResult } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { TrendingUp, Award, BookOpen, Target } from "lucide-react"

export function ProgressModule() {
  const child = STUDENTS[0]
  const result = studentResult(child.id)
  const overall = Math.round(result.reduce((a, r) => a + r.marks, 0) / result.length)

  const subjectBars = result.map((r) => ({ name: r.subject.slice(0, 6), marks: r.marks }))
  const termProgress = [
    { name: "Term 1", marks: 76 }, { name: "Half-Yearly", marks: 81 },
    { name: "Unit 2", marks: 84 }, { name: "Pre-Board", marks: 0 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Progress" description={`${child.name} • ${child.className} ${child.section}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Overall Average", value: `${overall}%`, color: "cyan", icon: TrendingUp },
          { label: "Class Rank", value: "#4", color: "amber", icon: Award },
          { label: "Best Subject", value: "English", color: "rose", icon: BookOpen },
          { label: "Improvement", value: "+4.5%", color: "emerald", icon: Target },
        ].map((s, i) => {
          const c = colorOf(s.color)
          return (
            <StaggerItem key={s.label} index={i}>
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
                <div className={cn("mb-3 inline-flex rounded-xl p-2.5", c.soft)}>
                  <s.icon className={cn("h-5 w-5", c.text)} />
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className={cn("mt-0.5 text-2xl font-bold", c.text)}>{s.value}</p>
              </div>
            </StaggerItem>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={1}>
          <SectionCard title="Subject-wise Performance" subtitle="Latest marks across subjects">
            <SimpleBar data={subjectBars} dataKey="marks" color="oklch(0.6 0.15 200)" />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={2}>
          <SectionCard title="Term Progress" subtitle="Exam-by-exam trend">
            <SimpleLine data={termProgress} dataKey="marks" color="oklch(0.65 0.16 60)" />
          </SectionCard>
        </StaggerItem>
      </div>

      <StaggerItem index={3}>
        <SectionCard title="Detailed Marks Breakdown" subtitle="Subject-wise with grades" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  {["Subject", "Marks", "Max", "Grade", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((r, i) => {
                  const sc = r.marks >= 80 ? "emerald" : r.marks >= 60 ? "amber" : "rose"
                  const c = colorOf(sc)
                  return (
                    <tr key={r.subject} className="border-b border-border/40 hover:bg-accent/30">
                      <td className="px-4 py-3 font-medium">{r.subject}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{r.marks}</span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div className={cn("h-full rounded-full", c.bg)} style={{ width: `${r.marks}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.max}</td>
                      <td className="px-4 py-3"><span className={cn("rounded-md px-2 py-0.5 text-xs font-bold", c.soft, c.text)}>{r.grade}</span></td>
                      <td className="px-4 py-3"><StatusBadge status={r.marks >= 80 ? "Completed" : r.marks >= 60 ? "Partial" : "Late"} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
