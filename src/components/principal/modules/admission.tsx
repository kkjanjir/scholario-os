"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  User, Users, Phone, MapPin, School, HeartPulse, GraduationCap,
  Bus, FileText, Camera, CheckCircle2, ChevronLeft, ChevronRight,
  Download, Sparkles, Loader2, IdCard, BookOpen, Wallet, Home, Award,
} from "lucide-react"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { Avatar, colorOf, formatINR } from "@/components/shared/brand"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"

import { CLASSES, SECTIONS, FEE_STRUCTURE, TRANSPORT_ROUTES } from "@/lib/mock/data"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 0, label: "Personal Details", icon: User, desc: "Basic information about the student" },
  { id: 1, label: "Parents Details", icon: Users, desc: "Father & mother information" },
  { id: 2, label: "Emergency Contact", icon: Phone, desc: "Alternate contact person" },
  { id: 3, label: "Address", icon: MapPin, desc: "Residential address" },
  { id: 4, label: "Previous School", icon: School, desc: "Prior education history" },
  { id: 5, label: "Medical Info", icon: HeartPulse, desc: "Health & medical records" },
  { id: 6, label: "Class & Section", icon: GraduationCap, desc: "Allocate class & section" },
  { id: 7, label: "Transport & Hostel", icon: Bus, desc: "Optional facilities" },
  { id: 8, label: "Documents", icon: FileText, desc: "Verify required documents" },
  { id: 9, label: "Photo Upload", icon: Camera, desc: "Student photograph" },
  { id: 10, label: "Preview", icon: Sparkles, desc: "Review & submit application" },
  { id: 11, label: "Confirmation", icon: CheckCircle2, desc: "Admission confirmed" },
]

type FormState = {
  // personal
  firstName: string; middleName: string; lastName: string; dob: string
  gender: string; bloodGroup: string; aadhaar: string; religion: string
  motherTongue: string; nationality: string
  // parents
  fatherName: string; fatherOccupation: string; fatherPhone: string; fatherEmail: string
  motherName: string; motherOccupation: string; motherPhone: string; motherEmail: string
  // emergency
  emergencyName: string; emergencyRelation: string; emergencyPhone: string; emergencyAlt: string
  // address
  house: string; street: string; area: string; city: string; state: string; pincode: string; country: string
  // previous school
  prevSchool: string; prevClass: string; prevYear: string; prevTc: boolean; prevMedium: string; prevPercent: string
  // medical
  allergies: string; chronic: string; medications: string; vaccination: string; doctorName: string; doctorPhone: string
  // class
  className: string; section: string
  // transport
  transportReq: boolean; routeNo: string; hostelReq: boolean; hostelType: string
  // documents
  docs: Record<string, boolean>
  // photo
  photoUploaded: boolean
}

const initialForm: FormState = {
  firstName: "", middleName: "", lastName: "", dob: "",
  gender: "Male", bloodGroup: "A+", aadhaar: "", religion: "Hindu",
  motherTongue: "Hindi", nationality: "Indian",
  fatherName: "", fatherOccupation: "", fatherPhone: "", fatherEmail: "",
  motherName: "", motherOccupation: "", motherPhone: "", motherEmail: "",
  emergencyName: "", emergencyRelation: "Father", emergencyPhone: "", emergencyAlt: "",
  house: "", street: "", area: "", city: "Pune", state: "Maharashtra", pincode: "", country: "India",
  prevSchool: "", prevClass: "", prevYear: "2024", prevTc: false, prevMedium: "English", prevPercent: "",
  allergies: "None", chronic: "None", medications: "None", vaccination: "Up to date", doctorName: "", doctorPhone: "",
  className: "Grade 6", section: "A",
  transportReq: false, routeNo: "", hostelReq: false, hostelType: "",
  docs: {},
  photoUploaded: false,
}

