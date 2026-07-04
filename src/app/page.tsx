"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { LoginPage } from "@/components/login/login-page"
import { PrincipalApp } from "@/components/principal/principal-app"
import { TeacherApp } from "@/components/teacher/teacher-app"
import { StudentApp } from "@/components/student/student-app"
import { ParentApp } from "@/components/parent/parent-app"
import { SuperAdminApp } from "@/components/superadmin/superadmin-app"

export default function Home() {
  const user = useAppStore((s) => s.user)
  const theme = useAppStore((s) => s.theme)
  const impersonating = useAppStore((s) => s.impersonating)
  const controlPlaneSchoolId = useAppStore((s) => s.controlPlaneSchoolId)

  // apply theme + role attribute to <html>
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
          {/* If impersonating or in control plane, always route through SuperAdminApp */}
          {(impersonating || controlPlaneSchoolId || user.role === "superadmin") && <SuperAdminApp />}
          {!impersonating && !controlPlaneSchoolId && user.role === "principal" && <PrincipalApp />}
          {!impersonating && !controlPlaneSchoolId && user.role === "teacher" && <TeacherApp />}
          {!impersonating && !controlPlaneSchoolId && user.role === "student" && <StudentApp />}
          {!impersonating && !controlPlaneSchoolId && user.role === "parent" && <ParentApp />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
