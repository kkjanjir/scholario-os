"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock as ClockIcon } from "lucide-react"

export function TopbarClock() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground/70 transition-all hover:bg-accent/60 hover:text-foreground"
        title="View clock"
      >
        <ClockIcon className="h-3.5 w-3.5" />
        <span className="hidden tabular-nums sm:inline" id="topbar-digital-clock">--:--</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-12 z-50 overflow-hidden rounded-3xl border border-border/60 bg-popover shadow-premium-xl"
            >
              <div className="scale-[0.55] origin-top-right -translate-x-[78px] -translate-y-[78px]">
                <LazyAnalogClock />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Lazy load the heavy analog clock only when needed
import { lazy, Suspense } from "react"
const AnalogClock = lazy(() => import("@/components/ui/clock").then(m => ({ default: m.Clock })))

function LazyAnalogClock() {
  return (
    <Suspense fallback={<div className="flex h-[350px] w-[350px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <AnalogClock />
    </Suspense>
  )
}

// Digital clock updater — lightweight, runs in topbar
export function DigitalClockUpdater() {
  // This component doesn't render anything visible — it just updates the topbar text
  useState(() => {
    const update = () => {
      const now = new Date()
      const displayTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Calcutta" }))
      const el = document.getElementById("topbar-digital-clock")
      if (el) {
        const h = displayTime.getHours()
        const m = displayTime.getMinutes().toString().padStart(2, "0")
        const ampm = h >= 12 ? "PM" : "AM"
        const h12 = h % 12 || 12
        el.textContent = `${h12}:${m} ${ampm}`
      }
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  })
  return null
}
