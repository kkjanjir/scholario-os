"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/lib/store"
import type { Role } from "@/lib/store"
import { SCHOOL } from "@/lib/mock/data"
import { Logo, Avatar, colorOf } from "@/components/shared/brand"
import { PageTransition } from "@/components/shared/motion"
import { RewardNotificationHost, triggerReward } from "@/components/shared/reward-notification"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  Search, Bell, Menu, PanelLeftClose, PanelLeftOpen, Sun, Moon,
  ChevronDown, LogOut, Settings, User as UserIcon, Shield,
  GraduationCap, BookOpen, Sparkles, X, Command, HeartHandshake,
} from "lucide-react"
import { toast } from "sonner"

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  badge?: string | number
}
export interface NavGroup {
  group: string
  items: NavItem[]
}

const ROLE_ICON = {
  principal: Shield,
  teacher: GraduationCap,
  student: BookOpen,
  parent: HeartHandshake,
} as const

const ROLE_LABEL = {
  principal: "Principal",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
} as const

function Sidebar({
  role,
  nav,
  active,
  onSelect,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: {
  role: Role
  nav: NavGroup[]
  active: string
  onSelect: (id: string) => void
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  const user = useAppStore((s) => s.user)!
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const c = colorOf(user.avatarColor || role)

  return (
    <>
      {/* mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 264 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-border/60 bg-sidebar lg:flex",
        )}
      >
        <SidebarInner
          role={role}
          nav={nav}
          active={active}
          onSelect={onSelect}
          collapsed={collapsed}
          onCollapse={toggleSidebar}
        />
      </motion.aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 z-50 h-screen w-[280px] flex-col border-r border-border/60 bg-sidebar lg:hidden flex"
          >
            <SidebarInner
              role={role}
              nav={nav}
              active={active}
              onSelect={(id) => { onSelect(id); onCloseMobile() }}
              collapsed={false}
              onCollapse={onCloseMobile}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarInner({
  role,
  nav,
  active,
  onSelect,
  collapsed,
  onCollapse,
}: {
  role: Role
  nav: NavGroup[]
  active: string
  onSelect: (id: string) => void
  collapsed: boolean
  onCollapse: () => void
}) {
  const user = useAppStore((s) => s.user)!
  return (
    <div className="flex h-full w-full flex-col">
      {/* brand */}
      <div className={cn("flex h-16 items-center gap-2.5 border-b border-border/60 px-4", collapsed && "justify-center px-0")}>
        <Logo size={collapsed ? 32 : 34} />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight">
              SCHOLARIO<span className="text-primary">-OS</span>
            </p>
            <p className="truncate text-[10px] text-muted-foreground">{SCHOOL.shortName} • {ROLE_LABEL[role]}</p>
          </div>
        )}
      </div>

      {/* nav */}
      <nav className="scroll-area flex-1 overflow-y-auto px-3 py-4">
        {nav.map((g) => (
          <div key={g.group} className="mb-5">
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {g.group}
              </p>
            )}
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const isActive = active === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`nav-active-${role}`}
                        className="pointer-events-none absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                      />
                    )}
                    <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                    {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* collapse toggle (desktop) */}
      <div className="hidden border-t border-border/60 p-3 lg:block">
        <button
          onClick={onCollapse}
          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  )
}

