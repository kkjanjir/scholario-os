"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Bus, MapPin, Users, Gauge, Navigation, Phone, IdCard,
  User, Search, Route, Clock, Activity,
} from "lucide-react"

import { PageHeader, DataTable, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge, KpiCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import { TRANSPORT_ROUTES, DRIVERS, STUDENTS } from "@/lib/mock/data"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TransportRoute {
  id: string
  routeNo: string
  name: string
  stops: number
  students: number
  driver: string
  vehicle: string
  capacity: number
  status: "On Route" | "Reached School" | "Maintenance"
}

const ROUTE_PATHS = [
  // SVG path d-strings within a 0..600 x 0..320 viewBox
  "M40,260 C120,180 200,220 280,160 S440,100 560,140",
  "M30,80 C140,140 220,60 320,120 S480,200 570,160",
  "M50,180 C140,260 240,140 320,220 S460,260 560,200",
  "M60,300 C160,260 240,300 320,240 S460,180 560,260",
  "M30,140 C140,200 240,80 340,160 S500,260 570,220",
]

export function TransportModule() {
  const [search, setSearch] = useState("")
  const [detailRoute, setDetailRoute] = useState<TransportRoute | null>(null)

  const onRoute = TRANSPORT_ROUTES.filter((r) => r.status === "On Route").length
  const reached = TRANSPORT_ROUTES.filter((r) => r.status === "Reached School").length
  const totalStudents = TRANSPORT_ROUTES.reduce((a, b) => a + b.students, 0)
  const totalCapacity = TRANSPORT_ROUTES.reduce((a, b) => a + b.capacity, 0)
  const fleetUtil = Math.round((totalStudents / totalCapacity) * 100)

  const filteredDrivers = DRIVERS.filter(
    (d) =>
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.routes.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transport Management"
        description="Routes, drivers, vehicles & live fleet tracking"
        action={
          <Button onClick={() => toast.info("Live tracking active", { description: "5 buses currently being tracked" })} className="shadow-premium">
            <Navigation className="h-4 w-4" /> Track Fleet
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Active Routes" value={TRANSPORT_ROUTES.length} icon={Route} color="emerald" />
        <KpiCard index={1} label="On Route Now" value={onRoute} icon={Bus} color="sky" />
        <KpiCard index={2} label="Students Riding" value={totalStudents} icon={Users} color="violet" />
        <KpiCard index={3} label="Fleet Utilization" value={fleetUtil} suffix="%" icon={Gauge} color="teal" trend={{ value: 3.2, up: true }} />
      </div>

      <StaggerItem index={0}>
        <SectionCard title="Live Tracking" subtitle="Real-time bus positions across all routes" bodyClassName="p-0">
          <LiveMap />
        </SectionCard>
      </StaggerItem>

      <StaggerItem index={1}>
        <SectionCard title="Active Routes" subtitle={`${TRANSPORT_ROUTES.length} routes across Pune`} bodyClassName="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(TRANSPORT_ROUTES as TransportRoute[]).map((r, i) => (
              <RouteCard key={r.id} route={r} index={i} onClick={() => setDetailRoute(r)} />
            ))}
          </div>
        </SectionCard>
      </StaggerItem>

      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={2} className="lg:col-span-2">
          <SectionCard title="Drivers" subtitle={`${filteredDrivers.length} drivers`} bodyClassName="space-y-3">
            <Toolbar search={search} onSearch={setSearch} placeholder="Search drivers…" />
            <DataTable
              columns={[
                { key: "name", label: "Driver" },
                { key: "phone", label: "Phone" },
                { key: "license", label: "License" },
                { key: "experience", label: "Exp." },
                { key: "routes", label: "Route" },
              ]}
              rows={filteredDrivers.map((d) => ({
                name: (
                  <div className="flex items-center gap-2.5">
                    <Avatar name={d.name} color="amber" size="sm" />
                    <div>
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-[10px] text-muted-foreground">Emp ID: SVM-DRV-{d.id.toUpperCase()}</p>
                    </div>
                  </div>
                ),
                phone: <span className="text-xs">{d.phone}</span>,
                license: <span className="font-mono text-xs text-muted-foreground">{d.license}</span>,
                experience: <span className="text-sm">{d.experience} yrs</span>,
                routes: <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-600">{d.routes}</span>,
              }))}
            />
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={3}>
          <SectionCard title="Vehicles Summary" subtitle="Fleet status">
            <div className="space-y-3">
              <div className="rounded-xl border border-border/60 bg-card/50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-500/10 p-2"><Bus className="h-4 w-4 text-emerald-600" /></div>
                    <span className="text-sm font-medium">Total Fleet</span>
                  </div>
                  <span className="text-lg font-bold">{TRANSPORT_ROUTES.length}</span>
                </div>
              </div>
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-sky-600" />
                    <span className="text-sm font-medium">On Route</span>
                  </div>
                  <span className="text-lg font-bold text-sky-600">{onRoute}</span>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium">Reached School</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{reached}</span>
                </div>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium">Maintenance</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{TRANSPORT_ROUTES.length - onRoute - reached}</span>
                </div>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      <RouteDetailDialog route={detailRoute} onOpenChange={(o) => !o && setDetailRoute(null)} />
    </div>
  )
}

