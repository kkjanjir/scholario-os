"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { RevenueAreaChart, DonutChart } from "@/components/shared/charts"
import { SUBSCRIPTIONS, PLANS, INVOICES, REVENUE_TREND_SA, type Subscription, type Invoice } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { CreditCard, Download, TrendingUp, DollarSign, Percent, Tag, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function BillingModule() {
  const [tab, setTab] = useState<"subs" | "invoices" | "plans">("subs")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Subscription | null>(null)

  const totalMRR = SUBSCRIPTIONS.reduce((a, s) => a + s.mrr, 0)
  const totalARR = totalMRR * 12
  const pendingAmount = INVOICES.filter((i) => i.status !== "Paid").reduce((a, i) => a + i.total, 0)

  return (
    <div className="space-y-6">
      <PageHeader title="Subscription & Billing" description="Manage plans, renewals, invoices & payments across all schools" />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem index={0}><div className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-premium"><DollarSign className="h-6 w-6 opacity-80" /><p className="mt-3 text-xs uppercase tracking-wide text-white/80">Total MRR</p><p className="text-2xl font-bold"><AnimatedCounter value={totalMRR} prefix="₹" /></p></div></StaggerItem>
        <StaggerItem index={1}><div className="rounded-2xl border border-border/60 bg-gradient-to-br from-violet-500 to-fuchsia-600 p-5 text-white shadow-premium"><TrendingUp className="h-6 w-6 opacity-80" /><p className="mt-3 text-xs uppercase tracking-wide text-white/80">Total ARR</p><p className="text-2xl font-bold"><AnimatedCounter value={totalARR} prefix="₹" /></p></div></StaggerItem>
        <StaggerItem index={2}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-amber-500/10 p-2.5"><Percent className="h-5 w-5 text-amber-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-600"><AnimatedCounter value={pendingAmount} prefix="₹" /></p></div></StaggerItem>
        <StaggerItem index={3}><div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"><div className="mb-3 inline-flex rounded-xl bg-sky-500/10 p-2.5"><CreditCard className="h-5 w-5 text-sky-600" /></div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active Subs</p><p className="text-2xl font-bold">{SUBSCRIPTIONS.filter((s) => s.status === "Active").length}</p></div></StaggerItem>
      </div>

      {/* revenue chart */}
      <StaggerItem index={1}>
        <SectionCard title="Revenue Trend" subtitle="MRR & ARR over 12 months (₹ Lakhs)">
          <RevenueAreaChart data={REVENUE_TREND_SA.map((r) => ({ month: r.month, revenue: r.mrr / 100000, collection: r.arr / 10000000 }))} />
        </SectionCard>
      </StaggerItem>

      {/* tabs */}
      <div className="flex gap-2">
        {([["subs", "Subscriptions"], ["invoices", "Invoices"], ["plans", "Plans & Pricing"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={cn("rounded-xl px-4 py-2 text-sm font-medium transition-colors", tab === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>{label}</button>
        ))}
      </div>

      {tab === "subs" && (
        <StaggerItem index={2}>
          <SectionCard title="Subscriptions" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/60 text-left">{["School", "Plan", "MRR", "Students", "Started", "Renews", "Status", ""].map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {SUBSCRIPTIONS.map((s, i) => (
                    <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/40 hover:bg-accent/30">
                      <td className="px-4 py-3 font-medium">{s.school}</td>
                      <td className="px-4 py-3"><span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", colorOf(s.plan === "Enterprise" ? "amber" : s.plan === "Professional" ? "violet" : s.plan === "Starter" ? "emerald" : "slate").soft, colorOf(s.plan === "Enterprise" ? "amber" : s.plan === "Professional" ? "violet" : s.plan === "Starter" ? "emerald" : "slate").text)}>{s.plan}</span></td>
                      <td className="px-4 py-3 font-semibold">{formatINR(s.mrr)}</td>
                      <td className="px-4 py-3">{s.students.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.startedAt}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.renewsAt}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3"><button onClick={() => setSelected(s)} className="text-xs font-medium text-primary hover:underline">Manage</button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </StaggerItem>
      )}

      {tab === "invoices" && (
        <StaggerItem index={2}>
          <SectionCard title="Invoices" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/60 text-left">{["Invoice", "School", "Amount", "GST", "Total", "Date", "Method", "Status", ""].map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {INVOICES.map((inv, i) => (
                    <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/40 hover:bg-accent/30">
                      <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNo}</td>
                      <td className="px-4 py-3 font-medium">{inv.school}</td>
                      <td className="px-4 py-3">{formatINR(inv.amount)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatINR(inv.gst)}</td>
                      <td className="px-4 py-3 font-semibold">{formatINR(inv.total)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                      <td className="px-4 py-3 text-muted-foreground">{inv.method}</td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                      <td className="px-4 py-3"><button onClick={() => toast.success("Invoice downloaded")} className="text-xs font-medium text-primary hover:underline"><Download className="inline h-3 w-3" /> PDF</button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </StaggerItem>
      )}

      {tab === "plans" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p, i) => {
            const c = colorOf(p.color)
            return (
              <StaggerItem key={p.id} index={i + 2}>
                <motion.div whileHover={{ y: -4 }} className={cn("rounded-2xl border-2 p-5", p.id === "enterprise" ? "border-amber-500/40 bg-amber-500/5" : "border-border/60 bg-card")}>
                  <div className="flex items-center justify-between">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", c.soft, c.text)}>{p.name}</span>
                    {p.id === "enterprise" && <span className="text-[10px] font-bold text-amber-600">POPULAR</span>}
                  </div>
                  <p className="mt-3 text-3xl font-bold">₹{p.price.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">/{p.period}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Up to {p.maxStudents.toLocaleString("en-IN")} students</p>
                  <div className="mt-4 space-y-1.5">
                    {p.features.map((f) => <div key={f} className="flex items-center gap-1.5 text-xs"><CheckCircle2 className={cn("h-3 w-3", c.text)} /> {f}</div>)}
                  </div>
                  <button onClick={() => toast.success(`${p.name} plan details`)} className={cn("mt-4 w-full rounded-xl py-2 text-sm font-semibold", p.id === "enterprise" ? "bg-amber-500 text-white" : "bg-muted hover:bg-accent")}>Configure</button>
                </motion.div>
              </StaggerItem>
            )
          })}
        </div>
      )}

      {/* subscription detail dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-premium">
              <h3 className="text-lg font-semibold">{selected.school}</h3>
              <p className="text-xs text-muted-foreground">{selected.plan} • {selected.invoiceNo}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">MRR</p><p className="font-bold">{formatINR(selected.mrr)}</p></div>
                <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">Students</p><p className="font-bold">{selected.students.toLocaleString("en-IN")}</p></div>
                <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">Started</p><p className="font-bold">{selected.startedAt}</p></div>
                <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">Renews</p><p className="font-bold">{selected.renewsAt}</p></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => { toast.success("Upgrade initiated"); setSelected(null) }} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><ArrowUpRight className="h-4 w-4" /> Upgrade Plan</button>
                <button onClick={() => toast.success("Invoice sent")} className="rounded-xl border border-border/70 px-4 py-2 text-sm font-medium hover:bg-accent">Send Invoice</button>
                <button onClick={() => setSelected(null)} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-accent">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
