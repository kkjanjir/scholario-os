"use client"

import { useAppStore } from "@/lib/store"
import { AppShell } from "@/components/shared/app-shell"
import { TEACHER_NAV } from "./nav"
import { TeacherDashboard } from "./modules/dashboard"
import { AttendanceModule } from "./modules/attendance"
import { HomeworkModule } from "./modules/homework"
import { AssignmentsModule } from "./modules/assignments"
import { MarksModule } from "./modules/marks"
import { StudentsModule } from "./modules/students"
import { TimetableModule } from "./modules/timetable"
import { CommunicationModule } from "./modules/communication"
import { AnalyticsModule } from "./modules/analytics"
import { LessonsModule } from "./modules/lessons"
import { TeacherChatModule } from "./modules/chat"

export function TeacherApp() {
  const activeModule = useAppStore((s) => s.teacherModule)
  const setModule = useAppStore((s) => s.setModule)

  const render = () => {
    switch (activeModule) {
      case "dashboard": return <TeacherDashboard />
      case "attendance": return <AttendanceModule />
      case "homework": return <HomeworkModule />
      case "assignments": return <AssignmentsModule />
      case "marks": return <MarksModule />
      case "students": return <StudentsModule />
      case "timetable": return <TimetableModule />
      case "communication": return <CommunicationModule />
      case "analytics": return <AnalyticsModule />
      case "lessons": return <LessonsModule />
      case "chat": return <TeacherChatModule />
      default: return <TeacherDashboard />
    }
  }

  return (
    <AppShell
      role="teacher"
      nav={TEACHER_NAV}
      active={activeModule}
      moduleKey={activeModule}
      onSelect={(id) => setModule("teacher", id)}
    >
      {render()}
    </AppShell>
  )
}
