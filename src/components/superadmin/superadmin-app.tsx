"use client"

import { useAppStore } from "@/lib/store"
import { AppShell } from "@/components/shared/app-shell"
import { SUPERADMIN_NAV } from "./nav"
import { SuperAdminDashboard } from "./modules/dashboard"
import { SchoolsModule } from "./modules/schools"
import { FeatureFlagsModule } from "./modules/feature-flags"
import { BillingModule } from "./modules/billing"
import { MonitoringModule } from "./modules/monitoring"
import { SecurityModule } from "./modules/security"
import { CommunicationModule } from "./modules/communication"
import { WhiteLabelModule } from "./modules/whitelabel"
import { SupportModule } from "./modules/support"
import { DeveloperModule } from "./modules/developer"
import { SchoolControlPlane } from "./control-plane/school-control-plane"
import { ImpersonationBanner } from "./impersonation-banner"

export function SuperAdminApp() {
  const activeModule = useAppStore((s) => s.superadminModule)
  const setModule = useAppStore((s) => s.setModule)
  const controlPlaneSchoolId = useAppStore((s) => s.controlPlaneSchoolId)
  const impersonating = useAppStore((s) => s.impersonating)

  // If impersonating, render the impersonated role app with banner
  if (impersonating) {
    return <ImpersonationBanner />
  }

  // If inside a school control plane, render the full-screen control plane
  if (controlPlaneSchoolId) {
    return <SchoolControlPlane />
  }

  const render = () => {
    switch (activeModule) {
      case "dashboard": return <SuperAdminDashboard />
      case "schools": return <SchoolsModule />
      case "feature-flags": return <FeatureFlagsModule />
      case "billing": return <BillingModule />
      case "monitoring": return <MonitoringModule />
      case "security": return <SecurityModule />
      case "communication": return <CommunicationModule />
      case "whitelabel": return <WhiteLabelModule />
      case "support": return <SupportModule />
      case "developer": return <DeveloperModule />
      default: return <SuperAdminDashboard />
    }
  }

  return (
    <AppShell
      role="superadmin"
      nav={SUPERADMIN_NAV}
      active={activeModule}
      moduleKey={activeModule}
      onSelect={(id) => setModule("superadmin", id)}
    >
      {render()}
    </AppShell>
  )
}
