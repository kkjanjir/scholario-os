"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { KpiCard, SectionCard, StatusBadge, MiniStat } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { DonutChart, SimpleBar, RadialGauge } from "@/components/shared/charts"
import { TIMETABLE, HOMEWORK, ASSIGNMENTS, STUDENTS, EXAMS, LESSON_PLANS, CHAT_THREADS, TODAY_BIRTHDAYS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import {
  CalendarClock, CalendarCheck, BookOpen, FileText, ClipboardList,
  TrendingUp, Users, Clock, CheckCircle2, ArrowUpRight, Sparkles, Bell, NotebookPen, MessagesSquare, Cake,
} from "lucide-react"
import { toast } from "sonner"

export function TeacherDashboard() {
  const setModule = useAppStore((s) => s.setModule)
  const myClass = STUDENTS.filter((s) => s.className === "Grade 10" && s.section === "A")

  const classPerf = [
    { name: "Grade 10-A", marks: 78 },
    { name: "Grade 9-A", marks: 74 },
    { name: "Grade 10-B", marks: 71 },
  ]
  const subDist = [
    { name: "Above 75%", value: 26, color: "oklch(0.65 0.16 60)" },
    { name: "50-75%", value: 9, color: "oklch(0.7 0.16 70)" },
    { name: "Below 50%", value: 3, color: "oklch(0.65 0.2 15)" },
  ]

  return (
    <div className="space-y-6">
      {/* welcome */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-premium lg:p-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="h-3 w-3" /> {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">Good morning, Rajesh Sir 👋</h2>
              <p className="mt-1 max-w-lg text-sm text-white/80">
                You have <b>3 classes</b> today, <b>2 homework</b> submissions to review and Grade 10-A attendance is pending.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setModule("teacher", "attendance")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 shadow-sm transition-transform hover:scale-105">
                <CalendarCheck className="h-4 w-4" /> Mark Attendance
              </button>
              <button onClick={() => setModule("teacher", "marks")} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-105">
                <ClipboardList className="h-4 w-4" /> Enter Marks
              </button>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Today's Classes" value={3} icon={CalendarClock} color="amber" onClick={() => setModule("teacher", "timetable")} />
        <KpiCard index={1} label="Attendance Pending" value={2} icon={CalendarCheck} color="rose" onClick={() => setModule("teacher", "attendance")} />
        <KpiCard index={2} label="Homework Pending" value={2} icon={BookOpen} color="violet" onClick={() => setModule("teacher", "homework")} />
        <KpiCard index={3} label="Assignments Due" value={4} icon={FileText} color="teal" onClick={() => setModule("teacher", "assignments")} />
      </div>

      {/* today's schedule + upcoming exams */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard
            title="Today's Classes"
            subtitle="Monday • 8 periods"
            action={<button onClick={() => setModule("teacher", "timetable")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Full timetable <ArrowUpRight className="h-3 w-3" /></button>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {TIMETABLE.slice(0, 6).map((t, i) => {
                const ongoing = i === 2
                const done = i < 2
                return (
                  <div key={i} className={cn("flex items-center gap-3 px-5 py-3", ongoing && "bg-primary/5")}>
                    <div className={cn("flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl text-white", done ? "bg-muted text-muted-foreground" : ongoing ? "bg-primary" : "bg-muted text-muted-foreground")}>
                      <span className="text-[10px] font-semibold">P{t.period}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">{t.time} • {t.room}</p>
                    </div>
                    {ongoing ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Ongoing
                      </span>
                    ) : done ? (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5" /> Done</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Upcoming</span>
                    )}
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={2}>
          <SectionCard title="Upcoming Exams" subtitle="You'll invigilate / evaluate">
            <div className="space-y-3">
              {EXAMS.filter((e) => e.status !== "Completed").map((e) => (
                <div key={e.id} className="rounded-xl border border-border/60 bg-card/50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{e.name}</p>
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

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={3} className="lg:col-span-2">
          <SectionCard title="Class Performance" subtitle="Average marks across your classes">
            <SimpleBar data={classPerf} dataKey="marks" color="oklch(0.62 0.15 60)" />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={4}>
          <SectionCard title="Grade 10-A Distribution" subtitle="Marks spread">
            <DonutChart data={subDist} />
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {subDist.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-[10px] text-muted-foreground">{d.name}</span>
                  </div>
                  <p className="text-sm font-bold">{d.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* homework pending + quick actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={5}>
          <SectionCard title="Homework to Review" subtitle="Submissions awaiting your review" bodyClassName="p-0">
            <div className="divide-y divide-border/50">
              {HOMEWORK.filter((h) => h.assignedBy === "Rajesh Kulkarni").map((h) => (
                <div key={h.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={cn("rounded-lg p-2", colorOf("emerald").soft)}>
                    <BookOpen className={cn("h-4 w-4", colorOf("emerald").text)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{h.title}</p>
                    <p className="text-xs text-muted-foreground">{h.className} • Due {h.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{h.submissions}/{h.total}</p>
                    <button onClick={() => setModule("teacher", "homework")} className="text-[11px] font-medium text-primary hover:underline">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={6}>
          <SectionCard title="Student Performance Spotlight" subtitle="Grade 10-A top performers">
            <div className="space-y-2">
              {myClass.sort((a, b) => b.avgMarks - a.avgMarks).slice(0, 5).map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", i === 0 ? "bg-amber-500/20 text-amber-600" : i === 1 ? "bg-slate-400/20 text-slate-500" : i === 2 ? "bg-orange-500/20 text-orange-600" : "bg-muted text-muted-foreground")}>{i + 1}</span>
                  <Avatar name={s.name} color={s.avatarColor} size="sm" />
                  <p className="flex-1 truncate text-sm font-medium">{s.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${s.avgMarks}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm font-semibold">{s.avgMarks}%</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setModule("teacher", "students")} className="mt-4 w-full rounded-xl bg-accent/50 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent">
              View all students
            </button>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* lesson plans widget */}
      <StaggerItem index={7}>
        <SectionCard
          title="Upcoming Lesson Plans"
          subtitle="Your planned & in-progress lessons"
          action={<button onClick={() => setModule("teacher", "lessons")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">View all <ArrowUpRight className="h-3 w-3" /></button>}
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border/50">
            {LESSON_PLANS.filter((p) => p.status !== "completed").map((p) => {
              const cfg = p.status === "in-progress" ? "amber" : "sky"
              const c = colorOf(cfg)
              return (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={cn("rounded-lg p-2", c.soft)}>
                    <NotebookPen className={cn("h-4 w-4", c.text)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.topic}</p>
                    <p className="text-xs text-muted-foreground">{p.className} • {p.date} • Period {p.period}</p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", c.soft, c.text)}>
                    {p.status === "in-progress" ? "In Progress" : "Planned"}
                  </span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* parent chat widget */}
      <StaggerItem index={8}>
        <SectionCard
          title="Parent Messages"
          subtitle="Unread conversations from parents"
          action={<button onClick={() => setModule("teacher", "chat")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Open chat <ArrowUpRight className="h-3 w-3" /></button>}
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border/50">
            {CHAT_THREADS.map((t) => (
              <button key={t.id} onClick={() => setModule("teacher", "chat")} className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/40">
                <div className="relative">
                  <Avatar name={t.parentName} color="cyan" size="sm" />
                  {t.unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-card">{t.unread}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.parentName}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.lastMessage}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{t.lastTime}</p>
                  <p className="text-[10px] font-medium text-primary">{t.studentName.split(" ")[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* student birthdays widget */}
      <StaggerItem index={9}>
        <div className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent p-5">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pink-300/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/15 text-2xl"
            >
              🎂
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Cake className="h-4 w-4 text-pink-500" />
                <p className="text-sm font-bold">Today's Birthdays</p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">Wish your students on their special day!</p>
            </div>
          </div>
          <div className="relative mt-4 space-y-2">
            {TODAY_BIRTHDAYS.map((b) => (
              <div key={b.name} className="flex items-center gap-3 rounded-xl bg-card/60 p-2.5 backdrop-blur-sm">
                <Avatar name={b.name} color={b.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.class}</p>
                </div>
                <button
                  onClick={() => toast.success(`🎂 Birthday wish sent to ${b.name}!`)}
                  className="inline-flex items-center gap-1 rounded-lg bg-pink-500/15 px-2.5 py-1 text-xs font-medium text-pink-600 transition-colors hover:bg-pink-500/25 dark:text-pink-300"
                >
                  Wish 🎉
                </button>
              </div>
            ))}
          </div>
        </div>
      </StaggerItem>

      {/* quick actions */}
      <StaggerItem index={10}>
        <SectionCard title="Quick Actions" subtitle="Jump straight into your daily tasks">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarCheck, color: "amber", label: "Mark Attendance", desc: "Grade 10-A pending", mod: "attendance" },
              { icon: BookOpen, color: "violet", label: "Assign Homework", desc: "Create new homework", mod: "homework" },
              { icon: ClipboardList, color: "teal", label: "Enter Marks", desc: "Unit Test 2", mod: "marks" },
              { icon: Users, color: "rose", label: "Message Parents", desc: "3 unread", mod: "communication" },
            ].map((a) => {
              const c = colorOf(a.color)
              return (
                <motion.button
                  key={a.label}
                  onClick={() => setModule("teacher", a.mod)}
                  whileHover={{ y: -3 }}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left transition-colors hover:bg-accent/30"
                >
                  <div className={cn("rounded-xl p-2.5", c.soft)}>
                    <a.icon className={cn("h-5 w-5", c.text)} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
