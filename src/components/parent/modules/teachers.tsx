"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { TEACHERS, STUDENTS, HOMEWORK } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { Mail, Phone, BookOpen, MessageSquare } from "lucide-react"
import { toast } from "sonner"

export function TeachersModule() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<null | typeof TEACHERS[0]>(null)
  const child = STUDENTS[0]
  // teachers associated with child's class
  const myTeachers = TEACHERS.filter((t) => t.classes.some((c) => c.includes("Grade 10")) || t.designation === "Principal").slice(0, 8)
  const filtered = myTeachers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.department.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageHeader title="My Child's Teachers" description={`${child.name} • ${child.className} ${child.section}`} />

      <StaggerItem index={0}>
        <SectionCard>
          <Toolbar search={search} onSearch={setSearch} placeholder="Search teachers…" />
        </SectionCard>
      </StaggerItem>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, i) => {
          const c = colorOf(t.avatarColor)
          return (
            <StaggerItem key={t.id} index={i + 1}>
              <motion.button
                onClick={() => setSelected(t)}
                whileHover={{ y: -4 }}
                className="w-full rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium transition-colors hover:bg-accent/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} color={t.avatarColor} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.designation}</p>
                    <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium", c.soft, c.text)}>{t.department}</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Subjects</p>
                    <p className="font-medium">{t.subjects.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-medium">{t.experience} years</p>
                  </div>
                </div>
              </motion.button>
            </StaggerItem>
          )
        })}
      </div>

      {/* teacher detail dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium">
              <div className={cn("flex items-center gap-4 bg-gradient-to-br p-6 text-white", `from-${selected.avatarColor}-500 to-${selected.avatarColor}-700`)}>
                <Avatar name={selected.name} color={selected.avatarColor} size="xl" className="ring-4 ring-white/30" />
                <div>
                  <p className="text-lg font-bold">{selected.name}</p>
                  <p className="text-sm text-white/80">{selected.designation} • {selected.department}</p>
                  <p className="mt-1 text-xs text-white/70">{selected.empId} • {selected.experience} yrs exp</p>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Subjects</p>
                    <p className="font-medium">{selected.subjects.join(", ")}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Classes</p>
                    <p className="font-medium">{selected.classes.join(", ")}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Qualification</p>
                    <p className="font-medium">{selected.qualification}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">Attendance</p>
                    <p className="font-medium">{selected.attendance}%</p>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-border/60 pt-4">
                  <button onClick={() => toast.success(`Email sent to ${selected.name}`)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
                    <Mail className="h-4 w-4" /> Email Teacher
                  </button>
                  <button onClick={() => toast.success("Message sent!")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>
                  <button onClick={() => toast.success(`Calling ${selected.phone}`)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium hover:bg-accent">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
