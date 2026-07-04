import type { NavGroup } from "@/components/shared/app-shell"
import {
  LayoutDashboard, User, CalendarCheck, BookOpen, FileText,
  Award, Wallet, CalendarClock, CalendarDays, Megaphone, Trophy, Target,
} from "lucide-react"

export const STUDENT_NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "profile", label: "My Profile", icon: User },
      { id: "gamification", label: "Achievements", icon: Trophy, badge: "L10" },
      { id: "challenges", label: "Daily Challenges", icon: Target, badge: 5 },
      { id: "timetable", label: "Timetable", icon: CalendarClock },
      { id: "calendar", label: "Calendar", icon: CalendarDays },
    ],
  },
  {
    group: "Academics",
    items: [
      { id: "attendance", label: "Attendance", icon: CalendarCheck },
      { id: "homework", label: "Homework", icon: BookOpen, badge: 3 },
      { id: "assignments", label: "Assignments", icon: FileText, badge: 2 },
      { id: "results", label: "Results", icon: Award },
    ],
  },
  {
    group: "Finance & Updates",
    items: [
      { id: "fees", label: "Fees", icon: Wallet },
      { id: "announcements", label: "Announcements", icon: Megaphone, badge: 6 },
    ],
  },
]
