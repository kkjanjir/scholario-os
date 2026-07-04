"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { FEE_DEFAULTERS, type FeeDefaulter } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import {
  AlertTriangle, Mail, MessageSquare, Phone, Send, Clock,
  CheckCircle2, XCircle, FileText, Bell,
} from "lucide-react"
import { toast } from "sonner"

const STATUS_CONFIG = {
  critical: { color: "rose", soft: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/20", label: "Critical", icon: AlertTriangle },
  overdue: { color: "amber", soft: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20", label: "Overdue", icon: Clock },
  reminder: { color: "sky", soft: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", ring: "ring-sky-500/20", label: "Reminder", icon: Bell },
} as const

export function DefaultersModule() {
  const [defaulters, setDefaulters] = useState(FEE_DEFAULTERS)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "critical" | "overdue" | "reminder">("all")
  const [selected, setSelected] = useState<FeeDefaulter | null>(null)
  const [reminderOpen, setReminderOpen] = useState<FeeDefaulter | null>(null)

  const filtered = defaulters.filter((d) => {
    const matchFilter = filter === "all" || d.status === filter
    const matchSearch = d.studentName.toLowerCase().includes(search.toLowerCase()) || d.admissionNo.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalDue = defaulters.reduce((a, d) => a + d.amount, 0)
  const stats = {
    total: defaulters.length,
    critical: defaulters.filter((d) => d.status === "critical").length,
    overdue: defaulters.filter((d) => d.status === "overdue").length,
    reminder: defaulters.filter((d) => d.status === "reminder").length,
  }

  function sendReminder(d: FeeDefaulter, channel: "email" | "sms" | "push") {
    setDefaulters((prev) => prev.map((x) => x.id === d.id ? { ...x, remindersSent: x.remindersSent + 1, lastReminder: new Date().toISOString().slice(0, 10) } : x))
    setReminderOpen(null)
    const labels = { email: "Email", sms: "SMS", push: "Push notification" }
    toast.success(`${labels[channel]} reminder sent to ${d.guardianName}!`, {
      description: `Reminder #${d.remindersSent + 1} • ${d.guardianPhone}`,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Defaulters"
        description="Automated follow-up workflow — track & remind overdue fee accounts"
        action={
          <button onClick={() => toast.success("Bulk reminders sent to 6 parents!")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105">
            <Send className="h-4 w-4" /> Send Bulk Reminders
          </button>
        }
      />

      {/* stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}>
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-rose-500 to-orange-600 p-5 text-white shadow-premium">
            <Wallet className="h-6 w-6 opacity-80" />
            <p className="mt-3 text-xs uppercase tracking-wide text-white/80">Total Overdue</p>
            <p className="text-2xl font-bold"><AnimatedCounter value={totalDue} prefix="₹" /></p>
          </div>
        </StaggerItem>
        <StaggerItem index={1}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-rose-500/10 p-2.5"><AlertTriangle className="h-5 w-5 text-rose-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-rose-600">{stats.critical}</p>
          </div>
        </StaggerItem>
        <StaggerItem index={2}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-amber-500/10 p-2.5"><Clock className="h-5 w-5 text-amber-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Overdue</p>
            <p className="text-2xl font-bold text-amber-600">{stats.overdue}</p>
          </div>
        </StaggerItem>
        <StaggerItem index={3}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            <div className="mb-3 inline-flex rounded-xl bg-sky-500/10 p-2.5"><Bell className="h-5 w-5 text-sky-600" /></div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reminder</p>
            <p className="text-2xl font-bold text-sky-600">{stats.reminder}</p>
          </div>
        </StaggerItem>
      </div>

      {/* toolbar */}
      <StaggerItem index={1}>
        <SectionCard>
          <Toolbar search={search} onSearch={setSearch} placeholder="Search student or admission no…">
            {(["all", "critical", "overdue", "reminder"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors", filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>
                {f}
              </button>
            ))}
          </Toolbar>
        </SectionCard>
      </StaggerItem>

      {/* defaulters table */}
      <StaggerItem index={2}>
        <SectionCard title="Overdue Accounts" subtitle={`${filtered.length} accounts need follow-up`} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  {["Student", "Class", "Guardian", "Amount", "Overdue", "Reminders", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const cfg = STATUS_CONFIG[d.status]
                  const Icon = cfg.icon
                  return (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/40 transition-colors hover:bg-accent/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={d.studentName} color={d.avatarColor} size="sm" />
                          <div>
                            <p className="font-medium">{d.studentName}</p>
                            <p className="text-[10px] text-muted-foreground">{d.admissionNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{d.className}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{d.guardianName}</p>
                        <p className="text-[10px] text-muted-foreground">{d.guardianPhone}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-rose-600">{formatINR(d.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("font-medium", cfg.text)}>{d.overdueDays} days</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          <Bell className="h-3 w-3" /> {d.remindersSent}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", cfg.soft, cfg.text, cfg.ring)}>
                          <Icon className="h-3 w-3" /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setReminderOpen(d)} title="Send reminder" className="rounded-lg bg-primary/10 p-1.5 text-primary transition-colors hover:bg-primary/20">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setSelected(d)} title="View details" className="rounded-lg bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent">
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => toast.success(`Calling ${d.guardianPhone}…`)} title="Call guardian" className="rounded-lg bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent">
                            <Phone className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* reminder dialog */}
      <AnimatePresence>
        {reminderOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setReminderOpen(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium">
              <div className="border-b border-border/60 p-5">
                <h2 className="text-lg font-semibold">Send Fee Reminder</h2>
                <p className="text-xs text-muted-foreground">To {reminderOpen.guardianName} • {reminderOpen.studentName}</p>
              </div>
              <div className="space-y-3 p-5">
                <p className="text-sm text-muted-foreground">Choose a channel to send the reminder for <b className="text-foreground">{formatINR(reminderOpen.amount)}</b> overdue by <b className="text-foreground">{reminderOpen.overdueDays} days</b>:</p>
                {[
                  { id: "email" as const, icon: Mail, label: "Email", desc: "Detailed email with invoice attachment", color: "sky" },
                  { id: "sms" as const, icon: MessageSquare, label: "SMS", desc: "Quick SMS to " + reminderOpen.guardianPhone, color: "emerald" },
                  { id: "push" as const, icon: Bell, label: "Push Notification", desc: "In-app notification on parent portal", color: "violet" },
                ].map((ch) => {
                  const c = colorOf(ch.color)
                  return (
                    <button
                      key={ch.id}
                      onClick={() => sendReminder(reminderOpen, ch.id)}
                      className="flex w-full items-center gap-3 rounded-xl border border-border/60 p-3 text-left transition-colors hover:bg-accent/30"
                    >
                      <div className={cn("rounded-lg p-2", c.soft)}>
                        <ch.icon className={cn("h-4 w-4", c.text)} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{ch.label}</p>
                        <p className="text-xs text-muted-foreground">{ch.desc}</p>
                      </div>
                      <Send className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )
                })}
                {/* preview */}
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">Preview</p>
                  <p className="text-xs text-muted-foreground">
                    Dear {reminderOpen.guardianName}, this is a reminder that the fee payment of {formatINR(reminderOpen.amount)} for {reminderOpen.studentName} ({reminderOpen.admissionNo}) is overdue by {reminderOpen.overdueDays} days. Please clear the dues at the earliest. — Sri Vidya Mandir School
                  </p>
                </div>
              </div>
              <div className="border-t border-border/60 p-4">
                <button onClick={() => setReminderOpen(null)} className="w-full rounded-xl py-2 text-sm font-medium hover:bg-accent">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* detail dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium">
              <DefaulterDetail defaulter={selected} onClose={() => setSelected(null)} onRemind={() => { setReminderOpen(selected); setSelected(null) }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DefaulterDetail({ defaulter, onClose, onRemind }: { defaulter: FeeDefaulter; onClose: () => void; onRemind: () => void }) {
  const cfg = STATUS_CONFIG[defaulter.status]
  return (
    <div>
      <div className={cn("relative overflow-hidden p-6 text-white", cfg.color === "rose" ? "bg-gradient-to-br from-rose-500 to-orange-600" : cfg.color === "amber" ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-sky-500 to-cyan-600")}>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={defaulter.studentName} color={defaulter.avatarColor} size="xl" className="ring-4 ring-white/30" />
            <div>
              <p className="text-xs uppercase tracking-wide text-white/80">{cfg.label} • {defaulter.overdueDays} days overdue</p>
              <h2 className="text-xl font-bold">{defaulter.studentName}</h2>
              <p className="text-sm text-white/80">{defaulter.className} • {defaulter.admissionNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg bg-white/15 p-2 text-white transition-colors hover:bg-white/25">✕</button>
        </div>
        <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
          <span className="text-xs">Outstanding</span>
          <span className="text-lg font-bold">{formatINR(defaulter.amount)}</span>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Guardian</p>
            <p className="text-sm font-medium">{defaulter.guardianName}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">{defaulter.guardianPhone}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Reminders Sent</p>
            <p className="text-sm font-medium">{defaulter.remindersSent}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Last Reminder</p>
            <p className="text-sm font-medium">{defaulter.lastReminder}</p>
          </div>
        </div>

        {/* reminder timeline */}
        <div className="rounded-xl border border-border/60 p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Follow-up Timeline</p>
          <div className="space-y-2">
            {Array.from({ length: Math.max(defaulter.remindersSent, 1) }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-muted-foreground">Reminder #{i + 1} sent</span>
                <span className="ml-auto text-muted-foreground">{defaulter.lastReminder}</span>
              </div>
            ))}
            {defaulter.status === "critical" && (
              <div className="flex items-center gap-2 text-xs">
                <XCircle className="h-3.5 w-3.5 text-rose-500" />
                <span className="font-medium text-rose-600">Escalation recommended — consider parent meeting</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          <button onClick={onRemind} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
            <Send className="h-4 w-4" /> Send Reminder
          </button>
          <button onClick={() => toast.success(`Meeting scheduled with ${defaulter.guardianName}`)} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
            <FileText className="h-4 w-4" /> Schedule Meeting
          </button>
          <button onClick={() => toast.success(`Calling ${defaulter.guardianPhone}…`)} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
            <Phone className="h-4 w-4" /> Call
          </button>
        </div>
      </div>
    </div>
  )
}

function Wallet({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
}
