"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { colorOf } from "@/components/shared/brand"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { cn } from "@/lib/utils"
import { Megaphone, Mail, MessageSquare, Bell, Send, Users, Clock, CheckCircle2, Smartphone } from "lucide-react"
import { toast } from "sonner"

export function CommunicationModule() {
  const [channel, setChannel] = useState<"email" | "sms" | "push">("email")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [target, setTarget] = useState("all-schools")

  const stats = { sent: 48230, delivered: 47120, opened: 32140, failed: 1110 }
  const history = [
    { id: "c1", title: "Winter Break Notice", channel: "Email", target: "All Schools • All Users", recipients: 184250, delivered: 182400, date: "2025-12-01", status: "Sent" },
    { id: "c2", title: "Scheduled Maintenance — Dec 5", channel: "SMS", target: "All Principals", recipients: 156, delivered: 156, date: "2025-11-30", status: "Sent" },
    { id: "c3", title: "New Feature: AI Performance Insights", channel: "Push", target: "Professional+ Schools", recipients: 9680, delivered: 9420, date: "2025-11-28", status: "Sent" },
    { id: "c4", title: "Payment Reminder — December", channel: "Email", target: "All Accountants", recipients: 128, delivered: 128, date: "2025-11-25", status: "Sent" },
  ]

  function send() {
    if (!subject.trim() || !body.trim()) { toast.error("Subject and body required"); return }
    toast.success(`Broadcast ${channel.toUpperCase()} sent to ${target}!`, { description: `${subject}` })
    setSubject(""); setBody("")
  }

  const CHANNEL_CFG = {
    email: { icon: Mail, color: "violet", label: "Email" },
    sms: { icon: MessageSquare, color: "emerald", label: "SMS" },
    push: { icon: Bell, color: "amber", label: "Push" },
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Global Communication" description="Broadcast messages across schools, roles, classes & individuals" />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-2.5"><Send className="h-5 w-5 text-violet-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Sent</p><p className="text-2xl font-bold"><AnimatedCounter value={stats.sent} /></p></div></StaggerItem>
        <StaggerItem index={1}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Delivered</p><p className="text-2xl font-bold text-emerald-600"><AnimatedCounter value={stats.delivered} /></p></div></StaggerItem>
        <StaggerItem index={2}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-sky-500/10 p-2.5"><Mail className="h-5 w-5 text-sky-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Opened</p><p className="text-2xl font-bold text-sky-600"><AnimatedCounter value={stats.opened} /></p></div></StaggerItem>
        <StaggerItem index={3}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-rose-500/10 p-2.5"><Megaphone className="h-5 w-5 text-rose-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Failed</p><p className="text-2xl font-bold text-rose-600"><AnimatedCounter value={stats.failed} /></p></div></StaggerItem>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* composer */}
        <StaggerItem index={1}>
          <SectionCard title="New Broadcast" subtitle="Send message to targeted audience">
            <div className="space-y-4">
              {/* channel selector */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">CHANNEL</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(CHANNEL_CFG) as [keyof typeof CHANNEL_CFG, typeof CHANNEL_CFG[keyof typeof CHANNEL_CFG]][]).map(([id, cfg]) => {
                    const Icon = cfg.icon
                    return (
                      <button key={id} onClick={() => setChannel(id)} className={cn("flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all", channel === id ? cn("border-primary bg-primary/5 ring-1 ring-primary/30", colorOf(cfg.color).text) : "border-border/60 hover:bg-accent")}>
                        <Icon className="h-4 w-4" /> {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              {/* target */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">TARGET AUDIENCE</label>
                <select value={target} onChange={(e) => setTarget(e.target.value)} className="h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50">
                  <option value="all-schools">All Schools • All Users (184K)</option>
                  <option value="all-principals">All Principals (156)</option>
                  <option value="all-teachers">All Teachers (12.4K)</option>
                  <option value="all-parents">All Parents (172K)</option>
                  <option value="enterprise">Enterprise Schools Only (42)</option>
                  <option value="trial">Trial Schools Only (18)</option>
                </select>
              </div>
              {/* subject */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">SUBJECT</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter subject…" className="h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50" />
              </div>
              {/* body */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">MESSAGE</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Type your message…" className="w-full resize-none rounded-xl border border-border/70 bg-background/60 p-3 text-sm outline-none focus:border-primary/50" />
              </div>
              {/* schedule */}
              <div className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <select className="flex-1 bg-transparent text-sm outline-none">
                  <option>Send Now</option>
                  <option>Schedule for later</option>
                  <option>Send in 1 hour</option>
                  <option>Send tomorrow 9 AM</option>
                </select>
              </div>
              <button onClick={send} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
                <Send className="h-4 w-4" /> Send Broadcast
              </button>
            </div>
          </SectionCard>
        </StaggerItem>

        {/* history */}
        <StaggerItem index={2}>
          <SectionCard title="Broadcast History" subtitle="Recent campaigns" bodyClassName="p-0">
            <div className="divide-y divide-border/40">
              {history.map((h) => {
                const c = colorOf(h.channel === "Email" ? "violet" : h.channel === "SMS" ? "emerald" : "amber")
                return (
                  <div key={h.id} className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", c.soft, c.text)}>{h.channel}</span>
                      <p className="flex-1 truncate text-sm font-medium">{h.title}</p>
                      <span className="text-[10px] text-muted-foreground">{h.date}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{h.target}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span><Users className="inline h-3 w-3" /> {h.recipients.toLocaleString("en-IN")} recipients</span>
                      <span className="text-emerald-600"><CheckCircle2 className="inline h-3 w-3" /> {h.delivered.toLocaleString("en-IN")} delivered</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}
