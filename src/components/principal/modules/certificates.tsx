"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  FileText, FileCheck, ScrollText, IdCard, Receipt, Search,
  Download, Sparkles, CheckCircle2, GraduationCap, Calendar, Shield,
} from "lucide-react"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Avatar, colorOf, Logo } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import { SCHOOL, STUDENTS, type Student } from "@/lib/mock/data"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

type CertType = "bonafide" | "tc" | "character" | "id" | "receipt"

const CERT_TYPES: { id: CertType; label: string; desc: string; icon: any; color: string }[] = [
  { id: "bonafide", label: "Bonafide Certificate", desc: "Proof of enrolment", icon: FileCheck, color: "emerald" },
  { id: "tc", label: "Transfer Certificate", desc: "School leaving record", icon: ScrollText, color: "rose" },
  { id: "character", label: "Character Certificate", desc: "Conduct & behaviour", icon: Shield, color: "violet" },
  { id: "id", label: "ID Card", desc: "Identity card print", icon: IdCard, color: "sky" },
  { id: "receipt", label: "Fee Receipt", desc: "Payment acknowledgement", icon: Receipt, color: "amber" },
]

export function CertificatesModule() {
  const [selectedType, setSelectedType] = useState<CertType>("bonafide")
  const [studentId, setStudentId] = useState(STUDENTS[0].id)
  const [search, setSearch] = useState("")
  const [generated, setGenerated] = useState(false)

  const student = STUDENTS.find((s) => s.id === studentId) || STUDENTS[0]
  const certConfig = CERT_TYPES.find((c) => c.id === selectedType)!

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return STUDENTS.slice(0, 30)
    return STUDENTS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q) || s.className.toLowerCase().includes(q)
    ).slice(0, 30)
  }, [search])

  const handleGenerate = () => {
    setGenerated(false)
    setTimeout(() => {
      setGenerated(true)
      toast.success(`${certConfig.label} generated`, {
        description: `${student.name} · ${student.admissionNo}`,
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificate Generation"
        description="Issue bonafide, transfer, character & ID certificates for students"
      />

      <StaggerItem index={0}>
        <SectionCard title="Select Certificate Type" subtitle="Choose the certificate to generate" bodyClassName="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CERT_TYPES.map((c, i) => {
              const Icon = c.icon
              const color = colorOf(c.color)
              const active = selectedType === c.id
              return (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3 }}
                  onClick={() => { setSelectedType(c.id); setGenerated(false) }}
                  className={cn(
                    "flex flex-col items-start rounded-2xl border p-4 text-left shadow-premium transition-colors",
                    active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/60 bg-card hover:bg-accent/30"
                  )}
                >
                  <div className={cn("rounded-xl p-2.5 ring-1", color.soft, color.ring)}>
                    <Icon className={cn("h-5 w-5", color.text)} />
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-tight">{c.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                </motion.button>
              )
            })}
          </div>
        </SectionCard>
      </StaggerItem>

      <div className="grid gap-4 lg:grid-cols-3">
        <StaggerItem index={1}>
          <SectionCard title="Select Student" subtitle="Search the student records" bodyClassName="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, admission no, class…" className="pl-9" />
            </div>
            <div className="max-h-[420px] space-y-1 overflow-y-auto rounded-xl border border-border/60">
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setStudentId(s.id); setGenerated(false) }}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                    s.id === studentId ? "bg-primary/10" : "hover:bg-accent/30"
                  )}
                >
                  <Avatar name={s.name} color={s.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.admissionNo} · {s.className} {s.section}</p>
                  </div>
                  {s.id === studentId && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem index={2} className="lg:col-span-2">
          <SectionCard
            title="Certificate Preview"
            subtitle={`${certConfig.label} · ${student.name}`}
            action={
              <Button onClick={handleGenerate} className="shadow-premium">
                <Sparkles className="h-4 w-4" /> Generate Certificate
              </Button>
            }
            bodyClassName="space-y-4"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedType}-${studentId}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <CertificatePreview type={selectedType} student={student} generated={generated} />
              </motion.div>
            </AnimatePresence>

            {generated && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                <Button variant="outline" size="sm" onClick={() => toast.success("Downloaded as PDF", { description: `${certConfig.label}_${student.admissionNo}.pdf` })}>
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Sent to registered email", { description: student.fatherName ? `Guardian of ${student.name}` : "" })}>
                  <FileText className="h-4 w-4" /> Email
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Print dialog opened")}>
                  <Receipt className="h-4 w-4" /> Print
                </Button>
              </motion.div>
            )}
          </SectionCard>
        </StaggerItem>
      </div>
    </div>
  )
}

