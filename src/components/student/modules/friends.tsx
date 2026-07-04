"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { STUDENT_FRIENDS, FRIEND_REQUESTS, ENCOURAGEMENTS_RECEIVED, ENCOURAGEMENT_EMOJIS, ENCOURAGEMENT_MESSAGES, STUDENTS, LEADERBOARD } from "@/lib/mock/data"
import { triggerReward } from "@/components/shared/reward-notification"
import { cn } from "@/lib/utils"
import {
  Users, UserPlus, TrendingUp, TrendingDown, Minus, Flame, Trophy,
  Send, Check, X, Heart, Zap, Sparkles,
} from "lucide-react"
import { toast } from "sonner"

const STATUS_CONFIG = {
  online: { color: "emerald", dot: "bg-emerald-500", label: "Online" },
  "in-class": { color: "amber", dot: "bg-amber-500", label: "In Class" },
  offline: { color: "slate", dot: "bg-slate-400", label: "Offline" },
} as const

export function FriendsModule() {
  const me = STUDENTS[0]
  const myEntry = LEADERBOARD.find((e) => e.name === me.name)!
  const [friends, setFriends] = useState(STUDENT_FRIENDS)
  const [requests, setRequests] = useState(FRIEND_REQUESTS)
  const [encourageOpen, setEncourageOpen] = useState<string | null>(null)
  const [selectedEmoji, setSelectedEmoji] = useState(ENCOURAGEMENT_EMOJIS[0])
  const [selectedMsg, setSelectedMsg] = useState(ENCOURAGEMENT_MESSAGES[0])

  function acceptRequest(req: typeof FRIEND_REQUESTS[0]) {
    setRequests((prev) => prev.filter((r) => r.id !== req.id))
    setFriends((prev) => [...prev, {
      id: `f${Date.now()}`, name: req.name, avatarColor: req.avatarColor, level: req.level,
      xp: req.level * 400, status: "online", streak: 1, badges: req.level, trend: "up",
      lastActive: "Online now", classRank: 8,
    }])
    toast.success(`${req.name} is now your friend! 🎉`)
    triggerReward({
      type: "badge",
      title: "New Friend!",
      desc: `You are now friends with ${req.name}`,
      icon: "🤝",
      color: "emerald",
    })
  }

  function sendEncouragement(friendName: string) {
    toast.success(`${selectedEmoji} Encouragement sent to ${friendName}!`, {
      description: selectedMsg,
    })
    triggerReward({
      type: "xp",
      title: "+10 XP — Helping Hand!",
      desc: `You encouraged ${friendName}`,
      icon: selectedEmoji,
      color: "emerald",
    })
    setEncourageOpen(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Friends" description="Connect, compare & encourage your classmates" />

      {/* my stats vs friends banner */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 p-5 text-white shadow-premium">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={me.name} color="violet" size="lg" className="ring-4 ring-white/30" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/80">Your Stats</p>
                <p className="text-xl font-bold">Level {myEntry.level} • {myEntry.xp.toLocaleString("en-IN")} XP</p>
                <p className="text-sm text-white/80">Rank #{myEntry.rank} • {friends.length} friends</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold"><AnimatedCounter value={friends.length} /></p>
                <p className="text-[10px] uppercase text-white/70">Friends</p>
              </div>
              <div>
                <p className="text-2xl font-bold"><AnimatedCounter value={friends.filter((f) => f.status === "online").length} /></p>
                <p className="text-[10px] uppercase text-white/70">Online</p>
              </div>
              <div>
                <p className="text-2xl font-bold"><AnimatedCounter value={requests.length} /></p>
                <p className="text-[10px] uppercase text-white/70">Requests</p>
              </div>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* friend requests */}
      {requests.length > 0 && (
        <StaggerItem index={1}>
          <SectionCard title="Friend Requests" subtitle={`${requests.length} pending`}>
            <div className="space-y-2">
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-3"
                >
                  <Avatar name={req.name} color={req.avatarColor} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{req.name}</p>
                    <p className="text-xs text-muted-foreground">Level {req.level} • {req.mutualFriends} mutual friends • {req.date}</p>
                  </div>
                  <button
                    onClick={() => acceptRequest(req)}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept
                  </button>
                  <button
                    onClick={() => { setRequests((prev) => prev.filter((r) => r.id !== req.id)); toast.info("Request declined") }}
                    className="rounded-lg bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      )}

      {/* friends list with XP comparison */}
      <StaggerItem index={2}>
        <SectionCard title="Your Friends" subtitle="Compare XP & encourage each other">
          <div className="space-y-3">
            {friends.map((f, i) => {
              const c = colorOf(f.avatarColor)
              const sc = STATUS_CONFIG[f.status]
              const xpDiff = myEntry.xp - f.xp
              const isAhead = xpDiff > 0
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-3 transition-colors hover:bg-accent/20"
                >
                  <div className="relative">
                    <Avatar name={f.name} color={f.avatarColor} size="md" />
                    <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-card", sc.dot)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{f.name}</p>
                      <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium", colorOf(sc.color).soft, colorOf(sc.color).text)}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-0.5"><Trophy className="h-3 w-3" /> Lvl {f.level}</span>
                      <span className="inline-flex items-center gap-0.5"><Flame className="h-3 w-3 text-amber-500" /> {f.streak}d</span>
                      <span>Rank #{f.classRank}</span>
                      <span className="hidden sm:inline">{f.lastActive}</span>
                    </div>
                  </div>
                  {/* XP comparison */}
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-bold">{f.xp.toLocaleString("en-IN")}</p>
                    <p className={cn("flex items-center justify-end gap-0.5 text-[10px] font-medium", isAhead ? "text-emerald-600" : "text-rose-600")}>
                      {f.trend === "up" && <TrendingUp className="h-2.5 w-2.5" />}
                      {f.trend === "down" && <TrendingDown className="h-2.5 w-2.5" />}
                      {f.trend === "same" && <Minus className="h-2.5 w-2.5" />}
                      {isAhead ? `+${xpDiff}` : `${xpDiff}`} XP
                    </p>
                  </div>
                  <button
                    onClick={() => setEncourageOpen(f.name)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-violet-500/10 px-2.5 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-500/20 dark:text-violet-400"
                  >
                    <Heart className="h-3.5 w-3.5" /> Encourage
                  </button>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* encouragements received */}
      <StaggerItem index={3}>
        <SectionCard title="Encouragements Received" subtitle="Cheers from your friends 💝">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENCOURAGEMENTS_RECEIVED.map((e, i) => {
              const c = colorOf(e.avatarColor)
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border/60 bg-card/40 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Avatar name={e.from} color={e.avatarColor} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{e.from}</p>
                      <p className="text-[10px] text-muted-foreground">{e.time}</p>
                    </div>
                    <span className="text-2xl">{e.emoji}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/90">{e.message}</p>
                  <button
                    onClick={() => toast.success(`Sent a ${e.emoji} back to ${e.from}!`)}
                    className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", c.text, "hover:underline")}
                  >
                    <Sparkles className="h-3 w-3" /> Send {e.emoji} back
                  </button>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* encouragement dialog */}
      <AnimatePresence>
        {encourageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={() => setEncourageOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium"
            >
              <div className="border-b border-border/60 p-5">
                <h2 className="text-lg font-semibold">Send Encouragement</h2>
                <p className="text-xs text-muted-foreground">To {encourageOpen} • Earn +10 XP for being supportive!</p>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">CHOOSE EMOJI</label>
                  <div className="flex flex-wrap gap-2">
                    {ENCOURAGEMENT_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all",
                          selectedEmoji === emoji ? "bg-primary/15 ring-2 ring-primary/40 scale-110" : "bg-muted hover:bg-accent"
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">CHOOSE MESSAGE</label>
                  <div className="space-y-1.5">
                    {ENCOURAGEMENT_MESSAGES.map((msg) => (
                      <button
                        key={msg}
                        onClick={() => setSelectedMsg(msg)}
                        className={cn(
                          "w-full rounded-xl border p-2.5 text-left text-sm transition-all",
                          selectedMsg === msg ? "border-primary/40 bg-primary/5" : "border-border/60 hover:bg-accent/30"
                        )}
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border/60 p-5">
                <button onClick={() => setEncourageOpen(null)} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
                <button
                  onClick={() => sendEncouragement(encourageOpen)}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
                >
                  <Send className="h-4 w-4" /> Send {selectedEmoji}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
