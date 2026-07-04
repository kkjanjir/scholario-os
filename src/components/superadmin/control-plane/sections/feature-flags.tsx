"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { FEATURE_FLAGS, FLAG_CATEGORIES } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import {
  Flag, Check, X, History, RotateCcw, Filter, Globe, Building2,
  Users, User, Eye, EyeOff, Layers, Sparkles, Shield, GraduationCap,
  Wallet, BookOpen, FileText, CreditCard, Library, Bus, Package,
  Megaphone, BarChart3, Award, Settings as SettingsIcon, Plug,
  LayoutDashboard, Calendar, MessageSquare,
} from "lucide-react"
import { toast } from "sonner"

type PreviewMode = "current" | "disabled" | "enabled"

export function FeatureFlagsSection() {
  const [flags, setFlags] = useState(FEATURE_FLAGS)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [preview, setPreview] = useState<PreviewMode>("current")
  const [previewRole, setPreviewRole] = useState("principal")

  const filtered = flags.filter((f) => {
    const matchCat = category === "all" || f.category === category
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function toggleGlobal(id: string) {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, global: !f.global } : f))
    toast.success("Feature flag updated")
  }

  // Preview nav items — shown/hidden based on flag state + preview mode
  const previewNav = [
    { id: "dashboard", label: "Dashboard", cat: "Admissions", icon: LayoutDashboard },
    { id: "admissions", label: "Admissions", cat: "Admissions", icon: GraduationCap },
    { id: "attendance", label: "Attendance", cat: "Attendance", icon: Calendar },
    { id: "homework", label: "Homework", cat: "Homework", icon: BookOpen },
    { id: "assignments", label: "Assignments", cat: "Homework", icon: FileText },
    { id: "fees", label: "Fees", cat: "Fees", icon: Wallet },
    { id: "exams", label: "Examinations", cat: "Examinations", icon: Award },
    { id: "results", label: "Results", cat: "Results", icon: BarChart3 },
    { id: "library", label: "Library", cat: "Library", icon: Library },
    { id: "transport", label: "Transport", cat: "Transport", icon: Bus },
    { id: "inventory", label: "Inventory", cat: "Inventory", icon: Package },
    { id: "communication", label: "Communication", cat: "Communication", icon: Megaphone },
    { id: "analytics", label: "Analytics", cat: "Analytics", icon: BarChart3 },
    { id: "ai", label: "AI Insights", cat: "AI Features", icon: Sparkles },
    { id: "certificates", label: "Certificates", cat: "Reports", icon: Award },
    { id: "settings", label: "Settings", cat: "Settings", icon: SettingsIcon },
    { id: "integrations", label: "Integrations", cat: "Integrations", icon: Plug },
    { id: "communication-sms", label: "SMS Gateway", cat: "SMS", icon: MessageSquare },
  ]

  function isVisible(cat: string) {
    const flag = flags.find((f) => f.category === cat || f.name.includes(cat))
    if (!flag) return true
    if (preview === "current") return flag.global
    if (preview === "disabled") return false // preview with all disabled
    if (preview === "enabled") return true // preview with all enabled
    return flag.global
  }

  const stats = { total: flags.length, enabled: flags.filter((f) => f.global).length, disabled: flags.filter((f) => !f.global).length }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <StaggerItem index={0}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-2.5"><Flag className="h-5 w-5 text-violet-600" /></div><p className="text-xs uppercase text-muted-foreground">Total Flags</p><p className="text-2xl font-bold">{stats.total}</p></div></StaggerItem>
        <StaggerItem index={1}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5"><Check className="h-5 w-5 text-emerald-600" /></div><p className="text-xs uppercase text-muted-foreground">Enabled</p><p className="text-2xl font-bold text-emerald-600">{stats.enabled}</p></div></StaggerItem>
        <StaggerItem index={2}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-rose-500/10 p-2.5"><X className="h-5 w-5 text-rose-600" /></div><p className="text-xs uppercase text-muted-foreground">Disabled</p><p className="text-2xl font-bold text-rose-600">{stats.disabled}</p></div></StaggerItem>
      </div>

      {/* Preview mode bar */}
      <StaggerItem index={1}>
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-violet-600" /><span className="text-sm font-semibold">Preview Mode</span></div>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {([["current", "Current View"], ["disabled", "Preview: All Disabled"], ["enabled", "Preview: All Enabled"]] as [PreviewMode, string][]).map(([id, label]) => (
                <button key={id} onClick={() => setPreview(id)} className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors", preview === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{label}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">As role:</span>
              <select value={previewRole} onChange={(e) => setPreviewRole(e.target.value)} className="h-8 rounded-lg border border-border/70 bg-background/60 px-2 text-xs outline-none">
                <option value="principal">Principal</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="accountant">Accountant</option>
                <option value="receptionist">Receptionist</option>
                <option value="librarian">Librarian</option>
                <option value="transport">Transport Manager</option>
                <option value="hr">HR</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <span className="ml-auto text-[10px] text-muted-foreground">Preview updates instantly when flags change</span>
          </div>
        </div>
      </StaggerItem>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Flags list */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search features…" className="h-9 flex-1 rounded-lg border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 rounded-lg border border-border/70 bg-background/60 px-2 text-sm outline-none">
              <option value="all">All</option>
              {FLAG_CATEGORIES.slice(0, 20).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {filtered.map((f, i) => (
            <motion.div key={f.id} layout className="rounded-2xl border border-border/60 bg-card p-3 shadow-premium">
              <div className="flex items-start gap-3">
                <div className={cn("rounded-lg p-2 shrink-0", f.global ? "bg-emerald-500/10" : "bg-rose-500/10")}><Flag className={cn("h-4 w-4", f.global ? "text-emerald-600" : "text-rose-600")} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="text-sm font-semibold">{f.name}</p><span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{f.category}</span></div>
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {Object.entries(f.roles).filter(([r]) => ["principal", "teacher", "student", "parent"].includes(r)).map(([role, en]) => (
                      <span key={role} className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-medium", en ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>{role}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => toggleGlobal(f.id)} className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", f.global ? "bg-emerald-500" : "bg-muted")}><span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all", f.global ? "left-[18px]" : "left-0.5")} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live preview panel */}
        <StaggerItem index={2}>
          <div className="sticky top-4 rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-violet-600" /><span className="text-sm font-semibold">Live Preview</span></div>
              <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-600 capitalize">{previewRole} view</span>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">This is how {previewRole}'s navigation would look with current flag settings.</p>
            {/* Mock sidebar preview */}
            <div className="rounded-xl border border-border/60 bg-sidebar p-2">
              <div className="space-y-0.5">
                <AnimatePresence>
                  {previewNav.map((item) => {
                    const visible = isVisible(item.cat) || isVisible(item.id)
                    if (!visible && preview !== "enabled") return null
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-accent"
                      >
                        <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{item.label}</span>
                        {!isVisible(item.cat) && preview === "enabled" && <span className="ml-auto rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[8px] font-bold text-rose-600">HIDDEN</span>}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Showing:</span>
              <span className="font-bold text-emerald-600">{previewNav.filter((n) => isVisible(n.cat) || isVisible(n.id)).length}</span>
              <span className="text-muted-foreground">of {previewNav.length} modules</span>
              {preview === "disabled" && <span className="ml-auto text-rose-600">All hidden</span>}
              {preview === "enabled" && <span className="ml-auto text-emerald-600">All visible</span>}
            </div>
          </div>
        </StaggerItem>
      </div>

      {/* Hierarchy legend */}
      <StaggerItem index={3}>
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Inheritance Hierarchy</p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {[["Platform", Globe, "emerald"], ["School", Building2, "violet"], ["Role", Users, "amber"], ["User", User, "sky"]].map(([label, Icon, color], i) => {
              const c = colorOf(color as string)
              const I = Icon as any
              return (
                <span key={label as string} className="inline-flex items-center gap-1.5">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium", c.soft, c.text)}><I className="h-3 w-3" /> {label as string}</span>
                  {i < 3 && <span className="text-muted-foreground">→</span>}
                </span>
              )
            })}
            <span className="ml-auto text-muted-foreground">Level 1 overrides all • Level 4 is most specific</span>
          </div>
        </div>
      </StaggerItem>
    </div>
  )
}
