import type { NavGroup } from "@/components/shared/app-shell"
import {
  LayoutDashboard, CalendarCheck, BookOpen, FileText, ClipboardList,
  Users, CalendarClock, Megaphone, BarChart3,
} from "lucide-react"

export const TEACHER_NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "analytics", label: "My Analytics", icon: BarChart3 },
      { id: "timetable", label: "Timetable", icon: CalendarClock },
    ],
  },
  {
    group: "Academics",
    items: [
      { id: "attendance", label: "Attendance", icon: CalendarCheck },
      { id: "homework", label: "Homework", icon: BookOpen, badge: 6 },
      { id: "assignments", label: "Assignments", icon: FileText, badge: 4 },
      { id: "marks", label: "Marks Entry", icon: ClipboardList },
    ],
  },
  {
    group: "People",
    items: [
      { id: "students", label: "My Students", icon: Users },
      { id: "communication", label: "Communication", icon: Megaphone },
    ],
  },
]
