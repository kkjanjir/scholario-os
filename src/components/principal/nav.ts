import type { NavGroup } from "@/components/shared/app-shell"
import {
  LayoutDashboard, UserPlus, Users, School, CalendarCheck, Wallet,
  Banknote, ClipboardList, BookOpen, FileText, BarChart3, Megaphone,
  CalendarDays, Library, Bus, Package, Award, Settings, GraduationCap,
} from "lucide-react"

export const PRINCIPAL_NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "calendar", label: "Calendar", icon: CalendarDays },
    ],
  },
  {
    group: "Academics",
    items: [
      { id: "admission", label: "Student Admission", icon: UserPlus },
      { id: "teachers", label: "Teacher Management", icon: GraduationCap },
      { id: "classes", label: "Class Management", icon: School },
      { id: "attendance", label: "Attendance", icon: CalendarCheck },
      { id: "examination", label: "Examination", icon: ClipboardList },
      { id: "homework", label: "Homework", icon: BookOpen, badge: 6 },
      { id: "assignments", label: "Assignments", icon: FileText, badge: 4 },
    ],
  },
  {
    group: "Finance",
    items: [
      { id: "fees", label: "Fee Management", icon: Wallet },
      { id: "salary", label: "Salary Management", icon: Banknote },
    ],
  },
  {
    group: "Operations",
    items: [
      { id: "communication", label: "Communication", icon: Megaphone },
      { id: "library", label: "Library", icon: Library },
      { id: "transport", label: "Transport", icon: Bus },
      { id: "inventory", label: "Inventory", icon: Package },
      { id: "certificates", label: "Certificates", icon: Award },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
]
