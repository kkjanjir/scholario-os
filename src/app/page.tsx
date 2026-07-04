"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { LoginPage } from "@/components/login/login-page"
import { PrincipalApp } from "@/components/principal/principal-app"
import { TeacherApp } from "@/components/teacher/teacher-app"
import { StudentApp } from "@/components/student/student-app"

export default function Home() {
  const user = useAppStore((s) => s.user)
  const theme = useAppStore((s) => s.theme)

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
          key={user.role}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {user.role === "principal" && <PrincipalApp />}
          {user.role === "teacher" && <TeacherApp />}
          {user.role === "student" && <StudentApp />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
