"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock as ClockIcon } from "lucide-react"

type SecondsMode = "smooth" | "tick1" | "tick2" | "highFreq"

// ═══════════════════════════════════════════════
// Compact Analog Clock — transparent background, header-sized
// ═══════════════════════════════════════════════
const HeaderAnalogClock = memo(function HeaderAnalogClock({
  size = 32,
  timeZone = "Asia/Calcutta",
  secondsMode = "smooth" as SecondsMode,
}: {
  size?: number
  timeZone?: string
  secondsMode?: SecondsMode
}) {
  const [time, setTime] = useState(new Date())
  const hourHandRef = useRef<HTMLDivElement>(null)
  const minuteHandRef = useRef<HTMLDivElement>(null)
  const secondHandRef = useRef<HTMLDivElement>(null)

  const updateClockHands = useCallback(() => {
    const now = new Date()
    const displayTime = new Date(now.toLocaleString("en-US", { timeZone }))
    setTime(displayTime)

    const hours = displayTime.getHours() % 12
    const minutes = displayTime.getMinutes()
    const seconds = displayTime.getSeconds()
    const milliseconds = displayTime.getMilliseconds()

    const hoursDegrees = hours * 30 + (minutes / 60) * 30
    const minutesDegrees = minutes * 6 + (seconds / 60) * 0.1

    if (hourHandRef.current) hourHandRef.current.style.transform = `rotate(${hoursDegrees}deg)`
    if (minuteHandRef.current) minuteHandRef.current.style.transform = `rotate(${minutesDegrees}deg)`

    let secondsAngle = 0
    switch (secondsMode) {
      case "tick1": secondsAngle = seconds * 6; break
      case "tick2": secondsAngle = Math.floor((seconds * 1000 + milliseconds) / 500) * 3; break
      case "highFreq": secondsAngle = ((seconds * 1000 + milliseconds) / 125) * 0.75; break
      case "smooth":
      default: secondsAngle = seconds * 6 + (milliseconds / 1000) * 6; break
    }
    if (secondHandRef.current) secondHandRef.current.style.transform = `rotate(${secondsAngle}deg)`
  }, [secondsMode, timeZone])

  useEffect(() => {
    updateClockHands()
    let rafId: number
    const animate = () => { updateClockHands(); rafId = requestAnimationFrame(animate) }
    animate()
    return () => cancelAnimationFrame(rafId)
  }, [updateClockHands])

  const center = size / 2
  // Scale factors relative to the original 350px design
  const scale = size / 350

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Analog clock showing ${time.toLocaleTimeString("en-IN", { timeZone })}`}
    >
      {/* Hour marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const radius = size * 0.38
        const left = center + Math.sin(angle) * radius
        const top = center - Math.cos(angle) * radius
        return (
          <div
            key={`mark-${i}`}
            className="absolute rounded-full bg-foreground/30"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${Math.max(1.5, 3 * scale)}px`,
              height: `${Math.max(1.5, 3 * scale)}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )
      })}

      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border"
        style={{
          borderColor: "color-mix(in oklch, var(--foreground) 15%, transparent)",
          borderWidth: `${Math.max(1, 1.5 * scale)}px`,
        }}
      />

      {/* Hour hand */}
      <div
        ref={hourHandRef}
        className="absolute rounded-full"
        style={{
          width: `${Math.max(1.5, 3 * scale)}px`,
          height: `${size * 0.22}px`,
          left: `${center - Math.max(0.75, 1.5 * scale)}px`,
          top: `${center - size * 0.22}px`,
          transformOrigin: `center ${size * 0.22}px`,
          backgroundColor: "var(--foreground)",
          opacity: 0.7,
        }}
      />

      {/* Minute hand */}
      <div
        ref={minuteHandRef}
        className="absolute rounded-full"
        style={{
          width: `${Math.max(1, 2 * scale)}px`,
          height: `${size * 0.30}px`,
          left: `${center - Math.max(0.5, 1 * scale)}px`,
          top: `${center - size * 0.30}px`,
          transformOrigin: `center ${size * 0.30}px`,
          backgroundColor: "var(--foreground)",
          opacity: 0.7,
        }}
      />

      {/* Second hand */}
      <div
        ref={secondHandRef}
        className="absolute rounded-full"
        style={{
          width: `${Math.max(0.5, 1 * scale)}px`,
          height: `${size * 0.34}px`,
          left: `${center - Math.max(0.25, 0.5 * scale)}px`,
          top: `${center - size * 0.34}px`,
          transformOrigin: `center ${size * 0.34}px`,
          backgroundColor: "var(--primary)",
        }}
      />

      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${Math.max(2, 4 * scale)}px`,
          height: `${Math.max(2, 4 * scale)}px`,
          left: `${center - Math.max(1, 2 * scale)}px`,
          top: `${center - Math.max(1, 2 * scale)}px`,
          backgroundColor: "var(--primary)",
        }}
      />
    </div>
  )
})

// ═══════════════════════════════════════════════
// Digital Clock — compact text
// ═══════════════════════════════════════════════
function DigitalClock({ timeZone = "Asia/Calcutta" }: { timeZone?: string }) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(new Date(now.toLocaleString("en-US", { timeZone })))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [timeZone])

  const h = time.getHours()
  const m = time.getMinutes().toString().padStart(2, "0")
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12

  return (
    <div className="flex items-center gap-1.5 px-1">
      <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-xs font-medium tabular-nums text-muted-foreground">
        {h12}:{m} <span className="text-[10px]">{ampm}</span>
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════
// Topbar Clock — toggle between digital & analog in-place
// ═══════════════════════════════════════════════
export function TopbarClock() {
  const [mode, setMode] = useState<"digital" | "analog">("digital")

  return (
    <button
      onClick={() => setMode((m) => (m === "digital" ? "analog" : "digital"))}
      className="flex items-center justify-center rounded-lg px-1.5 transition-colors hover:bg-accent/60"
      title={mode === "digital" ? "Switch to analog clock" : "Switch to digital clock"}
      style={{ height: "32px", minWidth: "32px" }}
    >
      <AnimatePresence mode="wait">
        {mode === "digital" ? (
          <motion.div
            key="digital"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <DigitalClock />
          </motion.div>
        ) : (
          <motion.div
            key="analog"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeaderAnalogClock size={30} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
