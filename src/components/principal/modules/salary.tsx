"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Wallet, Banknote, Clock, TrendingUp, Search, Download,
  Play, CheckCircle2, FileText, Loader2, Sparkles, PiggyBank,
} from "lucide-react"

import { PageHeader, Toolbar } from "@/components/shared/module-common"
import { SectionCard, KpiCard, StatusBadge } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { DonutChart } from "@/components/shared/charts"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"

import { SALARY_SLIPS, TEACHERS, type SalarySlip } from "@/lib/mock/data"
import { cn } from "@/lib/utils"

export function SalaryModule() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [openSlip, setOpenSlip] = useState<SalarySlip | null>(null)
  const [processOpen, setProcessOpen] = useState(false)

  const filtered = useMemo(() => {
    return SALARY_SLIPS.filter((s) => {
      const q = search.toLowerCase()
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.empId.toLowerCase().includes(q)
      const matchStatus = statusFilter === "All" || s.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  // KPIs
  const totalPayroll = SALARY_SLIPS.reduce((a, s) => a + s.net, 0)
  const paid = SALARY_SLIPS.filter((s) => s.status === "Paid").reduce((a, s) => a + s.net, 0)
  const pending = SALARY_SLIPS.filter((s) => s.status === "Pending").reduce((a, s) => a + s.net, 0)
  const avgSalary = Math.round(totalPayroll / SALARY_SLIPS.length)

  // Distribution by department
  const deptMap: Record<string, number> = {}
  SALARY_SLIPS.forEach((s) => {
    const t = TEACHERS.find((x) => x.empId === s.empId)
    const dept = t?.department || "Other"
    deptMap[dept] = (deptMap[dept] || 0) + s.net
  })
  const COLORS = ["oklch(0.6 0.14 160)", "oklch(0.7 0.16 70)", "oklch(0.62 0.2 15)", "oklch(0.65 0.18 300)", "oklch(0.7 0.15 200)", "oklch(0.7 0.18 350)", "oklch(0.7 0.14 140)"]
  const donutData = Object.entries(deptMap).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary & Payroll"
        description="Employee payroll, salary slips & disbursement"
        action={
          <Button onClick={() => setProcessOpen(true)} className="gap-2">
            <Play className="h-4 w-4" /> Process Payroll
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Payroll" value={totalPayroll / 100000} prefix="₹" suffix="L" decimals={2} icon={Wallet} color="emerald" trend={{ value: 4.2, up: true }} />
        <KpiCard index={1} label="Disbursed" value={paid / 100000} prefix="₹" suffix="L" decimals={2} icon={Banknote} color="teal" trend={{ value: 2.8, up: true }} />
        <KpiCard index={2} label="Pending Payout" value={pending / 100000} prefix="₹" suffix="L" decimals={2} icon={Clock} color="rose" />
        <KpiCard index={3} label="Avg Salary" value={avgSalary / 1000} prefix="₹" suffix="K" decimals={1} icon={TrendingUp} color="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard
            title="Salary Slips"
            subtitle="November 2025 payroll cycle"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["All", "Paid", "Pending"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => toast.success("Payroll register exported")}>
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </div>
            }
            bodyClassName="p-0"
          >
            <Toolbar search={search} onSearch={setSearch} placeholder="Search by name or employee ID…" />
            <div className="overflow-x-auto border-t border-border/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-left">
                    {["Employee", "Emp ID", "Month", "Net Pay", "Status", ""].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => {
                    const t = TEACHERS.find((x) => x.empId === s.empId)
                    return (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="cursor-pointer border-b border-border/40 transition-colors hover:bg-accent/30"
                        onClick={() => setOpenSlip(s)}
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={s.name} color={t?.avatarColor || "emerald"} size="sm" />
                            <div>
                              <p className="font-medium">{s.name}</p>
                              <p className="text-[11px] text-muted-foreground">{s.designation}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{s.empId}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{s.month}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold">{formatINR(s.net)}</td>
                        <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={s.status} /></td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            <FileText className="h-3.5 w-3.5" /> View
                          </Button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
              <span>Showing {filtered.length} of {SALARY_SLIPS.length} slips</span>
              <span>Total: <span className="font-bold text-foreground">{formatINR(filtered.reduce((a, s) => a + s.net, 0))}</span></span>
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={2}>
          <SectionCard title="Department Distribution" subtitle="Salary payout by department">
            <DonutChart data={donutData} />
            <div className="mt-3 space-y-1.5">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold">{formatINR(d.value, true)}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      <SlipDialog slip={openSlip} onClose={() => setOpenSlip(null)} />
      <ProcessPayrollDialog open={processOpen} onClose={setProcessOpen} />
    </div>
  )
}

function SlipDialog({ slip, onClose }: { slip: SalarySlip | null; onClose: () => void }) {
  const t = slip ? TEACHERS.find((x) => x.empId === slip.empId) : null
  return (
    <Dialog open={!!slip} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Salary Slip · {slip?.month}
          </DialogTitle>
          <DialogDescription>
            {slip?.name} · {slip?.empId} · {slip?.designation}
          </DialogDescription>
        </DialogHeader>

        {slip && (
          <div className="space-y-4 py-1">
            {/* earnings & deductions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Earnings</p>
                <div className="space-y-1.5 text-sm">
                  <Row label="Basic" value={formatINR(slip.basic)} />
                  <Row label="HRA" value={formatINR(slip.hra)} />
                  <Row label="Allowances" value={formatINR(slip.allowances)} />
                  <div className="my-1 border-t border-emerald-500/20" />
                  <Row label="Gross" value={formatINR(slip.basic + slip.hra + slip.allowances)} bold />
                </div>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">Deductions</p>
                <div className="space-y-1.5 text-sm">
                  <Row label="PF" value={formatINR(Math.round(slip.deductions * 0.4))} />
                  <Row label="Prof. Tax" value={formatINR(200)} />
                  <Row label="TDS" value={formatINR(Math.round(slip.deductions * 0.6) - 200)} />
                  <div className="my-1 border-t border-rose-500/20" />
                  <Row label="Total" value={formatINR(slip.deductions)} bold />
                </div>
              </div>
            </div>

            {/* net pay */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-premium">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider opacity-80">Net Pay</p>
                  <p className="mt-1 text-3xl font-bold">{formatINR(slip.net)}</p>
                </div>
                {slip.status === "Paid" ? (
                  <div className="flex flex-col items-end">
                    <CheckCircle2 className="h-8 w-8" />
                    <p className="mt-1 text-xs">Paid on {slip.paidOn}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <Clock className="h-8 w-8" />
                    <p className="mt-1 text-xs">Pending</p>
                  </div>
                )}
              </div>
            </div>

            {t && (
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/30 p-3 text-xs">
                <InfoRow label="Bank A/c" value={`XXXX${(t.id.charCodeAt(4) % 9000) + 1000}`} />
                <InfoRow label="PAN" value={`${t.name.slice(0, 2).toUpperCase()}PK${(t.id.charCodeAt(4) % 9000) + 1000}K`} />
                <InfoRow label="Dept" value={t.department} />
                <InfoRow label="Designation" value={t.designation} />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={() => toast.success(`Payslip downloaded for ${slip?.name}`)}>
            <Download className="h-4 w-4" /> Download Slip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-muted-foreground", bold && "font-semibold text-foreground")}>{label}</span>
      <span className={cn(bold ? "font-bold" : "font-medium")}>{value}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

type Stage = "confirm" | "processing" | "done"

function ProcessPayrollDialog({ open, onClose }: { open: boolean; onClose: (v: boolean) => void }) {
  const [stage, setStage] = useState<Stage>("confirm")
  const pending = SALARY_SLIPS.filter((s) => s.status === "Pending")
  const pendingAmount = pending.reduce((a, s) => a + s.net, 0)

  function start() {
    setStage("processing")
    setTimeout(() => {
      setStage("done")
      toast.success("Payroll processed successfully!", {
        description: `${pending.length} salary slips disbursed · ${formatINR(pendingAmount)}`,
      })
    }, 2400)
  }

  function reset() {
    setStage("confirm")
    onClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && stage === "confirm") onClose(false) }}>
      <DialogContent className="sm:max-w-md" showCloseButton={stage === "confirm"}>
        <AnimatePresence mode="wait">
          {stage === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Process November Payroll
                </DialogTitle>
                <DialogDescription>
                  Review &amp; disburse pending salary slips.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Pending slips</p>
                      <p className="text-2xl font-bold">{pending.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total payout</p>
                      <p className="text-2xl font-bold">{formatINR(pendingAmount, true)}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                  ⚠️ Once processed, payslips will be generated &amp; mailed to all employees. This action cannot be undone.
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={start} className="gap-2">
                  <Play className="h-4 w-4" /> Process Now
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {stage === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 text-center">
              <div className="relative mx-auto mb-6 h-24 w-24">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-emerald-500/20"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold">Processing Payroll…</h3>
              <p className="mt-1 text-sm text-muted-foreground">Generating payslips &amp; initiating bank transfers</p>
              <div className="mx-auto mt-4 max-w-xs space-y-2">
                {["Validating employee records", "Calculating deductions", "Initiating NEFT transfers", "Emailing payslips"].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {stage === "done" && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/20"
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              {/* confetti burst */}
              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((i / 12) * Math.PI * 2) * 80,
                    y: Math.sin((i / 12) * Math.PI * 2) * 80,
                    scale: 0.4,
                  }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/3 h-2 w-2 rounded-full"
                  style={{ background: ["#10b981", "#f59e0b", "#8b5cf6", "#ec4899"][i % 4] }}
                />
              ))}
              <h3 className="text-xl font-bold">Payroll Processed!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {pending.length} salary slips disbursed successfully.
              </p>
              <div className="mt-4 rounded-xl bg-muted/40 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Disbursed</span>
                  <span className="font-bold">{formatINR(pendingAmount)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Completed</span>
                </div>
              </div>
              <Button onClick={reset} className="mt-4 w-full">Done</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
