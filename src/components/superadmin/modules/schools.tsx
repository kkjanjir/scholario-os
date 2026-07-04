"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, Toolbar, DataTable } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { SCHOOLS, type School } from "@/lib/mock/superadmin-data"
import { ProvisioningWizard } from "./provisioning-wizard"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Building2, MoreVertical, Eye, UserCog, Archive, Trash2, Shield,
  Download, Activity, FileText, LogIn, Power, PowerOff, Bell, Plus, Rocket,
} from "lucide-react"
import { toast } from "sonner"

export function SchoolsModule() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "Active" | "Trial" | "Suspended" | "Expired">("all")
  const [selected, setSelected] = useState<School | null>(null)
  const [schools, setSchools] = useState(SCHOOLS)
  const [wizardOpen, setWizardOpen] = useState(false)
  const enterControlPlane = useAppStore((s) => s.enterControlPlane)

  const filtered = schools.filter((s) => {
    const matchFilter = filter === "all" || s.status === filter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()) || s.shortName.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  function toggleStatus(s: School) {
    const newStatus = s.status === "Active" ? "Suspended" : "Active"
    setSchools((prev) => prev.map((x) => x.id === s.id ? { ...x, status: newStatus as any } : x))
    toast.success(`${s.name} ${newStatus === "Active" ? "activated" : "suspended"}`)
    setSelected(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="School Management" description="Provision, configure, deploy & monitor all schools on the platform" action={
        <div className="flex gap-2">
          <button onClick={() => toast.success("Export started — CSV will be emailed")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm font-medium hover:bg-accent"><Download className="h-4 w-4" /> Export</button>
          <button onClick={() => setWizardOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"><Rocket className="h-4 w-4" /> Provision New School</button>
        </div>
      } />

      <StaggerItem index={0}>
        <SectionCard>
          <Toolbar search={search} onSearch={setSearch} placeholder="Search schools…">
            {(["all", "Active", "Trial", "Suspended", "Expired"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>{f}</button>
            ))}
          </Toolbar>
        </SectionCard>
      </StaggerItem>

      <StaggerItem index={1}>
        <SectionCard title={`Schools (${filtered.length})`} subtitle="Click any school to manage" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  {["School", "City", "Plan", "Students", "MRR", "Storage", "Health", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border/40 hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(s)} className="flex items-center gap-2 text-left">
                        <Avatar name={s.shortName} color={s.avatarColor} size="sm" />
                        <div>
                          <p className="font-medium hover:text-primary">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.domain}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.city}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", colorOf(s.plan === "Enterprise" ? "amber" : s.plan === "Professional" ? "violet" : s.plan === "Starter" ? "emerald" : "slate").soft, colorOf(s.plan === "Enterprise" ? "amber" : s.plan === "Professional" ? "violet" : s.plan === "Starter" ? "emerald" : "slate").text)}>{s.plan}</span></td>
                    <td className="px-4 py-3">{s.students.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold">{formatINR(s.mrr)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                          <div className={cn("h-full rounded-full", s.storageUsed / s.storageLimit > 0.85 ? "bg-rose-500" : s.storageUsed / s.storageLimit > 0.6 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${(s.storageUsed / s.storageLimit) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{s.storageUsed}/{s.storageLimit}GB</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={cn("font-medium", s.health >= 90 ? "text-emerald-600" : s.health >= 75 ? "text-amber-600" : "text-rose-600")}>{s.health}%</span></td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3"><button onClick={() => enterControlPlane(s.id)} className="text-xs font-medium text-primary hover:underline">Manage</button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* detail dialog */}
      <AnimatePresence>
        {selected && (
          <SchoolDetailDialog school={selected} onClose={() => setSelected(null)} onToggle={() => toggleStatus(selected)} onManage={() => { enterControlPlane(selected.id); setSelected(null) }} />
        )}
      </AnimatePresence>

      {/* provisioning wizard */}
      <AnimatePresence>
        {wizardOpen && (
          <ProvisioningWizard onClose={() => setWizardOpen(false)} onDeployed={(name) => { setWizardOpen(false); toast.success(`${name} provisioned & deployed!`) }} />
        )}
      </AnimatePresence>
    </div>
  )
}

function SchoolDetailDialog({ school, onClose, onToggle, onManage }: { school: School; onClose: () => void; onToggle: () => void; onManage: () => void }) {
  const c = colorOf(school.avatarColor)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto scroll-area rounded-3xl border border-border/60 bg-card shadow-premium">
        {/* header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={school.shortName} color={school.avatarColor} size="xl" className="ring-4 ring-white/20" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">{school.plan} • {school.status}</p>
                <h2 className="text-xl font-bold">{school.name}</h2>
                <p className="text-sm text-white/70">{school.city}, {school.state} • {school.domain}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg bg-white/15 p-2 text-white hover:bg-white/25">✕</button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Students", value: school.students.toLocaleString("en-IN"), color: "violet" },
              { label: "Teachers", value: school.teachers.toString(), color: "amber" },
              { label: "Staff", value: school.staff.toString(), color: "sky" },
              { label: "Parents", value: school.parents.toLocaleString("en-IN"), color: "cyan" },
              { label: "MRR", value: formatINR(school.mrr), color: "emerald" },
              { label: "Storage", value: `${school.storageUsed}/${school.storageLimit} GB`, color: "teal" },
              { label: "Modules", value: `${school.modulesEnabled}/${school.modulesTotal}`, color: "rose" },
              { label: "Health", value: `${school.health}%`, color: "emerald" },
            ].map((s) => {
              const cc = colorOf(s.color)
              return (
                <div key={s.label} className="rounded-xl border border-border/60 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">{s.label}</p>
                  <p className={cn("mt-0.5 text-sm font-bold", cc.text)}>{s.value}</p>
                </div>
              )
            })}
          </div>

          {/* management actions */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">School Management</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { icon: LogIn, label: "Impersonate", color: "violet", action: () => toast.success(`Impersonating ${school.name} admin…`) },
                { icon: Eye, label: "Open Dashboard", color: "sky", action: () => toast.info("Opening school dashboard…") },
                { icon: Activity, label: "Analytics", color: "emerald", action: () => toast.info("Loading analytics…") },
                { icon: FileText, label: "Audit Logs", color: "amber", action: () => toast.info("Loading audit logs…") },
                { icon: UserCog, label: "View Users", color: "cyan", action: () => toast.info("Loading users…") },
                { icon: Shield, label: "Permissions", color: "rose", action: () => toast.info("Loading permissions…") },
                { icon: Download, label: "Backup", color: "teal", action: () => toast.success("Backup started — will be ready in 5 min") },
                { icon: Bell, label: "Notifications", color: "violet", action: () => toast.info("Loading notifications…") },
              ].map((a) => {
                const cc = colorOf(a.color)
                return (
                  <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-1.5 rounded-xl border border-border/60 p-3 transition-colors hover:bg-accent/30">
                    <div className={cn("rounded-lg p-2", cc.soft)}><a.icon className={cn("h-4 w-4", cc.text)} /></div>
                    <span className="text-xs font-medium">{a.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* status controls */}
          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <button onClick={onManage} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
              <Building2 className="h-4 w-4" /> Open Control Center
            </button>
            <button onClick={onToggle} className={cn("inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105", school.status === "Active" ? "bg-rose-500" : "bg-emerald-500")}>
              {school.status === "Active" ? <><PowerOff className="h-4 w-4" /> Suspend</> : <><Power className="h-4 w-4" /> Activate</>}
            </button>
            <button onClick={() => { toast.success(`${school.name} archived`); onClose() }} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent"><Archive className="h-4 w-4" /> Archive</button>
            <button onClick={() => { toast.success(`${school.name} deleted`); onClose() }} className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /> Delete</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
