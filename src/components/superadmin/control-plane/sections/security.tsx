"use client"

import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { SECURITY_EVENTS, API_KEYS } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { ShieldAlert, Key, Ban, Lock, Copy, Check, Monitor, Smartphone } from "lucide-react"
import { toast } from "sonner"

export function SecuritySection() {
  const policies = [
    { label: "Two-Factor Authentication", desc: "Required for all admin accounts", enabled: true },
    { label: "IP Whitelisting", desc: "Restrict access by IP range", enabled: false },
    { label: "Session Timeout", desc: "Auto-logout after 30 min idle", enabled: true },
    { label: "Password Policy", desc: "Min 12 chars, special char, number", enabled: true },
    { label: "Failed Login Lockout", desc: "Lock after 5 failed attempts", enabled: true },
    { label: "Device Fingerprinting", desc: "Track & verify devices", enabled: true },
  ]

  return (
    <div className="space-y-6">
      {/* Security events */}
      <StaggerItem index={0}>
        <SectionCard title="Security Events" subtitle="Failed logins, blocked IPs & suspicious activity" bodyClassName="p-0">
          <div className="divide-y divide-border/40">
            {SECURITY_EVENTS.map((e) => {
              const c = colorOf(e.severity === "high" ? "rose" : e.severity === "medium" ? "amber" : "emerald")
              return (
                <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={cn("rounded-lg p-2 shrink-0", c.soft)}><ShieldAlert className={cn("h-4 w-4", c.text)} /></div>
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium">{e.detail}</p><p className="text-xs text-muted-foreground">{e.user} • IP: {e.ip}</p></div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", c.soft, c.text)}>{e.severity}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{e.time}</span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Policies */}
      <StaggerItem index={1}>
        <SectionCard title="Security Policies" subtitle="School-specific security configuration">
          <div className="grid gap-3 sm:grid-cols-2">
            {policies.map((p) => (
              <div key={p.label} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium">{p.label}</p><p className="text-xs text-muted-foreground">{p.desc}</p></div>
                <button onClick={() => toast.success(`${p.label} ${p.enabled ? "disabled" : "enabled"}`)} className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", p.enabled ? "bg-emerald-500" : "bg-muted")}><span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", p.enabled ? "left-[22px]" : "left-0.5")} /></button>
              </div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* API keys + sessions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={2}>
          <SectionCard title="API Keys" subtitle="School-specific API access" bodyClassName="p-0">
            <div className="divide-y divide-border/40">
              {API_KEYS.slice(0, 4).map((k) => (
                <div key={k.id} className="flex items-center gap-3 px-5 py-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium">{k.name}</p><p className="font-mono text-xs text-muted-foreground">{k.key}</p></div>
                  <button onClick={() => toast.success("Copied")} className="rounded-lg bg-muted p-1.5 hover:bg-accent"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={3}>
          <SectionCard title="Active Sessions" subtitle="Currently logged-in users">
            <div className="space-y-2">
              {[
                { user: "Dr. Anjali Deshpande", device: "Chrome / Windows", time: "2 min", icon: Monitor },
                { user: "Rajesh Kulkarni", device: "Safari / macOS", time: "8 min", icon: Monitor },
                { user: "Aarav Sharma", device: "Chrome / iOS", time: "30 min", icon: Smartphone },
                { user: "Suresh Sharma", device: "Chrome / Android", time: "45 min", icon: Smartphone },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{s.user}</p><p className="text-xs text-muted-foreground">{s.device}</p></div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Active</span>
                  <button onClick={() => toast.success("Session revoked")} className="rounded-lg bg-rose-500/10 p-1.5 text-rose-600 hover:bg-rose-500/20"><Ban className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}
