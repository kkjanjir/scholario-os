"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { KpiCard, SectionCard, StatusBadge, MiniStat } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { SimpleLine, RadialGauge, DonutChart } from "@/components/shared/charts"
import { STUDENTS, studentResult, studentAttendanceHeatmap, PARENT_MESSAGES, PARENT_NOTICES, HOMEWORK, TIMETABLE, CALENDAR_EVENTS, CHAT_THREADS, ACHIEVEMENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import {
  TrendingUp, CalendarCheck, Award, BookOpen, MessageSquare,
  Sparkles, ArrowUpRight, Wallet, Clock, Megaphone, Heart, MessagesSquare, Trophy,
} from "lucide-react"
import { toast } from "sonner"

export function ParentDashboard() {
  const setModule = useAppStore((s) => s.setModule)
  const child = STUDENTS[0]
  const result = studentResult(child.id)
  const overall = Math.round(result.reduce((a, r) => a + r.marks, 0) / result.length)

  const progress = [
    { name: "Aug", marks: 72 }, { name: "Sep", marks: 78 },
    { name: "Oct", marks: 81 }, { name: "Nov", marks: 79 },
    { name: "Dec", marks: 84 },
  ]
  const subjectSplit = result.map((r, i) => ({
    name: r.subject.slice(0, 4),
    value: r.marks,
    color: ["oklch(0.6 0.15 200)", "oklch(0.65 0.16 60)", "oklch(0.6 0.14 160)", "oklch(0.7 0.16 70)", "oklch(0.68 0.2 15)", "oklch(0.7 0.18 300)"][i],
  }))
  const unreadMsgs = PARENT_MESSAGES.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      {/* welcome banner */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 p-6 text-white shadow-premium lg:p-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar name={child.name} color="violet" size="xl" className="ring-4 ring-white/30" />
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-cyan-600 shadow-lg">
                  <Heart className="h-4 w-4 fill-current" />
                </span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                  <Sparkles className="h-3 w-3" /> {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">Hello, Suresh! 👋</h2>
                <p className="mt-0.5 text-sm text-white/80">
                  Tracking <b>{child.name}</b> • {child.className} {child.section} • Roll {String(child.rollNo).padStart(2, "0")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setModule("parent", "messages")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 shadow-sm transition-transform hover:scale-105">
                <MessageSquare className="h-4 w-4" /> {unreadMsgs} New Messages
              </button>
              <button onClick={() => setModule("parent", "progress")} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-105">
                <TrendingUp className="h-4 w-4" /> View Progress
              </button>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Attendance" value={child.attendancePct} suffix="%" icon={CalendarCheck} color="emerald" trend={{ value: 1.2, up: true }} onClick={() => setModule("parent", "attendance")} />
        <KpiCard index={1} label="Avg. Marks" value={overall} suffix="%" icon={TrendingUp} color="cyan" trend={{ value: 4.5, up: true }} onClick={() => setModule("parent", "progress")} />
        <KpiCard index={2} label="Class Rank" value={4} icon={Award} color="amber" onClick={() => setModule("parent", "results")} />
        <KpiCard index={3} label="Fee Due" value={child.feeTotal - child.feePaid} prefix="₹" icon={Wallet} color="rose" onClick={() => setModule("parent", "fees")} />
      </div>

      {/* progress + attendance */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard
            title="Academic Progress"
            subtitle="Average marks over the term"
            action={<button onClick={() => setModule("parent", "progress")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Details <ArrowUpRight className="h-3 w-3" /></button>}
          >
            <SimpleLine data={progress} dataKey="marks" color="oklch(0.6 0.15 200)" />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={2}>
          <SectionCard title="Attendance" subtitle="This term">
            <div className="flex items-center justify-center">
              <RadialGauge value={child.attendancePct} label="Present" color="oklch(0.6 0.15 200)" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MiniStat label="Present" value="82 days" color="emerald" icon={CalendarCheck} />
              <MiniStat label="Absent" value="4 days" color="rose" icon={CalendarCheck} />
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* subject split + today's classes */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={3}>
          <SectionCard title="Subject Performance" subtitle="Latest assessment marks">
            <DonutChart data={subjectSplit} />
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {result.slice(0, 6).map((r, i) => (
                <div key={r.subject}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: subjectSplit[i].color }} />
                    <span className="text-[10px] text-muted-foreground">{r.subject.slice(0, 8)}</span>
                  </div>
                  <p className="text-sm font-bold">{r.marks}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={4}>
          <SectionCard title="Today's Classes" subtitle="Your child's schedule">
            <div className="space-y-2">
              {TIMETABLE.slice(0, 5).map((t, i) => {
                const sc = t.subject === "Mathematics" ? "emerald" : t.subject === "English" ? "rose" : t.subject === "Science" ? "teal" : "violet"
                const c = colorOf(sc)
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-2.5">
                    <div className={cn("rounded-lg p-2", c.soft)}>
                      <BookOpen className={cn("h-4 w-4", c.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">{t.time} • {t.room} • {t.teacher}</p>
                    </div>
                    {i === 0 && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Now</span>}
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* messages + notices */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={5}>
          <SectionCard
            title="Recent Messages"
            subtitle="From teachers & school"
            action={<button onClick={() => setModule("parent", "messages")} className="text-xs font-medium text-primary hover:underline">View all</button>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {PARENT_MESSAGES.slice(0, 4).map((m) => (
                <button key={m.id} onClick={() => setModule("parent", "messages")} className="flex w-full items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/40">
                  <Avatar name={m.from} color={m.role === "Teacher" ? "amber" : "cyan"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{m.from}</p>
                      {!m.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{m.subject}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{m.date.slice(5)}</span>
                </button>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={6}>
          <SectionCard
            title="School Notices"
            subtitle="Latest for parents"
            action={<button onClick={() => setModule("parent", "notices")} className="text-xs font-medium text-primary hover:underline">View all</button>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {PARENT_NOTICES.map((n) => (
                <div key={n.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="flex-1 truncate text-sm font-medium">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground">{n.date.slice(5)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 pl-5 text-xs text-muted-foreground">{n.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* unread chat widget */}
      <StaggerItem index={7}>
        <SectionCard
          title="Teacher Conversations"
          subtitle="Recent chats with your child's teachers"
          action={<button onClick={() => setModule("parent", "chat")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Open chat <ArrowUpRight className="h-3 w-3" /></button>}
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border/50">
            {CHAT_THREADS.map((t) => {
              const ac = t.teacherName.includes("Rajesh") ? "amber" : t.teacherName.includes("Meera") ? "rose" : "teal"
              const c = colorOf(ac)
              return (
                <button key={t.id} onClick={() => setModule("parent", "chat")} className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/40">
                  <div className="relative">
                    <Avatar name={t.teacherName} color={ac} size="sm" />
                    <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card", c.bg)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{t.teacherName}</p>
                      {t.unread > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{t.unread}</span>}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{t.lastMessage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">{t.lastTime}</p>
                    <p className="text-[10px] font-medium" style={{ color: `var(--primary)` }}>{t.teacherSubject}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* child achievements celebration */}
      <StaggerItem index={8}>
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-300/10 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-3xl"
            >
              🏆
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-bold">Child Achievements</p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {child.name.split(" ")[0]} has unlocked <b className="text-amber-600 dark:text-amber-400">{ACHIEVEMENTS.filter((a) => a.unlocked).length} badges</b> this term!
              </p>
            </div>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-2">
            {ACHIEVEMENTS.filter((a) => a.unlocked).slice(0, 6).map((a) => (
              <span
                key={a.id}
                title={a.title}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-lg shadow-sm ring-1 ring-amber-500/20 dark:bg-card/60"
              >
                {a.icon}
              </span>
            ))}
            <span className="flex h-9 items-center rounded-xl bg-amber-500/15 px-3 text-xs font-bold text-amber-600 dark:text-amber-400">
              +{ACHIEVEMENTS.filter((a) => a.unlocked).length - 6 > 0 ? ACHIEVEMENTS.filter((a) => a.unlocked).length - 6 : 0} more
            </span>
          </div>
          <button
            onClick={() => toast.success(`${child.name.split(" ")[0]} is doing great! 🌟`)}
            className="relative mt-4 w-full rounded-xl bg-amber-500/15 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/25 dark:text-amber-300"
          >
            Celebrate {child.name.split(" ")[0]}'s success 🎉
          </button>
        </div>
      </StaggerItem>

      {/* child's daily schedule widget */}
      <StaggerItem index={9}>
        <SectionCard
          title={`${child.name.split(" ")[0]}'s Today Schedule`}
          subtitle="Monday • 8 periods"
          action={<button onClick={() => setModule("parent", "calendar")} className="text-xs font-medium text-primary hover:underline">Full calendar</button>}
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border/50">
            {TIMETABLE.slice(0, 5).map((t, i) => {
              const sc = t.subject === "Mathematics" ? "emerald" : t.subject === "English" ? "rose" : t.subject === "Science" ? "teal" : "violet"
              const c = colorOf(sc)
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                  <div className={cn("rounded-lg p-1.5", c.soft)}>
                    <Clock className={cn("h-3.5 w-3.5", c.text)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.subject}</p>
                    <p className="text-[11px] text-muted-foreground">{t.time} • {t.room} • {t.teacher}</p>
                  </div>
                  {i === 0 && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Now</span>}
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* fee payment reminder widget */}
      {child.feeTotal - child.feePaid > 0 && (
        <StaggerItem index={10}>
          <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-transparent p-5">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose-300/10 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-3xl"
              >
                ⚠️
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-rose-500" />
                  <p className="text-sm font-bold">Fee Payment Reminder</p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Outstanding balance of <b className="text-rose-600 dark:text-rose-400">₹{(child.feeTotal - child.feePaid).toLocaleString("en-IN")}</b> for {child.name.split(" ")[0]}'s fees. Due by 15 Dec 2025.
                </p>
              </div>
            </div>
            <div className="relative mt-4 flex gap-2">
              <button
                onClick={() => setModule("parent", "fees")}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-xs font-bold text-white transition-transform hover:scale-105"
              >
                Pay Now ₹{(child.feeTotal - child.feePaid).toLocaleString("en-IN")}
              </button>
              <button
                onClick={() => toast.info("Payment reminder snoozed for 3 days")}
                className="rounded-xl border border-border/60 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                Remind Later
              </button>
            </div>
          </div>
        </StaggerItem>
      )}

      {/* upcoming events */}
      <StaggerItem index={11}>
        <SectionCard title="Upcoming Events" subtitle="For your child & family">
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
