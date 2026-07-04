"use client"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, MiniStat } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { RadialGauge } from "@/components/shared/charts"
import { studentAttendanceHeatmap, STUDENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { CalendarCheck } from "lucide-react"

const STATUS_STYLE: Record<string, string> = {
  present: "bg-emerald-500 text-white",
  late: "bg-amber-400 text-white",
  absent: "bg-rose-500 text-white",
  leave: "bg-violet-400 text-white",
  holiday: "bg-muted",
}

export function AttendanceModule() {
  const child = STUDENTS[0]
  const grid = studentAttendanceHeatmap(child.id)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description={`${child.name} • ${child.className} ${child.section}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={0}>
          <SectionCard title="Attendance Rate" subtitle="This term">
            <div className="flex items-center justify-center">
              <RadialGauge value={child.attendancePct} label="Present" color="oklch(0.6 0.15 200)" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MiniStat label="Present" value="82 days" color="emerald" icon={CalendarCheck} />
              <MiniStat label="Absent" value="4 days" color="rose" icon={CalendarCheck} />
              <MiniStat label="Late" value="3 days" color="amber" icon={CalendarCheck} />
              <MiniStat label="Leave" value="1 day" color="violet" icon={CalendarCheck} />
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard title="3-Month Attendance Heatmap" subtitle="Daily attendance pattern">
            <div className="flex gap-1.5">
              <div className="flex flex-col gap-1 pt-6">
                {days.map((d) => (
                  <div key={d} className="flex h-6 w-8 items-center justify-center text-[10px] text-muted-foreground">{d}</div>
                ))}
              </div>
              <div className="grid flex-1 grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto scroll-area">
                {grid.map((cell, i) => (
                  <div
                    key={i}
                    title={`${cell.week + 1}/${cell.day + 1} — ${cell.status}`}
                    className={cn("h-6 w-6 rounded-md transition-transform hover:scale-110", STATUS_STYLE[cell.status])}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              {[
                { l: "Present", c: "bg-emerald-500" }, { l: "Late", c: "bg-amber-400" },
                { l: "Absent", c: "bg-rose-500" }, { l: "Leave", c: "bg-violet-400" }, { l: "Holiday", c: "bg-muted" },
              ].map((x) => (
                <div key={x.l} className="flex items-center gap-1.5">
                  <span className={cn("h-3 w-3 rounded", x.c)} /> {x.l}
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}
