"use client"

import { useAppStore } from "@/lib/store"
import { AppShell } from "@/components/shared/app-shell"
import { SUPERADMIN_NAV } from "./nav"
import { lazy, Suspense } from "react"

// Lazy load ALL modules to reduce Turbopack memory
const SuperAdminDashboard = lazy(() => import("./modules/dashboard").then(m => ({ default: m.SuperAdminDashboard })))
const SchoolsModule = lazy(() => import("./modules/schools").then(m => ({ default: m.SchoolsModule })))
const FeatureFlagsModule = lazy(() => import("./modules/feature-flags").then(m => ({ default: m.FeatureFlagsModule })))
const BillingModule = lazy(() => import("./modules/billing").then(m => ({ default: m.BillingModule })))
const MonitoringModule = lazy(() => import("./modules/monitoring").then(m => ({ default: m.MonitoringModule })))
const SecurityModule = lazy(() => import("./modules/security").then(m => ({ default: m.SecurityModule })))
const CommunicationModule = lazy(() => import("./modules/communication").then(m => ({ default: m.CommunicationModule })))
const WhiteLabelModule = lazy(() => import("./modules/whitelabel").then(m => ({ default: m.WhiteLabelModule })))
const SupportModule = lazy(() => import("./modules/support").then(m => ({ default: m.SupportModule })))
const DeveloperModule = lazy(() => import("./modules/developer").then(m => ({ default: m.DeveloperModule })))
const SchoolControlPlane = lazy(() => import("./control-plane/school-control-plane").then(m => ({ default: m.SchoolControlPlane })))
const ImpersonationBanner = lazy(() => import("./impersonation-banner").then(m => ({ default: m.ImpersonationBanner })))

function Loading() {
  return <div className="flex h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
}

export function SuperAdminApp() {
  const activeModule = useAppStore((s) => s.superadminModule)
  const setModule = useAppStore((s) => s.setModule)
  const controlPlaneSchoolId = useAppStore((s) => s.controlPlaneSchoolId)
  const impersonating = useAppStore((s) => s.impersonating)

  if (impersonating) {
    return <Suspense fallback={<Loading />}><ImpersonationBanner /></Suspense>
  }

  if (controlPlaneSchoolId) {
    return <Suspense fallback={<Loading />}><SchoolControlPlane /></Suspense>
  }

  const modules: Record<string, React.ComponentType> = {
    dashboard: SuperAdminDashboard,
    schools: SchoolsModule,
    "feature-flags": FeatureFlagsModule,
    billing: BillingModule,
    monitoring: MonitoringModule,
    security: SecurityModule,
    communication: CommunicationModule,
    whitelabel: WhiteLabelModule,
    support: SupportModule,
    developer: DeveloperModule,
  }

  const ActiveModule = modules[activeModule] || SuperAdminDashboard

  return (
    <AppShell
      role="superadmin"
      nav={SUPERADMIN_NAV}
      active={activeModule}
      moduleKey={activeModule}
      onSelect={(id) => setModule("superadmin", id)}
    >
      <Suspense fallback={<Loading />}>
        <ActiveModule />
      </Suspense>
    </AppShell>
  )
}
