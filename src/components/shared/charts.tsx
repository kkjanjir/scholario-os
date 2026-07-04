"use client"

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"
import { colorOf } from "./brand"

export const CHART_COLORS = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)",
]

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  fontSize: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
}

export function ChartTooltip({ active, payload, label, prefix = "", suffix = "" }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2">
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{prefix}{typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}{suffix}</span>
        </div>
      ))}
    </div>
  )
}

export function RevenueAreaChart({ data }: { data: { month: string; revenue: number; collection: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gCol" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip prefix="₹" suffix="L" />} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#gRev)" />
        <Area type="monotone" dataKey="collection" name="Collected" stroke="var(--chart-2)" strokeWidth={2.5} fill="url(#gCol)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function AttendanceBarChart({ data }: { data: { date: string; present: number; absent: number; late: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(8)} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
        <Bar dataKey="present" name="Present" stackId="a" fill="var(--chart-1)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="late" name="Late" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="absent" name="Absent" stackId="a" fill="var(--chart-5)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({ data }: { data: { name: string; value: number; color?: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={3} stroke="none">
          {data.map((d, i) => (
            <Cell key={i} fill={d.color || CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function RadialGauge({ value, label, color = "var(--chart-1)" }: { value: number; label: string; color?: string }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value, fill: color }]} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" background={{ fill: "hsl(var(--muted))" }} cornerRadius={20} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{value}%</span>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

export function SimpleLine({ data, dataKey, color = "var(--chart-1)", height = 220 }: { data: any[]; dataKey: string; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SimpleBar({ data, dataKey, color = "var(--chart-1)", height = 220 }: { data: any[]; dataKey: string; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
