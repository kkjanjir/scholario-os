"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { colorOf } from "@/components/shared/brand"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { SUPPORT_TICKETS, type SupportTicket } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { LifeBuoy, Bug, Lightbulb, AlertTriangle, CheckCircle2, Clock, MessageSquare } from "lucide-react"
import { toast } from "sonner"

const CATEGORY_CFG = {
  Bug: { color: "rose", icon: Bug },
  "Feature Request": { color: "violet", icon: Lightbulb },
  Support: { color: "sky", icon: LifeBuoy },
  Incident: { color: "amber", icon: AlertTriangle },
}

export function SupportModule() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "Open" | "In Progress" | "Resolved" | "Closed">("all")
  const [selected, setSelected] = useState<SupportTicket | null>(null)

  const filtered = SUPPORT_TICKETS.filter((t) => {
    const matchFilter = filter === "all" || t.status === filter
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.school.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    open: SUPPORT_TICKETS.filter((t) => t.status === "Open").length,
    inProgress: SUPPORT_TICKETS.filter((t) => t.status === "In Progress").length,
    resolved: SUPPORT_TICKETS.filter((t) => t.status === "Resolved").length,
    critical: SUPPORT_TICKETS.filter((t) => t.priority === "Critical").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Support Center" description="Tickets, feature requests, bug reports & system incidents" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-sky-500/10 p-2.5"><Clock className="h-5 w-5 text-sky-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Open</p><p className="text-2xl font-bold text-sky-600"><AnimatedCounter value={stats.open} /></p></div></StaggerItem>
        <StaggerItem index={1}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-amber-500/10 p-2.5"><MessageSquare className="h-5 w-5 text-amber-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">In Progress</p><p className="text-2xl font-bold text-amber-600"><AnimatedCounter value={stats.inProgress} /></p></div></StaggerItem>
        <StaggerItem index={2}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Resolved</p><p className="text-2xl font-bold text-emerald-600"><AnimatedCounter value={stats.resolved} /></p></div></StaggerItem>
        <StaggerItem index={3}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-rose-500/10 p-2.5"><AlertTriangle className="h-5 w-5 text-rose-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Critical</p><p className="text-2xl font-bold text-rose-600"><AnimatedCounter value={stats.critical} /></p></div></StaggerItem>
      </div>

      <StaggerItem index={1}>
        <SectionCard>
          <Toolbar search={search} onSearch={setSearch} placeholder="Search tickets…">
            {(["all", "Open", "In Progress", "Resolved", "Closed"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>{f}</button>
            ))}
          </Toolbar>
        </SectionCard>
      </StaggerItem>

      <StaggerItem index={2}>
        <SectionCard title={`Tickets (${filtered.length})`} bodyClassName="p-0">
          <div className="divide-y divide-border/40">
            {filtered.map((t, i) => {
              const cfg = CATEGORY_CFG[t.category]
              const c = colorOf(cfg.color)
              const Icon = cfg.icon
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(t)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/30"
                >
                  <div className={cn("rounded-lg p-2 shrink-0", c.soft)}><Icon className={cn("h-4 w-4", c.text)} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                      <p className="truncate text-sm font-medium">{t.subject}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.school} • {t.user} • {t.lastUpdate}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", t.priority === "Critical" ? "bg-rose-500/10 text-rose-600" : t.priority === "High" ? "bg-amber-500/10 text-amber-600" : t.priority === "Medium" ? "bg-sky-500/10 text-sky-600" : "bg-muted text-muted-foreground")}>{t.priority}</span>
                  <StatusBadge status={t.status} />
                </motion.button>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-lg rounded-3xl border border-border/60 bg-card p-6 shadow-premium">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{selected.id}</span>
              <StatusBadge status={selected.status} />
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", selected.priority === "Critical" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600")}>{selected.priority}</span>
            </div>
            <h3 className="mt-2 text-lg font-semibold">{selected.subject}</h3>
            <p className="text-sm text-muted-foreground">{selected.school} • {selected.user}</p>
            <div className="mt-4 space-y-2">
              {[
                { user: selected.user, msg: `${selected.subject}. Please help urgently.`, time: selected.created },
                { user: selected.assignedTo, msg: "Looking into this. Will update shortly.", time: selected.lastUpdate },
              ].map((m, i) => (
                <div key={i} className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs font-medium">{m.user} <span className="text-muted-foreground">• {m.time}</span></p>
                  <p className="mt-1 text-sm">{m.msg}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { toast.success("Reply sent"); setSelected(null) }} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><MessageSquare className="h-4 w-4" /> Reply</button>
              <button onClick={() => { toast.success("Ticket resolved"); setSelected(null) }} className="rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-500/20"><CheckCircle2 className="inline h-4 w-4" /> Resolve</button>
              <button onClick={() => setSelected(null)} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-accent">Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
