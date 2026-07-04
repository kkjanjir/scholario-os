"use client"

import { useAppStore } from "@/lib/store"
import { AppShell } from "@/components/shared/app-shell"
import { PARENT_NAV } from "./nav"
import { ParentDashboard } from "./modules/dashboard"
import { ProgressModule } from "./modules/progress"
import { AttendanceModule } from "./modules/attendance"
import { ResultsModule } from "./modules/results"
import { MessagesModule } from "./modules/messages"
import { FeesModule } from "./modules/fees"
import { CalendarModule } from "./modules/calendar"
import { NoticesModule } from "./modules/notices"
import { TeachersModule } from "./modules/teachers"

export function ParentApp() {
  const activeModule = useAppStore((s) => s.parentModule)
  const setModule = useAppStore((s) => s.setModule)

  const render = () => {
    switch (activeModule) {
      case "dashboard": return <ParentDashboard />
      case "progress": return <ProgressModule />
      case "attendance": return <AttendanceModule />
      case "results": return <ResultsModule />
      case "messages": return <MessagesModule />
      case "fees": return <FeesModule />
      case "calendar": return <CalendarModule />
      case "notices": return <NoticesModule />
      case "teachers": return <TeachersModule />
      default: return <ParentDashboard />
    }
  }

  return (
    <AppShell
      role="parent"
      nav={PARENT_NAV}
      active={activeModule}
      moduleKey={activeModule}
      onSelect={(id) => setModule("parent", id)}
    >
      {render()}
    </AppShell>
  )
}
