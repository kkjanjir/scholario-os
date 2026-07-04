"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { PARENT_NOTICES } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { Megaphone, Calendar, BookOpen, PartyPopper, Users, FileText, Search } from "lucide-react"
import { toast } from "sonner"

const TYPE_ICON: Record<string, any> = { event: PartyPopper, exam: BookOpen, holiday: Calendar, meeting: Users, circular: FileText }
const TYPE_COLOR: Record<string, string> = { event: "violet", exam: "rose", holiday: "emerald", meeting: "amber", circular: "sky" }

export function NoticesModule() {
  const [search, setSearch] = useState("")
  const filtered = PARENT_NOTICES.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageHeader title="School Notices" description="Important announcements for parents" />

      <StaggerItem index={0}>
        <SectionCard>
          <Toolbar search={search} onSearch={setSearch} placeholder="Search notices…">
            <button onClick={() => toast.success("All notices marked as read")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-xs font-medium hover:bg-accent">
              Mark all read
            </button>
          </Toolbar>
        </SectionCard>
      </StaggerItem>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((n, i) => {
          const Icon = TYPE_ICON[n.type] || Megaphone
          const c = TYPE_COLOR[n.type] || "slate"
          const colorMap: Record<string, string> = {
            violet: "from-violet-500 to-fuchsia-600", rose: "from-rose-500 to-orange-600",
            emerald: "from-emerald-500 to-teal-600", amber: "from-amber-500 to-orange-600", sky: "from-sky-500 to-cyan-600",
          }
          return (
            <StaggerItem key={n.id} index={i + 1}>
              <motion.div whileHover={{ y: -3 }} className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium">
                <div className={cn("flex items-center gap-3 bg-gradient-to-r p-4 text-white", colorMap[c])}>
                  <div className="rounded-lg bg-white/20 p-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80">{n.type}</p>
                    <p className="truncate text-sm font-bold">{n.title}</p>
                  </div>
                  <span className="text-[10px] text-white/80">{n.date.slice(5)}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-relaxed text-foreground/90">{n.body}</p>
                  <button onClick={() => toast.success("Notice saved for later")} className="mt-3 text-xs font-medium text-primary hover:underline">Save notice →</button>
                </div>
              </motion.div>
            </StaggerItem>
          )
        })}
      </div>
    </div>
  )
}
