"use client"

import { useAppStore } from "@/lib/store"
import { AppShell } from "@/components/shared/app-shell"
import { STUDENT_NAV } from "./nav"
import { StudentDashboard } from "./modules/dashboard"
import { ProfileModule } from "./modules/profile"
import { GamificationModule } from "./modules/gamification"
import { AttendanceModule } from "./modules/attendance"
import { HomeworkModule } from "./modules/homework"
import { AssignmentsModule } from "./modules/assignments"
import { ResultsModule } from "./modules/results"
import { FeesModule } from "./modules/fees"
import { TimetableModule } from "./modules/timetable"
import { CalendarModule } from "./modules/calendar"
import { AnnouncementsModule } from "./modules/announcements"

export function StudentApp() {
  const activeModule = useAppStore((s) => s.studentModule)
  const setModule = useAppStore((s) => s.setModule)

  const render = () => {
    switch (activeModule) {
      case "dashboard": return <StudentDashboard />
      case "profile": return <ProfileModule />
      case "gamification": return <GamificationModule />
      case "attendance": return <AttendanceModule />
      case "homework": return <HomeworkModule />
      case "assignments": return <AssignmentsModule />
      case "results": return <ResultsModule />
      case "fees": return <FeesModule />
      case "timetable": return <TimetableModule />
      case "calendar": return <CalendarModule />
      case "announcements": return <AnnouncementsModule />
      default: return <StudentDashboard />
    }
  }

  return (
    <AppShell
      role="student"
      nav={STUDENT_NAV}
      active={activeModule}
      moduleKey={activeModule}
      onSelect={(id) => setModule("student", id)}
    >
      {render()}
    </AppShell>
  )
}