export function AdmissionModule() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)

  // generated IDs (after submit)
  const [receipt, setReceipt] = useState({
    studentId: "", admissionNo: "", rollNo: "", libraryId: "", transportId: "",
    feeAccount: 0,
  })

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function next() {
    if (step === 10) { submit(); return }
    setStep((s) => Math.min(s + 1, 11))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  function jump(s: number) {
    if (s <= step) setStep(s)
  }

  function submit() {
    if (!form.firstName || !form.lastName || !form.fatherName) {
      toast.error("Please fill required fields (name, father's name)")
      setStep(0)
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      // Generate IDs
      const seq = String(Math.floor(2 + Math.random() * 98)).padStart(4, "0")
      const lib = String(2800 + Math.floor(Math.random() * 199))
      const trp = form.transportReq ? `TRP-${100 + Math.floor(Math.random() * 6)}` : "—"
      const roll = String(Math.floor(1 + Math.random() * 40)).padStart(2, "0")
      const feeBase = FEE_STRUCTURE.find((f) => f.category === "Tuition Fee" && f.grade === form.className)?.amount || 28000
      const transportFee = form.transportReq ? 12000 : 0
      const hostelFee = form.hostelReq ? 65000 : 0
      const totalFee = feeBase + transportFee + hostelFee + 1500 + 2000

      setReceipt({
        studentId: `SVM2026-${seq}`,
        admissionNo: `SVM2025${String(2500 + Math.floor(Math.random() * 99))}`,
        rollNo: roll,
        libraryId: `LIB-${lib}`,
        transportId: trp,
        feeAccount: totalFee,
      })
      setSubmitting(false)
      setShowSuccess(true)
      setStep(11)
      toast.success("Admission confirmed!", {
        description: `${form.firstName} ${form.lastName} · Student ID SVM2026-${seq}`,
      })
    }, 1600)
  }

  function reset() {
    setForm(initialForm)
    setStep(0)
    setShowSuccess(false)
    setReceiptOpen(false)
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Admission"
        description="Multi-step admission wizard for new enrolments"
        action={
          step > 0 && step < 11 && (
            <Button variant="outline" onClick={reset} className="gap-2">
              Reset Application
            </Button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <SectionCard title="Admission Steps" subtitle={`${step + 1} of ${STEPS.length}`} className="h-fit lg:sticky lg:top-4">
          <div className="space-y-1.5">
            {STEPS.map((s, i) => {
              const isDone = i < step
              const isActive = i === step
              const isFuture = i > step
              const c = isDone ? colorOf("emerald") : isActive ? colorOf("emerald") : colorOf("slate")
              return (
                <button
                  key={s.id}
                  onClick={() => jump(i)}
                  disabled={isFuture && step !== 11}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all",
                    isActive && "bg-emerald-500/10 ring-1 ring-emerald-500/30",
                    isDone && "hover:bg-accent/40",
                    isFuture && step !== 11 && "cursor-not-allowed opacity-50",
                    isFuture && step === 11 && "opacity-60",
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all",
                    isDone ? "bg-emerald-500 text-white" : isActive ? c.soft + " " + c.text + " ring-1 " + c.ring : "bg-muted text-muted-foreground"
                  )}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>{s.label}</p>
                  </div>
                  <s.icon className={cn("h-3.5 w-3.5", isActive ? c.text : "text-muted-foreground/60")} />
                </button>
              )
            })}
          </div>
          <div className="mt-4 border-t border-border/60 pt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </SectionCard>

        {/* Main content */}
        <SectionCard
          title={STEPS[step].label}
          subtitle={STEPS[step].desc}
          action={<Badge>{step + 1} / {STEPS.length}</Badge>}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[420px]"
            >
              {/* render step content */}
              {step === 0 && <PersonalStep form={form} update={update} />}
              {step === 1 && <ParentsStep form={form} update={update} />}
              {step === 2 && <EmergencyStep form={form} update={update} />}
              {step === 3 && <AddressStep form={form} update={update} />}
              {step === 4 && <PrevSchoolStep form={form} update={update} />}
              {step === 5 && <MedicalStep form={form} update={update} />}
              {step === 6 && <ClassStep form={form} update={update} />}
              {step === 7 && <TransportStep form={form} update={update} />}
              {step === 8 && <DocumentsStep form={form} update={update} />}
              {step === 9 && <PhotoStep form={form} update={update} />}
              {step === 10 && <PreviewStep form={form} />}
              {step === 11 && (
                <ConfirmationStep
                  form={form}
                  receipt={receipt}
                  showSuccess={showSuccess}
                  onViewReceipt={() => setReceiptOpen(true)}
                  onReset={reset}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 11 && (
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <Button variant="outline" onClick={back} disabled={step === 0 || submitting} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              {step === 10 ? (
                <Button onClick={next} disabled={submitting} className="gap-2">
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <><CheckCircle2 className="h-4 w-4" /> Submit Application</>}
                </Button>
              ) : (
                <Button onClick={next} className="gap-2">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </SectionCard>
      </div>

      <ReceiptDialog open={receiptOpen} onOpenChange={setReceiptOpen} form={form} receipt={receipt} />
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
      {children}
    </span>
  )
}

// ====================== STEP COMPONENTS ======================

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-rose-500"> *</span>}</Label>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function PersonalStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <Grid>
      <Field label="First Name" required>
        <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Aarav" />
      </Field>
      <Field label="Middle Name">
        <Input value={form.middleName} onChange={(e) => update("middleName", e.target.value)} placeholder="Kumar" />
      </Field>
      <Field label="Last Name" required>
        <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Sharma" />
      </Field>
      <Field label="Date of Birth">
        <Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
      </Field>
      <Field label="Gender">
        <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Male", "Female", "Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Blood Group">
        <Select value={form.bloodGroup} onValueChange={(v) => update("bloodGroup", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Aadhaar Number">
        <Input value={form.aadhaar} onChange={(e) => update("aadhaar", e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={14} />
      </Field>
      <Field label="Religion">
        <Select value={form.religion} onValueChange={(v) => update("religion", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Mother Tongue">
        <Select value={form.motherTongue} onValueChange={(v) => update("motherTongue", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Hindi", "Marathi", "English", "Tamil", "Telugu", "Kannada", "Bengali", "Gujarati", "Punjabi", "Urdu"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Nationality">
        <Input value={form.nationality} onChange={(e) => update("nationality", e.target.value)} />
      </Field>
    </Grid>
  )
}

function ParentsStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Father's Details</p>
        <Grid>
          <Field label="Father's Name" required>
            <Input value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} placeholder="Rajesh Sharma" />
          </Field>
          <Field label="Occupation">
            <Input value={form.fatherOccupation} onChange={(e) => update("fatherOccupation", e.target.value)} placeholder="Software Engineer" />
          </Field>
          <Field label="Phone">
            <Input value={form.fatherPhone} onChange={(e) => update("fatherPhone", e.target.value)} placeholder="+91 98xxx xxxxx" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.fatherEmail} onChange={(e) => update("fatherEmail", e.target.value)} placeholder="rajesh@example.com" />
          </Field>
        </Grid>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">Mother's Details</p>
        <Grid>
          <Field label="Mother's Name">
            <Input value={form.motherName} onChange={(e) => update("motherName", e.target.value)} placeholder="Priya Sharma" />
          </Field>
          <Field label="Occupation">
            <Input value={form.motherOccupation} onChange={(e) => update("motherOccupation", e.target.value)} placeholder="Doctor" />
          </Field>
          <Field label="Phone">
            <Input value={form.motherPhone} onChange={(e) => update("motherPhone", e.target.value)} placeholder="+91 98xxx xxxxx" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.motherEmail} onChange={(e) => update("motherEmail", e.target.value)} placeholder="priya@example.com" />
          </Field>
        </Grid>
      </div>
    </div>
  )
}

function EmergencyStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <Grid>
      <Field label="Contact Name" required>
        <Input value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} placeholder="Suresh Sharma" />
      </Field>
      <Field label="Relation">
        <Select value={form.emergencyRelation} onValueChange={(v) => update("emergencyRelation", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Father", "Mother", "Grandfather", "Grandmother", "Uncle", "Aunt", "Guardian"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Phone" required>
        <Input value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} placeholder="+91 98xxx xxxxx" />
      </Field>
      <Field label="Alternate Phone">
        <Input value={form.emergencyAlt} onChange={(e) => update("emergencyAlt", e.target.value)} placeholder="+91 98xxx xxxxx" />
      </Field>
    </Grid>
  )
}

function AddressStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="sm:col-span-2 lg:col-span-3">
        <Field label="House / Flat No">
          <Input value={form.house} onChange={(e) => update("house", e.target.value)} placeholder="Flat 402, Sunrise Apartments" />
        </Field>
      </div>
      <Field label="Street">
        <Input value={form.street} onChange={(e) => update("street", e.target.value)} placeholder="Baner Road" />
      </Field>
      <Field label="Area">
        <Input value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="Baner" />
      </Field>
      <Field label="City">
        <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
      </Field>
      <Field label="State">
        <Input value={form.state} onChange={(e) => update("state", e.target.value)} />
      </Field>
      <Field label="Pincode" required>
        <Input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="411045" maxLength={6} />
      </Field>
      <Field label="Country">
        <Input value={form.country} onChange={(e) => update("country", e.target.value)} />
      </Field>
    </div>
  )
}

function PrevSchoolStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <Grid>
      <div className="sm:col-span-2 lg:col-span-3">
        <Field label="Previous School Name">
          <Input value={form.prevSchool} onChange={(e) => update("prevSchool", e.target.value)} placeholder="Delhi Public School, Pune" />
        </Field>
      </div>
      <Field label="Last Class Attended">
        <Select value={form.prevClass} onValueChange={(v) => update("prevClass", v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
          <SelectContent>
            {CLASSES.slice(0, 12).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Year of Leaving">
        <Input value={form.prevYear} onChange={(e) => update("prevYear", e.target.value)} placeholder="2024" />
      </Field>
      <Field label="Medium of Instruction">
        <Select value={form.prevMedium} onValueChange={(v) => update("prevMedium", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["English", "Hindi", "Marathi", "Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Last Scored %">
        <Input type="number" value={form.prevPercent} onChange={(e) => update("prevPercent", e.target.value)} placeholder="85" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Transfer Certificate">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
            <Checkbox
              checked={form.prevTc}
              onCheckedChange={(v) => update("prevTc", !!v)}
              id="tc"
            />
            <Label htmlFor="tc" className="cursor-pointer text-sm">Transfer Certificate submitted</Label>
          </div>
        </Field>
      </div>
    </Grid>
  )
}

function MedicalStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <Grid>
      <Field label="Known Allergies">
        <Input value={form.allergies} onChange={(e) => update("allergies", e.target.value)} placeholder="Pollen, Peanuts, or None" />
      </Field>
      <Field label="Chronic Conditions">
        <Input value={form.chronic} onChange={(e) => update("chronic", e.target.value)} placeholder="Asthma, Diabetes, or None" />
      </Field>
      <Field label="Current Medications">
        <Input value={form.medications} onChange={(e) => update("medications", e.target.value)} placeholder="Inhaler, or None" />
      </Field>
      <Field label="Vaccination Status">
        <Select value={form.vaccination} onValueChange={(v) => update("vaccination", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Up to date", "Partial", "Not vaccinated"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Family Doctor">
        <Input value={form.doctorName} onChange={(e) => update("doctorName", e.target.value)} placeholder="Dr. Mehta" />
      </Field>
      <Field label="Doctor's Phone">
        <Input value={form.doctorPhone} onChange={(e) => update("doctorPhone", e.target.value)} placeholder="+91 98xxx xxxxx" />
      </Field>
    </Grid>
  )
}

function ClassStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const rollPreview = String(Math.floor(1 + Math.random() * 40)).padStart(2, "0")
  return (
    <Grid>
      <Field label="Class" required>
        <Select value={form.className} onValueChange={(v) => update("className", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CLASSES.slice(3).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Section" required>
        <Select value={form.section} onValueChange={(v) => update("section", v)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SECTIONS.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Roll Number (auto-assigned)">
        <Input value={rollPreview} disabled className="bg-muted/40 font-mono" />
      </Field>
      <div className="sm:col-span-2 lg:col-span-3 rounded-xl bg-emerald-500/5 p-4 text-sm">
        <p className="font-semibold text-emerald-700 dark:text-emerald-300">Class allocation preview</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Applying to <span className="font-bold">{form.className} - Section {form.section}</span>. Final seat confirmation will be given after document verification &amp; assessment.
        </p>
      </div>
    </Grid>
  )
}

function TransportStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="space-y-4">
      <div className={cn("rounded-xl border p-4 transition-colors", form.transportReq ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/60 bg-card/50")}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Checkbox checked={form.transportReq} onCheckedChange={(v) => update("transportReq", !!v)} id="transport" />
            <div>
              <Label htmlFor="transport" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold">School Transport</span>
                </div>
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">₹12,000/year · Pickup &amp; drop via school bus</p>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {form.transportReq && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-emerald-500/20 pt-4">
                <Field label="Select Route">
                  <Select value={form.routeNo} onValueChange={(v) => update("routeNo", v)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choose route…" /></SelectTrigger>
                    <SelectContent>
                      {TRANSPORT_ROUTES.map((r) => <SelectItem key={r.id} value={r.routeNo}>{r.routeNo} · {r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={cn("rounded-xl border p-4 transition-colors", form.hostelReq ? "border-violet-500/30 bg-violet-500/5" : "border-border/60 bg-card/50")}>
        <div className="flex items-start gap-3">
          <Checkbox checked={form.hostelReq} onCheckedChange={(v) => update("hostelReq", !!v)} id="hostel" />
          <div>
            <Label htmlFor="hostel" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span className="font-semibold">Hostel Accommodation</span>
              </div>
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">₹65,000/year · Optional residential facility</p>
          </div>
        </div>
        <AnimatePresence>
          {form.hostelReq && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-violet-500/20 pt-4">
                <Field label="Hostel Type">
                  <Select value={form.hostelType} onValueChange={(v) => update("hostelType", v)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choose type…" /></SelectTrigger>
                    <SelectContent>
                      {["Day Scholar (with meals)", "Weekly Boarding", "Full Boarding - AC", "Full Boarding - Non-AC"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const DOC_LIST = [
  { id: "tc", label: "Transfer Certificate", required: true },
  { id: "birth", label: "Birth Certificate", required: true },
  { id: "marks", label: "Previous Mark Sheet", required: true },
  { id: "aadhaar", label: "Aadhaar Card", required: true },
  { id: "photo", label: "Passport Size Photos (4)", required: true },
  { id: "caste", label: "Caste Certificate", required: false },
  { id: "income", label: "Income Certificate", required: false },
  { id: "medical", label: "Medical Fitness Certificate", required: false },
]

function DocumentsStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  function toggle(id: string) {
    update("docs", { ...form.docs, [id]: !form.docs[id] })
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Verify that the following documents have been submitted by the parent/guardian.</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {DOC_LIST.map((d) => {
          const on = !!form.docs[d.id]
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => toggle(d.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                on ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/60 bg-card/50 hover:bg-accent/30"
              )}
            >
              <Checkbox checked={on} onCheckedChange={() => toggle(d.id)} />
              <div className="flex-1">
                <p className="text-sm font-medium">{d.label}</p>
                <p className="text-[11px] text-muted-foreground">{d.required ? "Required" : "Optional"}</p>
              </div>
              {on && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            </button>
          )
        })}
      </div>
      <div className="rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">
        ✅ {Object.values(form.docs).filter(Boolean).length} of {DOC_LIST.filter((d) => d.required).length} required documents verified.
      </div>
    </div>
  )
}

function PhotoStep({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const fullName = `${form.firstName} ${form.lastName}`.trim() || "Student"
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Upload a recent passport-size photograph of the student. JPG/PNG, max 2MB.</p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { update("photoUploaded", true); toast.success("Photo uploaded successfully") }}
          className={cn(
            "relative flex h-40 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
            form.photoUploaded ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/60 hover:border-primary/40"
          )}
        >
          {form.photoUploaded ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex h-full w-full flex-col items-center justify-center gap-2">
              <Avatar name={fullName} color="emerald" size="xl" />
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">✓ Uploaded</span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera className="h-8 w-8" />
              <span className="text-xs">Click to upload</span>
            </div>
          )}
        </motion.button>
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-semibold">Photo Guidelines</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 text-emerald-500" /> Plain background (white or light blue)</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 text-emerald-500" /> Face should occupy 70–80% of the photo</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 text-emerald-500" /> No sunglasses or headgear</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 text-emerald-500" /> Recent photo (taken within last 3 months)</li>
          </ul>
          {form.photoUploaded && (
            <Button variant="outline" size="sm" onClick={() => update("photoUploaded", false)} className="mt-2">
              Replace Photo
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewStep({ form }: { form: FormState }) {
  const fullName = `${form.firstName} ${form.middleName} ${form.lastName}`.trim()
  const feeBase = FEE_STRUCTURE.find((f) => f.category === "Tuition Fee" && f.grade === form.className)?.amount || 28000
  const transportFee = form.transportReq ? 12000 : 0
  const hostelFee = form.hostelReq ? 65000 : 0
  const totalFee = feeBase + transportFee + hostelFee + 1500 + 2000

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl bg-emerald-500/5 p-4 ring-1 ring-emerald-500/20">
        <Avatar name={fullName || "Student"} color="emerald" size="lg" />
        <div>
          <p className="font-bold">{fullName || "Student Name"}</p>
          <p className="text-xs text-muted-foreground">Applying for {form.className} - Section {form.section} · {form.dob && `DOB ${new Date(form.dob).toLocaleDateString("en-IN")}`}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <PreviewCard icon={User} title="Personal" rows={[
          ["Full Name", fullName || "—"],
          ["DOB", form.dob || "—"],
          ["Gender", form.gender],
          ["Blood Group", form.bloodGroup],
          ["Aadhaar", form.aadhaar || "—"],
        ]} />
        <PreviewCard icon={Users} title="Parents" rows={[
          ["Father", form.fatherName || "—"],
          ["Father Phone", form.fatherPhone || "—"],
          ["Mother", form.motherName || "—"],
          ["Mother Phone", form.motherPhone || "—"],
        ]} />
        <PreviewCard icon={Phone} title="Emergency" rows={[
          ["Contact", form.emergencyName || "—"],
          ["Relation", form.emergencyRelation],
          ["Phone", form.emergencyPhone || "—"],
        ]} />
        <PreviewCard icon={MapPin} title="Address" rows={[
          ["House", form.house || "—"],
          ["Area", `${form.area}, ${form.city}`],
          ["State", form.state],
          ["Pincode", form.pincode || "—"],
        ]} />
        <PreviewCard icon={School} title="Previous School" rows={[
          ["School", form.prevSchool || "—"],
          ["Last Class", form.prevClass || "—"],
          ["Year", form.prevYear],
          ["Medium", form.prevMedium],
        ]} />
        <PreviewCard icon={HeartPulse} title="Medical" rows={[
          ["Allergies", form.allergies],
          ["Chronic", form.chronic],
          ["Medications", form.medications],
          ["Vaccination", form.vaccination],
        ]} />
      </div>

      {/* fee account preview */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Fee Account Summary
        </p>
        <div className="space-y-1.5 text-sm">
          <FeeRow label="Tuition Fee" value={formatINR(feeBase)} />
          {form.transportReq && <FeeRow label="Transport Fee" value={formatINR(transportFee)} />}
          {form.hostelReq && <FeeRow label="Hostel Fee" value={formatINR(hostelFee)} />}
          <FeeRow label="Library Fee" value={formatINR(1500)} />
          <FeeRow label="Exam Fee" value={formatINR(2000)} />
          <div className="my-2 border-t border-border/60" />
          <div className="flex items-center justify-between">
            <span className="font-bold">Total Annual Fee</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatINR(totalFee)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20">
        ⚠️ Please review all information carefully. After submission, changes require admin approval.
      </div>
    </div>
  )
}

function PreviewCard({ icon: Icon, title, rows }: { icon: any; title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-4">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {title}
      </p>
      <div className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{k}</span>
            <span className="max-w-[60%] truncate font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function ConfirmationStep({ form, receipt, showSuccess, onViewReceipt, onReset }: {
  form: FormState
  receipt: { studentId: string; admissionNo: string; rollNo: string; libraryId: string; transportId: string; feeAccount: number }
  showSuccess: boolean
  onViewReceipt: () => void
  onReset: () => void
}) {
  const fullName = `${form.firstName} ${form.lastName}`.trim()
  if (!showSuccess) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-muted-foreground">Processing application…</p>
      </div>
    )
  }
  return (
    <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden py-8 text-center">
      {/* confetti burst */}
      {[...Array(20)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: Math.cos((i / 20) * Math.PI * 2) * (120 + Math.random() * 80),
            y: Math.sin((i / 20) * Math.PI * 2) * (120 + Math.random() * 80),
            scale: 0.3,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-3 w-3"
          style={{
            background: ["#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#0ea5e9"][i % 5],
            borderRadius: i % 2 ? "50%" : "2px",
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/20"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CheckCircle2 className="h-14 w-14 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold tracking-tight">Admission Confirmed!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {fullName} has been successfully admitted to <span className="font-semibold text-foreground">{form.className} - Section {form.section}</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 w-full max-w-md rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
      >
        <div className="grid grid-cols-2 gap-3 text-left">
          <IdTile icon={IdCard} label="Student ID" value={receipt.studentId} />
          <IdTile icon={GraduationCap} label="Admission No" value={receipt.admissionNo} />
          <IdTile icon={User} label="Roll Number" value={receipt.rollNo} />
          <IdTile icon={BookOpen} label="Library ID" value={receipt.libraryId} />
          <IdTile icon={Bus} label="Transport ID" value={receipt.transportId} />
          <IdTile icon={Wallet} label="Fee Account" value={formatINR(receipt.feeAccount, true)} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-3"
      >
        <Button onClick={onViewReceipt} className="gap-2">
          <Download className="h-4 w-4" /> View Admission Receipt
        </Button>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <Sparkles className="h-4 w-4" /> New Admission
        </Button>
      </motion.div>
    </div>
  )
}

function IdTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/60 p-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
      <p className="mt-0.5 truncate text-sm font-bold">{value}</p>
    </div>
  )
}

function ReceiptDialog({ open, onOpenChange, form, receipt }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  form: FormState
  receipt: { studentId: string; admissionNo: string; rollNo: string; libraryId: string; transportId: string; feeAccount: number }
}) {
  const fullName = `${form.firstName} ${form.lastName}`.trim()
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Admission Receipt
          </DialogTitle>
          <DialogDescription>Official confirmation of enrolment · {today}</DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Sri Vidya Mandir</p>
              <p className="text-[10px] text-muted-foreground">Senior Secondary School · CBSE · Estd 1994</p>
            </div>
            <div className="rounded-lg bg-white/40 p-2 text-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              OFFICIAL<br />RECEIPT
            </div>
          </div>
          <div className="py-3">
            <div className="flex items-center gap-3 rounded-lg bg-background/60 p-3">
              <Avatar name={fullName || "Student"} color="emerald" size="lg" />
              <div>
                <p className="font-bold">{fullName}</p>
                <p className="text-xs text-muted-foreground">Admitted to {form.className} - Section {form.section}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 py-2 text-sm">
            <RRow label="Student ID" value={receipt.studentId} />
            <RRow label="Admission No" value={receipt.admissionNo} />
            <RRow label="Roll Number" value={receipt.rollNo} />
            <RRow label="Library ID" value={receipt.libraryId} />
            <RRow label="Transport ID" value={receipt.transportId} />
            <RRow label="Admission Date" value={today} />
            <div className="my-2 border-t border-emerald-500/20" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Total Annual Fee</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatINR(receipt.feeAccount)}</span>
            </div>
          </div>
          <div className="border-t border-emerald-500/20 pt-3 text-center">
            <p className="text-[10px] text-muted-foreground">This is a system-generated receipt. Verify online at srividya-mandir.edu.in</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={() => toast.success("Receipt downloaded as PDF")}>
            <Download className="h-4 w-4" /> Download Receipt
          </Button>
        </DialogFooter>
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
