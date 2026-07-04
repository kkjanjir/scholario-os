"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { KpiCard, SectionCard, StatusBadge, MiniStat } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { SimpleLine, RadialGauge, DonutChart } from "@/components/shared/charts"
import { studentResult, studentAttendanceHeatmap, TIMETABLE, HOMEWORK, ASSIGNMENTS, ANNOUNCEMENTS, CALENDAR_EVENTS, STUDENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import {
  CalendarClock, CalendarCheck, BookOpen, FileText, Award,
  TrendingUp, Sparkles, ArrowUpRight, Cake, Megaphone, Clock, Wallet,
} from "lucide-react"
import { toast } from "sonner"

export function StudentDashboard() {
  const setModule = useAppStore((s) => s.setModule)
  const me = STUDENTS[0]
  const result = studentResult(me.id)
  const overall = Math.round(result.reduce((a, r) => a + r.marks, 0) / result.length)

  const progress = [
    { name: "Aug", marks: 72 },
    { name: "Sep", marks: 78 },
    { name: "Oct", marks: 81 },
    { name: "Nov", marks: 79 },
    { name: "Dec", marks: 84 },
  ]
  const subjectSplit = result.map((r, i) => ({
    name: r.subject.slice(0, 4),
    value: r.marks,
    color: ["oklch(0.6 0.21 300)", "oklch(0.65 0.16 60)", "oklch(0.6 0.14 160)", "oklch(0.7 0.16 200)", "oklch(0.68 0.2 15)", "oklch(0.7 0.18 70)"][i],
  }))

  return (
    <div className="space-y-6">
      {/* welcome */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 p-6 text-white shadow-premium lg:p-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={me.name} color="violet" size="xl" className="ring-4 ring-white/30" />
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                  <Sparkles className="h-3 w-3" /> {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">Hi, {me.name.split(" ")[0]}! 👋</h2>
                <p className="mt-0.5 text-sm text-white/80">{me.className} {me.section} • Roll No. {String(me.rollNo).padStart(2, "0")} • {me.admissionNo}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setModule("student", "homework")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition-transform hover:scale-105">
                <BookOpen className="h-4 w-4" /> Homework
              </button>
              <button onClick={() => setModule("student", "results")} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-105">
                <Award className="h-4 w-4" /> My Results
              </button>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Attendance" value={me.attendancePct} suffix="%" icon={CalendarCheck} color="emerald" trend={{ value: 1.2, up: true }} onClick={() => setModule("student", "attendance")} />
        <KpiCard index={1} label="Avg. Marks" value={overall} suffix="%" icon={TrendingUp} color="violet" trend={{ value: 4.5, up: true }} onClick={() => setModule("student", "results")} />
        <KpiCard index={2} label="Pending Homework" value={3} icon={BookOpen} color="amber" onClick={() => setModule("student", "homework")} />
        <KpiCard index={3} label="Fee Due" value={me.feeTotal - me.feePaid} prefix="₹" icon={Wallet} color="rose" onClick={() => setModule("student", "fees")} />
      </div>

      {/* today + progress */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard
            title="Today's Classes"
            subtitle="Monday schedule"
            action={<button onClick={() => setModule("student", "timetable")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Full timetable <ArrowUpRight className="h-3 w-3" /></button>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {TIMETABLE.slice(0, 5).map((t, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.subject}</p>
                    <p className="text-xs text-muted-foreground">{t.time} • {t.room} • {t.teacher}</p>
                  </div>
                  {i === 0 && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Now</span>}
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={2}>
          <SectionCard title="Attendance" subtitle="This term">
            <div className="flex items-center justify-center">
              <RadialGauge value={me.attendancePct} label="Present" color="oklch(0.6 0.21 300)" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MiniStat label="Present" value="82 days" color="emerald" icon={CalendarCheck} />
              <MiniStat label="Absent" value="4 days" color="rose" icon={CalendarCheck} />
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* progress chart + results */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={3} className="lg:col-span-2">
          <SectionCard title="My Progress" subtitle="Average marks over the term 📈">
            <SimpleLine data={progress} dataKey="marks" color="oklch(0.6 0.21 300)" />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={4}>
          <SectionCard title="Subject Split" subtitle="Latest assessment">
            <DonutChart data={subjectSplit} />
          </SectionCard>
        </StaggerItem>
      </div>

      {/* homework + announcements */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={5}>
          <SectionCard
            title="Pending Homework"
            subtitle="Submit before deadline"
            action={<button onClick={() => setModule("student", "homework")} className="text-xs font-medium text-primary hover:underline">View all</button>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {HOMEWORK.filter((h) => h.className === "Grade 10 A").slice(0, 4).map((h) => {
                const sc = h.subject === "Mathematics" ? "emerald" : h.subject === "English" ? "rose" : "violet"
                return (
                  <div key={h.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={cn("rounded-lg p-2", colorOf(sc).soft)}>
                      <BookOpen className={cn("h-4 w-4", colorOf(sc).text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{h.title}</p>
                      <p className="text-xs text-muted-foreground">{h.subject} • Due {h.dueDate}</p>
                    </div>
                    <button onClick={() => toast.success("Homework submitted!")} className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20">
                      Submit
                    </button>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={6}>
          <SectionCard
            title="Latest Announcements"
            subtitle="From your school"
            action={<button onClick={() => setModule("student", "announcements")} className="text-xs font-medium text-primary hover:underline">View all</button>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {ANNOUNCEMENTS.slice(0, 4).map((a) => (
                <div key={a.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="flex-1 truncate text-sm font-medium">{a.title}</p>
                    <span className={cn("h-1.5 w-1.5 rounded-full", a.priority === "high" ? "bg-rose-500" : a.priority === "medium" ? "bg-amber-500" : "bg-emerald-500")} />
                  </div>
                  <p className="mt-1 line-clamp-2 pl-5 text-xs text-muted-foreground">{a.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* upcoming */}
      <StaggerItem index={7}>
        <SectionCard title="What's Coming Up" subtitle="Exams, events & birthdays">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CALENDAR_EVENTS.slice(0, 6).map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-3">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-[9px] font-semibold uppercase">{e.date.slice(5, 7)}</span>
                  <span className="text-base font-bold leading-none">{e.date.slice(8)}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{e.type} • {e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
