"use client"

import { motion } from "framer-motion"
import { lazy, Suspense } from "react"
import { useAppStore } from "@/lib/store"
import { Avatar } from "@/components/shared/brand"
import { ArrowLeft, Eye } from "lucide-react"
import { toast } from "sonner"

// Lazy load to reduce memory
const PrincipalApp = lazy(() => import("@/components/principal/principal-app").then(m => ({ default: m.PrincipalApp })))
const TeacherApp = lazy(() => import("@/components/teacher/teacher-app").then(m => ({ default: m.TeacherApp })))
const StudentApp = lazy(() => import("@/components/student/student-app").then(m => ({ default: m.StudentApp })))
const ParentApp = lazy(() => import("@/components/parent/parent-app").then(m => ({ default: m.ParentApp })))

export function ImpersonationBanner() {
  const impersonating = useAppStore((s) => s.impersonating)!
  const stopImpersonation = useAppStore((s) => s.stopImpersonation)

  const role = impersonating.role
  const RoleApp = role === "principal" ? PrincipalApp : role === "teacher" ? TeacherApp : role === "student" ? StudentApp : role === "parent" ? ParentApp : PrincipalApp

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-[100] flex items-center gap-3 border-b border-amber-500/40 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-white shadow-lg"
      >
        <Eye className="h-4 w-4 shrink-0" />
        <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
          <span className="font-bold hidden sm:inline">IMPERSONATING:</span>
          <Avatar name={impersonating.name} color={impersonating.avatarColor} size="xs" />
          <span className="font-medium truncate">{impersonating.name}</span>
          <span className="hidden text-white/80 sm:inline">• {impersonating.title}</span>
          <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold md:inline">PREVIEW MODE</span>
        </div>
        <span className="hidden text-xs text-white/80 lg:inline">All actions logged • No real changes persisted</span>
        <button
          onClick={() => { stopImpersonation(); toast.success("Returned to Super Admin") }}
          className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Return to Super Admin</span><span className="sm:hidden">Exit</span>
        </button>
      </motion.div>
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
        <RoleApp />
      </Suspense>
    </div>
  )
}
