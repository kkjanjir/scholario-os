"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { DAILY_CHALLENGES, WEEKLY_QUESTS, type DailyChallenge } from "@/lib/mock/data"
import { triggerReward } from "@/components/shared/reward-notification"
import { cn } from "@/lib/utils"
import { Flame, Zap, Lock, CheckCircle2, Clock, Trophy, Star, Sparkles, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const TYPE_COLOR: Record<string, string> = {
  homework: "violet", quiz: "amber", attendance: "emerald", reading: "sky", practice: "rose",
}

export function ChallengesModule() {
  const [challenges, setChallenges] = useState(DAILY_CHALLENGES)
  const [claimed, setClaimed] = useState<Set<string>>(new Set())
  const [xpGained, setXpGained] = useState(0)
  const [burst, setBurst] = useState<string | null>(null)

  function claim(ch: DailyChallenge) {
    if (ch.status !== "completed" || claimed.has(ch.id)) return
    setClaimed((prev) => new Set(prev).add(ch.id))
    setXpGained((prev) => prev + ch.xp)
    setBurst(ch.id)
    setTimeout(() => setBurst(null), 1200)
    toast.success(`+${ch.xp} XP earned! 🎉`, { description: ch.title })
    // Trigger premium reward notification
    triggerReward({
      type: "xp",
      title: `+${ch.xp} XP Earned!`,
      desc: ch.title,
      icon: ch.icon,
      color: TYPE_COLOR[ch.type] || "violet",
    })
  }

  function startChallenge(ch: DailyChallenge) {
    if (ch.status === "locked") {
      toast.info("This challenge unlocks at Level 11")
      return
    }
    toast.info(`Started: ${ch.title}`)
  }

  const completedCount = challenges.filter((c) => c.status === "completed").length
  const totalXP = challenges.filter((c) => claimed.has(c.id)).reduce((a, c) => a + c.xp, 0)

  return (
    <div className="space-y-6">
      <PageHeader title="Daily Challenges" description="Complete challenges, earn XP & climb the ranks" />

      {/* XP earned banner */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 p-5 text-white shadow-premium">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-300/20 blur-2xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm ring-2 ring-white/20"
              >
                ⚡
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/80">XP Earned Today</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter value={totalXP + xpGained} />
                  <span className="text-lg text-white/70"> XP</span>
                </p>
                <p className="text-xs text-white/70">{completedCount} of {challenges.length} challenges completed</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm sm:flex">
              <Flame className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-medium">7-day streak</span>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* daily challenges */}
      <StaggerItem index={1}>
        <SectionCard title="Today's Challenges" subtitle="Resets at midnight • Complete to earn XP">
          <div className="grid gap-3 sm:grid-cols-2">
            {challenges.map((ch, i) => {
              const color = TYPE_COLOR[ch.type] || "violet"
              const c = colorOfHelper(color)
              const isCompleted = ch.status === "completed"
              const isLocked = ch.status === "locked"
              const isClaimed = claimed.has(ch.id)
              const progressPct = Math.round((ch.progress / ch.total) * 100)

              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border p-4 transition-all",
                    isCompleted ? cn("border-transparent", c.soft, "ring-1", c.ring) : isLocked ? "border-border/60 bg-muted/30 opacity-70" : "border-border/60 bg-card hover:shadow-premium"
                  )}
                >
                  {/* XP burst animation */}
                  {burst === ch.id && (
                    <motion.div
                      initial={{ opacity: 1, scale: 0.5, y: 0 }}
                      animate={{ opacity: 0, scale: 1.5, y: -60 }}
                      transition={{ duration: 1.2 }}
                      className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-amber-500"
                    >
                      +{ch.xp} XP!
                    </motion.div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl", isLocked ? "grayscale" : c.soft)}>
                      {ch.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">{ch.title}</p>
                        {isCompleted && <CheckCircle2 className={cn("h-4 w-4 shrink-0", c.text)} />}
                        {isLocked && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{ch.desc}</p>
                    </div>
                    <div className={cn("flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold", c.soft, c.text)}>
                      <Zap className="h-3 w-3" />
                      {ch.xp}
                    </div>
                  </div>

                  {/* progress bar */}
                  {!isLocked && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{ch.progress}/{ch.total}</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className={cn("h-full rounded-full", c.bg)}
                        />
                      </div>
                    </div>
                  )}

                  {/* action button */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className={cn("inline-flex items-center gap-1 text-[10px]", isLocked ? "text-muted-foreground" : "text-muted-foreground")}>
                      <Clock className="h-3 w-3" /> {ch.expires}
                    </span>
                    {isCompleted ? (
                      <button
                        onClick={() => claim(ch)}
                        disabled={isClaimed}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                          isClaimed ? "bg-muted text-muted-foreground" : "bg-amber-500 text-white shadow-sm hover:scale-105"
                        )}
                      >
                        {isClaimed ? (
                          <><CheckCircle2 className="h-3.5 w-3.5" /> Claimed</>
                        ) : (
                          <><Sparkles className="h-3.5 w-3.5" /> Claim {ch.xp} XP</>
                        )}
                      </button>
                    ) : isLocked ? (
                      <span className="text-xs text-muted-foreground">Locked</span>
                    ) : (
                      <button
                        onClick={() => startChallenge(ch)}
                        className={cn("inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", c.soft, c.text, "hover:opacity-80")}
                      >
                        Start <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* weekly quests */}
      <StaggerItem index={2}>
        <SectionCard title="Weekly Quests" subtitle="Bigger rewards • Resets every Monday">
          <div className="grid gap-3 lg:grid-cols-3">
            {WEEKLY_QUESTS.map((q, i) => {
              const pct = Math.round((q.progress / q.total) * 100)
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-2xl">{q.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{q.title}</p>
                      <p className="text-xs text-muted-foreground">{q.desc}</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-1 text-xs font-bold text-amber-600">
                      <Trophy className="h-3 w-3" /> {q.xp}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{q.progress}/{q.total}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.08 }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    </div>
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {q.daysLeft} days left
                  </p>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* rewards info */}
      <StaggerItem index={3}>
        <SectionCard title="How XP Works" subtitle="Earn XP from daily activities">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "📝", label: "Submit Homework", xp: "+50 XP", color: "violet" },
              { icon: "✅", label: "Perfect Attendance", xp: "+40 XP", color: "emerald" },
              { icon: "🎯", label: "Quiz Score 80%+", xp: "+60 XP", color: "amber" },
              { icon: "📚", label: "Library Book Read", xp: "+30 XP", color: "sky" },
            ].map((r, i) => {
              const c = colorOfHelper(r.color)
              return (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3"
                >
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className={cn("text-xs font-bold", c.text)}>{r.xp}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

function colorOfHelper(c: string) {
  return {
    violet: { soft: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-500/20", bg: "bg-violet-500" },
    amber: { soft: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20", bg: "bg-amber-500" },
    emerald: { soft: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20", bg: "bg-emerald-500" },
    sky: { soft: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", ring: "ring-sky-500/20", bg: "bg-sky-500" },
    rose: { soft: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/20", bg: "bg-rose-500" },
  }[c] || { soft: "bg-muted", text: "text-muted-foreground", ring: "ring-border", bg: "bg-muted" }
}
