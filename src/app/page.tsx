"use client"

import { useEffect, lazy, Suspense } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { LoginPage } from "@/components/login/login-page"

// Lazy load role apps to reduce memory during compilation
const PrincipalApp = lazy(() => import("@/components/principal/principal-app").then(m => ({ default: m.PrincipalApp })))
const TeacherApp = lazy(() => import("@/components/teacher/teacher-app").then(m => ({ default: m.TeacherApp })))
const StudentApp = lazy(() => import("@/components/student/student-app").then(m => ({ default: m.StudentApp })))
const ParentApp = lazy(() => import("@/components/parent/parent-app").then(m => ({ default: m.ParentApp })))
const SuperAdminApp = lazy(() => import("@/components/superadmin/superadmin-app").then(m => ({ default: m.SuperAdminApp })))

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export default function Home() {
  const user = useAppStore((s) => s.user)
  const theme = useAppStore((s) => s.theme)
  const impersonating = useAppStore((s) => s.impersonating)
  const controlPlaneSchoolId = useAppStore((s) => s.controlPlaneSchoolId)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        >
          <LoginPage />
        </motion.div>
      ) : (
        <motion.div
          key={impersonating ? "impersonating" : user.role}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Suspense fallback={<LoadingScreen />}>
            {(impersonating || controlPlaneSchoolId || user.role === "superadmin") && <SuperAdminApp />}
            {!impersonating && !controlPlaneSchoolId && user.role === "principal" && <PrincipalApp />}
            {!impersonating && !controlPlaneSchoolId && user.role === "teacher" && <TeacherApp />}
            {!impersonating && !controlPlaneSchoolId && user.role === "student" && <StudentApp />}
            {!impersonating && !controlPlaneSchoolId && user.role === "parent" && <ParentApp />}
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
