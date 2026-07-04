import type { NavGroup } from "@/components/shared/app-shell"
import {
  LayoutDashboard, Settings, Activity, Flag, Palette, Globe,
  Users, Shield, History, Package, Rocket,
} from "lucide-react"

export const CONTROL_PLANE_NAV: NavGroup[] = [
  {
    group: "School",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "config", label: "Configuration", icon: Settings },
      { id: "monitoring", label: "Monitoring", icon: Activity },
      { id: "audit", label: "Audit Trail", icon: History },
    ],
  },
  {
    group: "Platform",
    items: [
      { id: "feature-flags", label: "Feature Flags", icon: Flag },
      { id: "modules", label: "Modules & Extensions", icon: Package },
      { id: "branding", label: "Branding & Website", icon: Palette },
      { id: "deployment", label: "Deployment", icon: Rocket },
    ],
  },
  {
    group: "Access",
    items: [
      { id: "impersonate", label: "Open As Role", icon: Users },
      { id: "security", label: "Security & Policies", icon: Shield },
    ],
  },
]
