import type { NavGroup } from "@/components/shared/app-shell"
import {
  LayoutDashboard, Building2, Flag, CreditCard, Activity, ShieldAlert,
  Megaphone, Palette, LifeBuoy, Code2,
} from "lucide-react"

export const SUPERADMIN_NAV: NavGroup[] = [
  {
    group: "Platform",
    items: [
      { id: "dashboard", label: "Global Dashboard", icon: LayoutDashboard },
      { id: "schools", label: "School Management", icon: Building2 },
      { id: "feature-flags", label: "Feature Flags", icon: Flag },
      { id: "billing", label: "Subscription & Billing", icon: CreditCard },
      { id: "monitoring", label: "Platform Monitoring", icon: Activity },
    ],
  },
  {
    group: "Control",
    items: [
      { id: "security", label: "Security Center", icon: ShieldAlert },
      { id: "communication", label: "Global Communication", icon: Megaphone },
      { id: "whitelabel", label: "White Label", icon: Palette },
      { id: "support", label: "Support Center", icon: LifeBuoy },
      { id: "developer", label: "Developer Center", icon: Code2 },
    ],
  },
]
