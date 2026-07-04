"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import {
  Package, Check, X, Download, RotateCcw, Eye, Plus, Shield,
  FileText, AlertTriangle, CheckCircle2, Clock, Server,
} from "lucide-react"
import { toast } from "sonner"

interface ExtModule {
  id: string
  name: string
  desc: string
  icon: string
  color: string
  version: string
  status: "installed" | "available" | "updating"
  permissions: string[]
  size: string
  installedAt?: string
}

const MODULES: ExtModule[] = [
  { id: "visitor", name: "Visitor Management", desc: "Track visitors, gate passes & approvals", icon: "🚪", color: "emerald", version: "2.1.0", status: "installed", permissions: ["read:visitors", "write:gatepass"], size: "4.2 MB", installedAt: "2025-06-15" },
  { id: "hostel", name: "Hostel Management", desc: "Room allocation, mess, leave & fees", icon: "🏨", color: "violet", version: "3.0.2", status: "installed", permissions: ["read:hostel", "write:allocation"], size: "8.5 MB", installedAt: "2025-07-20" },
  { id: "online-classes", name: "Online Classes", desc: "Virtual classroom & video conferencing", icon: "🎥", color: "sky", version: "1.5.0", status: "available", permissions: ["read:classes", "write:sessions"], size: "12.0 MB" },
  { id: "medical", name: "Medical Records", desc: "Student health records & infirmary", icon: "🏥", color: "rose", version: "1.2.0", status: "available", permissions: ["read:medical", "write:records"], size: "3.8 MB" },
  { id: "exam-generator", name: "Exam Generator", desc: "AI-powered question paper generation", icon: "📝", color: "amber", version: "2.3.1", status: "available", permissions: ["read:exams", "write:papers", "ai:generate"], size: "6.4 MB" },
  { id: "custom-reports", name: "Custom Report Generator", desc: "Drag-and-drop report builder", icon: "📊", color: "teal", version: "1.8.0", status: "available", permissions: ["read:reports", "write:templates"], size: "5.2 MB" },
  { id: "cert-gen", name: "Certificate Generator Pro", desc: "Bulk certificate generation with QR", icon: "📜", color: "fuchsia", version: "2.0.0", status: "available", permissions: ["read:students", "write:certificates"], size: "4.0 MB" },
  { id: "gps-tracking", name: "Transport GPS", desc: "Real-time GPS tracking with geo-fencing", icon: "📍", color: "cyan", version: "1.1.0", status: "available", permissions: ["read:transport", "read:gps"], size: "7.8 MB" },
  { id: "ai-assistant", name: "AI Assistant", desc: "Conversational AI for parents & students", icon: "🤖", color: "violet", version: "0.9.0-beta", status: "available", permissions: ["ai:chat", "read:students", "read:attendance"], size: "15.0 MB" },
]

