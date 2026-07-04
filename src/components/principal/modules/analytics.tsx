"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  TrendingUp, CalendarCheck, Wallet, GraduationCap, Users, UserPlus,
  Award, Banknote, Target, Download, Sparkles, Clock,
} from "lucide-react"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, KpiCard, MiniStat } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf, Avatar } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import {
  SimpleBar, SimpleLine, DonutChart, RadialGauge, RevenueAreaChart,
  RadarChartWrap, TreemapWrap, FunnelWrap, ComposedChartWrap, HorizontalBar,
} from "@/components/shared/charts"
import { REVENUE_TREND, CLASSES_INFO, TEACHERS, NEW_ADMISSIONS, ADMISSION_FUNNEL, FEE_STRUCTURE } from "@/lib/mock/data"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const C = {
  emerald: "oklch(0.6 0.14 160)",
  teal: "oklch(0.6 0.13 200)",
  amber: "oklch(0.7 0.16 70)",
  orange: "oklch(0.7 0.18 55)",
  rose: "oklch(0.65 0.2 15)",
  violet: "oklch(0.62 0.18 300)",
  fuchsia: "oklch(0.65 0.21 330)",
  sky: "oklch(0.7 0.15 230)",
  cyan: "oklch(0.7 0.13 195)",
  pink: "oklch(0.68 0.19 0)",
  lime: "oklch(0.72 0.18 130)",
  indigo: "oklch(0.55 0.18 270)",
}

export function AnalyticsModule() {
  const [tab, setTab] = useState("attendance")

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Analytics"
        description="Comprehensive insights across attendance, fees, academics, revenue & operations"
        action={
          <Button variant="outline" onClick={() => toast.success("Report exported as PDF", { description: "scholario-analytics-dec-2025.pdf" })}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="h-auto flex-wrap gap-1 rounded-xl bg-card p-1.5 shadow-premium border border-border/60">
          <TabsTrigger value="attendance" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CalendarCheck className="h-3.5 w-3.5" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="fee" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Wallet className="h-3.5 w-3.5" /> Fee
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Award className="h-3.5 w-3.5" /> Performance
          </TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Banknote className="h-3.5 w-3.5" /> Revenue
          </TabsTrigger>
          <TabsTrigger value="teacher" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-3.5 w-3.5" /> Teacher
          </TabsTrigger>
          <TabsTrigger value="admission" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <UserPlus className="h-3.5 w-3.5" /> Admission
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance"><AttendanceTab /></TabsContent>
        <TabsContent value="fee"><FeeTab /></TabsContent>
        <TabsContent value="performance"><PerformanceTab /></TabsContent>
        <TabsContent value="revenue"><RevenueTab /></TabsContent>
        <TabsContent value="teacher"><TeacherTab /></TabsContent>
        <TabsContent value="admission"><AdmissionTab /></TabsContent>
      </Tabs>
    </div>
  )
}

