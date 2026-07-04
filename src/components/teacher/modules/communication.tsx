"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ANNOUNCEMENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Megaphone, Send, Pin, Reply, Bell, Check, Mail,
} from "lucide-react"

const SENT_MESSAGES = [
  { id: "m1", to: "Grade 10-A Parents", subject: "Maths Unit Test 2 — syllabus & marking scheme", date: "2025-11-30", read: 32, total: 38 },
  { id: "m2", to: "Grade 9-A Parents", subject: "PTM slot booking reminder — 13th December", date: "2025-11-28", read: 35, total: 40 },
  { id: "m3", to: "Grade 10-B Parents", subject: "Trigonometry homework submission deadline extended", date: "2025-11-25", read: 28, total: 36 },
]

const PARENT_REPLIES = [
  { id: "r1", parent: "Sharma Family", student: "Aarav Sharma", class: "Grade 10-A", message: "Sir, will there be a revision session before the pre-board exams?", time: "2h ago", unread: true },
  { id: "r2", parent: "Patel Family", student: "Diya Patel", class: "Grade 10-A", message: "Thank you for the test feedback, sir. We'll work on the geometry chapter at home.", time: "5h ago", unread: true },
  { id: "r3", parent: "Gupta Family", student: "Vivaan Gupta", class: "Grade 10-A", message: "Noted. We've scheduled daily practice for the next two weeks.", time: "1d ago", unread: false },
]

export function CommunicationModule() {
  const [messageOpen, setMessageOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication"
        description="Announcements, parent messages & notices"
        action={
          <Button onClick={() => setMessageOpen(true)} className="bg-amber-600 text-white hover:bg-amber-700">
            <Send className="h-4 w-4" /> Message Parents
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Announcements / Notice board */}
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard title="Notice Board" subtitle="School-wide announcements & circulars" bodyClassName="p-0">
            <div className="divide-y divide-border/40">
              {ANNOUNCEMENTS.map((a, i) => {
                const isHigh = a.priority === "high"
                const c = colorOf(isHigh ? "rose" : a.priority === "medium" ? "amber" : "slate")
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-5 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5 rounded-lg p-2", c.soft)}>
                        {isHigh ? <Pin className={cn("h-4 w-4", c.text)} /> : <Megaphone className={cn("h-4 w-4", c.text)} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">{a.title}</p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{a.date}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.body}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="rounded-md bg-accent/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{a.channel}</span>
                          <span className="text-[10px] text-muted-foreground">• {a.audience}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>

        {/* Parent replies */}
        <StaggerItem index={2}>
          <SectionCard
            title="Parent Replies"
            subtitle="2 unread"
            action={<span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">2 new</span>}
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/40">
              {PARENT_REPLIES.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-3"
                >
                  <div className="flex items-start gap-2.5">
                    <Avatar name={r.parent} color={r.unread ? "amber" : "slate"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {r.parent}
                          {r.unread && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />}
                        </p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{r.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{r.student} • {r.class}</p>
                      <p className="mt-1 line-clamp-2 text-xs">{r.message}</p>
                      <button
                        onClick={() => toast.success(`Reply sent to ${r.parent}`, { description: `Re: ${r.student}'s progress` })}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:underline dark:text-amber-300"
                      >
                        <Reply className="h-3 w-3" /> Reply
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Sent messages */}
      <StaggerItem index={3}>
        <SectionCard title="Sent Messages" subtitle="Your recent communication to parents" bodyClassName="p-0">
          <div className="divide-y divide-border/40">
            {SENT_MESSAGES.map((m, i) => {
              const pct = Math.round((m.read / m.total) * 100)
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      <Mail className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{m.subject}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{m.date}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">To: {m.to}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full bg-amber-500"
                          />
                        </div>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Check className="h-3 w-3 text-emerald-500" /> {m.read}/{m.total} read
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      <MessageParentsDialog open={messageOpen} onOpenChange={setMessageOpen} />
    </div>
  )
}

function MessageParentsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [className, setClassName] = useState("Grade 10-A")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const recipientCount = useMemo(() => {
    const counts: Record<string, number> = { "Grade 9-A": 40, "Grade 10-A": 38, "Grade 10-B": 36 }
    return counts[className] ?? 38
  }, [className])

  function send() {
    if (!subject.trim() || !message.trim()) { toast.error("Please complete subject & message"); return }
    onOpenChange(false)
    toast.success(`Message sent to ${recipientCount} parents`, {
      description: `"${subject}" → ${className}`,
    })
    setSubject(""); setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-4 w-4 text-amber-600" /> Message Parents
          </DialogTitle>
          <DialogDescription>Send a notification to all parents of a class.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Class</Label>
            <Select value={className} onValueChange={setClassName}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Grade 9-A", "Grade 10-A", "Grade 10-B"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Bell className="h-3 w-3" /> Will notify <b className="mx-0.5 text-amber-700 dark:text-amber-300">{recipientCount} parents</b> via SMS + app push
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="msg-subject">Subject</Label>
            <Input id="msg-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Unit Test 2 — syllabus update" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="msg-body">Message</Label>
            <Textarea id="msg-body" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Dear Parents, ..." />
            <p className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{message.length} characters</span>
              <span>{message.length > 160 ? "Multi-part SMS" : "Single SMS"}</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={send} className="bg-amber-600 text-white hover:bg-amber-700">
            <Send className="h-4 w-4" /> Send to {recipientCount} parents
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
