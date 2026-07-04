import { cn } from "@/lib/utils"

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string; soft: string; dot: string }> = {
  emerald: { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20", soft: "bg-emerald-500/10", dot: "bg-emerald-500" },
  teal: { bg: "bg-teal-500", text: "text-teal-600 dark:text-teal-400", ring: "ring-teal-500/20", soft: "bg-teal-500/10", dot: "bg-teal-500" },
  amber: { bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20", soft: "bg-amber-500/10", dot: "bg-amber-500" },
  orange: { bg: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", ring: "ring-orange-500/20", soft: "bg-orange-500/10", dot: "bg-orange-500" },
  rose: { bg: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/20", soft: "bg-rose-500/10", dot: "bg-rose-500" },
  violet: { bg: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-500/20", soft: "bg-violet-500/10", dot: "bg-violet-500" },
  fuchsia: { bg: "bg-fuchsia-500", text: "text-fuchsia-600 dark:text-fuchsia-400", ring: "ring-fuchsia-500/20", soft: "bg-fuchsia-500/10", dot: "bg-fuchsia-500" },
  sky: { bg: "bg-sky-500", text: "text-sky-600 dark:text-sky-400", ring: "ring-sky-500/20", soft: "bg-sky-500/10", dot: "bg-sky-500" },
  cyan: { bg: "bg-cyan-500", text: "text-cyan-600 dark:text-cyan-400", ring: "ring-cyan-500/20", soft: "bg-cyan-500/10", dot: "bg-cyan-500" },
  pink: { bg: "bg-pink-500", text: "text-pink-600 dark:text-pink-400", ring: "ring-pink-500/20", soft: "bg-pink-500/10", dot: "bg-pink-500" },
  lime: { bg: "bg-lime-500", text: "text-lime-600 dark:text-lime-400", ring: "ring-lime-500/20", soft: "bg-lime-500/10", dot: "bg-lime-500" },
  indigo: { bg: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400", ring: "ring-indigo-500/20", soft: "bg-indigo-500/10", dot: "bg-indigo-500" },
  slate: { bg: "bg-slate-500", text: "text-slate-600 dark:text-slate-400", ring: "ring-slate-500/20", soft: "bg-slate-500/10", dot: "bg-slate-500" },
}

export function colorOf(c: string) {
  return COLOR_MAP[c] || COLOR_MAP.emerald
}

export function Avatar({
  name,
  color = "emerald",
  size = "md",
  className,
}: {
  name: string
  color?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}) {
  const c = colorOf(color)
  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0",
        c.bg,
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  )
}

export function Logo({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="scholario-logo" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--primary)" />
          <stop offset="1" stopColor="color-mix(in oklch, var(--primary) 65%, oklch(0.7 0.18 70))" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#scholario-logo)" />
      <path d="M32 14 L50 22 L32 30 L14 22 Z" fill="white" fillOpacity="0.95" />
      <path d="M20 26 L20 38 Q32 46 44 38 L44 26" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M50 22 L50 34" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="50" cy="36" r="2.4" fill="white" />
    </svg>
  )
}

export function formatINR(n: number, compact = false) {
  if (compact) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
    return `₹${n}`
  }
  return `₹${n.toLocaleString("en-IN")}`
}