/* ---------------- Attendance ---------------- */
function AttendanceTab() {
  const trend = [
    { name: "Wk1", present: 91 }, { name: "Wk2", present: 93 }, { name: "Wk3", present: 89 },
    { name: "Wk4", present: 95 }, { name: "Wk5", present: 92 }, { name: "Wk6", present: 94 },
    { name: "Wk7", present: 96 }, { name: "Wk8", present: 93 },
  ]
  const classComparison = CLASSES_INFO.map((c, i) => ({
    name: c.name.replace("Grade ", "G"),
    attendance: 88 + ((i * 7) % 10),
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Avg Attendance" value={94} suffix="%" icon={CalendarCheck} color="emerald" trend={{ value: 1.4, up: true }} />
        <KpiCard index={1} label="Best Class" value={97} suffix="%" icon={Award} color="teal" />
        <KpiCard index={2} label="Late Today" value={18} icon={Clock} color="amber" trend={{ value: 3.0, up: false }} />
        <KpiCard index={3} label="Absentee Rate" value={4} suffix="%" icon={Users} color="rose" trend={{ value: 0.6, up: false }} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={0} className="lg:col-span-2">
          <SectionCard title="Attendance Trend" subtitle="Weekly school-wide attendance % (last 8 weeks)">
            <SimpleLine data={trend} dataKey="present" color={C.emerald} height={260} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1}>
          <SectionCard title="Overall Rate" subtitle="Current school attendance">
            <RadialGauge value={94} label="Attendance" color={C.emerald} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MiniStat label="Present Today" value="946" color="emerald" icon={CalendarCheck} />
              <MiniStat label="Absent" value="58" color="rose" icon={Users} />
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
      <StaggerItem index={2}>
        <SectionCard title="Class Comparison" subtitle="Average attendance % by grade">
          <SimpleBar data={classComparison} dataKey="attendance" color={C.teal} height={240} />
        </SectionCard>
      </StaggerItem>
    </motion.div>
  )
}

/* ---------------- Fee ---------------- */
function FeeTab() {
  const collection = [
    { name: "Collected", value: 812, color: C.emerald },
    { name: "Partial", value: 124, color: C.amber },
    { name: "Pending", value: 68, color: C.rose },
  ]
  const pendingByClass = CLASSES_INFO.map((c, i) => ({
    name: c.name.replace("Grade ", "G"),
    pending: 6 + ((i * 5) % 14),
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Collected" value={4.86} prefix="₹" suffix="Cr" decimals={2} icon={Wallet} color="emerald" trend={{ value: 6.8, up: true }} />
        <KpiCard index={1} label="Pending Amount" value={32.4} prefix="₹" suffix="L" decimals={1} icon={Banknote} color="rose" />
        <KpiCard index={2} label="Collection Rate" value={89} suffix="%" icon={Target} color="teal" trend={{ value: 2.4, up: true }} />
        <KpiCard index={3} label="Defaulters" value={68} icon={Users} color="amber" trend={{ value: 5.2, up: false }} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={0} className="lg:col-span-2">
          <SectionCard title="Fee Collection Trend" subtitle="Monthly revenue vs collected (₹ Lakhs)">
            <RevenueAreaChart data={REVENUE_TREND} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1}>
          <SectionCard title="Collection Status" subtitle="Distribution by status">
            <DonutChart data={collection} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {collection.map((d) => (
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
      <StaggerItem index={2}>
        <SectionCard title="Pending Fees by Class" subtitle="Number of pending fee accounts per grade">
          <SimpleBar data={pendingByClass} dataKey="pending" color={C.rose} height={220} />
        </SectionCard>
      </StaggerItem>
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={3}>
          <SectionCard title="Fee Breakdown by Category" subtitle="Revenue contribution by fee type (Treemap)">
            <TreemapWrap
              data={FEE_STRUCTURE.map((f, i) => ({
                name: f.category,
                size: f.amount * (i === 0 ? 1004 : i === 4 ? 200 : 800),
                fill: [C.emerald, C.teal, C.amber, C.orange, C.violet, C.sky, C.rose, C.cyan, C.pink][i % 9],
              }))}
            />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={4}>
          <SectionCard title="Revenue vs Target" subtitle="Monthly collection vs target (Composed)">
            <ComposedChartWrap
              data={REVENUE_TREND.map((r) => ({ name: r.month, collected: r.collection, target: r.revenue }))}
              barKey="collected"
              lineKey="target"
              barColor={C.emerald}
              lineColor={C.amber}
            />
          </SectionCard>
        </StaggerItem>
      </div>
    </motion.div>
  )
}

/* ---------------- Performance ---------------- */
function PerformanceTab() {
  const gradeDist = [
    { name: "A1 (90+)", value: 124, color: C.emerald },
    { name: "A2 (80-89)", value: 218, color: C.teal },
    { name: "B1 (70-79)", value: 286, color: C.amber },
    { name: "B2 (60-69)", value: 196, color: C.orange },
    { name: "C1 (50-59)", value: 142, color: C.rose },
    { name: "C2 (<50)", value: 38, color: C.violet },
  ]
  const subjectPerf = [
    { name: "Maths", score: 78 }, { name: "English", score: 82 }, { name: "Sci", score: 85 },
    { name: "S.St", score: 80 }, { name: "CS", score: 91 }, { name: "Hindi", score: 88 },
    { name: "Phy", score: 74 }, { name: "Chem", score: 76 },
  ]
  const topClasses = CLASSES_INFO.map((c, i) => ({
    name: c.name.replace("Grade ", "G"),
    score: 74 + ((i * 11) % 18),
  })).sort((a, b) => b.score - a.score)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="School Average" value={81.4} suffix="%" decimals={1} icon={Award} color="violet" trend={{ value: 2.1, up: true }} />
        <KpiCard index={1} label="Top Scorer" value={98.4} suffix="%" decimals={1} icon={Sparkles} color="emerald" />
        <KpiCard index={2} label="Distinction" value={342} icon={Target} color="teal" trend={{ value: 8, up: true }} />
        <KpiCard index={3} label="Need Support" value={38} icon={Users} color="rose" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={0}>
          <SectionCard title="Grade Distribution" subtitle="Students per grade band">
            <DonutChart data={gradeDist} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {gradeDist.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-[11px] text-muted-foreground">{d.name}</span>
                  </div>
                  <p className="mt-0.5 text-sm font-bold">{d.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard title="Subject Performance" subtitle="Average score per subject (%)">
            <SimpleBar data={subjectPerf} dataKey="score" color={C.violet} height={280} />
          </SectionCard>
        </StaggerItem>
      </div>
      <StaggerItem index={2}>
        <SectionCard title="Top Performing Classes" subtitle="Ranked by average score">
          <SimpleBar data={topClasses} dataKey="score" color={C.emerald} height={220} />
        </SectionCard>
      </StaggerItem>
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={3}>
          <SectionCard title="Subject Proficiency Radar" subtitle="Multi-dimensional view of subject strength">
            <RadarChartWrap
              data={[
                { subject: "Maths", marks: 78, fullMark: 100 },
                { subject: "English", marks: 82, fullMark: 100 },
                { subject: "Science", marks: 85, fullMark: 100 },
                { subject: "S.Science", marks: 80, fullMark: 100 },
                { subject: "Computers", marks: 91, fullMark: 100 },
                { subject: "Hindi", marks: 88, fullMark: 100 },
              ]}
              color={C.violet}
            />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={4}>
          <SectionCard title="Class Comparison" subtitle="Average marks by class (horizontal)">
            <HorizontalBar data={topClasses} dataKey="score" color={C.emerald} height={280} />
          </SectionCard>
        </StaggerItem>
      </div>
    </motion.div>
  )
}

/* ---------------- Revenue ---------------- */
function RevenueTab() {
  const growth = [
    { name: "Apr", growth: 8.2 }, { name: "May", growth: 10.1 }, { name: "Jun", growth: 34.0 },
    { name: "Jul", growth: -11.6 }, { name: "Aug", growth: -5.0 }, { name: "Sep", growth: 11.9 },
    { name: "Oct", growth: -15.7 }, { name: "Nov", growth: 14.8 }, { name: "Dec", growth: -4.9 },
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="YTD Revenue" value={5.83} prefix="₹" suffix="Cr" decimals={2} icon={Banknote} color="emerald" trend={{ value: 9.4, up: true }} />
        <KpiCard index={1} label="Avg Monthly" value={48.6} prefix="₹" suffix="L" decimals={1} icon={Wallet} color="teal" />
        <KpiCard index={2} label="Best Month" value={56.4} prefix="₹" suffix="L" decimals={1} icon={TrendingUp} color="violet" />
        <KpiCard index={3} label="YoY Growth" value={11.8} suffix="%" icon={Sparkles} color="amber" trend={{ value: 3.2, up: true }} />
      </div>
      <StaggerItem index={0}>
        <SectionCard title="Revenue Trend" subtitle="Monthly revenue & collection (₹ Lakhs)">
          <RevenueAreaChart data={REVENUE_TREND} />
        </SectionCard>
      </StaggerItem>
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard title="Monthly Growth %" subtitle="Month-over-month revenue growth">
            <SimpleLine data={growth} dataKey="growth" color={C.amber} height={240} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={2}>
          <SectionCard title="Health Gauge" subtitle="Financial year performance">
            <RadialGauge value={88} label="Fiscal Health" color={C.emerald} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MiniStat label="Collected" value="₹5.18 Cr" color="emerald" icon={Wallet} />
              <MiniStat label="Pending" value="₹65 L" color="rose" icon={Banknote} />
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </motion.div>
  )
}

/* ---------------- Teacher ---------------- */
function TeacherTab() {
  const deptDist = (() => {
    const map: Record<string, number> = {}
    TEACHERS.forEach((t) => { map[t.department] = (map[t.department] || 0) + 1 })
    const palette = [C.emerald, C.amber, C.violet, C.sky, C.rose, C.teal, C.orange, C.fuchsia, C.pink]
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
  })()
  const teacherAtt = TEACHERS.slice(0, 8).map((t) => ({
    name: t.name.split(" ")[0],
    attendance: t.attendance,
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Teachers" value={68} icon={Users} color="violet" trend={{ value: 2, up: true }} />
        <KpiCard index={1} label="Avg Attendance" value={96} suffix="%" icon={CalendarCheck} color="emerald" />
        <KpiCard index={2} label="Departments" value={9} icon={GraduationCap} color="teal" />
        <KpiCard index={3} label="Avg Experience" value={9.4} suffix=" yrs" decimals={1} icon={Award} color="amber" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={0}>
          <SectionCard title="Department Distribution" subtitle="Teachers per department">
            <DonutChart data={deptDist} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {deptDist.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1}>
          <SectionCard title="Teacher Attendance" subtitle="Individual attendance % (top 8)">
            <SimpleBar data={teacherAtt} dataKey="attendance" color={C.sky} height={300} />
          </SectionCard>
        </StaggerItem>
      </div>
    </motion.div>
  )
}

/* ---------------- Admission ---------------- */
function AdmissionTab() {
  const monthly = [
    { name: "Apr", admissions: 42 }, { name: "May", admissions: 58 }, { name: "Jun", admissions: 78 },
    { name: "Jul", admissions: 34 }, { name: "Aug", admissions: 28 }, { name: "Sep", admissions: 22 },
    { name: "Oct", admissions: 31 }, { name: "Nov", admissions: 44 }, { name: "Dec", admissions: 18 },
  ]
  const gradeWise = [
    { name: "Nursery", value: 28, color: C.pink },
    { name: "Primary", value: 142, color: C.amber },
    { name: "Middle", value: 96, color: C.teal },
    { name: "Secondary", value: 74, color: C.violet },
    { name: "Sr. Sec", value: 38, color: C.sky },
  ]
  const total = monthly.reduce((a, b) => a + b.admissions, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Admissions" value={total} icon={UserPlus} color="cyan" trend={{ value: 12, up: true }} />
        <KpiCard index={1} label="This Month" value={18} icon={Users} color="emerald" />
        <KpiCard index={2} label="Enquiry→Admit" value={64} suffix="%" icon={Target} color="amber" trend={{ value: 4.5, up: true }} />
        <KpiCard index={3} label="Pending Docs" value={9} icon={GraduationCap} color="rose" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={0} className="lg:col-span-2">
          <SectionCard title="Monthly Admissions" subtitle="New admissions per month (current session)">
            <SimpleBar data={monthly} dataKey="admissions" color={C.cyan} height={260} />
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={1}>
          <SectionCard title="Grade-wise Split" subtitle="Admissions by school stage">
            <DonutChart data={gradeWise} />
            <div className="mt-3 space-y-1.5">
              {gradeWise.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
      <StaggerItem index={2}>
        <SectionCard title="Recent Admissions" subtitle="Latest enrolments this week" bodyClassName="p-0">
          <div className="divide-y divide-border/50">
            {NEW_ADMISSIONS.map((a) => (
              <div key={a.name} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={a.name} color="cyan" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.class} · {a.date}</p>
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", a.fee === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>
                  {a.fee}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>
      <StaggerItem index={3}>
        <SectionCard title="Admission Funnel" subtitle="From application to enrolment — conversion pipeline">
          <FunnelWrap data={ADMISSION_FUNNEL} height={320} />
          <div className="mt-3 grid grid-cols-5 gap-2 text-center">
            {ADMISSION_FUNNEL.map((f, i) => {
              const pct = i === 0 ? 100 : Math.round((f.value / ADMISSION_FUNNEL[0].value) * 100)
              return (
                <div key={f.name}>
                  <p className="text-[10px] text-muted-foreground">{f.name}</p>
                  <p className="text-sm font-bold">{f.value}</p>
                  <p className="text-[10px] text-muted-foreground">{pct}%</p>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </motion.div>
  )
}