function LiveMap() {
  const activeBuses = TRANSPORT_ROUTES.filter((r) => r.status !== "Maintenance")

  return (
    <div className="relative h-[340px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Decorative map grid */}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 600 340" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="340" fill="url(#grid)" className="text-slate-400" />
      </svg>

      {/* SVG routes */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 340" preserveAspectRatio="none">
        {activeBuses.map((r, i) => {
          const idx = TRANSPORT_ROUTES.findIndex((x) => x.id === r.id)
          const path = ROUTE_PATHS[idx % ROUTE_PATHS.length]
          const c = r.status === "On Route" ? "oklch(0.7 0.15 230)" : "oklch(0.6 0.14 160)"
          return (
            <g key={r.id}>
              <path d={path} fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6 4" opacity={0.6} />
              <circle cx="0" cy="0" r="6" fill={c}>
                <animateMotion dur={`${8 + i}s`} repeatCount="indefinite" path={path} rotate="auto" />
              </circle>
              <circle cx="0" cy="0" r="14" fill={c} opacity={0.18}>
                <animateMotion dur={`${8 + i}s`} repeatCount="indefinite" path={path} rotate="auto" />
              </circle>
            </g>
          )
        })}
        {/* School marker */}
        <g transform="translate(540, 280)">
          <circle r="14" fill="oklch(0.55 0.13 160)" />
          <circle r="22" fill="oklch(0.55 0.13 160)" opacity="0.18" />
          <text x="0" y="4" textAnchor="middle" fontSize="14" fill="white">🏫</text>
        </g>
      </svg>

      {/* Live labels */}
      <div className="absolute left-4 top-4 flex flex-col gap-1.5">
        {activeBuses.map((r) => {
          const idx = TRANSPORT_ROUTES.findIndex((x) => x.id === r.id)
          const c = colorOf(r.status === "On Route" ? "sky" : "emerald")
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs shadow-premium backdrop-blur-sm dark:bg-slate-800/90"
            >
              <span className={cn("h-2 w-2 rounded-full", c.dot, r.status === "On Route" && "animate-pulse")} />
              <span className="font-semibold">{r.routeNo}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">ETA {4 + (idx % 5) * 2}m</span>
            </motion.div>
          )
        })}
      </div>

      <div className="absolute bottom-4 right-4 rounded-xl bg-white/90 px-3 py-1.5 text-[10px] text-muted-foreground shadow-premium backdrop-blur-sm dark:bg-slate-800/90">
        <p className="font-semibold text-foreground">SVM Campus</p>
        <p>17 School Rd, Pune</p>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-premium">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
      </div>
    </div>
  )
}

function RouteCard({ route, index, onClick }: { route: TransportRoute; index: number; onClick: () => void }) {
  const c = colorOf(route.status === "On Route" ? "sky" : route.status === "Reached School" ? "emerald" : "amber")
  const pct = Math.round((route.students / route.capacity) * 100)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-border/60 bg-card p-4 shadow-premium transition-colors hover:bg-accent/30"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{route.routeNo}</span>
          <StatusBadge status={route.status} />
        </div>
        <Bus className={cn("h-4 w-4", c.text)} />
      </div>
      <p className="mt-2 font-semibold leading-snug">{route.name}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3 w-3" /> {route.stops} stops
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <User className="h-3 w-3" /> {route.driver.split(" ")[0]}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
          <Bus className="h-3 w-3" /> {route.vehicle}
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Occupancy</span>
          <span className={cn("font-semibold", c.text)}>{route.students}/{route.capacity}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className={cn("h-full rounded-full", c.bg)}
          />
        </div>
      </div>
    </motion.div>
  )
}

function RouteDetailDialog({ route, onOpenChange }: { route: TransportRoute | null; onOpenChange: (v: boolean) => void }) {
  if (!route) return null
  // Pick a deterministic subset of students for this route
  const idx = TRANSPORT_ROUTES.findIndex((r) => r.id === route.id)
  const start = (idx * 7) % Math.max(1, STUDENTS.length - route.students)
  const routeStudents = STUDENTS.slice(start, start + route.students).slice(0, 18)

  return (
    <Dialog open={!!route} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{route.routeNo}</span>
            {route.name}
          </DialogTitle>
          <DialogDescription>
            {route.stops} stops · {route.students}/{route.capacity} students · {route.vehicle}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/60 bg-card/50 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              <User className="h-3 w-3" /> Driver
            </div>
            <p className="mt-1 text-sm font-semibold">{route.driver}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              <Phone className="h-3 w-3" /> Contact
            </div>
            <p className="mt-1 text-sm font-semibold">{DRIVERS.find((d) => d.name === route.driver)?.phone || "+91 98xxx xxxxx"}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              <IdCard className="h-3 w-3" /> Status
            </div>
            <p className="mt-1"><StatusBadge status={route.status} /></p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Students on this Route ({routeStudents.length})</p>
          <div className="max-h-[280px] overflow-y-auto rounded-xl border border-border/60">
            {routeStudents.map((s, i) => (
              <div key={s.id} className={cn("flex items-center gap-3 px-4 py-2.5", i !== routeStudents.length - 1 && "border-b border-border/40")}>
                <Avatar name={s.name} color={s.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.className} {s.section} · Roll {s.rollNo}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-medium">Stop {(i % route.stops) + 1}</p>
                  <p className="text-muted-foreground">{7 + (i % 3) * 4}:{(i * 7) % 60 < 10 ? "0" : ""}{(i * 7) % 60}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => toast.success(`Tracking shared with all ${routeStudents.length} parents on ${route.routeNo}`)}>
            <Phone className="h-4 w-4" /> Notify Parents
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
