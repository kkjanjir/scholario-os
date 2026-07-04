"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { SCHOOLS } from "@/lib/mock/superadmin-data"
import { CONTROL_PLANE_NAV } from "./nav"
import { Logo, Avatar, colorOf } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  ArrowLeft, Search, Bell, Menu, X, ChevronDown, PanelLeftClose,
  PanelLeftOpen, Sun, Moon, LogOut, Building2,
} from "lucide-react"
import { toast } from "sonner"
import { OverviewSection } from "./sections/overview"
import { ConfigSection } from "./sections/config"
import { MonitoringSection } from "./sections/monitoring"
import { AuditSection } from "./sections/audit"
import { FeatureFlagsSection } from "./sections/feature-flags"
import { ModulesSection } from "./sections/modules"
import { BrandingSection } from "./sections/branding"
import { DeploymentSection } from "./sections/deployment"
import { ImpersonateSection } from "./sections/impersonate"
import { SecuritySection } from "./sections/security"

export function SchoolControlPlane() {
  const schoolId = useAppStore((s) => s.controlPlaneSchoolId)
  const activeModule = useAppStore((s) => s.controlPlaneModule)
  const setModule = useAppStore((s) => s.setControlPlaneModule)
  const exitControlPlane = useAppStore((s) => s.exitControlPlane)
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const logout = useAppStore((s) => s.logout)
  const user = useAppStore((s) => s.user)!
  const [mobileOpen, setMobileOpen] = useState(false)

  const school = SCHOOLS.find((s) => s.id === schoolId) || SCHOOLS[0]
  const c = colorOf(school.avatarColor)

  const renderSection = () => {
    switch (activeModule) {
      case "overview": return <OverviewSection school={school} />
      case "config": return <ConfigSection school={school} />
      case "monitoring": return <MonitoringSection school={school} />
      case "audit": return <AuditSection />
      case "feature-flags": return <FeatureFlagsSection />
      case "modules": return <ModulesSection />
      case "branding": return <BrandingSection school={school} />
      case "deployment": return <DeploymentSection school={school} />
      case "impersonate": return <ImpersonateSection school={school} />
      case "security": return <SecuritySection />
      default: return <OverviewSection school={school} />
    }
  }

  const activeItem = CONTROL_PLANE_NAV.flatMap((g) => g.items).find((i) => i.id === activeModule)

  return (
    <div data-role="superadmin" className="min-h-screen bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden" />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 264 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-border/60 bg-sidebar lg:flex"
      >
        <ControlPlaneSidebar
          school={school}
          nav={CONTROL_PLANE_NAV}
          active={activeModule}
          onSelect={setModule}
          collapsed={collapsed}
          onCollapse={toggleSidebar}
          onExit={exitControlPlane}
        />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ duration: 0.3 }} className="fixed left-0 top-0 z-50 h-screen w-[280px] flex-col border-r border-border/60 bg-sidebar lg:hidden flex">
            <ControlPlaneSidebar school={school} nav={CONTROL_PLANE_NAV} active={activeModule} onSelect={(id) => { setModule(id); setMobileOpen(false) }} collapsed={false} onCollapse={() => setMobileOpen(false)} onExit={exitControlPlane} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]")}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"><Menu className="h-5 w-5" /></button>
          {/* Back to platform */}
          <button onClick={exitControlPlane} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">All Schools</span>
          </button>
          {/* School identity */}
          <div className="flex items-center gap-2.5">
            <Avatar name={school.shortName} color={school.avatarColor} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none">{school.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{school.plan} • {school.domain}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={toggleTheme} className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground">{theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}</button>
            <button className="relative rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" /></button>
            <div className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-accent">
              <Avatar name={user.name} color="slate" size="sm" />
              <div className="hidden text-left md:block"><p className="text-sm font-semibold leading-none">{user.name}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{user.title}</p></div>
            </div>
          </div>
        </header>

        {/* Module heading */}
        <div className="border-b border-border/40 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-2">
            {activeItem && <activeItem.icon className="h-4 w-4 text-muted-foreground" />}
            <h1 className="text-lg font-semibold tracking-tight">{activeItem?.label}</h1>
            <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">School Control Plane</span>
          </div>
        </div>

        {/* Content */}
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeModule} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border/60 bg-background/60 px-4 py-3 backdrop-blur-sm lg:px-8">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><Logo size={18} /><span className="font-medium text-foreground">SCHOLARIO-OS</span><span className="hidden sm:inline">• School Control Plane</span></div>
            <button onClick={logout} className="rounded-md px-2 py-0.5 font-medium hover:bg-accent hover:text-foreground">Sign out</button>
          </div>
        </footer>
      </div>
    </div>
  )
}

function ControlPlaneSidebar({ school, nav, active, onSelect, collapsed, onCollapse, onExit }: {
  school: typeof SCHOOLS[0]
  nav: typeof CONTROL_PLANE_NAV
  active: string
  onSelect: (id: string) => void
  collapsed: boolean
  onCollapse: () => void
  onExit: () => void
}) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Brand */}
      <div className={cn("flex h-16 items-center gap-2.5 border-b border-border/60 px-4", collapsed && "justify-center px-0")}>
        <Logo size={collapsed ? 32 : 34} />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight">SCHOLARIO<span className="text-primary">-OS</span></p>
            <p className="truncate text-[10px] text-muted-foreground">Control Plane</p>
          </div>
        )}
      </div>

      {/* School card */}
      {!collapsed && (
        <div className="border-b border-border/60 p-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-accent/40 p-2.5">
            <Avatar name={school.shortName} color={school.avatarColor} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{school.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{school.city} • {school.plan}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="scroll-area flex-1 overflow-y-auto px-3 py-4">
        {nav.map((g) => (
          <div key={g.group} className="mb-5">
            {!collapsed && <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{g.group}</p>}
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const isActive = active === item.id
                const Icon = item.icon
                return (
                  <button key={item.id} onClick={() => onSelect(item.id)} title={collapsed ? item.label : undefined} className={cn("group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all", collapsed && "justify-center px-0", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
                    {isActive && <motion.span layoutId="cp-nav-active" className="pointer-events-none absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
                    <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                    {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Exit */}
      <div className="border-t border-border/60 p-3">
        <button onClick={onExit} className={cn("flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", collapsed && "justify-center")}>
          <ArrowLeft className="h-[18px] w-[18px]" /> {!collapsed && "Back to Platform"}
        </button>
      </div>
    </div>
  )
}
