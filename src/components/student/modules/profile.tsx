"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, MiniStat } from "@/components/shared/ui"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { StaggerItem } from "@/components/shared/motion"
import { AnimatedCounter } from "@/components/shared/motion"
import { STUDENTS, studentResult, topPerformers, SCHOOL } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  User, IdCard, Calendar, Droplet, MapPin, Phone, GraduationCap,
  Award, CalendarCheck, TrendingUp, BookMarked, Bus, Library,
  Pencil, ShieldCheck, Cake, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProfileModule() {
  const me = STUDENTS[0]
  const result = studentResult(me.id)
  const avg = Math.round(result.reduce((a, r) => a + r.marks, 0) / result.length)
  const rank = topPerformers(me.className).findIndex((s) => s.id === me.id) + 1
  const c = colorOf("violet")
  const fuchsia = colorOf("fuchsia")
  const parents = [
    { role: "Father", name: me.fatherName, icon: User, color: "sky" },
    { role: "Mother", name: me.motherName, icon: User, color: "rose" },
  ]

  const ids = [
    { label: "Admission No", value: me.admissionNo, icon: IdCard, color: "violet" },
    { label: "Library ID", value: me.libraryId, icon: Library, color: "emerald" },
    { label: "Transport ID", value: me.transportId || "—", icon: Bus, color: "amber" },
  ]

  const info = [
    { label: "Date of Birth", value: new Date(me.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), icon: Cake, color: "pink" },
    { label: "Blood Group", value: me.bloodGroup, icon: Droplet, color: "rose" },
    { label: "Gender", value: me.gender, icon: User, color: "sky" },
    { label: "Admission Date", value: new Date(me.admissionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), icon: Calendar, color: "teal" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Your student identity, academics & school IDs"
        action={
          <Button onClick={() => toast.info("Edit Profile is disabled in this demo. Contact the office to update details.")} variant="outline" className="rounded-xl">
            <Pencil className="h-4 w-4" /> Edit Profile
          </Button>
        }
      />

      {/* Hero */}
      <StaggerItem index={1}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 p-6 text-white shadow-premium lg:p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-fuchsia-300/20 blur-2xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
              <Avatar name={me.name} color="violet" size="xl" className="relative h-28 w-28 text-4xl ring-4 ring-white/40" />
              <span className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-violet-600 shadow-lg">
                <ShieldCheck className="h-4 w-4" />
              </span>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <GraduationCap className="h-3 w-3" /> {SCHOOL.session} Session
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">{me.name}</h2>
              <p className="mt-1 text-sm text-white/85">{me.className} • Section {me.section} • Roll No. {String(me.rollNo).padStart(2, "0")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                  <IdCard className="h-3.5 w-3.5" /> {me.admissionNo}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                  <CalendarCheck className="h-3.5 w-3.5" /> Attendance {me.attendancePct}%
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                  <TrendingUp className="h-3.5 w-3.5" /> Avg {avg}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Quick academic stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StaggerItem index={2}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="flex items-center gap-3">
              <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
                <CalendarCheck className={cn("h-5 w-5", c.text)} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={me.attendancePct} suffix="%" />
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div initial={{ width: 0 }} animate={{ width: `${me.attendancePct}%` }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className={cn("h-full rounded-full", c.bg)} />
            </div>
          </div>
        </StaggerItem>
        <StaggerItem index={3}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="flex items-center gap-3">
              <div className={cn("rounded-xl p-2.5 ring-1", fuchsia.soft, fuchsia.ring)}>
                <TrendingUp className={cn("h-5 w-5", fuchsia.text)} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Average Marks</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={avg} suffix="%" />
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div initial={{ width: 0 }} animate={{ width: `${avg}%` }} transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className={cn("h-full rounded-full", fuchsia.bg)} />
            </div>
          </div>
        </StaggerItem>
        <StaggerItem index={4}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="flex items-center gap-3">
              <div className={cn("rounded-xl p-2.5 ring-1", colorOf("amber").soft, colorOf("amber").ring)}>
                <Award className={cn("h-5 w-5", colorOf("amber").text)} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Class Rank</p>
                <p className="text-2xl font-bold">
                  #<AnimatedCounter value={rank} /> <span className="text-sm font-medium text-muted-foreground">of 38</span>
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Top 10% in {me.className} {me.section}</p>
          </div>
        </StaggerItem>
      </div>

      {/* Personal info + IDs */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={5} className="lg:col-span-2">
          <SectionCard title="Personal Information" subtitle="Basic demographic details">
            <div className="grid gap-3 sm:grid-cols-2">
              {info.map((it) => {
                const ic = colorOf(it.color)
                return (
                  <div key={it.label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
                    <div className={cn("rounded-lg p-2", ic.soft)}>
                      <it.icon className={cn("h-4 w-4", ic.text)} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{it.label}</p>
                      <p className="text-sm font-semibold">{it.value}</p>
                    </div>
                  </div>
                )
              })}
              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3 sm:col-span-2">
                <div className={cn("rounded-lg p-2", colorOf("teal").soft)}>
                  <MapPin className={cn("h-4 w-4", colorOf("teal").text)} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Address</p>
                  <p className="text-sm font-semibold">{me.address}</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={6}>
          <SectionCard title="School IDs" subtitle="Your identity cards">
            <div className="space-y-3">
              {ids.map((id) => {
                const ic = colorOf(id.color)
                return (
                  <motion.div
                    key={id.label}
                    whileHover={{ y: -2 }}
                    className={cn("relative overflow-hidden rounded-xl border p-4", ic.soft, "border-border/60")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{id.label}</p>
                        <p className={cn("mt-0.5 font-mono text-base font-bold", ic.text)}>{id.value}</p>
                      </div>
                      <div className={cn("rounded-lg p-2 bg-background/60", ic.text)}>
                        <id.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              <Button variant="outline" className="w-full rounded-xl" onClick={() => toast.success("ID card download started! Check your downloads.")}>
                <IdCard className="h-4 w-4" /> Download ID Card
              </Button>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Parents + academic IDs */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={7} className="lg:col-span-2">
          <SectionCard title="Parents & Guardian" subtitle="Emergency contact information">
            <div className="grid gap-3 sm:grid-cols-2">
              {parents.map((p) => {
                const ic = colorOf(p.color)
                return (
                  <div key={p.role} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4">
                    <Avatar name={p.name} color={p.color} size="lg" />
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{p.role}</p>
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                    </div>
                  </div>
                )
              })}
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-4 sm:col-span-2">
                <div className={cn("rounded-xl p-2.5", c.soft)}>
                  <Phone className={cn("h-5 w-5", c.text)} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Guardian Phone</p>
                  <p className="font-mono text-sm font-semibold">{me.guardianPhone}</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => toast.info("Call feature is disabled in this demo.")}>
                  <Phone className="h-3.5 w-3.5" /> Call
                </Button>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={8}>
          <SectionCard title="Academic Snapshot" subtitle="Current term overview">
            <div className="space-y-2.5">
              <MiniStat label="Class" value={`${me.className} - ${me.section}`} color="violet" icon={GraduationCap} />
              <MiniStat label="Roll Number" value={String(me.rollNo).padStart(2, "0")} color="fuchsia" icon={IdCard} />
              <MiniStat label="Library Member" value={me.libraryId} color="emerald" icon={BookMarked} />
              <MiniStat label="Transport" value={me.transport ? `Yes • ${me.transportId}` : "Not availed"} color="amber" icon={Bus} />
              <MiniStat label="Fee Status" value={`${formatINR(me.feePaid)} / ${formatINR(me.feeTotal, true)}`} color="rose" icon={Users} />
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}
