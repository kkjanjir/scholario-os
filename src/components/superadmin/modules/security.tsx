"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { SECURITY_EVENTS, API_KEYS } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { ShieldAlert, ShieldCheck, Key, Lock, Ban, Activity, Eye, Copy, Plus, Smartphone, Monitor, Globe } from "lucide-react"
import { toast } from "sonner"

export function SecurityModule() {
  const [tab, setTab] = useState<"events" | "apikeys" | "sessions" | "policies">("events")

  const stats = {
    blocked: SECURITY_EVENTS.filter((e) => e.type === "blocked").length,
    failed: SECURITY_EVENTS.filter((e) => e.type === "failed").length,
    activeKeys: API_KEYS.filter((k) => k.status === "active").length,
    twoFactor: 142,
  }

  const permissionMatrix = [
    { role: "Super Admin", admissions: true, attendance: true, fees: true, salary: true, exams: true, settings: true, schools: true, billing: true },
    { role: "Principal", admissions: true, attendance: true, fees: true, salary: true, exams: true, settings: true, schools: false, billing: false },
    { role: "Teacher", admissions: false, attendance: true, fees: false, salary: false, exams: true, settings: false, schools: false, billing: false },
    { role: "Student", admissions: false, attendance: false, fees: true, salary: false, exams: true, settings: false, schools: false, billing: false },
    { role: "Parent", admissions: false, attendance: true, fees: true, salary: false, exams: true, settings: false, schools: false, billing: false },
    { role: "Accountant", admissions: false, attendance: false, fees: true, salary: true, exams: false, settings: false, schools: false, billing: false },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Security Center" description="RBAC, sessions, API keys, audit logs & security policies" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-rose-500/10 p-2.5"><Ban className="h-5 w-5 text-rose-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blocked IPs</p><p className="text-2xl font-bold text-rose-600"><AnimatedCounter value={stats.blocked} /></p></div></StaggerItem>
        <StaggerItem index={1}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-amber-500/10 p-2.5"><ShieldAlert className="h-5 w-5 text-amber-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Failed Logins</p><p className="text-2xl font-bold text-amber-600"><AnimatedCounter value={stats.failed} /></p></div></StaggerItem>
        <StaggerItem index={2}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5"><Key className="h-5 w-5 text-emerald-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active API Keys</p><p className="text-2xl font-bold text-emerald-600"><AnimatedCounter value={stats.activeKeys} /></p></div></StaggerItem>
        <StaggerItem index={3}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-2.5"><Lock className="h-5 w-5 text-violet-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">2FA Enabled</p><p className="text-2xl font-bold text-violet-600"><AnimatedCounter value={stats.twoFactor} /></p></div></StaggerItem>
      </div>

      <div className="flex gap-2">
        {([["events", "Security Events"], ["apikeys", "API Keys"], ["sessions", "Sessions & Devices"], ["policies", "Permission Matrix"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={cn("rounded-xl px-3 py-1.5 text-xs font-medium transition-colors", tab === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>{label}</button>
        ))}
      </div>

      {tab === "events" && (
        <StaggerItem index={1}>
          <SectionCard title="Security Events" subtitle="Failed logins, blocked IPs & suspicious activity" bodyClassName="p-0">
            <div className="divide-y divide-border/40">
              {SECURITY_EVENTS.map((e) => {
                const c = colorOf(e.severity === "high" ? "rose" : e.severity === "medium" ? "amber" : "emerald")
                return (
                  <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={cn("rounded-lg p-2 shrink-0", c.soft)}><ShieldAlert className={cn("h-4 w-4", c.text)} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{e.detail}</p>
                      <p className="text-xs text-muted-foreground">{e.user} • {e.school} • IP: {e.ip}</p>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", c.soft, c.text)}>{e.severity}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{e.time}</span>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
      )}

      {tab === "apikeys" && (
        <StaggerItem index={1}>
          <SectionCard title="API Keys" subtitle="Manage API access for schools & integrations" action={<button onClick={() => toast.success("New API key created")} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> New Key</button>} bodyClassName="p-0">
            <div className="divide-y divide-border/40">
              {API_KEYS.map((k) => (
                <div key={k.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="inline-flex rounded-lg bg-muted p-2"><Key className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{k.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{k.key}</p>
                    <p className="text-[10px] text-muted-foreground">{k.school} • Created {k.created} • Last used {k.lastUsed}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", k.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>{k.status}</span>
                  <button onClick={() => toast.success("Key copied to clipboard")} className="rounded-lg bg-muted p-1.5 hover:bg-accent"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      )}

      {tab === "sessions" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <StaggerItem index={1}>
            <SectionCard title="Active Sessions" subtitle="Currently logged-in users">
              <div className="space-y-2">
                {[
                  { user: "Dr. Anjali Deshpande", school: "SVM Pune", device: "Chrome / Windows", ip: "103.21.45.89", time: "2 min", icon: Monitor },
                  { user: "Rajesh Kulkarni", school: "SVM Pune", device: "Safari / macOS", ip: "103.21.45.92", time: "8 min", icon: Monitor },
                  { user: "Aarav Sharma", school: "SVM Pune", device: "Chrome / iOS", ip: "103.21.45.101", time: "30 min", icon: Smartphone },
                  { user: "Priya Sharma", school: "DPS Delhi", device: "Chrome / Android", ip: "49.36.12.45", time: "15 min", icon: Smartphone },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.user}</p>
                      <p className="text-xs text-muted-foreground">{s.school} • {s.device}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Active</span>
                      <p className="text-[10px] text-muted-foreground">{s.time} ago</p>
                    </div>
                    <button onClick={() => toast.success("Session revoked")} className="rounded-lg bg-rose-500/10 p-1.5 text-rose-600 hover:bg-rose-500/20"><Ban className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </StaggerItem>
          <StaggerItem index={2}>
            <SectionCard title="Security Policies" subtitle="Platform-wide security configuration">
              <div className="space-y-3">
                {[
                  { label: "Two-Factor Authentication", desc: "Required for all admin accounts", enabled: true },
                  { label: "IP Whitelisting", desc: "Restrict access by IP range", enabled: false },
                  { label: "Session Timeout", desc: "Auto-logout after 30 min idle", enabled: true },
                  { label: "Password Policy", desc: "Min 12 chars, special char, number", enabled: true },
                  { label: "Failed Login Lockout", desc: "Lock after 5 failed attempts", enabled: true },
                  { label: "Device Fingerprinting", desc: "Track & verify devices", enabled: true },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <button onClick={() => toast.success(`${p.label} ${p.enabled ? "disabled" : "enabled"}`)} className={cn("relative h-6 w-11 rounded-full transition-colors", p.enabled ? "bg-emerald-500" : "bg-muted")}>
                      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", p.enabled ? "left-[22px]" : "left-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </StaggerItem>
        </div>
      )}

      {tab === "policies" && (
        <StaggerItem index={1}>
          <SectionCard title="Permission Matrix (RBAC)" subtitle="Role-based access control for all modules">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left">
                    <th className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Role</th>
                    {["Admissions", "Attendance", "Fees", "Salary", "Exams", "Settings", "Schools", "Billing"].map((m) => (
                      <th key={m} className="px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionMatrix.map((row) => (
                    <tr key={row.role} className="border-b border-border/40 hover:bg-accent/30">
                      <td className="px-3 py-2.5 font-medium">{row.role}</td>
                      {Object.entries(row).filter(([k]) => k !== "role").map(([key, val]) => (
                        <td key={key} className="px-3 py-2.5 text-center">
                          {val ? <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">✓</span> : <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">✕</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </StaggerItem>
      )}
    </div>
  )
}
