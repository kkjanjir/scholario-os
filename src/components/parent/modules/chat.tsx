"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { Avatar, colorOf } from "@/components/shared/brand"
import { CHAT_THREADS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { Send, Search, Phone, Video, MoreVertical, CheckCheck, Check, Circle, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export function ChatModule() {
  const [threads, setThreads] = useState(CHAT_THREADS)
  const [activeId, setActiveId] = useState(CHAT_THREADS[0].id)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [search, setSearch] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeThread = threads.find((t) => t.id === activeId)!
  const filteredThreads = threads.filter((t) =>
    t.teacherName.toLowerCase().includes(search.toLowerCase()) ||
    t.teacherSubject.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeThread.messages, isTyping])

  function sendMessage() {
    if (!input.trim()) return
    const newMsg = {
      id: `m${Date.now()}`,
      sender: "parent" as const,
      name: "Suresh Sharma",
      text: input.trim(),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, newMsg], lastMessage: newMsg.text, lastTime: newMsg.time }
          : t
      )
    )
    setInput("")

    // Simulate teacher typing + reply
    setTimeout(() => setIsTyping(true), 800)
    setTimeout(() => {
      setIsTyping(false)
      const replies = [
        "Thank you for the update, Mr. Sharma. I appreciate your involvement.",
        "Noted. Let's work together to ensure Aarav continues improving.",
        "That's wonderful to hear! Aarav is a bright student.",
        "I'll keep an eye on his progress. Feel free to reach out anytime.",
        "Great! Please remind him about the upcoming assignment deadline.",
      ]
      const reply = {
        id: `m${Date.now() + 1}`,
        sender: "teacher" as const,
        name: activeThread.teacherName,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        read: true,
      }
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeId
            ? { ...t, messages: [...t.messages, reply], lastMessage: reply.text, lastTime: reply.time }
            : t
        )
      )
    }, 2400)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Chat" description="Real-time messaging with your child's teachers" />

      <div className="grid gap-4 lg:grid-cols-3" style={{ minHeight: "560px" }}>
        {/* threads list */}
        <div className="lg:col-span-1">
          <SectionCard title="Conversations" subtitle={`${threads.length} teachers`} bodyClassName="p-0">
            <div className="border-b border-border/60 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search teachers…"
                  className="h-9 w-full rounded-lg border border-border/70 bg-background/60 pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="max-h-[460px] divide-y divide-border/40 overflow-y-auto scroll-area">
              {filteredThreads.map((t) => {
                const c = colorOf(t.teacherName.includes("Rajesh") ? "amber" : t.teacherName.includes("Meera") ? "rose" : "teal")
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className={cn("flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40", activeId === t.id && "bg-primary/5")}
                  >
                    <div className="relative">
                      <Avatar name={t.teacherName} color={t.teacherName.includes("Rajesh") ? "amber" : t.teacherName.includes("Meera") ? "rose" : "teal"} size="md" />
                      <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-card", c.bg)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{t.teacherName}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{t.lastTime}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{t.teacherSubject} • {t.studentName}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="flex-1 truncate text-xs text-muted-foreground">{t.lastMessage}</p>
                        {t.unread > 0 && (
                          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                            {t.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </SectionCard>
        </div>

        {/* chat window */}
        <div className="lg:col-span-2">
          <SectionCard bodyClassName="p-0" className="flex h-full flex-col">
            {/* chat header */}
            <div className="flex items-center gap-3 border-b border-border/60 p-4">
              <Avatar name={activeThread.teacherName} color={activeThread.teacherName.includes("Rajesh") ? "amber" : activeThread.teacherName.includes("Meera") ? "rose" : "teal"} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{activeThread.teacherName}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online • {activeThread.teacherSubject}
                </p>
              </div>
              <button onClick={() => toast.success(`Calling ${activeThread.teacherName}…`)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Phone className="h-4 w-4" />
              </button>
              <button onClick={() => toast.info("Video call started")} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Video className="h-4 w-4" />
              </button>
              <button onClick={() => toast.info("More options")} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* messages */}
            <div className="flex-1 space-y-3 overflow-y-auto scroll-area bg-muted/20 p-4" style={{ minHeight: "360px", maxHeight: "400px" }}>
              <div className="flex justify-center">
                <span className="rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">Today</span>
              </div>
              <AnimatePresence>
                {activeThread.messages.map((m) => {
                  const isParent = m.sender === "parent"
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className={cn("flex items-end gap-2", isParent ? "justify-end" : "justify-start")}
                    >
                      {!isParent && <Avatar name={m.name} color={m.name.includes("Rajesh") ? "amber" : m.name.includes("Meera") ? "rose" : "teal"} size="xs" />}
                      <div className={cn("max-w-[70%] rounded-2xl px-3.5 py-2 text-sm shadow-sm", isParent ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-card border border-border/60")}>
                        <p className="leading-relaxed">{m.text}</p>
                        <div className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", isParent ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {m.time}
                          {isParent && (m.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2"
                  >
                    <Avatar name={activeThread.teacherName} color={activeThread.teacherName.includes("Rajesh") ? "amber" : activeThread.teacherName.includes("Meera") ? "rose" : "teal"} size="xs" />
                    <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-card px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* input */}
            <div className="border-t border-border/60 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="h-11 flex-1 rounded-xl border border-border/70 bg-background/60 px-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow transition-all disabled:opacity-40 disabled:shadow-none"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                🔒 Messages are private between you and the teacher • Replies are simulated
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
