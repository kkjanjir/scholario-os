"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { DEPLOYMENT_STEPS, type School } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { Globe, Rocket, CheckCircle2, Loader2, Server, GitBranch, Shield, Activity } from "lucide-react"
import { toast } from "sonner"

export function DeploymentSection({ school }: { school: School }) {
  const [deploying, setDeploying] = useState(false)
  const [deployStep, setDeployStep] = useState(0)
  const [deployed, setDeployed] = useState(false)

  function deploy() {
    setDeploying(true); setDeployed(false); setDeployStep(0)
    let i = 0
    const interval = setInterval(() => { i++; setDeployStep(i); if (i >= DEPLOYMENT_STEPS.length) { clearInterval(interval); setDeploying(false); setDeployed(true) } }, 600)
  }

  return (
    <div className="space-y-6">
      {/* Domain config */}
      <StaggerItem index={0}>
        <SectionCard title="Domain Configuration" subtitle="School access URL & DNS">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-sky-500" /><span className="text-sm font-semibold">Primary Domain</span></div>
              <p className="mt-1 font-mono text-sm text-primary">{school.domain}</p>
              <p className="mt-1 text-xs text-muted-foreground">Type: Scholario Subdomain</p>
            </div>
            <div className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /><span className="text-sm font-semibold">SSL Certificate</span></div>
              <p className="mt-1 text-sm font-medium text-emerald-600">Active • Auto-renewed</p>
              <p className="text-xs text-muted-foreground">Expires in 89 days</p>
            </div>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Environment */}
      <StaggerItem index={1}>
        <SectionCard title="Environment" subtitle="Deployment environment configuration">
          <div className="grid gap-3 sm:grid-cols-3">
            {[{ env: "Production", status: "Active", color: "emerald", url: school.domain }, { env: "Staging", status: "Available", color: "amber", url: `staging.${school.domain}` }, { env: "Preview", status: "Idle", color: "slate", url: `preview.${school.domain}` }].map((e) => {
              const c = colorOf(e.color)
              return (
                <div key={e.env} className={cn("rounded-xl border-2 p-4", e.env === "Production" ? cn(c.ring, c.soft, "ring-1") : "border-border/60")}>
                  <div className="flex items-center justify-between"><span className="text-sm font-semibold">{e.env}</span><span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", c.soft, c.text)}>{e.status}</span></div>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">{e.url}</p>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Deploy button */}
      <StaggerItem index={2}>
        <div className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-premium">
          {!deploying && !deployed && (
            <>
              <Rocket className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-2 text-lg font-semibold">Deploy School</p>
              <p className="text-sm text-muted-foreground">Re-deploy the school with latest configuration. Takes ~30 seconds.</p>
              <button onClick={deploy} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105"><Rocket className="h-4 w-4" /> Deploy Now</button>
            </>
          )}
          {deploying && (
            <div>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-lg font-semibold">Deploying…</p>
              <div className="mx-auto mt-4 max-w-md space-y-2 text-left">
                {DEPLOYMENT_STEPS.map((s, i) => {
                  const done = i < deployStep; const active = i === deployStep
                  return <div key={s.id} className={cn("flex items-center gap-3 rounded-lg p-2", active && "bg-primary/5")}>{done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : active ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <div className="h-5 w-5 rounded-full border-2 border-muted" />}<span className={cn("text-sm", done ? "" : active ? "font-medium" : "text-muted-foreground")}>{s.label}</span></div>
                })}
              </div>
            </div>
          )}
          {deployed && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500"><CheckCircle2 className="h-10 w-10 text-white" /></div>
              <p className="mt-2 text-lg font-bold">Deployment Successful!</p>
              <p className="text-sm text-muted-foreground">{school.name} is live at {school.domain}</p>
              <button onClick={() => { setDeployed(false); setDeployStep(0) }} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Done</button>
            </motion.div>
          )}
        </div>
      </StaggerItem>

      {/* Deployment history */}
      <StaggerItem index={3}>
        <SectionCard title="Deployment History" subtitle="Recent deployments" bodyClassName="p-0">
          <div className="divide-y divide-border/40">
            {[
              { version: "v3.8.2", env: "Production", user: "Arjun Mehta", time: "2 hours ago", status: "Success" },
              { version: "v3.8.1", env: "Staging", user: "System", time: "Yesterday", status: "Success" },
              { version: "v3.8.0", env: "Production", user: "Arjun Mehta", time: "3 days ago", status: "Success" },
              { version: "v3.7.9", env: "Production", user: "System", time: "1 week ago", status: "Rolled back" },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1"><p className="text-sm font-medium font-mono">{d.version}</p><p className="text-xs text-muted-foreground">{d.env} • {d.user} • {d.time}</p></div>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", d.status === "Success" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>{d.status}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