function CertificatePreview({ type, student, generated }: { type: CertType; student: Student; generated: boolean }) {
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  const Header = (
    <div className="flex items-center gap-4 border-b-2 border-emerald-600/30 pb-4">
      <Logo size={56} />
      <div className="flex-1 text-center">
        <h2 className="text-xl font-bold tracking-tight">{SCHOOL.name}</h2>
        <p className="text-[11px] text-muted-foreground">{SCHOOL.tagline} · Estd. {SCHOOL.estd}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{SCHOOL.address}</p>
        <p className="text-[10px] text-muted-foreground">{SCHOOL.phone} · {SCHOOL.email}</p>
      </div>
      <Logo size={56} />
    </div>
  )

  if (type === "id") {
    return (
      <div className="mx-auto max-w-sm">
        <div className="overflow-hidden rounded-2xl border-2 border-emerald-600/30 shadow-premium">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-3 text-center text-white">
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{SCHOOL.shortName} Identity Card</p>
            <p className="text-sm font-bold">{SCHOOL.session}</p>
          </div>
          <div className="flex gap-4 p-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Avatar name={student.name} color={student.avatarColor} size="lg" />
              </div>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-600">{SCHOOL.shortName}</span>
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              <Field label="Name" value={student.name} />
              <Field label="Adm No" value={student.admissionNo} />
              <Field label="Class" value={`${student.className} ${student.section}`} />
              <Field label="Roll" value={String(student.rollNo)} />
              <Field label="Blood" value={student.bloodGroup} />
              <Field label="Phone" value={student.guardianPhone} />
            </div>
          </div>
          <div className="border-t border-border/60 bg-muted/40 px-4 py-2 text-center text-[9px] text-muted-foreground">
            If found, please return to: {SCHOOL.name}, Pune
          </div>
        </div>
      </div>
    )
  }

  if (type === "receipt") {
    return (
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-premium dark:bg-card">
        {Header}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Fee Receipt</p>
            <p className="text-xs text-muted-foreground">Receipt No: FR-2025-{student.admissionNo.slice(-4)}</p>
          </div>
          <div className="text-right text-xs">
            <p className="text-muted-foreground">Date</p>
            <p className="font-semibold">{today}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-4 text-sm">
          <Field label="Student" value={student.name} />
          <Field label="Admission No" value={student.admissionNo} />
          <Field label="Class" value={`${student.className} ${student.section}`} />
          <Field label="Payment Mode" value="UPI" />
        </div>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/40"><td className="py-2">Tuition Fee (Q3)</td><td className="py-2 text-right">₹{Math.round(student.feeTotal * 0.25).toLocaleString("en-IN")}</td></tr>
            <tr className="border-b border-border/40"><td className="py-2">Lab Fee</td><td className="py-2 text-right">₹875</td></tr>
            <tr className="border-b border-border/40"><td className="py-2">Exam Fee</td><td className="py-2 text-right">₹500</td></tr>
            <tr className="font-bold"><td className="py-2">Total Paid</td><td className="py-2 text-right">₹{student.feePaid.toLocaleString("en-IN")}</td></tr>
          </tbody>
        </table>
        <div className="mt-6 flex items-end justify-between">
          <div className="text-xs text-muted-foreground">
            <p>This is a computer-generated receipt.</p>
            <p>Balance due: ₹{(student.feeTotal - student.feePaid).toLocaleString("en-IN")}</p>
          </div>
          <div className="text-center">
            <div className="h-10 w-32 border-b border-border" />
            <p className="mt-1 text-[10px] text-muted-foreground">Authorised Signatory</p>
          </div>
        </div>
      </div>
    )
  }

  // Bonafide / TC / Character — share a similar formal layout
  const titles: Record<CertType, string> = {
    bonafide: "BONAFIDE CERTIFICATE",
    tc: "TRANSFER CERTIFICATE",
    character: "CHARACTER CERTIFICATE",
    id: "",
    receipt: "",
  }

  const body: Record<CertType, React.ReactNode> = {
    bonafide: (
      <p className="text-sm leading-relaxed">
        This is to certify that <span className="font-bold">{student.name}</span>, bearing Admission No. <span className="font-semibold">{student.admissionNo}</span>, is a bona fide student of <span className="font-semibold">{SCHOOL.name}</span>, currently studying in <span className="font-semibold">{student.className} - Section {student.section}</span> for the academic session <span className="font-semibold">{SCHOOL.session}</span>. The student's date of birth as per school records is <span className="font-semibold">{new Date(student.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>.
      </p>
    ),
    tc: (
      <div className="space-y-3 text-sm leading-relaxed">
        <p>
          This is to certify that <span className="font-bold">{student.name}</span>, S/o / D/o <span className="font-semibold">{student.fatherName}</span>, was a bona fide student of this institution. The following particulars are hereby confirmed:
        </p>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 text-xs">
          <Field label="Admission No" value={student.admissionNo} />
          <Field label="Date of Birth" value={new Date(student.dob).toLocaleDateString("en-IN")} />
          <Field label="Last Class" value={`${student.className} ${student.section}`} />
          <Field label="Admission Date" value={new Date(student.admissionDate).toLocaleDateString("en-IN")} />
          <Field label="Blood Group" value={student.bloodGroup} />
          <Field label="Fee Status" value={student.feeStatus} />
        </div>
        <p>The student's conduct has been <span className="font-semibold">satisfactory</span> during their tenure at this institution. This certificate is issued on request for transfer purposes.</p>
      </div>
    ),
    character: (
      <p className="text-sm leading-relaxed">
        This is to certify that <span className="font-bold">{student.name}</span>, Admission No. <span className="font-semibold">{student.admissionNo}</span>, was a student of <span className="font-semibold">{SCHOOL.name}</span> in <span className="font-semibold">{student.className} {student.section}</span>. To the best of our knowledge and observation, the student bears a good moral character, has been regular in attendance ({student.attendancePct}%), and has shown satisfactory conduct throughout the academic session {SCHOOL.session}.
      </p>
    ),
    id: null,
    receipt: null,
  }

  return (
    <div className="relative rounded-2xl border border-border/60 bg-white p-6 shadow-premium dark:bg-card lg:p-8">
      {generated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="absolute right-8 top-12 -rotate-12 rounded-xl border-2 border-emerald-500/40 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600"
        >
          ✓ Verified
        </motion.div>
      )}
      {Header}
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-bold tracking-wide text-emerald-700 dark:text-emerald-300">{titles[type]}</h3>
        <div className="mx-auto mt-2 h-0.5 w-32 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      </div>
      <div className="mt-6">{body[type]}</div>

      <div className="mt-8 flex items-end justify-between">
        <div>
          <div className="mb-1 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/30 text-[9px] font-bold uppercase text-emerald-600">
            SVM<br />SEAL
          </div>
          <p className="text-[10px] text-muted-foreground">Official Seal</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Date: <span className="font-semibold text-foreground">{today}</span></p>
          <div className="mt-3 h-10 w-40 border-b border-border" />
          <p className="mt-1 text-xs font-semibold">{SCHOOL.principal}</p>
          <p className="text-[10px] text-muted-foreground">Principal</p>
        </div>
      </div>

      <div className="mt-6 border-t border-border/40 pt-3 text-center text-[10px] text-muted-foreground">
        Ref: {SCHOOL.shortName}/{type.toUpperCase()}/{student.admissionNo.slice(-4)} · This is a computer-generated certificate and is digitally signed.
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}:</span>
      <span className="text-xs font-semibold">{value}</span>
    </div>
  )
}
