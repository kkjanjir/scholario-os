"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Search, Package, Boxes, AlertTriangle, Wallet,
  Armchair, FlaskConical, PencilRuler, Cpu, Trophy, PackageCheck,
} from "lucide-react"

import { PageHeader, Toolbar, DataTable } from "@/components/shared/module-common"
import { SectionCard, StatusBadge, KpiCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { formatINR, colorOf } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import { DonutChart } from "@/components/shared/charts"
import { INVENTORY } from "@/lib/mock/data"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface InventoryItem {
  id: string
  category: string
  item: string
  total: number
  available: number
  condition: "Good" | "Fair" | "New" | "Reorder"
  value: number
}

const CATEGORY_META: Record<string, { icon: any; color: string }> = {
  Furniture: { icon: Armchair, color: "emerald" },
  "Lab Equipment": { icon: FlaskConical, color: "violet" },
  Stationery: { icon: PencilRuler, color: "amber" },
  Electronics: { icon: Cpu, color: "sky" },
  Sports: { icon: Trophy, color: "rose" },
}

const DONUT_COLORS: Record<string, string> = {
  Furniture: "oklch(0.6 0.14 160)",
  "Lab Equipment": "oklch(0.62 0.18 300)",
  Stationery: "oklch(0.7 0.16 70)",
  Electronics: "oklch(0.7 0.15 230)",
  Sports: "oklch(0.65 0.2 15)",
}

export function InventoryModule() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [addOpen, setAddOpen] = useState(false)
  const [list, setList] = useState<InventoryItem[]>(INVENTORY as InventoryItem[])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return list.filter((it) => {
      const matchesSearch = !q || it.item.toLowerCase().includes(q) || it.category.toLowerCase().includes(q)
      const matchesCat = category === "all" || it.category === category
      return matchesSearch && matchesCat
    })
  }, [list, search, category])

  const totalValue = list.reduce((a, b) => a + b.value, 0)
  const totalItems = list.reduce((a, b) => a + b.total, 0)
  const reorderCount = list.filter((it) => it.condition === "Reorder" || it.available < it.total * 0.25).length

  const categorySummaries = useMemo(() => {
    const cats = Object.keys(CATEGORY_META)
    return cats.map((cat) => {
      const items = list.filter((it) => it.category === cat)
      const value = items.reduce((a, b) => a + b.value, 0)
      const count = items.reduce((a, b) => a + b.total, 0)
      return { category: cat, value, count, itemCount: items.length }
    })
  }, [list])

  const donutData = categorySummaries.map((c) => ({
    name: c.category,
    value: c.value,
    color: DONUT_COLORS[c.category],
  }))

  const handleAdd = (data: { item: string; category: string; total: number; condition: InventoryItem["condition"]; value: number }) => {
    const newItem: InventoryItem = {
      id: `i_${Date.now()}`,
      category: data.category,
      item: data.item,
      total: data.total,
      available: data.total,
      condition: data.condition,
      value: data.value,
    }
    setList((p) => [newItem, ...p])
    setAddOpen(false)
    toast.success("Inventory item added", { description: `${data.item} · ${data.category}` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Track stock levels, condition & valuation across all school assets"
        action={
          <Button onClick={() => setAddOpen(true)} className="shadow-premium">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Value" value={totalValue / 100000} prefix="₹" suffix="L" decimals={2} icon={Wallet} color="emerald" trend={{ value: 2.1, up: true }} />
        <KpiCard index={1} label="Total Items" value={totalItems} icon={Boxes} color="violet" />
        <KpiCard index={2} label="Categories" value={Object.keys(CATEGORY_META).length} icon={Package} color="teal" />
        <KpiCard index={3} label="Reorder Alerts" value={reorderCount} icon={AlertTriangle} color="rose" />
      </div>

      <StaggerItem index={0}>
        <SectionCard title="Category Summary" subtitle="Stock value & item count per category">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categorySummaries.map((c, i) => {
              const meta = CATEGORY_META[c.category]
              const Icon = meta.icon
              const color = colorOf(meta.color)
              return (
                <motion.div
                  key={c.category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium"
                >
                  <div className={cn("rounded-xl p-2.5 ring-1", color.soft, color.ring)}>
                    <Icon className={cn("h-4 w-4", color.text)} />
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.category}</p>
                  <p className="mt-1 text-lg font-bold">{formatINR(c.value, true)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.count} units · {c.itemCount} types</p>
                </motion.div>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1} className="lg:col-span-2">
          <SectionCard title="Inventory Items" subtitle={`${filtered.length} of ${list.length} items`} bodyClassName="space-y-4">
            <Toolbar search={search} onSearch={setSearch} placeholder="Search items…">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="All categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {Object.keys(CATEGORY_META).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Toolbar>
            <DataTable
              columns={[
                { key: "item", label: "Item" },
                { key: "category", label: "Category" },
                { key: "stock", label: "Stock" },
                { key: "condition", label: "Condition" },
                { key: "value", label: "Value", className: "text-right" },
              ]}
              rows={filtered.map((it) => {
                const pct = Math.round((it.available / it.total) * 100)
                const stockColor = it.condition === "Reorder" ? "rose" : pct < 25 ? "rose" : pct < 50 ? "amber" : "emerald"
                const c = colorOf(stockColor)
                const isAlert = it.condition === "Reorder" || pct < 25
                return {
                  item: (
                    <div className="flex items-center gap-2">
                      {isAlert && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
                      <span className="font-medium">{it.item}</span>
                    </div>
                  ),
                  category: <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{it.category}</span>,
                  stock: (
                    <div className="w-32">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className={cn("font-semibold", c.text)}>{it.available}/{it.total}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className={cn("h-1.5", c.soft)} />
                    </div>
                  ),
                  condition: <StatusBadge status={it.condition} />,
                  value: <span className="font-semibold">{formatINR(it.value)}</span>,
                }
              })}
            />
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={2}>
          <SectionCard title="Category Distribution" subtitle="Value by category">
            <DonutChart data={donutData} />
            <div className="mt-3 space-y-2">
              {donutData.map((d) => {
                const pct = Math.round((d.value / totalValue) * 100)
                return (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ml-auto font-semibold">{formatINR(d.value, true)}</span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 rounded-xl border border-border/60 bg-card/50 p-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Total Inventory Value</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{formatINR(totalValue)}</p>
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      <AddItemDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAdd} />
    </div>
  )
}

function AddItemDialog({
  open, onOpenChange, onAdd,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onAdd: (data: { item: string; category: string; total: number; condition: InventoryItem["condition"]; value: number }) => void
}) {
  const [item, setItem] = useState("")
  const [cat, setCat] = useState("Furniture")
  const [total, setTotal] = useState(10)
  const [condition, setCondition] = useState<InventoryItem["condition"]>("New")
  const [value, setValue] = useState(5000)

  const submit = () => {
    if (!item) { toast.error("Item name is required"); return }
    onAdd({ item, category: cat, total, condition, value })
    setItem(""); setTotal(10); setValue(5000); setCondition("New")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>Register a new asset in the school inventory.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Item Name</Label>
            <Input value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g., Whiteboard Markers" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORY_META).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Quantity</Label>
              <Input type="number" value={total} onChange={(e) => setTotal(parseInt(e.target.value || "0", 10))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Condition</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as InventoryItem["condition"])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Reorder">Reorder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Value (₹)</Label>
              <Input type="number" value={value} onChange={(e) => setValue(parseInt(e.target.value || "0", 10))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Plus className="h-4 w-4" /> Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
