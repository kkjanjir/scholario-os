"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Search, BookOpen, BookCheck, BookX, AlertTriangle,
  Library, ArrowUpRight, Calendar, RotateCcw, BookMarked, Hash,
} from "lucide-react"

import { PageHeader, Toolbar, DataTable } from "@/components/shared/module-common"
import { SectionCard, StatusBadge, KpiCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import { DonutChart } from "@/components/shared/charts"
import {
  LIBRARY_BOOKS, LIBRARY_ISSUES, STUDENTS,
} from "@/lib/mock/data"

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

interface Book {
  id: string
  title: string
  author: string
  category: string
  copies: number
  available: number
  isbn: string
}
interface Issue {
  id: string
  book: string
  student: string
  admNo: string
  issueDate: string
  dueDate: string
  status: "Issued" | "Overdue" | "Returned"
  fine: number
}

const CATEGORY_COLORS: Record<string, string> = {
  Biography: "oklch(0.6 0.14 160)",
  History: "oklch(0.7 0.16 70)",
  Textbook: "oklch(0.62 0.18 300)",
  Science: "oklch(0.7 0.15 200)",
  Fiction: "oklch(0.65 0.2 15)",
  Essays: "oklch(0.68 0.19 0)",
  "Self-Help": "oklch(0.72 0.18 130)",
}

export function LibraryModule() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [issueOpen, setIssueOpen] = useState(false)
  const [issues, setIssues] = useState<Issue[]>(LIBRARY_ISSUES as Issue[])

  const filteredBooks = useMemo(() => {
    const q = search.toLowerCase().trim()
    return LIBRARY_BOOKS.filter((b) => {
      const matchesSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q)
      const matchesCat = category === "all" || b.category === category
      return matchesSearch && matchesCat
    })
  }, [search, category])

  const categories = Array.from(new Set(LIBRARY_BOOKS.map((b) => b.category)))

  const totalBooks = LIBRARY_BOOKS.reduce((a, b) => a + b.copies, 0)
  const issuedCount = LIBRARY_BOOKS.reduce((a, b) => a + (b.copies - b.available), 0)
  const availableCount = LIBRARY_BOOKS.reduce((a, b) => a + b.available, 0)
  const totalFines = issues.reduce((a, b) => a + b.fine, 0)

  const categoryStats = useMemo(() => {
    return categories.map((c) => {
      const books = LIBRARY_BOOKS.filter((b) => b.category === c)
      return {
        name: c,
        value: books.reduce((a, b) => a + b.copies, 0),
        color: CATEGORY_COLORS[c] || "oklch(0.65 0.2 15)",
      }
    })
  }, [categories])

  const handleIssue = (book: Book, studentId: string, dueDate: string) => {
    const student = STUDENTS.find((s) => s.id === studentId)
    if (!student) {
      toast.error("Select a valid student")
      return
    }
    const newIssue: Issue = {
      id: `li_${Date.now()}`,
      book: book.title,
      student: student.name,
      admNo: student.admissionNo,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate,
      status: "Issued",
      fine: 0,
    }
    setIssues((prev) => [newIssue, ...prev])
    setIssueOpen(false)
    toast.success("Book issued", { description: `${book.title} → ${student.name} · Due ${dueDate}` })
  }

  const handleReturn = (issue: Issue) => {
    setIssues((prev) => prev.map((i) => (i.id === issue.id ? { ...i, status: "Returned" } : i)))
    if (issue.fine > 0) {
      toast.success(`Book returned · Fine collected ${formatINR(issue.fine)}`, { description: `${issue.book} — ${issue.student}` })
    } else {
      toast.success("Book returned successfully", { description: `${issue.book} — ${issue.student}` })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Management"
        description="Catalog, issue & track books across the school library"
        action={
          <Button onClick={() => setIssueOpen(true)} className="shadow-premium">
            <Plus className="h-4 w-4" /> Issue Book
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard index={0} label="Total Books" value={totalBooks} icon={Library} color="emerald" />
        <KpiCard index={1} label="Issued" value={issuedCount} icon={BookOpen} color="violet" />
        <KpiCard index={2} label="Available" value={availableCount} icon={BookCheck} color="teal" />
        <KpiCard index={3} label="Overdue Fines" value={totalFines} prefix="₹" icon={AlertTriangle} color="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={0} className="lg:col-span-2">
          <SectionCard title="Book Catalog" subtitle={`${filteredBooks.length} of ${LIBRARY_BOOKS.length} titles`} bodyClassName="space-y-4">
            <Toolbar search={search} onSearch={setSearch} placeholder="Search by title, author or ISBN…">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Toolbar>

            {filteredBooks.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">No books match your search.</div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredBooks.map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} />
                ))}
              </div>
            )}
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={1}>
          <SectionCard title="Category Statistics" subtitle="Distribution of books">
            <DonutChart data={categoryStats} />
            <div className="mt-3 space-y-1.5">
              {categoryStats.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>
      </div>

      <StaggerItem index={2}>
        <SectionCard title="Issued Books" subtitle={`${issues.length} active issues`} bodyClassName="p-0">
          <DataTable
            columns={[
              { key: "book", label: "Book" },
              { key: "student", label: "Student" },
              { key: "issueDate", label: "Issued" },
              { key: "dueDate", label: "Due" },
              { key: "fine", label: "Fine" },
              { key: "status", label: "Status" },
              { key: "action", label: "", className: "text-right" },
            ]}
            rows={issues.map((iss) => ({
              book: <span className="font-medium">{iss.book}</span>,
              student: (
                <div className="flex items-center gap-2">
                  <Avatar name={iss.student} color="violet" size="xs" />
                  <div>
                    <p className="text-sm">{iss.student}</p>
                    <p className="text-[10px] text-muted-foreground">{iss.admNo}</p>
                  </div>
                </div>
              ),
              issueDate: <span className="text-xs text-muted-foreground">{iss.issueDate}</span>,
              dueDate: <span className="text-xs">{iss.dueDate}</span>,
              fine: <span className={cn("font-medium", iss.fine > 0 ? "text-rose-600" : "text-muted-foreground")}>{iss.fine > 0 ? formatINR(iss.fine) : "—"}</span>,
              status: <StatusBadge status={iss.status} />,
              action: iss.status === "Returned" ? (
                <span className="text-xs text-muted-foreground">Closed</span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReturn(iss)}
                >
                  <RotateCcw className="h-3 w-3" /> Return
                </Button>
              ),
            }))}
          />
        </SectionCard>
      </StaggerItem>

      <IssueBookDialog open={issueOpen} onOpenChange={setIssueOpen} onIssue={handleIssue} />
    </div>
  )
}

