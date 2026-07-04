"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, animate } from "framer-motion"

export function AnimatedCounter({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  const formatted =
    decimals > 0
      ? display.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.round(display).toLocaleString("en-IN")

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

export function PageTransition({ children, k }: { children: React.ReactNode; k: string }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-0"
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode
  index?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