function Topbar({
  role,
  nav,
  active,
  onOpenMobile,
  onSearch,
}: {
  role: Role
  nav: NavGroup[]
  active: string
  onOpenMobile: () => void
  onSearch: () => void
}) {
  const user = useAppStore((s) => s.user)!
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const logout = useAppStore((s) => s.logout)
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const activeItem = useMemo(() => {
    for (const g of nav) {
      const f = g.items.find((i) => i.id === active)
      if (f) return f
    }
    return null
  }, [nav, active])

  const RoleIcon = ROLE_ICON[role]

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6",
      )}
      style={{ marginLeft: undefined }}
    >
      <button
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden items-center gap-2 lg:flex">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", colorOf(role).soft)}>
          <RoleIcon className={cn("h-4 w-4", colorOf(role).text)} />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight leading-none">{activeItem?.label}</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">{ROLE_LABEL[role]} Workspace</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* search */}
        <button
          onClick={onSearch}
          className="hidden items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent sm:flex"
        >
          <Search className="h-4 w-4" />
          <span className="text-xs">Search…</span>
          <kbd className="ml-4 inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Toggle theme"
        >
          {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </button>

        {/* notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setMenuOpen(false) }}
            className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-2xl border border-border/60 bg-popover shadow-premium"
                >
                  <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                    <p className="text-sm font-semibold">Notifications</p>
                    <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600">3 new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto scroll-area">
                    {NOTIFS.map((n, i) => {
                      const c = colorOf(n.color)
                      const Icon = n.icon
                      return (
                        <button key={i} className="flex w-full items-start gap-3 border-b border-border/40 px-4 py-3 text-left transition-colors hover:bg-accent/50">
                          <div className={cn("rounded-lg p-1.5", c.soft)}>
                            <Icon className={cn("h-4 w-4", c.text)} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-tight">{n.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                            <p className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <button className="w-full bg-accent/40 py-2.5 text-xs font-medium text-muted-foreground hover:bg-accent">
                    View all notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* profile */}
        <div className="relative">
          <button
            onClick={() => { setMenuOpen((v) => !v); setNotifOpen(false) }}
            className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-accent"
          >
            <Avatar name={user.name} color={user.avatarColor || role} size="sm" />
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{user.title}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 z-40 w-60 overflow-hidden rounded-2xl border border-border/60 bg-popover shadow-premium"
                >
                  <div className="border-b border-border/60 px-4 py-3">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <span className={cn("mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", colorOf(role).soft, colorOf(role).text)}>
                      <RoleIcon className="h-3 w-3" /> {ROLE_LABEL[role]} Access
                    </span>
                  </div>
                  <div className="p-1.5">
                    <ProfileMenuItem icon={UserIcon} label="My Profile" onClick={() => { setMenuOpen(false); toast("Profile coming up") }} />
                    <ProfileMenuItem icon={Settings} label="Settings" onClick={() => { setMenuOpen(false); toast("Settings") }} />
                    <ProfileMenuItem icon={Sparkles} label="Switch Role (Demo)" onClick={() => { setMenuOpen(false); toast.info("Use the role switcher at the bottom of the sidebar") }} />
                    <div className="my-1 h-px bg-border/60" />
                    <ProfileMenuItem
                      icon={LogOut}
                      label="Sign out"
                      danger
                      onClick={() => { logout(); toast.success("Signed out") }}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

function ProfileMenuItem({ icon: Icon, label, onClick, danger }: { icon: LucideIcon; label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent",
        danger ? "text-rose-600 dark:text-rose-400" : "text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

const NOTIFS = [
  { icon: Bell, color: "rose", title: "3 fee payments overdue", body: "Grade 10-A students have pending dues", time: "5 min ago" },
  { icon: GraduationCap, color: "emerald", title: "New admission received", body: "Kiara Desai — Grade 6 A", time: "22 min ago" },
  { icon: BookOpen, color: "amber", title: "Homework submission due", body: "Mathematics — Exercise 4.3", time: "1 hour ago" },
  { icon: Shield, color: "violet", title: "Attendance marked", body: "Grade 9-A attendance 94%", time: "2 hours ago" },
]

export function AppShell({
  role,
  nav,
  active,
  moduleKey,
  onSelect,
  children,
}: {
  role: Role
  nav: NavGroup[]
  active: string
  moduleKey: string
  onSelect: (id: string) => void
  children: React.ReactNode
}) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const mobileOpen = useAppStore((s) => s.sidebarMobileOpen)
  const setMobileOpen = useAppStore((s) => s.setSidebarMobileOpen)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div data-role={role} className="min-h-screen bg-background">
      <Sidebar
        role={role}
        nav={nav}
        active={active}
        onSelect={onSelect}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn("flex min-h-screen flex-col transition-[padding] duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]")}
      >
        <Topbar
          role={role}
          nav={nav}
          active={active}
          onOpenMobile={() => setMobileOpen(true)}
          onSearch={() => setSearchOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait">
            <PageTransition key={moduleKey} k={moduleKey}>{children}</PageTransition>
          </AnimatePresence>
        </main>
        <AppFooter />
      </div>

      {/* command palette */}
      <AnimatePresence>
        {searchOpen && (
          <CommandPalette
            role={role}
            nav={nav}
            onClose={() => setSearchOpen(false)}
            onSelect={(id) => { onSelect(id); setSearchOpen(false) }}
          />
        )}
      </AnimatePresence>

      {/* reward notification host */}
      <RewardNotificationHost />
    </div>
  )
}

function CommandPalette({
  role,
  nav,
  onClose,
  onSelect,
}: {
  role: Role
  nav: NavGroup[]
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const [q, setQ] = useState("")
  const all = useMemo(() => nav.flatMap((g) => g.items), [nav])
  const filtered = all.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-950/40 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border/60 bg-popover shadow-premium"
      >
        <div className="flex items-center gap-3 border-b border-border/60 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search modules…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto scroll-area p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No modules found</p>
          )}
          {filtered.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

function AppFooter() {
  const logout = useAppStore((s) => s.logout)
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60 px-4 py-4 backdrop-blur-sm lg:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <span className="font-medium text-foreground">SCHOLARIO-OS</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{SCHOOL.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">© 2025 • {SCHOOL.session}</span>
          <span className="hidden md:inline">{SCHOOL.affiliation}</span>
          <button
            onClick={logout}
            className="rounded-md px-2 py-0.5 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    </footer>
  )
}
