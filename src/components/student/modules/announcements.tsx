"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, Toolbar, EmptyState } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { colorOf } from "@/components/shared/brand"
import { ANNOUNCEMENTS } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Megaphone, AlertTriangle, Info, CheckCircle2, Users, Clock, Search,
  Pin, Bell, Sparkles, ArrowRight,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const PRIORITY_META: Record<string, { color: string; label: string; icon: any; ribbon: string }> = {
  high: { color: "rose", label: "High Priority", icon: AlertTriangle, ribbon: "from-rose-500 to-orange-500" },
  medium: { color: "amber", label: "Medium", icon: Info, ribbon: "from-amber-500 to-yellow-500" },
  low: { color: "emerald", label: "General", icon: CheckCircle2, ribbon: "from-emerald-500 to-teal-500" },
}

// Add a couple of extra notices for a fuller board
const EXTRA = [
  { id: "a7", title: "Inter-House Cricket Tournament — Sign-ups Open", body: "Trials for the inter-house cricket tournament will be held on 14th December during sports period. Interested students from Grade 8–10 should register with their house captain.", date: "2025-12-02", priority: "low", channel: "Students", audience: "Grade 8–10" },
  { id: "a8", title: "Lost & Found — Collect Personal Items", body: "Multiple water bottles, lunch boxes and notebooks have been found in the lost & found box at the reception. Students are requested to check and claim their items by 6th December.", date: "2025-11-30", priority: "low", channel: "Students", audience: "All Students" },
  { id: "a9", title: "School Bus Route R-04 — Temporary Change", body: "Due to road repair work on Viman Nagar main road, bus route R-04 will take a 10-minute detour from 5th to 12th December. Pickup times may shift by 5–7 minutes.", date: "2025-11-28", priority: "medium", channel: "Parents + Students", audience: "Route R-04 Users" },
]

const ALL = [...ANNOUNCEMENTS, ...EXTRA].sort((a, b) => b.date.localeCompare(a.date))

const FILTERS = [
  { id: "all", label: "All" },
  { id: "high", label: "High Priority" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "General" },
]

export function AnnouncementsModule() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filtered = ALL.filter((a) => {
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || a.priority === filter
    return matchesSearch && matchesFilter
  })

  // Featured = top high-priority announcement
  const featured = ALL.find((a) => a.priority === "high")
  const featuredVisible = filter === "all" && (!search || featured?.title.toLowerCase().includes(search.toLowerCase()) || featured?.body.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notice Board"
        description="School announcements, updates & circulars"
        action={
          <Button variant="outline" className="rounded-xl" onClick={() => toast.info("You're all caught up! No new notices.")}>
            <Bell className="h-4 w-4" /> Mark all as read
          </Button>
        }
      />

      {/* Featured School Update */}
      {featured && featuredVisible && (
        <StaggerItem index={1}>
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 p-6 text-white shadow-premium lg:p-7">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-2xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  <Pin className="h-3 w-3" /> Featured School Update
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/30 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <AlertTriangle className="h-3 w-3" /> High Priority
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight">{featured.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/90">{featured.body}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/80">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(featured.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {featured.audience}</span>
                <span className="inline-flex items-center gap-1"><Megaphone className="h-3 w-3" /> {featured.channel}</span>
              </div>
            </div>
          </div>
        </StaggerItem>
      )}

      {/* Search + filters */}
      <StaggerItem index={2}>
        <Tabs value={filter} onValueChange={setFilter}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="rounded-xl">
              {FILTERS.map((f) => {
                const count = f.id === "all" ? ALL.length : ALL.filter((a) => a.priority === f.id).length
                return (
                  <TabsTrigger key={f.id} value={f.id} className="rounded-lg">
                    {f.label} ({count})
                  </TabsTrigger>
                )
              })}
            </TabsList>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notices…"
                className="h-9 w-full rounded-xl border border-border/60 bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-violet-500/50"
              />
            </div>
          </div>

          <TabsContent value={filter} className="mt-4">
            {filtered.length === 0 ? (
              <EmptyState icon={Megaphone} title="No notices found" desc="Try a different search or filter." />
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {filtered.map((a, i) => (
                  <NoticeCard key={a.id} a={a} index={i} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </StaggerItem>

      {/* Quick audience filter pills */}
      <StaggerItem index={3}>
        <SectionCard title="Browse by Audience" subtitle="Notices targeted to specific groups">
          <div className="flex flex-wrap gap-2">
            {["Everyone", "All Students", "Parents", "Grade 10 & 12", "Grade 8–10", "Route R-04 Users"].map((aud) => {
              const count = ALL.filter((a) => a.audience === aud).length
              return (
                <motion.button
                  key={aud}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSearch(aud); toast.info(`Showing notices for: ${aud}`) }}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2 text-sm font-medium transition-colors hover:border-violet-500/40 hover:bg-violet-500/5"
                >
                  <Users className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  {aud}
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{count}</span>
                </motion.button>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>
    </div>
  )
}

function NoticeCard({ a, index }: { a: typeof ANNOUNCEMENTS[number]; index: number }) {
  const m = PRIORITY_META[a.priority]
  const c = colorOf(m.color)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="relative"
    >
      <SectionCard bodyClassName="p-0">
        {/* Priority ribbon */}
        <div className={cn("flex items-center justify-between gap-2 rounded-t-2xl bg-gradient-to-r px-4 py-2 text-white", m.ribbon)}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <m.icon className="h-3.5 w-3.5" /> {m.label}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide opacity-90">
            {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className={cn("rounded-xl p-2.5 ring-1", c.soft, c.ring)}>
              <Megaphone className={cn("h-5 w-5", c.text)} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold leading-tight">{a.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {a.audience}</span>
                <span className="inline-flex items-center gap-1"><Bell className="h-3 w-3" /> {a.channel}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{a.body}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => toast.success("Notice bookmarked! 📌")}
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
            >
              <Sparkles className="h-3 w-3" /> Save <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  )
}
