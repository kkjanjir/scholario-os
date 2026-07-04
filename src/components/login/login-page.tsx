"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { DEMO_ACCOUNTS, SCHOOL } from "@/lib/mock/data"
import { Logo, colorOf } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  GraduationCap, Shield, BookOpen, ArrowRight, User, Lock,
  Sparkles, Eye, EyeOff, Loader2, CheckCircle2, Mail, HeartHandshake,
} from "lucide-react"

const ROLE_ICON = {
  principal: Shield,
  teacher: GraduationCap,
  student: BookOpen,
  parent: HeartHandshake,
} as const

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-amber-50/30 dark:from-emerald-950/40 dark:via-slate-950 dark:to-violet-950/30" />
      {/* aurora blobs */}
      <div className="aurora-blob absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-emerald-400/30 blur-3xl dark:bg-emerald-600/20" />
      <div className="aurora-blob absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-teal-400/25 blur-3xl dark:bg-teal-600/15" style={{ animationDelay: "-6s" }} />
      <div className="aurora-blob absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-amber-300/25 blur-3xl dark:bg-violet-700/15" style={{ animationDelay: "-12s" }} />
      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* floating particles */}
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute bottom-[-10px] rounded-full bg-emerald-500/40 dark:bg-emerald-400/30"
          style={{
            left: `${(i * 4.5 + 3) % 100}%`,
            width: `${3 + (i % 4) * 2}px`,
            height: `${3 + (i % 4) * 2}px`,
            animation: `float-particle ${14 + (i % 7) * 2}s linear ${i * 0.7}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function LoginPage() {
  const login = useAppStore((s) => s.login)
  const setLoggingIn = useAppStore((s) => s.setLoggingIn)
  const loggingIn = useAppStore((s) => s.loggingIn)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [stage, setStage] = useState<"idle" | "loading" | "success">("idle")

  const account = useMemo(
    () => DEMO_ACCOUNTS.find((a) => a.username === username || a.role === selectedRole),
    [username, selectedRole]
  )

  function fillAccount(role: string) {
    const a = DEMO_ACCOUNTS.find((x) => x.role === role)!
    setSelectedRole(role)
    setUsername(a.username)
    setPassword(a.password)
  }

  function handleLogin() {
    const acc = DEMO_ACCOUNTS.find(
      (a) => a.username === username.trim().toLowerCase() && a.password === password
    )
    if (!acc) {
      toast.error("Invalid credentials", { description: "Try a demo credential card below." })
      return
    }
    setLoggingIn(true)
    setStage("loading")
    setTimeout(() => {
      setStage("success")
      setTimeout(() => {
        login({
          id: acc.role,
          name: acc.name,
          role: acc.role,
          email: acc.email,
          title: acc.title,
          teacherId: acc.role === "teacher" ? "tch_002" : undefined,
          studentId: acc.role === "student" ? "stu_1" : undefined,
        })
      }, 700)
    }, 1400)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AuroraBackground />

      {/* loading overlay */}
      <AnimatePresence>
        {stage !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Logo size={72} />
            </motion.div>
            {stage === "loading" ? (
              <div className="mt-8 flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  Authenticating into SCHOLARIO-OS…
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                <p className="text-sm font-semibold">Welcome, {account?.name.split(" ")[0]}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-4 py-10 lg:flex-row lg:items-stretch lg:gap-16">
        {/* Left — branding */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-1 flex-col justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 120, delay: 0.1 }}
            className="mb-6 flex items-center gap-3"
          >
            <Logo size={56} />
            <div>
              <p className="text-2xl font-bold tracking-tight">
                SCHOLARIO<span className="text-primary">-OS</span>
              </p>
              <p className="text-xs text-muted-foreground">School Operating System</p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="text-4xl font-bold leading-[1.1] tracking-tight lg:text-5xl"
          >
            The operating system
            <br />
            for <span className="text-gradient">modern schools.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-5 max-w-md text-base text-muted-foreground"
          >
            Admissions, academics, finance, attendance, examinations & analytics —
            unified in one beautifully crafted platform built for principals, teachers & students.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> CBSE Aligned
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {SCHOOL.session}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" /> Role-based access
            </span>
          </motion.div>

          {/* stats showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-10 grid grid-cols-3 gap-4 border-t border-border/40 pt-6"
          >
            {[
              { value: "1,004", label: "Students", icon: "👨‍🎓" },
              { value: "68", label: "Teachers", icon: "👩‍🏫" },
              { value: "50+", label: "Modules", icon: "⚙️" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl">{s.icon}</div>
                <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — login card */}
        <motion.div
          initial={{ opacity: 0, x: 24, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass-strong rounded-3xl border border-white/40 p-7 shadow-premium dark:border-white/10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Sign in to your workspace</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a role card or enter credentials manually.
              </p>
            </div>

            {/* credential cards */}
            <div className="mb-6 grid gap-2.5">
              {DEMO_ACCOUNTS.map((a, i) => {
                const Icon = ROLE_ICON[a.role]
                const c = colorOf(a.avatarColor)
                const active = selectedRole === a.role
                return (
                  <motion.button
                    key={a.role}
                    type="button"
                    onClick={() => fillAccount(a.role)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className={cn(
                      "group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-colors",
                      active
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/70 bg-card/60 hover:bg-card"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                        a.accent
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{a.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.title}</p>
                    </div>
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent"
                      )}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* divider */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/70" />
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">or enter manually</span>
              <div className="h-px flex-1 bg-border/70" />
            </div>

            {/* form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="principal / teacher / student"
                    className="h-11 w-full rounded-xl border border-border/70 bg-background/60 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-border/70 bg-background/60 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleLogin}
                disabled={loggingIn}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-glow transition-all disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
                {loggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign in to SCHOLARIO-OS
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </motion.button>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {SCHOOL.email}
              </span>
              <span>Need help? Contact IT desk</span>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo environment • All data is simulated • No real authentication
          </p>
        </motion.div>
      </div>
    </div>
  )
}
