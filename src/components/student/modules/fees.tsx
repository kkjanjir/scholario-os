"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader, StatPill } from "@/components/shared/module-common"
import { SectionCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem, AnimatedCounter } from "@/components/shared/motion"
import { formatINR } from "@/components/shared/brand"
import { STUDENTS, SCHOOL } from "@/lib/mock/data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Wallet, CheckCircle2, AlertCircle, Receipt, CreditCard, Smartphone,
  Building2, Download, ShieldCheck, Sparkles, Check, Clock, IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Force a partial-payment scenario for the demo so the "Pay Now" flow is interactive
const me = { ...STUDENTS[0], feePaid: Math.round(STUDENTS[0].feeTotal * 0.72) }
const outstanding = me.feeTotal - me.feePaid

const PAYMENT_HISTORY = [
  { id: "ph1", date: "2025-11-10", invoice: "INV-2025-1042", method: "UPI", amount: 20000, status: "Paid" as const },
  { id: "ph2", date: "2025-09-15", invoice: "INV-2025-0987", method: "Card", amount: 15000, status: "Paid" as const },
  { id: "ph3", date: "2025-07-22", invoice: "INV-2025-0911", method: "Net Banking", amount: 7120, status: "Paid" as const },
]

const FEE_BREAKDOWN = [
  { label: "Tuition Fee", amount: 42000 },
  { label: "Transport Fee", amount: 12000 },
  { label: "Library Fee", amount: 1500 },
  { label: "Lab Fee", amount: 3500 },
]

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", desc: "GPay / PhonePe / Paytm", icon: Smartphone, color: "violet" },
  { id: "card", label: "Card", desc: "Credit / Debit", icon: CreditCard, color: "fuchsia" },
  { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: Building2, color: "emerald" },
]

type Stage = "idle" | "processing" | "success" | "receipt"

