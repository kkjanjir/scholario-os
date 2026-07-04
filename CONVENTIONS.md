# SCHOLARIO-OS — Build Conventions for Subagents

Read this carefully before writing any code. Follow these patterns exactly.

## Tech Stack
Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui + framer-motion + recharts + zustand. Single-route SPA (only `/`).

## Every module file MUST:
1. Start with `"use client"`
2. Export the named component (e.g. `export function FeesModule()`)
3. Use realistic Indian school data from `@/lib/mock/data` — NEVER lorem ipsum, NEVER empty placeholders
4. Be fully interactive (clicks → toasts, forms → simulated submit, tables → search/filter, charts animate)
5. Be responsive (mobile-first: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
6. Use framer-motion for subtle entrance + hover animations

## Shared components — import from `@/components/shared/*`

### `@/components/shared/ui`
- `KpiCard({ label, value, icon, color, trend:{value,up}, suffix, prefix, decimals, index, onClick })` — animated counter KPI
- `SectionCard({ title, subtitle, action, children, className, bodyClassName })` — card with header
- `StatusBadge({ status })` — auto-colored pill for Paid/Pending/Late/Submitted/Reviewed/Open/Evaluated/Issued/Overdue/Scheduled/Ongoing/Completed/Maintenance/On Route/Reached School/Reorder/Good/Fair/New
- `MiniStat({ label, value, color, icon })`

### `@/components/shared/motion`
- `AnimatedCounter({ value, decimals, prefix, suffix })`
- `StaggerItem({ children, index, className })` — fade-up on mount with delay

### `@/components/shared/brand`
- `Avatar({ name, color, size:"xs"|"sm"|"md"|"lg"|"xl" })` — initials avatar
- `colorOf(color)` → `{ bg, text, ring, soft, dot }` for: emerald, teal, amber, orange, rose, violet, fuchsia, sky, cyan, pink, lime, indigo, slate
- `formatINR(n, compact?)` — ₹ formatting with L/Cr
- `Logo`

### `@/components/shared/charts` (recharts wrappers, already styled)
- `RevenueAreaChart({ data })` — data: `[{month,revenue,collection}]`
- `AttendanceBarChart({ data })` — data: `[{date,present,absent,late,leave}]`
- `DonutChart({ data })` — data: `[{name,value,color?}]`
- `RadialGauge({ value, label, color })`
- `SimpleLine({ data, dataKey, color, height })` — data: `[{name, ...}]`
- `SimpleBar({ data, dataKey, color, height })`

### `@/components/shared/module-common`
- `PageHeader({ title, description, action })`
- `Toolbar({ search, onSearch, placeholder, children })`
- `DataTable({ columns:[{key,label,className?}], rows:[{key:ReactNode}] })`
- `EmptyState({ icon, title, desc })`
- `StatPill({ label, value, color })`

## shadcn/ui available (`@/components/ui/*`)
Button, Card, Input, Label, Textarea, Select, Tabs (TabsList/TabsTrigger/TabsContent), Dialog (DialogTrigger/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter), Badge, Progress, Table, Checkbox, Switch, Separator, ScrollArea, DropdownMenu, Popover, Tooltip, Calendar, Sheet, Command, etc.

## Mock data — `@/lib/mock/data`
Exports: `SCHOOL`, `CLASSES`, `SECTIONS`, `SUBJECTS`, `CLASSES_INFO`, `TEACHERS`, `STUDENTS`, `FEE_STRUCTURE`, `REVENUE_TREND`, `FEE_INVOICES`, `SALARY_SLIPS`, `EXAMS`, `HOMEWORK`, `ASSIGNMENTS`, `LIBRARY_BOOKS`, `LIBRARY_ISSUES`, `TRANSPORT_ROUTES`, `DRIVERS`, `INVENTORY`, `ANNOUNCEMENTS`, `CALENDAR_EVENTS`, `TODAY_BIRTHDAYS`, `NEW_ADMISSIONS`, `TIMETABLE`, `DEMO_ACCOUNTS`
Functions: `attendanceForClass(className, section)` → `{data, total}`, `studentAttendanceHeatmap(studentId)`, `studentResult(studentId)`, `topPerformers(className)`

## Navigation
```ts
import { useAppStore } from "@/lib/store"
const setModule = useAppStore((s) => s.setModule)
setModule("principal" | "teacher" | "student", "moduleId")
```

## Toasts
```ts
import { toast } from "sonner"
toast.success("Saved!") | toast.error("...") | toast.info("...")
```

## Style rules
- Rounded corners: `rounded-2xl` for cards, `rounded-xl` for inner elements
- Shadows: `shadow-premium` (defined in globals.css)
- Borders: `border-border/60`
- Accents via `colorOf()` — combine `c.soft` + `c.text` for icon chips
- NO indigo/blue as primary. Role themes: principal=emerald, teacher=amber, student=violet
- Glass: `glass` or `glass-strong` classes
- Use `cn()` from `@/lib/utils` for conditional classes

## Animation patterns
```tsx
<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16,1,0.3,1] }}>
```
Hover: `whileHover={{ y: -3 }}` or `whileHover={{ scale: 1.01 }}` + `whileTap={{ scale: 0.98 }}` for buttons.

## Worklog (MANDATORY)
1. Read `/home/z/my-project/worklog.md` before starting.
2. After finishing, APPEND (do not overwrite) a section:
```
---
Task ID: <your id>
Agent: <name>
Task: <summary>

Work Log:
- <step>

Stage Summary:
- <artifacts produced>
```
