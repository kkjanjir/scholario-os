"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Wallet, Clock, AlertCircle, CalendarRange, Search, Download,
  Banknote, CreditCard, Smartphone, Building2, Loader2, CheckCircle2,
  Receipt, ArrowRight, FileText,
} from "lucide-react"

import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, KpiCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { RevenueAreaChart } from "@/components/shared/charts"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"

import { FEE_INVOICES, FEE_STRUCTURE, REVENUE_TREND, type FeeInvoice } from "@/lib/mock/data"
import { cn } from "@/lib/utils"

export function FeesModule() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [openInvoice, setOpenInvoice] = useState<FeeInvoice | null>(null)
  const [payInvoice, setPayInvoice] = useState<FeeInvoice | null>(null)

  const filtered = useMemo(() => {
    return FEE_INVOICES.filter((inv) => {
      const q = search.toLowerCase()
      const matchSearch = !q || inv.studentName.toLowerCase().includes(q) || inv.invoiceNo.toLowerCase().includes(q) || inv.admissionNo.toLowerCase().includes(q)
      const matchStatus = statusFilter === "All" || inv.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  // KPIs
  const totalCollected = FEE_INVOICES.reduce((a, i) => a + i.paid, 0)
  const pendingAmt = FEE_INVOICES.filter((i) => i.status !== "Paid").reduce((a, i) => a + (i.amount - i.paid), 0)
  const overdue = FEE_INVOICES.filter((i) => i.status === "Pending").length
  const thisMonth = REVENUE_TREND[REVENUE_TREND.length - 1].collection * 100000

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management"
        description="Fee structure, invoices, payments & receipts"
        action={
          <Button variant="outline" onClick={() => toast.success("Fee report exported to PDF")}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Collected" value={totalCollected / 100000} prefix="₹" suffix="L" decimals={2} icon={Wallet} color="emerald" trend={{ value: 6.8, up: true }} />
        <KpiCard index={1} label="Pending" value={pendingAmt / 100000} prefix="₹" suffix="L" decimals={2} icon={Clock} color="amber" />
        <KpiCard index={2} label="Overdue Invoices" value={overdue} icon={AlertCircle} color="rose" trend={{ value: 3.1, up: false }} />
        <KpiCard index={3} label="This Month" value={thisMonth / 100000} prefix="₹" suffix="L" decimals={2} icon={CalendarRange} color="violet" trend={{ value: 8.4, up: true }} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* invoices table */}
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard
            title="Fee Invoices"
            subtitle={`${filtered.length} of ${FEE_INVOICES.length} invoices`}
            action={
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["All", "Paid", "Partial", "Pending"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            }
            bodyClassName="p-0"
          >
            <div className="border-b border-border/60 px-5 py-3">
              <Toolbar search={search} onSearch={setSearch} placeholder="Search student, invoice or admission no…" />
            </div>
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b border-border/60 bg-muted/30 text-left">
                    {["Student", "Invoice", "Amount", "Paid", "Status", ""].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv, i) => (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.015 }}
                      className="cursor-pointer border-b border-border/40 transition-colors hover:bg-accent/30"
                      onClick={() => setOpenInvoice(inv)}
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={inv.studentName} color={["emerald","violet","amber","rose","teal","sky"][i % 6]} size="sm" />
                          <div>
                            <p className="font-medium">{inv.studentName}</p>
                            <p className="text-[11px] text-muted-foreground">{inv.admissionNo} · {inv.className}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{inv.invoiceNo}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold">{formatINR(inv.amount)}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={cn(inv.paid === 0 ? "text-muted-foreground" : "font-medium")}>{formatINR(inv.paid)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={inv.status} /></td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {inv.status !== "Paid" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 text-xs text-emerald-600 dark:text-emerald-400"
                            onClick={(e) => { e.stopPropagation(); setPayInvoice(inv) }}
                          >
                            <Banknote className="h-3.5 w-3.5" /> Pay
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </StaggerItem>

        {/* revenue chart */}
        <StaggerItem index={2}>
          <SectionCard title="Revenue Trend" subtitle="Monthly collection (₹ Lakhs)">
            <RevenueAreaChart data={REVENUE_TREND} />
          </SectionCard>
        </StaggerItem>
      </div>

      {/* fee structure */}
      <StaggerItem index={3}>
        <SectionCard title="Fee Structure" subtitle="Standard fee schedule for academic year 2025–2026">
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left">
                  {["Category", "Applicable To", "Amount", "Frequency"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEE_STRUCTURE.map((f, i) => (
                  <motion.tr
                    key={f.category + i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/40 transition-colors hover:bg-accent/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{f.category}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{f.grade}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold">{formatINR(f.amount)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium">{f.frequency}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </StaggerItem>

      <InvoiceDialog invoice={openInvoice} onClose={() => setOpenInvoice(null)} onPay={(inv) => { setOpenInvoice(null); setPayInvoice(inv) }} />
      <PaymentDialog invoice={payInvoice} onClose={() => setPayInvoice(null)} />
    </div>
  )
}

function InvoiceDialog({ invoice, onClose, onPay }: {
  invoice: FeeInvoice | null; onClose: () => void; onPay: (inv: FeeInvoice) => void
}) {
  if (!invoice) return <Dialog open={false} onOpenChange={() => {}}><DialogContent /></Dialog>
  const balance = invoice.amount - invoice.paid
  const components = [
    { label: "Tuition Fee", amount: Math.round(invoice.amount * 0.72) },
    { label: "Transport Fee", amount: Math.round(invoice.amount * 0.20) },
    { label: "Library Fee", amount: 1500 },
    { label: "Lab Fee", amount: 3500 },
    { label: "Exam Fee", amount: 2000 },
  ]
  const adjusted = components.reduce((a, c) => a + c.amount, 0)
  if (components[0]) components[0].amount += invoice.amount - adjusted

  return (
    <Dialog open={!!invoice} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Invoice {invoice.invoiceNo}
          </DialogTitle>
          <DialogDescription>{invoice.studentName} · {invoice.admissionNo} · {invoice.className}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="grid grid-cols-3 gap-3">
            <MiniInfo label="Total Amount" value={formatINR(invoice.amount)} />
            <MiniInfo label="Paid" value={formatINR(invoice.paid)} color="emerald" />
            <MiniInfo label="Balance" value={formatINR(balance)} color={balance > 0 ? "rose" : "emerald"} />
          </div>

          <div className="rounded-xl border border-border/60">
            <div className="border-b border-border/60 bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Fee Breakdown
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border/40">
                {components.map((c) => (
                  <tr key={c.label}>
                    <td className="px-4 py-2 text-muted-foreground">{c.label}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatINR(c.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/20 font-bold">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2 text-right">{formatINR(invoice.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Due Date</p>
              <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Payment Method</p>
              <p className="font-medium">{invoice.method || "—"}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => toast.success("Invoice downloaded")}>
            <Download className="h-4 w-4" /> Download
          </Button>
          {invoice.status !== "Paid" ? (
            <Button onClick={() => onPay(invoice)} className="gap-2">
              <Banknote className="h-4 w-4" /> Collect Payment
            </Button>
          ) : (
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MiniInfo({ label, value, color = "default" }: { label: string; value: string; color?: string }) {
  const c = color !== "default" ? colorOf(color) : null
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-3 text-center">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-sm font-bold", c?.text)}>{value}</p>
    </div>
  )
}

type Stage = "method" | "processing" | "success" | "receipt"

function PaymentDialog({ invoice, onClose }: { invoice: FeeInvoice | null; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("method")
  const [method, setMethod] = useState<string>("UPI")
  const [amount, setAmount] = useState<string>("")
  const [receiptNo, setReceiptNo] = useState<string>("")

  const balance = invoice ? invoice.amount - invoice.paid : 0

  function startPayment() {
    const amt = Number(amount) || balance
    if (amt <= 0) { toast.error("Enter a valid amount"); return }
    setStage("processing")
    setTimeout(() => {
      const rcp = `RCP-2025-${Math.floor(1000 + Math.random() * 9000)}`
      setReceiptNo(rcp)
      setStage("success")
      toast.success("Payment successful!", { description: `${formatINR(amt)} via ${method} · ${rcp}` })
      setTimeout(() => setStage("receipt"), 1500)
    }, 2000)
  }

  function reset() {
    setStage("method")
    setAmount("")
    setReceiptNo("")
    onClose()
  }

  const methods = [
    { id: "UPI", label: "UPI", icon: Smartphone, color: "violet" },
    { id: "Card", label: "Card", icon: CreditCard, color: "emerald" },
    { id: "Net Banking", label: "Net Banking", icon: Building2, color: "sky" },
    { id: "Cash", label: "Cash", icon: Banknote, color: "amber" },
  ]

  return (
    <Dialog open={!!invoice} onOpenChange={(o) => { if (!o && stage === "method") onClose() }}>
      <DialogContent className="sm:max-w-md" showCloseButton={stage === "method"}>
        <AnimatePresence mode="wait">
          {stage === "method" && invoice && (
            <motion.div key="method" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Collect Payment
                </DialogTitle>
                <DialogDescription>{invoice.studentName} · {invoice.invoiceNo}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-1">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <MiniInfo label="Total" value={formatINR(invoice.amount)} />
                  <MiniInfo label="Paid" value={formatINR(invoice.paid)} color="emerald" />
                  <MiniInfo label="Balance" value={formatINR(balance)} color="rose" />
                </div>

                <div>
                  <Label className="mb-2">Select Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {methods.map((m) => {
                      const c = colorOf(m.color)
                      const active = method === m.id
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMethod(m.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                            active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border/60 hover:bg-accent/30"
                          )}
                        >
                          <div className={cn("rounded-lg p-1.5", c.soft)}>
                            <m.icon className={cn("h-4 w-4", c.text)} />
                          </div>
                          <span className="text-sm font-medium">{m.label}</span>
                          {active && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5">Amount (₹)</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Max ${formatINR(balance)}`}
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <button onClick={() => setAmount(String(balance))} className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      Full Balance ({formatINR(balance, true)})
                    </button>
                    <button onClick={() => setAmount(String(Math.round(balance / 2)))} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Half
                    </button>
                    <button onClick={() => setAmount(String(Math.round(balance / 4)))} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Quarter
                    </button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={startPayment} className="gap-2">
                  <ArrowRight className="h-4 w-4" /> Pay {amount ? formatINR(Number(amount)) : formatINR(balance)}
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {stage === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 text-center">
              <div className="relative mx-auto mb-6 h-24 w-24">
                <motion.div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
                <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold">Processing Payment…</h3>
              <p className="mt-1 text-sm text-muted-foreground">{method} · {formatINR(Number(amount) || balance)}</p>
              <p className="mt-3 text-xs text-muted-foreground">Please do not close this window</p>
            </motion.div>
          )}

          {stage === "success" && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/20"
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              {[...Array(14)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((i / 14) * Math.PI * 2) * 90,
                    y: Math.sin((i / 14) * Math.PI * 2) * 90,
                    scale: 0.3,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/3 h-2 w-2 rounded-full"
                  style={{ background: ["#10b981", "#f59e0b", "#8b5cf6", "#ec4899"][i % 4] }}
                />
              ))}
              <h3 className="text-xl font-bold">Payment Successful!</h3>
              <p className="mt-1 text-sm text-muted-foreground">Generating receipt…</p>
            </motion.div>
          )}

          {stage === "receipt" && invoice && (
            <motion.div key="receipt" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Payment Receipt
                </DialogTitle>
                <DialogDescription>{receiptNo}</DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-5">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Sri Vidya Mandir</p>
                    <p className="text-[10px] text-muted-foreground">Fee Receipt · 2025–2026</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-1.5 py-3 text-sm">
                  <RRow label="Receipt No" value={receiptNo} />
                  <RRow label="Student" value={invoice.studentName} />
                  <RRow label="Admission No" value={invoice.admissionNo} />
                  <RRow label="Class" value={invoice.className} />
                  <RRow label="Invoice" value={invoice.invoiceNo} />
                  <RRow label="Method" value={method} />
                  <RRow label="Date" value={new Date().toLocaleDateString("en-IN")} />
                  <div className="my-2 border-t border-emerald-500/20" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Amount Paid</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatINR(Number(amount) || balance)}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => { toast.success("Receipt downloaded"); reset() }} className="gap-2">
                  <Download className="h-4 w-4" /> Download Receipt
                </Button>
                <Button onClick={reset}>Done</Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

function RRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
