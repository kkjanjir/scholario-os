"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { PARENT_MESSAGES } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { Search, Send, Reply, Mail, MailOpen, Star } from "lucide-react"
import { toast } from "sonner"

export function MessagesModule() {
  const [selected, setSelected] = useState(PARENT_MESSAGES[0])
  const [search, setSearch] = useState("")
  const [replyOpen, setReplyOpen] = useState(false)
  const [reply, setReply] = useState("")

  const filtered = PARENT_MESSAGES.filter((m) => m.subject.toLowerCase().includes(search.toLowerCase()) || m.from.toLowerCase().includes(search.toLowerCase()))
  const unread = PARENT_MESSAGES.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Communication from teachers & school office" />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* message list */}
        <StaggerItem index={0} className="lg:col-span-1">
          <SectionCard title="Inbox" subtitle={`${unread} unread`} bodyClassName="p-0">
            <div className="border-b border-border/60 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages…"
                  className="h-9 w-full rounded-lg border border-border/70 bg-background/60 pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="max-h-[500px] divide-y divide-border/40 overflow-y-auto scroll-area">
              {filtered.map((m) => {
                const c = colorOf(m.role === "Teacher" ? "amber" : "cyan")
                return (
                  <button
                    key={m.id}
                    onClick={() => { setSelected(m); setReplyOpen(false) }}
                    className={cn("flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40", selected.id === m.id && "bg-primary/5")}
                  >
                    <div className="relative">
                      <Avatar name={m.from} color={m.role === "Teacher" ? "amber" : "cyan"} size="sm" />
                      {!m.read && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-primary ring-2 ring-card" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("truncate text-sm", m.read ? "font-medium" : "font-bold")}>{m.from}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{m.date.slice(5)}</span>
                      </div>
                      <p className={cn("truncate text-xs", m.read ? "text-muted-foreground" : "text-foreground font-medium")}>{m.subject}</p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{m.body}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </SectionCard>
        </StaggerItem>

        {/* message detail */}
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard bodyClassName="p-0">
            <AnimatePresence mode="wait">
              <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <div className="border-b border-border/60 p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={selected.from} color={selected.role === "Teacher" ? "amber" : "cyan"} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{selected.from}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", colorOf(selected.role === "Teacher" ? "amber" : "cyan").soft, colorOf(selected.role === "Teacher" ? "amber" : "cyan").text)}>{selected.role}</span>
                        {selected.priority === "high" && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{selected.date} • To: Suresh Sharma</p>
                      <h3 className="mt-2 text-lg font-semibold">{selected.subject}</h3>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => toast.success("Marked as important")} className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-foreground/90">{selected.body}</p>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/90">Please feel free to reach out if you have any questions or would like to discuss this further. We value your partnership in {`Aarav's`} education.</p>
                  <p className="mt-4 text-sm text-muted-foreground">Regards,<br />{selected.from}</p>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/20 p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setReplyOpen(!replyOpen); setReply("") }}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
                    >
                      <Reply className="h-4 w-4" /> Reply
                    </button>
                    <button onClick={() => toast.success("Forwarded")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm font-medium hover:bg-accent">
                      <Send className="h-4 w-4" /> Forward
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {selected.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />} {selected.read ? "Read" : "Unread"}
                  </div>
                </div>
                <AnimatePresence>
                  {replyOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border/60">
                      <div className="p-4">
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder={`Reply to ${selected.from}…`}
                          rows={4}
                          className="w-full resize-none rounded-xl border border-border/70 bg-background/60 p-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button onClick={() => { setReplyOpen(false); setReply("") }} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
                          <button
                            onClick={() => { toast.success(`Reply sent to ${selected.from}!`); setReply(""); setReplyOpen(false) }}
                            disabled={!reply.trim()}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                          >
                            <Send className="h-4 w-4" /> Send Reply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}
