"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface RewardEvent {
  id: string
  type: "xp" | "badge" | "level" | "streak"
  title: string
  desc: string
  icon: string
  color: string
}

// Global reward notification system — call triggerReward() to show
let listeners: ((e: RewardEvent) => void)[] = []

export function triggerReward(event: Omit<RewardEvent, "id">) {
  const full = { ...event, id: `r${Date.now()}` }
  listeners.forEach((l) => l(full))
}

export function RewardNotificationHost() {
  const [events, setEvents] = useState<RewardEvent[]>([])

  useEffect(() => {
    const listener = (e: RewardEvent) => {
      setEvents((prev) => [...prev, e])
      setTimeout(() => {
        setEvents((prev) => prev.filter((x) => x.id !== e.id))
      }, 4500)
    }
    listeners.push(listener)
    return () => { listeners = listeners.filter((l) => l !== listener) }
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {events.map((e) => (
          <RewardCard key={e.id} event={e} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function RewardCard({ event }: { event: RewardEvent }) {
  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    violet: { bg: "bg-violet-500", text: "text-violet-600", ring: "ring-violet-500/30" },
    amber: { bg: "bg-amber-500", text: "text-amber-600", ring: "ring-amber-500/30" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-600", ring: "ring-emerald-500/30" },
    rose: { bg: "bg-rose-500", text: "text-rose-600", ring: "ring-rose-500/30" },
    sky: { bg: "bg-sky-500", text: "text-sky-600", ring: "ring-sky-500/30" },
  }
  const c = colorMap[event.color] || colorMap.violet

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="pointer-events-auto relative w-80 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium"
    >
      {/* confetti particles */}
      <ConfettiBurst color={c.bg} />

      <div className="relative flex items-center gap-3 p-4">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
          className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ring-2", c.bg, c.ring)}
        >
          {event.icon}
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide", c.bg, "text-white")}>
              {event.type === "xp" ? "+XP" : event.type === "badge" ? "Badge" : event.type === "level" ? "Level Up" : "Streak"}
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] text-muted-foreground"
            >
              just now
            </motion.span>
          </div>
          <p className="mt-1 truncate text-sm font-bold">{event.title}</p>
          <p className="truncate text-xs text-muted-foreground">{event.desc}</p>
        </div>
      </div>

      {/* progress bar auto-dismiss */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4.5, ease: "linear" }}
        className={cn("h-0.5", c.bg)}
      />
    </motion.div>
  )
}

function ConfettiBurst({ color }: { color: string }) {
  const particles = Array.from({ length: 12 })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2
        const dist = 60 + (i % 3) * 20
        const x = Math.cos(angle) * dist
        const y = Math.sin(angle) * dist
        const colors = [color, "bg-amber-400", "bg-emerald-400", "bg-rose-400", "bg-sky-400"]
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x, y, opacity: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className={cn("absolute left-7 top-7 h-2 w-2 rounded-sm", colors[i % colors.length])}
          />
        )
      })}
    </div>
  )
}
