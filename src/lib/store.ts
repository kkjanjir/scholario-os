import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Role = "principal" | "teacher" | "student" | "parent" | "superadmin"

export interface SessionUser {
  id: string
  name: string
  role: Role
  email: string
  avatar?: string
  avatarColor?: string
  // linking ids for role isolation
  teacherId?: string
  studentId?: string
  title?: string
}

interface AppState {
  // auth
  user: SessionUser | null
  loggingIn: boolean
  // navigation (kept per role via activeModule string keys)
  principalModule: string
  teacherModule: string
  studentModule: string
  parentModule: string
  superadminModule: string
  // school control plane — when set, super admin is inside a school workspace
  controlPlaneSchoolId: string | null
  controlPlaneModule: string
  // impersonation — when set, super admin is previewing another role
  impersonating: SessionUser | null
  // ui
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  theme: "light" | "dark"

  // actions
  login: (user: SessionUser) => void
  setLoggingIn: (v: boolean) => void
  logout: () => void
  switchRole: (user: SessionUser) => void
  setModule: (role: Role, module: string) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  setSidebarMobileOpen: (v: boolean) => void
  toggleTheme: () => void
  setTheme: (t: "light" | "dark") => void
  // control plane
  enterControlPlane: (schoolId: string) => void
  exitControlPlane: () => void
  setControlPlaneModule: (m: string) => void
  // impersonation
  startImpersonation: (user: SessionUser) => void
  stopImpersonation: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      loggingIn: false,
      principalModule: "dashboard",
      teacherModule: "dashboard",
      studentModule: "dashboard",
      parentModule: "dashboard",
      superadminModule: "dashboard",
      controlPlaneSchoolId: null,
      controlPlaneModule: "overview",
      impersonating: null,
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: "light",

      login: (user) => set({ user, loggingIn: false }),
      setLoggingIn: (v) => set({ loggingIn: v }),
      logout: () =>
        set({
          user: null,
          principalModule: "dashboard",
          teacherModule: "dashboard",
          studentModule: "dashboard",
          parentModule: "dashboard",
          superadminModule: "dashboard",
        }),
      switchRole: (user) => set({ user }),
      setModule: (role, module) =>
        set(
          role === "principal"
            ? { principalModule: module }
            : role === "teacher"
            ? { teacherModule: module }
            : role === "student"
            ? { studentModule: module }
            : role === "parent"
            ? { parentModule: module }
            : { superadminModule: module }
        ),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setSidebarMobileOpen: (v) => set({ sidebarMobileOpen: v }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setTheme: (t) => set({ theme: t }),
      // control plane
      enterControlPlane: (schoolId) => set({ controlPlaneSchoolId: schoolId, controlPlaneModule: "overview" }),
      exitControlPlane: () => set({ controlPlaneSchoolId: null, controlPlaneModule: "overview" }),
      setControlPlaneModule: (m) => set({ controlPlaneModule: m }),
      // impersonation
      startImpersonation: (user) => set({ impersonating: user }),
      stopImpersonation: () => set({ impersonating: null }),
    }),
    {
      name: "scholario-os",
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    }
  )
)
