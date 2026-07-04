"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Megaphone, MessageSquare, Mail, Bell, ClipboardList,
  Send, Smartphone, Flag, AlertCircle, CheckCircle2, CheckIcon,
} from "lucide-react"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, StatusBadge, KpiCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import { ANNOUNCEMENTS, SCHOOL } from "@/lib/mock/data"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Announcement {
  id: string
  title: string
  body: string
  date: string
  priority: "high" | "medium" | "low"
  channel: string
  audience: string
  channels?: string[]
}

const PRIORITY_MAP = {
  high: { label: "High", color: "rose", icon: Flag },
  medium: { label: "Medium", color: "amber", icon: AlertCircle },
  low: { label: "Low", color: "emerald", icon: CheckCircle2 },
}

const CHANNEL_OPTIONS = [
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "email", label: "Email", icon: Mail },
  { id: "push", label: "Push", icon: Bell },
  { id: "notice", label: "Notice Board", icon: ClipboardList },
]

export function CommunicationModule() {
  const [list, setList] = useState<Announcement[]>(ANNOUNCEMENTS as Announcement[])
  const [createOpen, setCreateOpen] = useState(false)

  const latest = list[0]

  const handleCreate = (data: {
    title: string
    body: string
    audience: string
    channels: string[]
    priority: "high" | "medium" | "low"
  }) => {
    const newA: Announcement = {
      id: `a_${Date.now()}`,
      title: data.title,
      body: data.body,
      date: new Date().toISOString().slice(0, 10),
      priority: data.priority,
      channel: data.channels.length > 1 ? "Multi-channel" : CHANNEL_OPTIONS.find((c) => c.id === data.channels[0])?.label || "All",
      audience: data.audience,
      channels: data.channels,
    }
    setList((prev) => [newA, ...prev])
    setCreateOpen(false)
    toast.success("Announcement published", {
      description: `Sent via ${data.channels.length} channel(s) to ${data.audience}`,
    })
  }

  const totalSent = list.length
  const highPriority = list.filter((a) => a.priority === "high").length
  const smsCount = list.filter((a) => (a.channels || []).includes("sms")).length + 8
  const emailCount = list.filter((a) => (a.channels || []).includes("email")).length + 14

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication Center"
        description="Announcements, notifications & multi-channel messaging"
        action={
          <Button onClick={() => setCreateOpen(true)} className="shadow-premium">
            <Plus className="h-4 w-4" /> New Announcement
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Sent" value={totalSent} icon={Megaphone} color="emerald" />
        <KpiCard index={1} label="High Priority" value={highPriority} icon={Flag} color="rose" />
        <KpiCard index={2} label="SMS Dispatched" value={smsCount} icon={Smartphone} color="violet" />
        <KpiCard index={3} label="Emails Sent" value={emailCount} icon={Mail} color="sky" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={0} className="lg:col-span-2">
          <SectionCard
            title="Announcements"
            subtitle={`${list.length} total · sorted by recent`}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {list.map((a, i) => {
                const p = PRIORITY_MAP[a.priority]
                const Icon = p.icon
                const c = colorOf(p.color)
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex gap-3 px-5 py-4 transition-colors hover:bg-accent/30"
                  >
                    <div className={cn("mt-0.5 rounded-lg p-2 ring-1", c.soft, c.ring)}>
                      <Icon className={cn("h-4 w-4", c.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{a.title}</p>
                        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", c.soft, c.text)}>
                          {p.label}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.body}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Megaphone className="h-3 w-3" /> {a.channel}</span>
                        <span className="inline-flex items-center gap-1"><Send className="h-3 w-3" /> {a.audience}</span>
                        <span className="ml-auto">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={1}>
          <SectionCard title="Notice Board" subtitle="Latest on display" bodyClassName="p-0">
            <div className="divide-y divide-border/50 max-h-[280px] overflow-y-auto">
              {list.slice(0, 5).map((a) => (
                <div key={a.id} className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      a.priority === "high" ? "bg-rose-500" : a.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                    )} />
                    <p className="flex-1 truncate text-sm font-medium">{a.title}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 pl-3.5 text-xs text-muted-foreground">{a.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={2}>
          <SmsPreview announcement={latest} />
        </StaggerItem>
        <StaggerItem index={3}>
          <EmailPreview announcement={latest} />
        </StaggerItem>
        <StaggerItem index={4}>
          <PushPreview announcement={latest} />
        </StaggerItem>
      </div>

      <CreateAnnouncementDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
    </div>
  )
}

function CreateAnnouncementDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (data: { title: string; body: string; audience: string; channels: string[]; priority: "high" | "medium" | "low" }) => void
}) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [audience, setAudience] = useState("Everyone")
  const [channels, setChannels] = useState<string[]>(["notice", "push"])
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")

  const toggleChannel = (id: string) => {
    setChannels((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }

  const submit = () => {
    if (!title || !body) {
      toast.error("Title and body are required")
      return
    }
    if (channels.length === 0) {
      toast.error("Select at least one channel")
      return
    }
    onCreate({ title, body, audience, channels, priority })
    setTitle(""); setBody(""); setAudience("Everyone"); setChannels(["notice", "push"]); setPriority("medium")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>New Announcement</DialogTitle>
          <DialogDescription>Compose & dispatch across multiple channels.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Holiday Notice — 25 December" />
          </div>

          <div className="grid gap-2">
            <Label>Body</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the announcement message…" rows={4} />
            <p className="text-right text-xs text-muted-foreground">{body.length} characters {body.length > 160 && channels.includes("sms") && "· SMS will be split"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Everyone">Everyone</SelectItem>
                  <SelectItem value="All Students">All Students</SelectItem>
                  <SelectItem value="All Parents">All Parents</SelectItem>
                  <SelectItem value="Parents + Students">Parents + Students</SelectItem>
                  <SelectItem value="Teachers">Teachers</SelectItem>
                  <SelectItem value="Grade 10 & 12">Grade 10 & 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Channels</Label>
            <div className="grid grid-cols-2 gap-2">
              {CHANNEL_OPTIONS.map((c) => {
                const Icon = c.icon
                const checked = channels.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleChannel(c.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                      checked ? "border-primary bg-primary/5 text-primary" : "border-border/60 bg-card hover:bg-accent/30"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                        checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
                      )}
                    >
                      {checked && <CheckIcon className="h-3 w-3" />}
                    </span>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{c.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Priority Level</Label>
            <RadioGroup value={priority} onValueChange={(v) => setPriority(v as any)} className="grid grid-cols-3 gap-2">
              {(["high", "medium", "low"] as const).map((p) => {
                const cfg = PRIORITY_MAP[p]
                const c = colorOf(cfg.color)
                return (
                  <label
                    key={p}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                      priority === p ? cn("border-current", c.soft, c.text) : "border-border/60 hover:bg-accent/30"
                    )}
                  >
                    <RadioGroupItem value={p} />
                    <cfg.icon className="h-4 w-4" />
                    <span className="font-medium">{cfg.label}</span>
                  </label>
                )
              })}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>
            <Send className="h-4 w-4" /> Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SmsPreview({ announcement }: { announcement: Announcement }) {
  const c = colorOf("violet")
  return (
    <SectionCard title="SMS Preview" subtitle="Phone mockup" bodyClassName="flex justify-center">
      <div className="relative w-full max-w-[260px] rounded-[2rem] border-4 border-slate-800 bg-slate-900 p-3 shadow-premium dark:border-slate-700">
        <div className="absolute left-1/2 top-1 h-1.5 w-12 -translate-x-1/2 rounded-full bg-slate-700" />
        <div className="mt-3 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">SVM School</p>
          <p className="text-xs text-slate-500">{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-2xl rounded-tl-sm bg-violet-500 p-3 text-white"
        >
          <p className="text-[11px] leading-relaxed">
            <span className="font-semibold">SVM Alert:</span> {announcement?.title}. {announcement?.body.slice(0, 90)}…
          </p>
          <p className="mt-1 text-right text-[9px] text-white/70">From SVM-SCHOLARIO</p>
        </motion.div>
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5">
          <MessageSquare className={cn("h-3 w-3", c.text)} />
          <span className="text-[10px] text-slate-400">Reply STOP to opt-out</span>
        </div>
      </div>
    </SectionCard>
  )
}

function EmailPreview({ announcement }: { announcement: Announcement }) {
  return (
    <SectionCard title="Email Preview" subtitle="Inbox card">
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-premium">
        <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5">
              <Mail className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold">Sri Vidya Mandir</p>
              <p className="text-[10px] text-muted-foreground">office@srividya-mandir.edu.in</p>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        </div>
        <div className="p-4">
          <p className="text-sm font-bold">{announcement?.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Dear Parents & Students,
            <br /><br />
            {announcement?.body}
            <br /><br />
            Warm regards,
            <br />
            <span className="font-medium text-foreground">{SCHOOL.principal}</span>
            <br />
            <span className="text-muted-foreground">Principal, {SCHOOL.shortName}</span>
          </p>
          <div className="mt-3 flex gap-1.5">
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">School Notice</span>
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">{announcement?.priority}</span>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function PushPreview({ announcement }: { announcement: Announcement }) {
  const p = announcement ? PRIORITY_MAP[announcement.priority] : PRIORITY_MAP.medium
  const c = colorOf(p.color)
  return (
    <SectionCard title="Push Notification" subtitle="Mobile notification card">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl p-3.5 shadow-premium"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">SVM School</p>
              <span className="text-[10px] text-muted-foreground">now</span>
            </div>
            <p className="mt-0.5 text-sm font-semibold leading-snug">{announcement?.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{announcement?.body}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-t border-border/40 pt-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Priority: {p.label}
          </span>
          <Button size="sm" variant="ghost" className="ml-auto h-6 px-2 text-[10px]">View</Button>
        </div>
      </motion.div>
    </SectionCard>
  )
}