export function ModulesSection() {
  const [modules, setModules] = useState(MODULES)
  const [tab, setTab] = useState<"installed" | "available">("installed")
  const [registerOpen, setRegisterOpen] = useState(false)

  function install(id: string) {
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, status: "installed", installedAt: new Date().toISOString().slice(0, 10) } : m))
    toast.success("Module installed & activated!")
  }
  function uninstall(id: string) {
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, status: "available", installedAt: undefined } : m))
    toast.success("Module removed")
  }

  const filtered = tab === "installed" ? modules.filter((m) => m.status === "installed") : modules.filter((m) => m.status === "available")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["installed", "available"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors", tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>
              {t} ({t === "installed" ? modules.filter((m) => m.status === "installed").length : modules.filter((m) => m.status === "available").length})
            </button>
          ))}
        </div>
        <button onClick={() => setRegisterOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Register New Module</button>
      </div>

      {/* Safe extensibility info */}
      <StaggerItem index={0}>
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Safe Extension Architecture</p>
              <p className="text-xs text-muted-foreground">All modules go through manifest validation, permission review, compatibility checks & sandboxed activation. No arbitrary source code is executed in production.</p>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Module grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m, i) => {
          const c = colorOf(m.color)
          return (
            <StaggerItem key={m.id} index={i + 1}>
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
                <div className="flex items-start justify-between">
                  <div className={cn("rounded-xl p-3 text-2xl", c.soft)}>{m.icon}</div>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", m.status === "installed" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>{m.status === "installed" ? "INSTALLED" : "AVAILABLE"}</span>
                </div>
                <p className="mt-3 text-sm font-bold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>v{m.version}</span><span>•</span><span>{m.size}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.permissions.slice(0, 2).map((p) => <span key={p} className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">{p}</span>)}
                  {m.permissions.length > 2 && <span className="text-[9px] text-muted-foreground">+{m.permissions.length - 2}</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  {m.status === "installed" ? (
                    <>
                      <button onClick={() => toast.info(`Configuring ${m.name}`)} className="flex-1 rounded-lg bg-muted py-1.5 text-xs font-medium hover:bg-accent">Configure</button>
                      <button onClick={() => uninstall(m.id)} className="rounded-lg bg-rose-500/10 px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20"><X className="h-3.5 w-3.5" /></button>
                    </>
                  ) : (
                    <button onClick={() => install(m.id)} className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:scale-[1.02]">Install</button>
                  )}
                </div>
              </motion.div>
            </StaggerItem>
          )
        })}
      </div>

      {/* Registration dialog */}
      <AnimatePresence>
        {registerOpen && (
          <RegisterModuleDialog onClose={() => setRegisterOpen(false)} onRegister={(name) => { setRegisterOpen(false); toast.success(`${name} registered — pending validation`) }} />
        )}
      </AnimatePresence>
    </div>
  )
}

function RegisterModuleDialog({ onClose, onRegister }: { onClose: () => void; onRegister: (name: string) => void }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border/60 bg-card p-6 shadow-premium">
        <h3 className="text-lg font-semibold">Register New Module</h3>
        <p className="text-xs text-muted-foreground">Safe extensibility workflow • Step {step} of 4</p>

        <div className="mt-4 space-y-3">
          {step === 1 && (<>
            <div><label className="text-xs font-medium text-muted-foreground">MODULE NAME</label><input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50" placeholder="e.g. Alumni Network" /></div>
            <div><label className="text-xs font-medium text-muted-foreground">MODULE DESCRIPTION</label><textarea rows={2} className="mt-1 w-full resize-none rounded-xl border border-border/70 bg-background/60 p-3 text-sm outline-none" placeholder="Brief description of module functionality" /></div>
            <div><label className="text-xs font-medium text-muted-foreground">VERSION</label><input className="mt-1 h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none" placeholder="1.0.0" /></div>
          </>)}
          {step === 2 && (<>
            <p className="text-sm font-medium">Manifest & Permissions</p>
            <div className="space-y-2">
              {["read:students", "read:attendance", "write:reports", "ai:generate"].map((p) => (
                <label key={p} className="flex items-center gap-2 rounded-xl border border-border/60 p-2 text-sm"><input type="checkbox" className="h-4 w-4 rounded" /> <code className="font-mono text-xs">{p}</code></label>
              ))}
            </div>
          </>)}
          {step === 3 && (<>
            <p className="text-sm font-medium">Compatibility Check</p>
            <div className="space-y-2">
              {[{ label: "Platform version compatible", ok: true }, { label: "No dependency conflicts", ok: true }, { label: "Permission scope approved", ok: true }, { label: "Security scan passed", ok: true }].map((c) => (
                <div key={c.label} className="flex items-center gap-2 rounded-xl border border-border/60 p-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {c.label}</div>
              ))}
            </div>
          </>)}
          {step === 4 && (<>
            <p className="text-sm font-medium">Review & Activate</p>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-sm">
              <p><b>Module:</b> {name || "Untitled"}</p>
              <p><b>Version:</b> 1.0.0</p>
              <p><b>Permissions:</b> 4 granted</p>
              <p><b>Status:</b> Ready to activate</p>
            </div>
          </>)}
        </div>

        <div className="mt-5 flex justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-accent">{step > 1 ? "Back" : "Cancel"}</button>
          {step < 4 ? <button onClick={() => setStep(step + 1)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Continue</button> : <button onClick={() => onRegister(name || "New Module")} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">Activate Module</button>}
        </div>
      </motion.div>
    </motion.div>
  )
}
