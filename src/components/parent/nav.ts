import type { NavGroup } from "@/components/shared/app-shell"
import {
  LayoutDashboard, TrendingUp, CalendarCheck, Award, Wallet,
  MessageSquare, CalendarDays, Megaphone, GraduationCap, MessagesSquare,
} from "lucide-react"

export const PARENT_NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "progress", label: "Academic Progress", icon: TrendingUp },
      { id: "attendance", label: "Attendance", icon: CalendarCheck },
      { id: "results", label: "Results", icon: Award },
    ],
  },
  {
    group: "Engagement",
    items: [
      { id: "chat", label: "Teacher Chat", icon: MessagesSquare, badge: 1 },
      { id: "messages", label: "Messages", icon: MessageSquare, badge: 2 },
      { id: "fees", label: "Fees & Payments", icon: Wallet },
      { id: "calendar", label: "Calendar", icon: CalendarDays },
      { id: "notices", label: "Notices", icon: Megaphone, badge: 4 },
    ],
  },
  {
    group: "School",
    items: [
      { id: "teachers", label: "Teachers", icon: GraduationCap },
    ],
  },
]
