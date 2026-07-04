"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { STUDENTS } from "@/lib/mock/data"
import { formatINR } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import { Wallet, Download, CheckCircle2, Loader2, CreditCard, Smartphone, Building2, Banknote } from "lucide-react"
import { toast } from "sonner"

const HISTORY = [
  { id: "p1", invoice: "INV-2025-1108", date: "2025-11-08", amount: 29250, method: "UPI", status: "Paid" },
  { id: "p2", invoice: "INV-2025-1015", date: "2025-10-15", amount: 15000, method: "Card", status: "Paid" },
  { id: "p3", invoice: "INV-2025-1002", date: "2025-10-02", amount: 14250, method: "Net Banking", status: "Paid" },
  { id: "p4", invoice: "INV-2025-0905", date: "2025-09-05", amount: 29250, method: "UPI", status: "Paid" },
]

export function FeesModule() {
  const child = STUDENTS[0]
  const outstanding = child.feeTotal - child.feePaid
  const [payOpen, setPayOpen] = useState(false)
  const [method, setMethod] = useState("upi")
  const [stage, setStage] = useState<"idle" | "processing" | "success">("idle")

  const methods = [
    { id: "upi", label: "UPI", icon: Smartphone, desc: "GPay / PhonePe / Paytm" },
    { id: "card", label: "Card", icon: CreditCard, desc: "Debit / Credit Card" },
    { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks" },
    { id: "cash", label: "Cash", icon: Banknote, desc: "Pay at school office" },
  ]

  function pay() {
    setStage("processing")
    setTimeout(() => {
      setStage("success")
      setTimeout(() => { setStage("idle"); setPayOpen(false); toast.success("Payment successful!") }, 1800)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Fees & Payments" description={`${child.name} • ${child.className} ${child.section}`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StaggerItem index={0}>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-premium">
            <Wallet className="h-6 w-6 opacity-80" />
            <p className="mt-3 text-xs uppercase tracking-wide text-white/80">Total Paid</p>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={child.feePaid} prefix="₹" />
            </p>
            <p className="mt-1 text-xs text-white/70">{Math.round((child.feePaid / child.feeTotal) * 100)}% of total fees</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(child.feePaid / child.feeTotal) * 100}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-white" />
            </div>
          </div>
        </StaggerItem>
        <StaggerItem index={1}>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-rose-500 to-orange-600 p-5 text-white shadow-premium">
            <Wallet className="h-6 w-6 opacity-80" />
            <p className="mt-3 text-xs uppercase tracking-wide text-white/80">Outstanding</p>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={outstanding} prefix="₹" />
            </p>
            <p className="mt-1 text-xs text-white/70">Due by 15 Dec 2025</p>
            <button onClick={() => setPayOpen(true)} className="mt-3 w-full rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-rose-600 transition-transform hover:scale-105">
              Pay Now
            </button>
          </div>
        </StaggerItem>
        <StaggerItem index={2}>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-cyan-500 to-teal-600 p-5 text-white shadow-premium">
            <Wallet className="h-6 w-6 opacity-80" />
            <p className="mt-3 text-xs uppercase tracking-wide text-white/80">Total Fees</p>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={child.feeTotal} prefix="₹" />
            </p>
            <p className="mt-1 text-xs text-white/70">Annual • 2025-26</p>
          </div>
        </StaggerItem>
      </div>

      <StaggerItem index={3}>
        <SectionCard title="Payment History" subtitle="All transactions for this academic year" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  {["Invoice", "Date", "Amount", "Method", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/40 hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs">{p.invoice}</td>
                    <td className="px-4 py-3">{p.date}</td>
                    <td className="px-4 py-3 font-semibold">{formatINR(p.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3"><button onClick={() => toast.success("Receipt downloaded")} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"><Download className="h-3 w-3" /> Receipt</button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>

      {/* payment dialog */}
      <AnimatePresence>
        {payOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => stage === "idle" && setPayOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium">
              {stage === "idle" && (
                <div>
                  <div className="border-b border-border/60 p-5">
                    <h2 className="text-lg font-semibold">Pay Fees Online</h2>
                    <p className="text-xs text-muted-foreground">Secure payment • No hidden charges</p>
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">AMOUNT (₹)</label>
                      <input type="number" defaultValue={outstanding} className="mt-1 h-12 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-lg font-bold outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium text-muted-foreground">PAYMENT METHOD</label>
                      <div className="grid grid-cols-2 gap-2">
                        {methods.map((m) => {
                          const Icon = m.icon
                          return (
                            <button key={m.id} onClick={() => setMethod(m.id)} className={cn("flex items-start gap-2 rounded-xl border p-3 text-left transition-all", method === m.id ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border/70 hover:bg-accent")}>
                              <Icon className={cn("h-4 w-4", method === m.id ? "text-primary" : "text-muted-foreground")} />
                              <div>
                                <p className="text-sm font-medium">{m.label}</p>
                                <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <button onClick={pay} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">
                      <Wallet className="h-4 w-4" /> Pay {formatINR(outstanding)}
                    </button>
                    <p className="text-center text-[11px] text-muted-foreground">🔒 This is a simulated payment for demo purposes</p>
                  </div>
                </div>
              )}
              {stage === "processing" && (
                <div className="flex flex-col items-center justify-center p-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 font-semibold">Processing payment…</p>
                  <p className="mt-1 text-sm text-muted-foreground">Please don't close this window</p>
                </div>
              )}
              {stage === "success" && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center p-12 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500">
                    <CheckCircle2 className="h-12 w-12 text-white" />
                  </motion.div>
                  <p className="mt-4 text-lg font-bold">Payment Successful!</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatINR(outstanding)} paid via {method.toUpperCase()}</p>
                  <button onClick={() => toast.success("Receipt downloaded!")} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm font-medium hover:bg-accent">
                    <Download className="h-4 w-4" /> Download Receipt
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
