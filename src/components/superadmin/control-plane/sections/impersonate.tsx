"use client"

import { motion } from "framer-motion"
import { useAppStore, type SessionUser, type Role } from "@/lib/store"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { type School } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import {
  Shield, GraduationCap, BookOpen, HeartHandshake, User,
  Calculator, Phone, Library, Bus, Users2, Briefcase, AlertTriangle,
  Eye, ArrowRight, CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

const ROLES: { id: Role | string; label: string; icon: any; color: string; desc: string }[] = [
  { id: "principal", label: "Principal", icon: Shield, color: "emerald", desc: "Full school control center" },
  { id: "teacher", label: "Teacher", icon: GraduationCap, color: "amber", desc: "Attendance, homework, marks" },
  { id: "student", label: "Student", icon: BookOpen, color: "violet", desc: "Timetable, results, gamification" },
  { id: "parent", label: "Parent", icon: HeartHandshake, color: "cyan", desc: "Child progress & communication" },
  { id: "receptionist", label: "Receptionist", icon: Phone, color: "sky", desc: "Visitor management, front desk" },
  { id: "accountant", label: "Accountant", icon: Calculator, color: "teal", desc: "Fees, invoices, payroll" },
  { id: "librarian", label: "Librarian", icon: Library, color: "rose", desc: "Book catalog, issue/return" },
  { id: "transport", label: "Transport Manager", icon: Bus, color: "orange", desc: "Routes, vehicles, GPS" },
  { id: "hr", label: "HR", icon: Briefcase, color: "fuchsia", desc: "Staff management, recruitment" },
  { id: "staff", label: "Staff", icon: Users2, color: "slate", desc: "General staff access" },
]

export function ImpersonateSection({ school }: { school: School }) {
  const startImpersonation = useAppStore((s) => s.startImpersonation)

  function impersonate(role: typeof ROLES[0]) {
    const user: SessionUser = {
      id: `imp-${role.id}`,
      name: role.label === "Principal" ? "Dr. Anjali Deshpande" : `${role.label} User`,
      role: (["principal", "teacher", "student", "parent"].includes(role.id) ? role.id : "principal") as Role,
      email: `${role.id}@${school.domain}`,
      title: role.label,
      avatarColor: role.color,
    }
    startImpersonation(user)
    toast.success(`Now viewing as ${role.label}`, { description: "Return to Super Admin anytime using the banner" })
  }

  return (
    <div className="space-y-6">
      {/* Warning banner */}
      <StaggerItem index={0}>
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Administrative Preview Mode</p>
              <p className="text-xs text-muted-foreground">Impersonation allows the Super Admin to preview exactly how a role experiences this school. All actions are logged. A banner will clearly indicate you are impersonating. No real changes are persisted.</p>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Role grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r, i) => {
          const c = colorOf(r.color)
          const Icon = r.icon
          const supported = ["principal", "teacher", "student", "parent"].includes(r.id)
          return (
            <StaggerItem key={r.id} index={i + 1}>
              <motion.button
                onClick={() => impersonate(r)}
                whileHover={{ y: -4 }}
                className="w-full rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium transition-colors hover:bg-accent/20"
              >
                <div className="flex items-start justify-between">
                  <div className={cn("rounded-xl p-3", c.soft)}><Icon className={cn("h-6 w-6", c.text)} /></div>
                  {supported ? <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600">READY</span> : <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground">PREVIEW</span>}
                </div>
                <p className="mt-3 text-sm font-bold">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                  <Eye className="h-3.5 w-3.5" /> Open as {r.label} <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.button>
            </StaggerItem>
          )
        })}
      </div>

      {/* How it works */}
      <StaggerItem index={ROLES.length + 1}>
        <SectionCard title="How Impersonation Works" subtitle="Safe administrative preview">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Eye, color: "violet", title: "1. Select Role", desc: "Choose any role to preview" },
              { icon: Shield, color: "amber", title: "2. Banner Shown", desc: "Clear indicator you're impersonating" },
              { icon: CheckCircle2, color: "emerald", title: "3. Return Anytime", desc: "Click 'Return to Super Admin' to exit" },
            ].map((s) => {
              const c = colorOf(s.color)
              return (
                <div key={s.title} className="rounded-xl border border-border/60 p-4">
                  <div className={cn("mb-2 inline-flex rounded-lg p-2", c.soft)}><s.icon className={cn("h-4 w-4", c.text)} /></div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}
