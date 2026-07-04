"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { colorOf } from "./brand"
import { AnimatedCounter } from "./motion"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"

export function KpiCard({
  label,
  value,
  icon: Icon,
  color = "emerald",
  trend,
  suffix = "",
  prefix = "",
  decimals = 0,
  index = 0,
  onClick,
}: {
  label: string
  value: number
  icon: LucideIcon
  color?: string
  trend?: { value: number; up: boolean }
  suffix?: string
  prefix?: string
  decimals?: number
  index?: number
  onClick?: () => void
}) {
  const c = colorOf(color)
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn(onClick && "cursor-pointer")}
    >
      <Card className="relative overflow-hidden p-5 shadow-premium border-border/60 group">
        <div
          className={cn(
            "absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40",
            c.bg
          )}
        />
        <div className="relative flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight">
              <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
            </p>
          </div>
          <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
            <Icon className={cn("h-5 w-5", c.text)} />
          </div>
        </div>
        {trend && (
          <div className="relative mt-3 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold",
                trend.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <Card className={cn("shadow-premium border-border/60", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
          <div>
            {title && <h3 className="font-semibold tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </Card>
  )
}

export function MiniStat({
  label,
  value,
  color = "emerald",
  icon: Icon,
}: {
  label: string
  value: string
  color?: string
  icon: LucideIcon
}) {
  const c = colorOf(color)
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
      <div className={cn("rounded-lg p-2", c.soft)}>
        <Icon className={cn("h-4 w-4", c.text)} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    Submitted: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
    Issued: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
    Evaluated: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    Reviewed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    Open: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    Partial: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    Late: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    Overdue: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    Absent: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    Scheduled: "bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-500/20",
    Maintenance: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    "On Route": "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
    "Reached School": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    Returned: "bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-500/20",
    Ongoing: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    Reorder: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    Good: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    Fair: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    New: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        map[status] || "bg-slate-500/10 text-slate-600 ring-slate-500/20"
      )}
    >
      {status}
    </span>
  )
}