export function FeesModule() {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState("upi")
  const [amount, setAmount] = useState(String(outstanding))
  const [stage, setStage] = useState<Stage>("idle")
  const [receiptNo] = useState(`RCT-${Math.floor(Math.random() * 9000 + 1000)}`)

  const payNow = () => {
    setOpen(true)
    setStage("idle")
    setAmount(String(outstanding))
  }

  const startPayment = () => {
    setStage("processing")
    setTimeout(() => {
      setStage("success")
      toast.success(`Payment of ${formatINR(Number(amount))} successful! 🎉`)
      setTimeout(() => setStage("receipt"), 1400)
    }, 2000)
  }

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => setStage("idle"), 250)
  }

  const pctPaid = Math.round((me.feePaid / me.feeTotal) * 100)

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Fees"
        description="Fee summary, payment history & online payment"
        action={
          outstanding > 0 ? (
            <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90" onClick={payNow}>
              <Wallet className="h-4 w-4" /> Pay Now
            </Button>
          ) : undefined
        }
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StaggerItem index={1}>
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 shadow-premium">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/15 p-2.5 ring-1 ring-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatINR(me.feePaid)}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{pctPaid}% of total paid</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">On track ✅</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-emerald-500/15">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pctPaid}%` }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem index={2}>
          <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-orange-500/5 p-6 shadow-premium">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-500/15 p-2.5 ring-1 ring-rose-500/20">
                  <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold text-rose-700 dark:text-rose-400">
                    <AnimatedCounter value={outstanding} prefix="₹" />
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Fee</p>
                  <p className="font-semibold">{formatINR(me.feeTotal)}</p>
                </div>
                <Button size="sm" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90" onClick={payNow}>
                  <Wallet className="h-3.5 w-3.5" /> Pay Now
                </Button>
              </div>
            </div>
          </div>
        </StaggerItem>
      </div>

      {/* Fee breakdown + history */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={3}>
          <SectionCard title="Fee Breakdown" subtitle="Annual fee structure">
            <div className="space-y-2.5">
              {FEE_BREAKDOWN.map((f) => (
                <div key={f.label} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-3 py-2.5">
                  <span className="text-sm">{f.label}</span>
                  <span className="font-semibold">{formatINR(f.amount)}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between rounded-xl bg-violet-500/10 px-3 py-3 ring-1 ring-violet-500/20">
                <span className="text-sm font-semibold">Total Annual Fee</span>
                <span className="font-bold text-violet-600 dark:text-violet-400">{formatINR(me.feeTotal)}</span>
              </div>
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={4} className="lg:col-span-2">
          <SectionCard title="Payment History" subtitle="All transactions this session" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Invoice</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Method</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_HISTORY.map((p) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border/40 transition-colors hover:bg-accent/40"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs">{p.invoice}</td>
                      <td className="px-5 py-3">{p.method}</td>
                      <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-3 text-right font-semibold">{formatINR(p.amount)}</td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border">
                    <td colSpan={4} className="px-5 py-3 font-semibold">Total Paid</td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatINR(me.feePaid)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      {/* Quick stats */}
      <StaggerItem index={5}>
        <SectionCard title="Quick Stats" subtitle="At a glance">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill label="Total Fee" value={formatINR(me.feeTotal, true)} color="violet" />
            <StatPill label="Paid" value={formatINR(me.feePaid, true)} color="emerald" />
            <StatPill label="Outstanding" value={formatINR(outstanding, true)} color="rose" />
            <StatPill label="Payments Made" value={String(PAYMENT_HISTORY.length)} color="amber" />
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Payment simulation dialog */}
      <Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    Pay Fees Online
                  </DialogTitle>
                  <DialogDescription>Secure payment gateway • {SCHOOL.shortName}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="amount" className="text-xs uppercase tracking-wide">Amount (₹)</Label>
                    <div className="relative mt-1.5">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-xl pl-9 text-lg font-semibold" />
                    </div>
                    <button onClick={() => setAmount(String(outstanding))} className="mt-1.5 text-xs text-violet-600 dark:text-violet-400 hover:underline">
                      Pay full outstanding ({formatINR(outstanding)})
                    </button>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide">Payment Method</Label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {PAYMENT_METHODS.map((m) => {
                        const c = m.color
                        const ic = c === "violet" ? "ring-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                          : c === "fuchsia" ? "ring-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400"
                          : "ring-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        const active = method === m.id
                        return (
                          <button
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all",
                              active ? cn("border-current", ic) : "border-border/60 hover:border-violet-500/40",
                            )}
                          >
                            <m.icon className={cn("h-5 w-5", active && ic.split(" ").find((x) => x.startsWith("text-")))} />
                            <span className="text-xs font-medium">{m.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {PAYMENT_METHODS.find((m) => m.id === method)?.desc}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Convenience fee</span><span>₹0</span></div>
                    <div className="flex justify-between font-semibold"><span>Total payable</span><span>{formatINR(Number(amount) || 0)}</span></div>
                  </div>
                </div>
                <DialogFooter className="pt-2">
                  <Button variant="outline" className="rounded-xl" onClick={closeDialog}>Cancel</Button>
                  <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90" onClick={startPayment} disabled={!Number(amount)}>
                    <ShieldCheck className="h-4 w-4" /> Pay {formatINR(Number(amount) || 0)}
                  </Button>
                </DialogFooter>
              </motion.div>
            )}

            {stage === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-violet-500/20 border-t-violet-500"
                >
                  <Wallet className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </motion.div>
                <h3 className="mt-6 text-lg font-bold">Processing Payment…</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please don&apos;t close this window. Verifying with {PAYMENT_METHODS.find((m) => m.id === method)?.label}…
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 256-bit encrypted
                </div>
              </motion.div>
            )}

            {stage === "success" && (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-12 text-center">
                <div className="relative">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      animate={{ opacity: 0, x: Math.cos((i / 16) * Math.PI * 2) * 100, y: Math.sin((i / 16) * Math.PI * 2) * 100, scale: 0.2 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ background: ["#8b5cf6", "#d946ef", "#ec4899", "#10b981", "#f59e0b"][i % 5] }}
                    />
                  ))}
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl"
                  >
                    <Check className="h-10 w-10" />
                  </motion.div>
                </div>
                <h3 className="mt-6 text-xl font-bold">Payment Successful! 🎉</h3>
                <p className="mt-1 text-sm text-muted-foreground">{formatINR(Number(amount))} paid via {PAYMENT_METHODS.find((m) => m.id === method)?.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">Generating receipt…</p>
              </motion.div>
            )}

            {stage === "receipt" && (
              <motion.div key="receipt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Payment Receipt
                  </DialogTitle>
                  <DialogDescription>Transaction successful • Save for your records</DialogDescription>
                </DialogHeader>
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Receipt No.</p>
                      <p className="font-mono text-sm font-semibold">{receiptNo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-semibold">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="space-y-2 py-3 text-sm">
                    <Row label="Student" value={me.name} />
                    <Row label="Admission No" value={me.admissionNo} />
                    <Row label="Class" value={`${me.className} - ${me.section}`} />
                    <Row label="Method" value={PAYMENT_METHODS.find((m) => m.id === method)?.label || ""} />
                    <Row label="Invoice" value={`INV-2025-${Math.floor(Math.random() * 900 + 1100)}`} />
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed border-border pt-3">
                    <span className="text-sm font-semibold">Amount Paid</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatINR(Number(amount))}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" /> Payment verified • Thank you!
                  </div>
                </div>
                <DialogFooter className="pt-2">
                  <Button variant="outline" className="rounded-xl" onClick={closeDialog}>Close</Button>
                  <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90" onClick={() => toast.success("Receipt PDF download started! 📄")}>
                    <Download className="h-4 w-4" /> Download Receipt
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
