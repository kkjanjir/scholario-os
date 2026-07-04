"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { KpiCard, SectionCard, StatusBadge, MiniStat } from "@/components/shared/ui"
import { AnimatedCounter, StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { RevenueAreaChart, AttendanceBarChart, DonutChart, RadialGauge } from "@/components/shared/charts"
import { attendanceForClass, REVENUE_TREND, TODAY_BIRTHDAYS, NEW_ADMISSIONS, ANNOUNCEMENTS, CALENDAR_EVENTS, TRANSPORT_ROUTES, STUDENTS, TEACHERS, HOMEWORK, AT_RISK_STUDENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import {
  Users, GraduationCap, CalendarCheck, Wallet, AlertCircle, Banknote,
  Cake, UserPlus, CalendarDays, Bus, BookOpen, Package, ClipboardList,
  FileText, Megaphone, ArrowUpRight, TrendingUp, Sparkles, AlertTriangle, ShieldAlert,
} from "lucide-react"
import { toast } from "sonner"

export function PrincipalDashboard() {
  const setModule = useAppStore((s) => s.setModule)
  const att = attendanceForClass("Grade 10", "A")
  const todayAtt = att.data[att.data.length - 1]

  const feeDonut = [
    { name: "Paid", value: 812, color: "oklch(0.6 0.14 160)" },
    { name: "Partial", value: 124, color: "oklch(0.7 0.16 70)" },
    { name: "Pending", value: 68, color: "oklch(0.65 0.2 15)" },
  ]

  return (
    <div className="space-y-6">
      {/* welcome banner */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-6 text-white shadow-premium lg:p-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="h-3 w-3" /> {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">
                Good morning, Dr. Anjali 👋
              </h2>
              <p className="mt-1 max-w-lg text-sm text-white/80">
                Here's what's happening at Sri Vidya Mandir today. Attendance is at {Math.round((todayAtt.present / att.total) * 100)}% and 3 fee payments need your attention.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setModule("principal", "admission")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-transform hover:scale-105">
                <UserPlus className="h-4 w-4" /> New Admission
              </button>
              <button onClick={() => setModule("principal", "analytics")} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-105">
                <TrendingUp className="h-4 w-4" /> View Analytics
              </button>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Students" value={1004} icon={Users} color="emerald" trend={{ value: 4.2, up: true }} onClick={() => setModule("principal", "admission")} />
        <KpiCard index={1} label="Total Teachers" value={68} icon={GraduationCap} color="violet" trend={{ value: 2, up: true }} onClick={() => setModule("principal", "teachers")} />
        <KpiCard index={2} label="Today's Attendance" value={Math.round((todayAtt.present / att.total) * 100)} suffix="%" icon={CalendarCheck} color="teal" trend={{ value: 1.4, up: true }} onClick={() => setModule("principal", "attendance")} />
        <KpiCard index={3} label="Monthly Revenue" value={48.7} prefix="₹" suffix="L" decimals={1} icon={Wallet} color="amber" trend={{ value: 6.8, up: true }} onClick={() => setModule("principal", "fees")} />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={4} label="Pending Fees" value={28} icon={AlertCircle} color="rose" trend={{ value: 3.1, up: false }} onClick={() => setModule("principal", "fees")} />
        <KpiCard index={5} label="Salary Due" value={5} icon={Banknote} color="orange" onClick={() => setModule("principal", "salary")} />
        <KpiCard index={6} label="New Admissions" value={5} icon={UserPlus} color="cyan" trend={{ value: 12, up: true }} onClick={() => setModule("principal", "admission")} />
        <KpiCard index={7} label="Inventory Alerts" value={3} icon={Package} color="pink" onClick={() => setModule("principal", "inventory")} />
      </div>

      {/* charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard
            title="Revenue & Collection Trend"
            subtitle="Monthly fee collection vs revenue (in ₹ Lakhs)"
            action={<button onClick={() => setModule("principal", "fees")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">View details <ArrowUpRight className="h-3 w-3" /></button>}
          >
            <RevenueAreaChart data={REVENUE_TREND} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={2}>
          <SectionCard title="Fee Collection" subtitle="Overall status">
            <DonutChart data={feeDonut} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {feeDonut.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-muted-foreground">{d.name}</span>
                  </div>
                  <p className="mt-0.5 text-sm font-bold">{d.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* attendance + quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={3} className="lg:col-span-2">
          <SectionCard
            title="Attendance Overview"
            subtitle="Grade 10-A • last 14 working days"
            action={<button onClick={() => setModule("principal", "attendance")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Full report <ArrowUpRight className="h-3 w-3" /></button>}
          >
            <AttendanceBarChart data={att.data.slice(-14)} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={4}>
          <SectionCard title="School Health" subtitle="Key metrics">
            <div className="flex items-center justify-center">
              <RadialGauge value={94} label="Overall Health" color="oklch(0.6 0.14 160)" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MiniStat label="Avg Attendance" value="94%" color="emerald" icon={CalendarCheck} />
              <MiniStat label="Fee Collection" value="89%" color="amber" icon={Wallet} />
              <MiniStat label="Academic Perf." value="87%" color="violet" icon={TrendingUp} />
              <MiniStat label="Staff Present" value="96%" color="teal" icon={GraduationCap} />
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* quick stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickStatCard icon={Cake} color="rose" label="Today's Birthdays" value="3" desc="Aarav, Saanvi, Reyansh" onClick={() => setModule("principal", "calendar")} />
        <QuickStatCard icon={Bus} color="sky" label="School Bus Status" value="5/5" desc="4 on route, 1 maintenance" onClick={() => setModule("principal", "transport")} />
        <QuickStatCard icon={BookOpen} color="amber" label="Library Issues" value="142" desc="3 overdue returns" onClick={() => setModule("principal", "library")} />
        <QuickStatCard icon={ClipboardList} color="violet" label="Upcoming Exams" value="3" desc="Unit Test 2 ongoing" onClick={() => setModule("principal", "examination")} />
      </div>

      {/* lists row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={5}>
          <SectionCard
            title="New Admissions"
            subtitle="Recent enrolments this week"
            action={<button onClick={() => setModule("principal", "admission")} className="text-xs font-medium text-primary hover:underline">View all</button>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {NEW_ADMISSIONS.map((a) => (
                <div key={a.name} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/40">
                  <Avatar name={a.name} color="cyan" size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.class} • {a.date}</p>
                  </div>
                  <StatusBadge status={a.fee} />
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={6}>
          <SectionCard title="Today's Birthdays" subtitle="Wish them well 🎂" bodyClassName="p-0">
            <div className="divide-y divide-border/50">
              {TODAY_BIRTHDAYS.map((b) => (
                <div key={b.name} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="relative">
                    <Avatar name={b.name} color={b.avatarColor} size="sm" />
                    <span className="absolute -bottom-1 -right-1 text-base">🎂</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.class}</p>
                  </div>
                  <button onClick={() => toast.success(`🎂 Birthday wish sent to ${b.name}!`)} className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500/20">
                    Wish
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={7}>
          <SectionCard
            title="Notice Board"
            subtitle="Latest announcements"
            action={<button onClick={() => setModule("principal", "communication")} className="text-xs font-medium text-primary hover:underline">View all</button>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {ANNOUNCEMENTS.slice(0, 4).map((a) => (
                <div key={a.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-1.5 w-1.5 rounded-full", a.priority === "high" ? "bg-rose-500" : a.priority === "medium" ? "bg-amber-500" : "bg-emerald-500")} />
                    <p className="flex-1 truncate text-sm font-medium">{a.title}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 pl-3.5 text-xs text-muted-foreground">{a.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* assignments pending review + upcoming events */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={8}>
          <SectionCard title="Homework & Assignments Pending Review" subtitle="Across all classes" bodyClassName="p-0">
            <div className="divide-y divide-border/50">
              {HOMEWORK.slice(0, 5).map((h) => {
                const sc = h.subject === "Mathematics" ? "emerald" : h.subject === "English" ? "rose" : "violet"
                return (
                  <div key={h.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={cn("rounded-lg p-2", colorOf(sc).soft)}>
                      <FileText className={cn("h-4 w-4", colorOf(sc).text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{h.title}</p>
                      <p className="text-xs text-muted-foreground">{h.subject} • {h.className} • Due {h.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{h.submissions}/{h.total}</p>
                      <StatusBadge status={h.status} />
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={9}>
          <SectionCard title="Upcoming Events" subtitle="December 2025" bodyClassName="p-0">
            <div className="divide-y divide-border/50">
              {CALENDAR_EVENTS.slice(0, 6).map((e) => (
                <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl border border-border/60 bg-card">
                    <span className="text-[9px] font-semibold uppercase text-muted-foreground">{e.date.slice(5, 7)}</span>
                    <span className="text-sm font-bold leading-none">{e.date.slice(8)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.time} • {e.type}</p>
                  </div>
                  <EventDot type={e.type} />
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* at-risk students widget */}
      <StaggerItem index={10}>
        <SectionCard
          title="At-Risk Students — Early Warning"
          subtitle="AI-predicted students needing intervention"
          action={<button onClick={() => setModule("principal", "atrisk")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">View all <ArrowUpRight className="h-3 w-3" /></button>}
          bodyClassName="p-0"
        >
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-rose-500/15 p-2"><AlertTriangle className="h-4 w-4 text-rose-600" /></div>
                <div>
                  <p className="text-2xl font-bold text-rose-600">{AT_RISK_STUDENTS.filter((s) => s.riskLevel === "High").length}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">High Risk</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-amber-500/15 p-2"><ShieldAlert className="h-4 w-4 text-amber-600" /></div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{AT_RISK_STUDENTS.filter((s) => s.riskLevel === "Medium").length}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Medium Risk</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-500/15 p-2"><TrendingUp className="h-4 w-4 text-emerald-600" /></div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{AT_RISK_STUDENTS.filter((s) => s.riskLevel === "Low").length}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Low Risk</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 px-5 py-3">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <p className="text-muted-foreground">
                <b className="text-foreground">AI Insight:</b> {AT_RISK_STUDENTS[0].name} & {AT_RISK_STUDENTS[1].name} need immediate attention — declining attendance & marks trend.
              </p>
            </div>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* transport quick view */}
      <StaggerItem index={11}>
        <SectionCard title="Transport Fleet Status" subtitle="Live bus tracking overview" action={<button onClick={() => setModule("principal", "transport")} className="text-xs font-medium text-primary hover:underline">Track all <ArrowUpRight className="h-3 w-3" /></button>}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {TRANSPORT_ROUTES.map((r) => {
              const sc = r.status === "On Route" ? "sky" : r.status === "Reached School" ? "emerald" : "amber"
              return (
                <div key={r.id} className="rounded-2xl border border-border/60 bg-card/50 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{r.routeNo}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-2 truncate text-sm font-medium">{r.name}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{r.students}/{r.capacity} students</span>
                    <Bus className="h-3.5 w-3.5" />
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", colorOf(sc).bg)} style={{ width: `${(r.students / r.capacity) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

function QuickStatCard({ icon: Icon, color, label, value, desc, onClick }: { icon: any; color: string; label: string; value: string; desc: string; onClick?: () => void }) {
  const c = colorOf(color)
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-premium transition-colors hover:bg-accent/30"
    >
      <div className={cn("rounded-xl p-2.5", c.soft)}>
        <Icon className={cn("h-5 w-5", c.text)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-lg font-bold leading-tight">{value}</p>
        <p className="truncate text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </motion.button>
  )
}

function EventDot({ type }: { type: string }) {
  const map: Record<string, string> = {
    exam: "bg-rose-500", event: "bg-violet-500", ptm: "bg-amber-500",
    birthday: "bg-pink-500", holiday: "bg-emerald-500", meeting: "bg-sky-500",
  }
  return <span className={cn("h-2 w-2 rounded-full", map[type] || "bg-slate-400")} />
}
