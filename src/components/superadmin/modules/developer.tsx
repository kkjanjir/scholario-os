"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { cn } from "@/lib/utils"
import { Code2, Key, Webhook, Database, Terminal, Copy, Eye, EyeOff, Plus, RefreshCw, CheckCircle2, Server } from "lucide-react"
import { toast } from "sonner"

export function DeveloperModule() {
  const [showSecret, setShowSecret] = useState(false)
  const [tab, setTab] = useState<"api" | "webhooks" | "env" | "info">("api")

  const endpoints = [
    { method: "GET", path: "/api/v1/schools", desc: "List all schools", auth: "API Key" },
    { method: "POST", path: "/api/v1/schools", desc: "Create new school", auth: "Admin" },
    { method: "GET", path: "/api/v1/schools/:id", desc: "Get school details", auth: "API Key" },
    { method: "PUT", path: "/api/v1/schools/:id", desc: "Update school", auth: "Admin" },
    { method: "DELETE", path: "/api/v1/schools/:id", desc: "Delete school", auth: "Admin" },
    { method: "GET", path: "/api/v1/students", desc: "List students (paginated)", auth: "API Key" },
    { method: "POST", path: "/api/v1/attendance", desc: "Mark attendance", auth: "API Key" },
    { method: "GET", path: "/api/v1/reports/fees", desc: "Fee report", auth: "API Key" },
    { method: "POST", path: "/api/v1/webhooks/subscribe", desc: "Subscribe to webhook", auth: "Admin" },
    { method: "GET", path: "/api/v1/health", desc: "Health check", auth: "None" },
  ]

  const webhooks = [
    { id: "wh1", url: "https://svm.edu.in/webhooks/scholario", events: ["student.admitted", "fee.paid"], status: "Active", lastDelivery: "2 min ago" },
    { id: "wh2", url: "https://dps.edu.in/api/sync", events: ["attendance.marked", "exam.result"], status: "Active", lastDelivery: "15 min ago" },
    { id: "wh3", url: "https://bss.edu.in/hooks/notifications", events: ["notice.posted"], status: "Failing", lastDelivery: "1 hour ago" },
  ]

  const envVars = [
    { key: "DATABASE_URL", value: "postgresql://••••••••@db-prod-01:5432/scholario", masked: true },
    { key: "REDIS_URL", value: "redis://••••••••@cache-01:6379", masked: true },
    { key: "RAZORPAY_KEY_ID", value: "rzp_live_••••••••", masked: true },
    { key: "RAZORPAY_SECRET", value: "••••••••••••••••", masked: true },
    { key: "MSG91_AUTH_KEY", value: "••••••••••••••••", masked: true },
    { key: "JWT_SECRET", value: "••••••••••••••••", masked: true },
    { key: "SMTP_HOST", value: "smtp.sendgrid.net", masked: false },
    { key: "SMTP_PORT", value: "587", masked: false },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Developer Center" description="API, integrations, webhooks, secrets & system information" />

      <div className="flex gap-2">
        {([["api", "API Reference"], ["webhooks", "Webhooks"], ["env", "Environment"], ["info", "System Info"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={cn("rounded-xl px-4 py-2 text-sm font-medium transition-colors", tab === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>{label}</button>
        ))}
      </div>

      {tab === "api" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <StaggerItem index={0} className="lg:col-span-2">
            <SectionCard title="API Endpoints" subtitle="REST API v1 • Base: https://api.scholario-os.com" bodyClassName="p-0">
              <div className="divide-y divide-border/40">
                {endpoints.map((e) => (
                  <div key={e.path} className="flex items-center gap-3 px-5 py-3">
                    <span className={cn("w-14 shrink-0 rounded-md px-2 py-0.5 text-center text-[10px] font-bold", e.method === "GET" ? "bg-sky-500/10 text-sky-600" : e.method === "POST" ? "bg-emerald-500/10 text-emerald-600" : e.method === "PUT" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600")}>{e.method}</span>
                    <code className="flex-1 font-mono text-xs">{e.path}</code>
                    <span className="hidden text-xs text-muted-foreground sm:block">{e.desc}</span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground">{e.auth}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </StaggerItem>
          <StaggerItem index={1}>
            <SectionCard title="API Usage" subtitle="Last 24 hours">
              <div className="space-y-3">
                <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">Total Requests</p><p className="text-2xl font-bold">1.28M</p></div>
                <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">Avg Response</p><p className="text-2xl font-bold text-emerald-600">142ms</p></div>
                <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">Error Rate</p><p className="text-2xl font-bold text-rose-600">0.04%</p></div>
                <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">Rate Limit</p><p className="text-sm font-bold">10,000 req/min</p></div>
              </div>
            </SectionCard>
          </StaggerItem>
        </div>
      )}

      {tab === "webhooks" && (
        <StaggerItem index={0}>
          <SectionCard title="Webhooks" subtitle="Event subscriptions for schools & integrations" action={<button onClick={() => toast.success("Webhook created")} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Add Webhook</button>} bodyClassName="p-0">
            <div className="divide-y divide-border/40">
              {webhooks.map((w) => (
                <div key={w.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-4 w-4 text-muted-foreground" />
                    <code className="flex-1 truncate font-mono text-xs">{w.url}</code>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", w.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>{w.status}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-6">
                    {w.events.map((ev) => <span key={ev} className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-600">{ev}</span>)}
                    <span className="ml-auto text-[10px] text-muted-foreground">Last delivery: {w.lastDelivery}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      )}

      {tab === "env" && (
        <StaggerItem index={0}>
          <SectionCard title="Environment Variables" subtitle="Production secrets & configuration" action={<button onClick={() => setShowSecret(!showSecret)} className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-accent">{showSecret ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Reveal</>}</button>}>
            <div className="space-y-2">
              {envVars.map((v) => (
                <div key={v.key} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                  <Key className="h-4 w-4 text-muted-foreground shrink-0" />
                  <code className="flex-1 font-mono text-xs">
                    <span className="font-semibold text-foreground">{v.key}</span>
                    <span className="text-muted-foreground"> = </span>
                    <span>{v.masked && !showSecret ? "••••••••••••••••" : v.value}</span>
                  </code>
                  <button onClick={() => toast.success("Copied to clipboard")} className="rounded-lg bg-muted p-1.5 hover:bg-accent"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      )}

      {tab === "info" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <StaggerItem index={0}>
            <SectionCard title="System Information" subtitle="Platform runtime details">
              <div className="space-y-2">
                {[
                  { label: "Platform Version", value: "v3.8.2" },
                  { label: "Next.js", value: "16.1.3" },
                  { label: "Database", value: "PostgreSQL 16.2" },
                  { label: "Cache", value: "Redis 7.2" },
                  { label: "CDN", value: "Cloudflare" },
                  { label: "Region", value: "ap-south-1 (Mumbai)" },
                  { label: "Instances", value: "8 (auto-scaled)" },
                  { label: "Uptime", value: "99.97% (30d)" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <span className="font-mono text-sm font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </StaggerItem>
          <StaggerItem index={1}>
            <SectionCard title="Service Status" subtitle="All systems">
              <div className="space-y-2">
                {[
                  { name: "Web Application", status: "Operational", icon: Server },
                  { name: "API Gateway", status: "Operational", icon: Code2 },
                  { name: "Database Cluster", status: "Operational", icon: Database },
                  { name: "Background Jobs", status: "Operational", icon: Terminal },
                  { name: "Backup Service", status: "Operational", icon: RefreshCw },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium">{s.name}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> {s.status}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </StaggerItem>
        </div>
      )}
    </div>
  )
}
