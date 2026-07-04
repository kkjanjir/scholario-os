"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { FEATURE_FLAGS, FLAG_CATEGORIES, type FeatureFlag } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import {
  Flag, Search, Check, X, History, RotateCcw, Filter, Layers,
  Building2, Users, User, Globe, Shield, Download,
} from "lucide-react"
import { toast } from "sonner"

const LEVEL_CONFIG = {
  global: { icon: Globe, color: "emerald", label: "Global" },
  school: { icon: Building2, color: "violet", label: "School" },
  role: { icon: Users, color: "amber", label: "Role" },
  user: { icon: User, color: "sky", label: "User" },
}

export function FeatureFlagsModule() {
  const [flags, setFlags] = useState(FEATURE_FLAGS)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [selected, setSelected] = useState<FeatureFlag | null>(null)

  const filtered = flags.filter((f) => {
    const matchCat = category === "all" || f.category === category
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function toggleGlobal(id: string) {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, global: !f.global, modifiedBy: "Arjun Mehta", modifiedDate: new Date().toISOString().slice(0, 10) } : f))
    const f = flags.find((x) => x.id === id)!
    toast.success(`${f.name} ${!f.global ? "enabled" : "disabled"} globally`)
  }

  function toggleRole(flagId: string, role: string) {
    setFlags((prev) => prev.map((f) => {
      if (f.id !== flagId) return f
      return { ...f, roles: { ...f.roles, [role]: !f.roles[role] }, modifiedBy: "Arjun Mehta", modifiedDate: new Date().toISOString().slice(0, 10) }
    }))
    toast.success("Role permission updated")
  }

  const stats = {
    total: flags.length,
    enabled: flags.filter((f) => f.global).length,
    disabled: flags.filter((f) => !f.global).length,
    categories: new Set(flags.map((f) => f.category)).size,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Feature Flags" description="Enterprise-grade hierarchical feature control — Global → School → Role → User" action={<button onClick={() => toast.success("Flag configuration exported")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" /> Export Config</button>} />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-2.5"><Flag className="h-5 w-5 text-violet-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Flags</p><p className="text-2xl font-bold">{stats.total}</p></div></StaggerItem>
        <StaggerItem index={1}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5"><Check className="h-5 w-5 text-emerald-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Globally Enabled</p><p className="text-2xl font-bold text-emerald-600">{stats.enabled}</p></div></StaggerItem>
        <StaggerItem index={2}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-rose-500/10 p-2.5"><X className="h-5 w-5 text-rose-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Globally Disabled</p><p className="text-2xl font-bold text-rose-600">{stats.disabled}</p></div></StaggerItem>
        <StaggerItem index={3}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-amber-500/10 p-2.5"><Layers className="h-5 w-5 text-amber-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Categories</p><p className="text-2xl font-bold text-amber-600">{stats.categories}</p></div></StaggerItem>
      </div>

      {/* hierarchy info */}
      <StaggerItem index={1}>
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-violet-600 dark:text-violet-400">Hierarchy:</span>
            {Object.entries(LEVEL_CONFIG).map(([key, cfg], i) => (
              <span key={key} className="inline-flex items-center gap-1.5">
                <span className={cn("rounded-full px-2 py-0.5 font-medium", colorOfHelper(cfg.color).soft, colorOfHelper(cfg.color).text)}>{cfg.label}</span>
                {i < 3 && <span className="text-muted-foreground">→</span>}
              </span>
            ))}
            <span className="ml-auto text-muted-foreground">Level 1 overrides all • Level 4 is most specific</span>
          </div>
        </div>
      </StaggerItem>

      {/* toolbar */}
      <StaggerItem index={2}>
        <SectionCard>
          <Toolbar search={search} onSearch={setSearch} placeholder="Search features…">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 rounded-lg border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50">
              <option value="all">All Categories</option>
              {FLAG_CATEGORIES.slice(0, 15).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => toast.success("Bulk enable applied to 5 flags")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20"><Check className="h-3.5 w-3.5" /> Bulk Enable</button>
            <button onClick={() => toast.success("Bulk disable applied")} className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20"><X className="h-3.5 w-3.5" /> Bulk Disable</button>
          </Toolbar>
        </SectionCard>
      </StaggerItem>

      {/* flags list */}
      <div className="space-y-3">
        {filtered.map((f, i) => (
          <StaggerItem key={f.id} index={i + 3}>
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium transition-colors hover:bg-accent/10">
              <div className="flex items-start gap-3">
                <div className={cn("rounded-xl p-2.5 shrink-0", f.global ? "bg-emerald-500/10" : "bg-rose-500/10")}>
                  <Flag className={cn("h-5 w-5", f.global ? "text-emerald-600" : "text-rose-600")} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{f.name}</p>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{f.category}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", f.global ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>
                      {f.global ? "GLOBAL ON" : "GLOBAL OFF"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                    <span>Schools: <b className="text-foreground">{f.schools.enabled}/{f.schools.total}</b></span>
                    <span>Modified: <b className="text-foreground">{f.modifiedDate}</b></span>
                    <span>By: <b className="text-foreground">{f.modifiedBy}</b></span>
                    <span className="italic">Reason: {f.reason}</span>
                  </div>
                  {/* role toggles */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(f.roles).map(([role, enabled]) => (
                      <button
                        key={role}
                        onClick={() => toggleRole(f.id, role)}
                        className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", enabled ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}
                      >
                        {enabled ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button onClick={() => toggleGlobal(f.id)} className={cn("relative h-6 w-11 rounded-full transition-colors", f.global ? "bg-emerald-500" : "bg-muted")}>
                    <motion.span layout className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow", f.global ? "left-[22px]" : "left-0.5")} />
                  </button>
                  <button onClick={() => setSelected(f)} className="rounded-lg bg-muted p-1.5 text-muted-foreground hover:bg-accent"><History className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </div>

      {/* history dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-premium">
              <h3 className="text-lg font-semibold">Flag History — {selected.name}</h3>
              <p className="text-xs text-muted-foreground">Audit trail & rollback options</p>
              <div className="mt-4 space-y-3">
                {[
                  { date: selected.modifiedDate, user: selected.modifiedBy, action: `Set to ${selected.global ? "Enabled" : "Disabled"}`, reason: selected.reason },
                  { date: "2025-11-15", user: "System", action: "School-level override added (12 schools)", reason: "Enterprise opt-in" },
                  { date: "2025-10-20", user: "Arjun Mehta", action: "Role permissions updated", reason: "Security review" },
                  { date: "2025-09-01", user: "System", action: "Flag created", reason: "Initial deployment" },
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-3 border-l-2 border-border/60 pl-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{h.action}</p>
                      <p className="text-xs text-muted-foreground">{h.reason}</p>
                      <p className="text-[10px] text-muted-foreground">{h.user} • {h.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => { toast.success("Rolled back to previous state"); setSelected(null) }} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><RotateCcw className="h-4 w-4" /> Rollback</button>
                <button onClick={() => setSelected(null)} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-accent">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function colorOfHelper(c: string) {
  return {
    emerald: { soft: "bg-emerald-500/10", text: "text-emerald-600" },
    violet: { soft: "bg-violet-500/10", text: "text-violet-600" },
    amber: { soft: "bg-amber-500/10", text: "text-amber-600" },
    sky: { soft: "bg-sky-500/10", text: "text-sky-600" },
  }[c] || { soft: "bg-muted", text: "text-muted-foreground" }
}
