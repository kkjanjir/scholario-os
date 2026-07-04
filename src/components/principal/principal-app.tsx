"use client"

import { useAppStore } from "@/lib/store"
import { AppShell } from "@/components/shared/app-shell"
import { PRINCIPAL_NAV } from "./nav"
import { PrincipalDashboard } from "./modules/dashboard"
import { AdmissionModule } from "./modules/admission"
import { TeachersModule } from "./modules/teachers"
import { ClassesModule } from "./modules/classes"
import { AttendanceModule } from "./modules/attendance"
import { FeesModule } from "./modules/fees"
import { DefaultersModule } from "./modules/defaulters"
import { SalaryModule } from "./modules/salary"
import { ExaminationModule } from "./modules/examination"
import { HomeworkModule } from "./modules/homework"
import { AssignmentsModule } from "./modules/assignments"
import { AnalyticsModule } from "./modules/analytics"
import { AtRiskModule } from "./modules/atrisk"
import { CommunicationModule } from "./modules/communication"
import { CalendarModule } from "./modules/calendar"
import { LibraryModule } from "./modules/library"
import { TransportModule } from "./modules/transport"
import { InventoryModule } from "./modules/inventory"
import { CertificatesModule } from "./modules/certificates"
import { SettingsModule } from "./modules/settings"

export function PrincipalApp() {
  const activeModule = useAppStore((s) => s.principalModule)
  const setModule = useAppStore((s) => s.setModule)

  const render = () => {
    switch (activeModule) {
      case "dashboard": return <PrincipalDashboard />
      case "admission": return <AdmissionModule />
      case "teachers": return <TeachersModule />
      case "classes": return <ClassesModule />
      case "attendance": return <AttendanceModule />
      case "fees": return <FeesModule />
      case "defaulters": return <DefaultersModule />
      case "salary": return <SalaryModule />
      case "examination": return <ExaminationModule />
      case "homework": return <HomeworkModule />
      case "assignments": return <AssignmentsModule />
      case "analytics": return <AnalyticsModule />
      case "atrisk": return <AtRiskModule />
      case "communication": return <CommunicationModule />
      case "calendar": return <CalendarModule />
      case "library": return <LibraryModule />
      case "transport": return <TransportModule />
      case "inventory": return <InventoryModule />
      case "certificates": return <CertificatesModule />
      case "settings": return <SettingsModule />
      default: return <PrincipalDashboard />
    }
  }

  return (
    <AppShell
      role="principal"
      nav={PRINCIPAL_NAV}
      active={activeModule}
      moduleKey={activeModule}
      onSelect={(id) => setModule("principal", id)}
    >
      {render()}
    </AppShell>
  )
}