function BookCard({ book, index }: { book: Book; index: number }) {
  const pct = book.copies ? Math.round((book.available / book.copies) * 100) : 0
  const color = book.available === 0 ? "rose" : book.available < book.copies / 3 ? "amber" : "emerald"
  const c = colorOf(color)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium"
    >
      <div className="flex items-start gap-3">
        <div className={cn("rounded-lg p-2.5 ring-1", c.soft, c.ring)}>
          <BookMarked className={cn("h-4 w-4", c.text)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold">{book.title}</p>
          <p className="truncate text-xs text-muted-foreground">{book.author}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-medium">{book.category}</span>
        <span className="inline-flex items-center gap-1 text-muted-foreground"><Hash className="h-3 w-3" />{book.isbn}</span>
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Availability</span>
          <span className={cn("font-semibold", c.text)}>{book.available}/{book.copies}</span>
        </div>
        <Progress value={pct} className={cn("h-1.5", c.soft)} />
      </div>
    </motion.div>
  )
}

function IssueBookDialog({
  open, onOpenChange, onIssue,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onIssue: (book: Book, studentId: string, dueDate: string) => void
}) {
  const [bookId, setBookId] = useState("")
  const [studentId, setStudentId] = useState("")
  const [due, setDue] = useState("")

  const availableBooks = LIBRARY_BOOKS.filter((b) => b.available > 0)
  const sampleStudents = STUDENTS.slice(0, 25)

  const submit = () => {
    const book = LIBRARY_BOOKS.find((b) => b.id === bookId)
    if (!book) { toast.error("Select a book to issue"); return }
    if (!studentId) { toast.error("Select a student"); return }
    if (!due) { toast.error("Select a due date"); return }
    onIssue(book, studentId, due)
    setBookId(""); setStudentId(""); setDue("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Issue Book</DialogTitle>
          <DialogDescription>Lend a book to a student with a due date.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Book</Label>
            <Select value={bookId} onValueChange={setBookId}>
              <SelectTrigger className="w-full"><SelectValue placeholder={`${availableBooks.length} available`} /></SelectTrigger>
              <SelectContent>
                {availableBooks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.title} — {b.author}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Student</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>
                {sampleStudents.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name} · {s.className} {s.section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Calendar className="h-3.5 w-3.5" /> Issue Policy
            </div>
            <p className="mt-1">Books must be returned within 14 days. Late returns incur a fine of ₹5 per day. Lost books are charged at full replacement cost.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><ArrowUpRight className="h-4 w-4" /> Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
