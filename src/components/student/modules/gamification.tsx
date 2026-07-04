"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { SimpleBar, SimpleLine } from "@/components/shared/charts"
import { ACHIEVEMENTS, LEADERBOARD, XP_HISTORY, STUDENT_LEVELS, STUDENTS, studentStreak } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { Trophy, Flame, Star, TrendingUp, TrendingDown, Minus, Zap, Lock, Sparkles, Crown, Medal } from "lucide-react"
import { toast } from "sonner"

export function GamificationModule() {
  const me = STUDENTS[0]
  const [selected, setSelected] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const streak = studentStreak(me.id)
  const currentStreak = streak.filter((d) => d.completed).length
  const myEntry = LEADERBOARD.find((e) => e.name === me.name)!
  const xp = myEntry.xp
  const level = myEntry.level
  const currentLevelInfo = STUDENT_LEVELS.filter((l) => l.level <= level).slice(-1)[0]
  const nextLevelInfo = STUDENT_LEVELS.find((l) => l.level > level)
  const xpInLevel = nextLevelInfo ? xp - currentLevelInfo.min : 0
  const xpForNext = nextLevelInfo ? nextLevelInfo.min - currentLevelInfo.min : 0
  const pct = nextLevelInfo ? Math.round((xpInLevel / xpForNext) * 100) : 100
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length

  return (
    <div className="space-y-6">
      <PageHeader title="Achievements & Progress" description="Level up, earn badges & climb the leaderboard" />

      {/* Level hero card */}
      <StaggerItem index={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 p-6 text-white shadow-premium lg:p-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 right-1/3 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm ring-4 ring-white/20"
              >
                <span className="text-5xl">{currentLevelInfo.icon}</span>
                <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-amber-900 shadow-lg">
                  {level}
                </span>
              </motion.div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                  <Sparkles className="h-3 w-3" /> Level {level} — {currentLevelInfo.title}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">{xp.toLocaleString("en-IN")} XP</h2>
                <p className="text-sm text-white/80">
                  {nextLevelInfo ? <>{nextLevelInfo.min - xp} XP to <b>Level {nextLevelInfo.level} — {nextLevelInfo.title}</b> {nextLevelInfo.icon}</> : "Max level reached! 👑"}
                </p>
                {nextLevelInfo && (
                  <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-white/20">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-100" />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center">
                <Flame className="mx-auto h-6 w-6 text-amber-300" />
                <p className="mt-1 text-2xl font-bold"><AnimatedCounter value={currentStreak} /></p>
                <p className="text-[10px] uppercase tracking-wide text-white/70">Day Streak</p>
              </div>
              <div className="text-center">
                <Trophy className="mx-auto h-6 w-6 text-amber-300" />
                <p className="mt-1 text-2xl font-bold"><AnimatedCounter value={unlocked} /></p>
                <p className="text-[10px] uppercase tracking-wide text-white/70">Badges</p>
              </div>
              <div className="text-center">
                <Trophy className="mx-auto h-6 w-6 text-amber-300" />
                <p className="mt-1 text-2xl font-bold">#{myEntry.rank}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/70">Class Rank</p>
              </div>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* streak + xp chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1}>
          <SectionCard title="Activity Streak" subtitle="Last 21 days">
            <div className="flex flex-wrap gap-1.5">
              {streak.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.15 }}
                  title={`${d.date} — ${d.completed ? d.type : "missed"}`}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                    d.type === "none" ? "bg-muted text-muted-foreground" :
                    d.completed && d.type === "homework" ? "bg-violet-500 text-white" :
                    d.completed && d.type === "attendance" ? "bg-emerald-500 text-white" :
                    d.completed && d.type === "quiz" ? "bg-amber-500 text-white" :
                    "bg-rose-500/80 text-white"
                  )}
                >
                  {d.completed ? "✓" : "·"}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-violet-500" /> Homework</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Attendance</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500" /> Quiz</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-rose-500/80" /> Missed</span>
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={2} className="lg:col-span-2">
          <SectionCard title="XP Earnings" subtitle="Weekly XP over last 8 weeks">
            <SimpleBar data={XP_HISTORY} dataKey="xp" color="oklch(0.6 0.21 300)" />
          </SectionCard>
        </StaggerItem>
      </div>

      {/* achievements grid */}
      <StaggerItem index={3}>
        <SectionCard title="Achievements" subtitle={`${unlocked} of ${ACHIEVEMENTS.length} unlocked`} action={<span className="text-xs text-muted-foreground">Tap a badge for details</span>}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ACHIEVEMENTS.map((a, i) => {
              const c = colorOf(a.color)
              return (
                <motion.button
                  key={a.id}
                  onClick={() => { setSelected(a); if (a.unlocked) toast.success(`Badge: ${a.title}!`) }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border p-4 text-center transition-colors",
                    a.unlocked ? cn("border-transparent shadow-premium", c.soft) : "border-border/60 bg-muted/30 opacity-70"
                  )}
                >
                  {a.unlocked && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-amber-300/40 to-transparent blur-xl"
                    />
                  )}
                  <div className="relative">
                    <span className={cn("text-4xl", !a.unlocked && "grayscale opacity-50")}>{a.icon}</span>
                    {!a.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className={cn("mt-2 text-sm font-bold", a.unlocked ? c.text : "text-muted-foreground")}>{a.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{a.desc}</p>
                  {!a.unlocked && a.progress !== undefined && a.total !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", c.bg)} style={{ width: `${(a.progress / a.total) * 100}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">{a.progress}/{a.total}</p>
                    </div>
                  )}
                  {a.unlocked && a.date && (
                    <p className="mt-1 text-[10px] text-muted-foreground/70">Unlocked {a.date.slice(5)}</p>
                  )}
                </motion.button>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* leaderboard */}
      <StaggerItem index={4}>
        <SectionCard title="Class Leaderboard" subtitle="Top performers in Grade 10 A • This month">
          <div className="space-y-2">
            {LEADERBOARD.map((e, i) => {
              const isMe = e.name === me.name
              const c = colorOf(e.avatarColor)
              return (
                <motion.div
                  key={e.rank}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 transition-colors",
                    isMe ? cn("border-primary/40 bg-primary/5 ring-1 ring-primary/20") : "border-border/60 bg-card/40 hover:bg-accent/30",
                    e.rank <= 3 && "shadow-sm"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                    e.rank === 1 ? "bg-amber-400 text-amber-900" :
                    e.rank === 2 ? "bg-slate-300 text-slate-700" :
                    e.rank === 3 ? "bg-orange-400 text-orange-900" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {e.rank <= 3 ? ["🥇", "🥈", "🥉"][e.rank - 1] : e.rank}
                  </div>
                  <Avatar name={e.name} color={e.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-medium", isMe && "text-primary font-bold")}>
                      {e.name} {isMe && <span className="text-[10px]">(You)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">Level {e.level} • {e.badges} badges</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {e.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                    {e.trend === "down" && <TrendingDown className="h-4 w-4 text-rose-500" />}
                    {e.trend === "same" && <Minus className="h-4 w-4 text-muted-foreground" />}
                    <div className="text-right">
                      <p className="text-sm font-bold">{e.xp.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-muted-foreground">XP</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* XP history + season leaderboard */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={5}>
          <SectionCard title="XP History" subtitle="Your XP growth over the term 📈">
            <SimpleLine data={XP_HISTORY.map((x, i) => ({ name: x.week, xp: x.xp, cumulative: XP_HISTORY.slice(0, i + 1).reduce((a, b) => a + b.xp, 0) }))} dataKey="cumulative" color="oklch(0.6 0.21 300)" height={260} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/40 p-2">
                <p className="text-[10px] text-muted-foreground">Total XP</p>
                <p className="text-sm font-bold text-violet-600">{XP_HISTORY.reduce((a, b) => a + b.xp, 0).toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2">
                <p className="text-[10px] text-muted-foreground">Weekly Avg</p>
                <p className="text-sm font-bold text-amber-600">{Math.round(XP_HISTORY.reduce((a, b) => a + b.xp, 0) / XP_HISTORY.length)}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2">
                <p className="text-[10px] text-muted-foreground">Best Week</p>
                <p className="text-sm font-bold text-emerald-600">{Math.max(...XP_HISTORY.map((x) => x.xp))}</p>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem index={6}>
          <SectionCard title="Season Leaderboard" subtitle="Top 3 this season 🏆" action={<button onClick={() => toast.info("Season ends in 12 days")} className="text-xs font-medium text-primary hover:underline">Season info</button>}>
            <div className="space-y-3">
              {/* Top 3 podium */}
              <div className="grid grid-cols-3 gap-2">
                {LEADERBOARD.slice(0, 3).map((e, i) => {
                  const podiumColors = ["from-amber-400 to-amber-600", "from-slate-300 to-slate-500", "from-orange-400 to-orange-600"]
                  const medals = ["🥇", "🥈", "🥉"]
                  const isMe = e.name === me.name
                  return (
                    <motion.div
                      key={e.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                      className={cn("flex flex-col items-center rounded-2xl border p-4 text-center", i === 0 ? "border-amber-500/40 bg-amber-500/5 order-1 pt-6" : i === 1 ? "border-slate-400/40 bg-slate-400/5 order-0" : "border-orange-500/40 bg-orange-500/5 order-2 pt-4")}
                    >
                      <span className="text-3xl">{medals[i]}</span>
                      <Avatar name={e.name} color={e.avatarColor} size="sm" className={cn("mt-2", isMe && "ring-2 ring-primary")} />
                      <p className={cn("mt-1.5 truncate text-xs font-bold", isMe && "text-primary")}>{e.name.split(" ")[0]}{isMe && " (You)"}</p>
                      <p className="text-[10px] text-muted-foreground">Lvl {e.level}</p>
                      <p className="mt-1 text-sm font-bold">{e.xp.toLocaleString("en-IN")}</p>
                      <p className="text-[9px] text-muted-foreground">XP</p>
                    </motion.div>
                  )
                })}
              </div>
              {/* My rank highlight */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <p className="text-xs font-semibold">Your Season Rank</p>
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">#{myEntry.rank}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">You're {LEADERBOARD[myEntry.rank - 2].xp - myEntry.xp} XP away from #{myEntry.rank - 1}! Keep going 💪</p>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* achievement detail dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium">
              <div className={cn("flex flex-col items-center p-8 text-center", selected.unlocked ? colorOf(selected.color).soft : "bg-muted")}>
                <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }} className={cn("flex h-24 w-24 items-center justify-center rounded-3xl text-6xl", selected.unlocked ? "" : "grayscale opacity-50")}>
                  {selected.icon}
                </motion.div>
                <p className={cn("mt-4 text-xl font-bold", selected.unlocked ? colorOf(selected.color).text : "text-muted-foreground")}>{selected.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{selected.desc}</p>
              </div>
              <div className="p-5">
                {selected.unlocked ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
                    <Star className="h-4 w-4 fill-current" />
                    Unlocked on {selected.date}
                  </div>
                ) : (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Zap className="h-4 w-4 text-amber-500" /> Progress</span>
                      <span className="font-semibold">{selected.progress}/{selected.total}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${((selected.progress || 0) / (selected.total || 1)) * 100}%` }} transition={{ duration: 0.8 }} className={cn("h-full rounded-full", colorOf(selected.color).bg)} />
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">Keep going to unlock this badge!</p>
                  </div>
                )}
                <button onClick={() => setSelected(null)} className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
