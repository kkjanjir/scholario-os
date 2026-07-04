"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, colorOf } from "@/components/shared/brand"
import { PAYMENT_PROVIDERS, TEMPLATE_TYPES, WEBSITE_SECTIONS, DEPLOYMENT_STEPS, PLANS } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import {
  Check, ChevronRight, ChevronLeft, Building2, CreditCard, Wallet,
  Globe, Cloud, Sparkles, Palette, Globe2, KeyRound, Rocket,
  Loader2, CheckCircle2, Upload, Eye, Copy, Mail, Download, X,
} from "lucide-react"
import { toast } from "sonner"

const STEPS = [
  { id: 1, label: "Basic Info", icon: Building2, color: "emerald" },
  { id: 2, label: "Subscription", icon: CreditCard, color: "violet" },
  { id: 3, label: "Payments", icon: Wallet, color: "amber" },
  { id: 4, label: "Domain & Deploy", icon: Globe, color: "sky" },
  { id: 5, label: "Storage & Backup", icon: Cloud, color: "teal" },
  { id: 6, label: "AI Config", icon: Sparkles, color: "rose" },
  { id: 7, label: "Branding", icon: Palette, color: "fuchsia" },
  { id: 8, label: "Website Builder", icon: Globe2, color: "cyan" },
  { id: 9, label: "Credentials", icon: KeyRound, color: "orange" },
  { id: 10, label: "Review & Deploy", icon: Rocket, color: "emerald" },
]

export function ProvisioningWizard({ onClose, onDeployed }: { onClose: () => void; onDeployed: (name: string) => void }) {
  const [step, setStep] = useState(1)
  const [deploying, setDeploying] = useState(false)
  const [deployStep, setDeployStep] = useState(0)
  const [deployed, setDeployed] = useState(false)
  const [config, setConfig] = useState<any>({
    name: "", code: "", city: "", state: "Maharashtra", board: "CBSE", session: "2025-2026",
    plan: "Professional", billing: "Monthly", maxStudents: 2000, maxStorage: 75,
    provider: "razorpay", domain: "subdomain", domainName: "", env: "Production",
    backupFreq: "Daily", retention: "30 days", autoBackup: true,
    aiEnabled: true, aiCredits: 5000,
    primaryColor: "#10b981", logo: "S",
    adminEmail: "", adminPassword: "Scholario@2026",
  })

  function next() { setStep((s) => Math.min(s + 1, 10)) }
  function prev() { setStep((s) => Math.max(s - 1, 1)) }

  function deploy() {
    setDeploying(true)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDeployStep(i)
      if (i >= DEPLOYMENT_STEPS.length) {
        clearInterval(interval)
        setDeploying(false)
        setDeployed(true)
      }
    }, 700)
  }

  const isLastStep = step === 10

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Rocket className="h-5 w-5" /></div>
            <div>
              <h2 className="text-base font-semibold">Provision New School</h2>
              <p className="text-[11px] text-white/60">Guided setup • Step {step} of {STEPS.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg bg-white/10 p-2 hover:bg-white/20"><X className="h-4 w-4" /></button>
        </div>

        {/* step indicator */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60 px-4 py-3 scroll-area">
          {STEPS.map((s, i) => {
            const isActive = step === s.id
            const isDone = step > s.id
            const c = colorOf(s.color)
            const Icon = s.icon
            return (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => !deploying && (isDone || isActive) && setStep(s.id)}
                  disabled={deploying}
                  className={cn("flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors", isActive ? cn(c.soft, c.text) : isDone ? "text-emerald-600" : "text-muted-foreground")}
                >
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold", isActive ? cn(c.bg, "text-white") : isDone ? "bg-emerald-500 text-white" : "bg-muted")}>
                    {isDone ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className="hidden whitespace-nowrap lg:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="mx-0.5 h-3 w-3 text-muted-foreground/50" />}
              </div>
            )
          })}
        </div>

        {/* progress bar */}
        <div className="h-1 bg-muted">
          <motion.div className="h-full bg-primary" animate={{ width: `${(step / STEPS.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto scroll-area p-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {step === 1 && <StepBasicInfo config={config} setConfig={setConfig} />}
              {step === 2 && <StepSubscription config={config} setConfig={setConfig} />}
              {step === 3 && <StepPayments config={config} setConfig={setConfig} />}
              {step === 4 && <StepDomain config={config} setConfig={setConfig} />}
              {step === 5 && <StepStorage config={config} setConfig={setConfig} />}
              {step === 6 && <StepAI config={config} setConfig={setConfig} />}
              {step === 7 && <StepBranding config={config} setConfig={setConfig} />}
              {step === 8 && <StepWebsite />}
              {step === 9 && <StepCredentials config={config} setConfig={setConfig} />}
              {step === 10 && !deploying && !deployed && <StepReview config={config} />}
              {step === 10 && deploying && <DeployProgress currentStep={deployStep} />}
              {step === 10 && deployed && <DeploySuccess config={config} onDone={() => onDeployed(config.name || "New School")} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer nav */}
        {!deploying && !deployed && (
          <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
            <button onClick={prev} disabled={step === 1} className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-accent">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {isLastStep ? (
              <button onClick={deploy} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2 text-sm font-bold text-white shadow-glow transition-transform hover:scale-105">
                <Rocket className="h-4 w-4" /> Deploy School
              </button>
            ) : (
              <button onClick={next} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ===== Step Components =====
type Config = { [key: string]: any }
type SetConfig = (c: Config) => void
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
const inputCls = "h-10 w-full rounded-xl border border-border/70 bg-background/60 px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"

function StepBasicInfo({ config, setConfig }: { config: Config; setConfig: SetConfig }) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Basic School Information</h3>
      <p className="text-sm text-muted-foreground">Tell us about the school. This information appears on certificates, receipts & the website.</p>
      {/* logo + name */}
      <div className="flex items-center gap-4">
        <button onClick={() => toast.success("Logo upload dialog")} className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-2xl font-bold text-white">
          {config.logo || "S"}
        </button>
        <div className="flex-1">
          <Field label="SCHOOL NAME"><input className={inputCls} value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} placeholder="e.g. Sri Vidya Mandir School" /></Field>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="SCHOOL CODE"><input className={inputCls} value={config.code} onChange={(e) => setConfig({ ...config, code: e.target.value })} placeholder="SVM2026" /></Field>
        <Field label="CITY"><input className={inputCls} value={config.city} onChange={(e) => setConfig({ ...config, city: e.target.value })} placeholder="Pune" /></Field>
        <Field label="STATE"><select className={inputCls} value={config.state} onChange={(e) => setConfig({ ...config, state: e.target.value })}><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>Gujarat</option></select></Field>
        <Field label="SCHOOL BOARD"><select className={inputCls} value={config.board} onChange={(e) => setConfig({ ...config, board: e.target.value })}><option>CBSE</option><option>ICSE</option><option>State Board</option><option>IB</option><option>IGCSE</option></select></Field>
        <Field label="ACADEMIC SESSION"><input className={inputCls} value={config.session} onChange={(e) => setConfig({ ...config, session: e.target.value })} /></Field>
        <Field label="CONTACT NUMBER"><input className={inputCls} placeholder="+91 20 2456 7890" /></Field>
        <Field label="OFFICIAL EMAIL"><input className={inputCls} placeholder="office@school.edu.in" /></Field>
        <Field label="TIME ZONE"><select className={inputCls}><option>Asia/Kolkata (IST)</option><option>Asia/Dubai (GST)</option><option>UTC</option></select></Field>
        <Field label="CURRENCY"><select className={inputCls}><option>INR (₹)</option><option>USD ($)</option><option>AED (د.إ)</option></select></Field>
      </div>
      <Field label="SCHOOL MOTTO"><input className={inputCls} placeholder="Vidya Dadati Vinayam" /></Field>
    </div>
  )
}

function StepSubscription({ config, setConfig }: { config: Config; setConfig: SetConfig }) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Subscription Configuration</h3>
      <p className="text-sm text-muted-foreground">Choose a plan and configure billing limits for this school.</p>
      {/* plan cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => {
          const c = colorOf(p.color)
          const selected = config.plan === p.name
          return (
            <button key={p.id} onClick={() => setConfig({ ...config, plan: p.name, maxStudents: p.maxStudents, maxStorage: p.id === "enterprise" ? 200 : p.id === "professional" ? 75 : 25 })} className={cn("rounded-2xl border-2 p-4 text-left transition-all", selected ? cn("ring-2", c.ring, c.soft) : "border-border/60 hover:bg-accent/30")}>
              <div className="flex items-center justify-between"><span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", c.soft, c.text)}>{p.name}</span>{selected && <Check className={cn("h-4 w-4", c.text)} />}</div>
              <p className="mt-2 text-2xl font-bold">₹{p.price.toLocaleString("en-IN")}<span className="text-xs font-normal text-muted-foreground">/{p.period}</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Up to {p.maxStudents.toLocaleString("en-IN")} students</p>
            </button>
          )
        })}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="BILLING CYCLE"><select className={inputCls} value={config.billing} onChange={(e) => setConfig({ ...config, billing: e.target.value })}><option>Monthly</option><option>Annual (save 20%)</option><option>Custom</option></select></Field>
        <Field label="RENEWAL DATE"><input type="date" className={inputCls} defaultValue="2026-01-15" /></Field>
        <Field label="GRACE PERIOD"><select className={inputCls}><option>7 days</option><option>14 days</option><option>30 days</option></select></Field>
        <Field label="MAX STUDENTS"><input type="number" className={inputCls} value={config.maxStudents} onChange={(e) => setConfig({ ...config, maxStudents: +e.target.value })} /></Field>
        <Field label="MAX TEACHERS"><input type="number" className={inputCls} defaultValue="150" /></Field>
        <Field label="MAX STORAGE (GB)"><input type="number" className={inputCls} value={config.maxStorage} onChange={(e) => setConfig({ ...config, maxStorage: +e.target.value })} /></Field>
        <Field label="MAX AI CREDITS"><input type="number" className={inputCls} defaultValue="5000" /></Field>
        <Field label="MAX SMS / MONTH"><input type="number" className={inputCls} defaultValue="10000" /></Field>
        <Field label="MAX EMAILS / MONTH"><input type="number" className={inputCls} defaultValue="50000" /></Field>
      </div>
      <div className="flex flex-wrap gap-3">
        {["Enable Claimable Free Trial", "Enable Auto Renewal", "Custom Pricing", "Apply GST (18%)"].map((opt) => (
          <label key={opt} className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded" /> {opt}
          </label>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="COUPON CODE (OPTIONAL)"><input className={inputCls} placeholder="SCHOLAR20" /></Field>
        <Field label="DISCOUNT (%)"><input type="number" className={inputCls} placeholder="0" /></Field>
      </div>
    </div>
  )
}

function StepPayments({ config, setConfig }: { config: Config; setConfig: SetConfig }) {
  const provider = PAYMENT_PROVIDERS.find((p) => p.id === config.provider)!
  const [mode, setMode] = useState<"test" | "production">("test")
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Payment Infrastructure</h3>
      <p className="text-sm text-muted-foreground">Configure a payment gateway for fee collection. All secrets are encrypted at rest.</p>
      {/* provider selector */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PAYMENT_PROVIDERS.map((p) => {
          const c = colorOf(p.color)
          const selected = config.provider === p.id
          return (
            <button key={p.id} onClick={() => setConfig({ ...config, provider: p.id })} className={cn("rounded-2xl border-2 p-4 text-center transition-all", selected ? cn("ring-2", c.ring, c.soft) : "border-border/60 hover:bg-accent/30")}>
              <div className="text-3xl">{p.logo}</div>
              <p className="mt-2 text-sm font-semibold">{p.name}</p>
              {selected && <Check className={cn("mx-auto mt-1 h-4 w-4", c.text)} />}
            </button>
          )
        })}
      </div>
      {/* fields */}
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">{provider.name} Configuration</p>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <button onClick={() => setMode("test")} className={cn("rounded-md px-3 py-1 text-xs font-medium", mode === "test" ? "bg-amber-500 text-white" : "text-muted-foreground")}>Test Mode</button>
            <button onClick={() => setMode("production")} className={cn("rounded-md px-3 py-1 text-xs font-medium", mode === "production" ? "bg-emerald-500 text-white" : "text-muted-foreground")}>Production</button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {provider.fields.map((f) => (
            <Field key={f.key} label={f.label}>
              <input type={f.type} className={inputCls} placeholder={f.type === "password" ? "••••••••••••" : `Enter ${f.label}`} />
            </Field>
          ))}
          <Field label="BUSINESS NAME"><input className={inputCls} placeholder="Sri Vidya Mandir School" /></Field>
          <Field label="SETTLEMENT FREQUENCY"><select className={inputCls}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></Field>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => toast.success("Connection validated — credentials are valid")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-500/20"><Check className="h-4 w-4" /> Validate Connection</button>
        <button onClick={() => toast.success("Test payment of ₹1 initiated — check your dashboard")} className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm font-medium hover:bg-accent"><Wallet className="h-4 w-4" /> Test Payment</button>
        <button onClick={() => toast.success("Configuration saved securely")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Check className="h-4 w-4" /> Save Configuration</button>
      </div>
    </div>
  )
}

function StepDomain({ config, setConfig }: { config: Config; setConfig: SetConfig }) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Domain & Deployment</h3>
      <p className="text-sm text-muted-foreground">Choose how the school will be accessed. SSL is automatically provisioned.</p>
      <div className="space-y-2">
        {[
          { id: "subdomain", label: "Scholario Subdomain", desc: "scholario.schoolname.com", example: "scholario.svm.com" },
          { id: "custom", label: "Custom Domain", desc: "Connect your own domain", example: "portal.svm.edu.in" },
          { id: "existing", label: "Connect Existing Domain", desc: "Migrate an active domain", example: "admin.svm.edu.in" },
        ].map((opt) => (
          <button key={opt.id} onClick={() => setConfig({ ...config, domain: opt.id })} className={cn("flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all", config.domain === opt.id ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border/60 hover:bg-accent/30")}>
            <Globe className={cn("h-5 w-5", config.domain === opt.id ? "text-primary" : "text-muted-foreground")} />
            <div className="flex-1"><p className="text-sm font-semibold">{opt.label}</p><p className="text-xs text-muted-foreground">{opt.desc} • e.g. {opt.example}</p></div>
            {config.domain === opt.id && <Check className="h-4 w-4 text-primary" />}
          </button>
        ))}
      </div>
      {config.domain !== "subdomain" && (
        <Field label="DOMAIN NAME"><input className={inputCls} value={config.domainName} onChange={(e) => setConfig({ ...config, domainName: e.target.value })} placeholder="portal.svm.edu.in" /></Field>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="ENVIRONMENT">
          <select className={inputCls} value={config.env} onChange={(e) => setConfig({ ...config, env: e.target.value })}><option>Production</option><option>Staging</option><option>Preview</option></select>
        </Field>
        <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">SSL STATUS</p><p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Auto-provisioned</p></div>
        <div className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">DEPLOYMENT STATUS</p><p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600"><Loader2 className="h-4 w-4" /> Pending deploy</p></div>
      </div>
    </div>
  )
}

function StepStorage({ config, setConfig }: { config: Config; setConfig: SetConfig }) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Cloud Storage & Backup</h3>
      <p className="text-sm text-muted-foreground">Configure automatic backups to protect school data.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2"><Cloud className="h-5 w-5 text-emerald-600" /><p className="font-semibold">Cloud Storage</p></div>
          <p className="mt-1 text-xs text-muted-foreground">Scholario-managed S3-compatible storage</p>
          <p className="mt-2 text-2xl font-bold">{config.maxStorage} GB</p>
          <p className="text-xs text-muted-foreground">Allocated limit</p>
        </div>
        <div className="rounded-2xl border border-border/60 p-4">
          <div className="flex items-center gap-2"><Cloud className="h-5 w-5 text-sky-600" /><p className="font-semibold">Google Drive Backup</p></div>
          <p className="mt-1 text-xs text-muted-foreground">Optional secondary backup to school's GDrive</p>
          <button onClick={() => toast.success("Google Drive connected")} className="mt-2 w-full rounded-lg bg-sky-500/10 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-500/20">Connect Google Drive</button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="BACKUP FREQUENCY"><select className={inputCls} value={config.backupFreq} onChange={(e) => setConfig({ ...config, backupFreq: e.target.value })}><option>Daily</option><option>Twice daily</option><option>Hourly</option><option>Weekly</option></select></Field>
        <Field label="RETENTION POLICY"><select className={inputCls} value={config.retention} onChange={(e) => setConfig({ ...config, retention: e.target.value })}><option>7 days</option><option>30 days</option><option>90 days</option><option>1 year</option></select></Field>
        <Field label="RESTORE POINTS"><select className={inputCls}><option>5 restore points</option><option>10 restore points</option><option>Unlimited</option></select></Field>
      </div>
      <label className="flex items-center gap-2 rounded-xl border border-border/60 p-3">
        <input type="checkbox" checked={config.autoBackup} onChange={(e) => setConfig({ ...config, autoBackup: e.target.checked })} className="h-4 w-4 rounded" />
        <span className="text-sm">Enable automatic backups (recommended)</span>
      </label>
    </div>
  )
}

function StepAI({ config, setConfig }: { config: Config; setConfig: SetConfig }) {
  const aiModules = [
    { id: "insights", name: "AI Performance Insights", desc: "ML-powered student predictions", icon: "📊" },
    { id: "atrisk", name: "At-Risk Detection", desc: "Predict students needing intervention", icon: "⚠️" },
    { id: "autograde", name: "AI Auto-Grading", desc: "Automated answer sheet evaluation", icon: "🤖" },
    { id: "chatbot", name: "AI Support Chatbot", desc: "24/7 parent & student queries", icon: "💬" },
    { id: "content", name: "Content Generation", desc: "Auto-generate homework, quizzes", icon: "✨" },
    { id: "face", name: "Face Recognition", desc: "Camera-based attendance (beta)", icon: "📷" },
  ]
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">AI Configuration</h3>
      <p className="text-sm text-muted-foreground">Enable AI modules & set usage limits. Future providers can be attached easily.</p>
      <div className="flex items-center justify-between rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-violet-500/15 p-2.5"><Sparkles className="h-5 w-5 text-violet-600" /></div><div><p className="font-semibold">AI Services {config.aiEnabled ? "Enabled" : "Disabled"}</p><p className="text-xs text-muted-foreground">Toggle AI capabilities for this school</p></div></div>
        <button onClick={() => setConfig({ ...config, aiEnabled: !config.aiEnabled })} className={cn("relative h-6 w-11 rounded-full transition-colors", config.aiEnabled ? "bg-violet-500" : "bg-muted")}><span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", config.aiEnabled ? "left-[22px]" : "left-0.5")} /></button>
      </div>
      {config.aiEnabled && (
        <>
          <Field label="AI CREDITS / MONTH"><input type="number" className={inputCls} value={config.aiCredits} onChange={(e) => setConfig({ ...config, aiCredits: +e.target.value })} /></Field>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {aiModules.map((m) => (
              <label key={m.id} className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded" />
                <div><span className="text-xl">{m.icon}</span><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.desc}</p></div>
              </label>
            ))}
          </div>
          <button onClick={() => toast.success("AI connectivity test passed — 142ms response")} className="inline-flex items-center gap-2 rounded-xl bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-500/20"><Sparkles className="h-4 w-4" /> Test AI Connectivity</button>
        </>
      )}
    </div>
  )
}

function StepBranding({ config, setConfig }: { config: Config; setConfig: SetConfig }) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">School Branding</h3>
      <p className="text-sm text-muted-foreground">Upload logos, signatures & configure document templates.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "School Logo", emoji: "🏫" },
          { label: "Principal Signature", emoji: "✍️" },
          { label: "Official Seal", emoji: "🛡️" },
          { label: "School Stamp", emoji: "🔖" },
        ].map((u) => (
          <button key={u.label} onClick={() => toast.success(`${u.label} uploaded`)} className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border/60 p-4 hover:bg-accent/30">
            <span className="text-3xl">{u.emoji}</span><Upload className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium">{u.label}</span>
          </button>
        ))}
      </div>
      {/* templates */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">DOCUMENT TEMPLATES</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATE_TYPES.map((t) => {
            const c = colorOf(t.color)
            return (
              <div key={t.id} className="rounded-xl border border-border/60 p-3">
                <div className="flex items-center gap-2"><span className="text-xl">{t.icon}</span><span className="text-sm font-medium">{t.name}</span></div>
                <p className="mt-1 text-[10px] text-muted-foreground">{t.versions} version{t.versions > 1 ? "s" : ""}</p>
                <div className="mt-2 flex gap-1">
                  <button onClick={() => toast.info(`Previewing ${t.name}`)} className="flex-1 rounded-lg bg-muted py-1 text-[10px] font-medium hover:bg-accent"><Eye className="inline h-3 w-3" /> Preview</button>
                  <button onClick={() => toast.success("Template duplicated")} className="rounded-lg bg-muted px-2 py-1 text-[10px] hover:bg-accent">⧉</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* theme colors */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="PRIMARY COLOUR"><div className="flex items-center gap-2"><input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="h-10 w-16 cursor-pointer rounded-lg border border-border/60" /><input className={inputCls} value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} /></div></Field>
        <Field label="SECONDARY COLOUR"><input type="color" defaultValue="#0d9488" className="h-10 w-full cursor-pointer rounded-lg border border-border/60" /></Field>
        <Field label="ACCENT COLOUR"><input type="color" defaultValue="#f59e0b" className="h-10 w-full cursor-pointer rounded-lg border border-border/60" /></Field>
      </div>
    </div>
  )
}

function StepWebsite() {
  const [sections, setSections] = useState(WEBSITE_SECTIONS)
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Website Builder</h3>
      <p className="text-sm text-muted-foreground">Configure the school's public landing page. Toggle sections on/off.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {sections.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
            <button onClick={() => setSections((prev) => prev.map((x) => x.id === s.id ? { ...x, enabled: !x.enabled } : x))} className={cn("relative h-6 w-11 rounded-full transition-colors", s.enabled ? "bg-emerald-500" : "bg-muted")}><span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", s.enabled ? "left-[22px]" : "left-0.5")} /></button>
            <span className="flex-1 text-sm font-medium">{s.name}</span>
            <button onClick={() => toast.info(`Editing ${s.name}`)} className="rounded-lg bg-muted px-2 py-1 text-xs hover:bg-accent">Edit</button>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="SEO META TITLE"><input className={inputCls} placeholder="Sri Vidya Mandir — Best CBSE School in Pune" /></Field>
        <Field label="META DESCRIPTION"><input className={inputCls} placeholder="Admissions open 2026-27..." /></Field>
        <Field label="FACEBOOK URL"><input className={inputCls} placeholder="facebook.com/svm" /></Field>
        <Field label="INSTAGRAM URL"><input className={inputCls} placeholder="instagram.com/svm" /></Field>
      </div>
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
        <div className="flex items-center justify-between"><p className="text-sm font-semibold">Admission Open Banner</p><button className={cn("relative h-6 w-11 rounded-full bg-emerald-500")}><span className="absolute left-[22px] top-0.5 h-5 w-5 rounded-full bg-white shadow" /></button></div>
        <p className="mt-1 text-xs text-muted-foreground">Show a prominent banner on the homepage when admissions are open</p>
      </div>
    </div>
  )
}

function StepCredentials({ config, setConfig }: { config: Config; setConfig: SetConfig }) {
  const adminUser = `admin@${(config.name || "school").toLowerCase().replace(/\s/g, "")}.scholario-os.com`
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Initial Admin Credentials</h3>
      <p className="text-sm text-muted-foreground">Generate the first admin account for this school. The admin will be forced to reset password on first login.</p>
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="ADMIN EMAIL"><input className={inputCls} value={adminUser} onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })} readOnly /></Field>
          <Field label="INITIAL PASSWORD"><input className={inputCls} value={config.adminPassword} onChange={(e) => setConfig({ ...config, adminPassword: e.target.value })} /></Field>
        </div>
        <label className="mt-3 flex items-center gap-2"><input type="checkbox" defaultChecked className="h-4 w-4 rounded" /><span className="text-sm">Force password reset on first login (recommended)</span></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button onClick={() => toast.success("Credentials copied to clipboard")} className="flex flex-col items-center gap-2 rounded-xl border border-border/60 p-4 hover:bg-accent/30"><Copy className="h-5 w-5 text-violet-600" /><span className="text-xs font-medium">Copy</span></button>
        <button onClick={() => toast.success("Credentials downloaded as PDF")} className="flex flex-col items-center gap-2 rounded-xl border border-border/60 p-4 hover:bg-accent/30"><Download className="h-5 w-5 text-emerald-600" /><span className="text-xs font-medium">Download</span></button>
        <button onClick={() => toast.success("Welcome email sent")} className="flex flex-col items-center gap-2 rounded-xl border border-border/60 p-4 hover:bg-accent/30"><Mail className="h-5 w-5 text-sky-600" /><span className="text-xs font-medium">Email</span></button>
        <button onClick={() => toast.success("New password generated")} className="flex flex-col items-center gap-2 rounded-xl border border-border/60 p-4 hover:bg-accent/30"><KeyRound className="h-5 w-5 text-amber-600" /><span className="text-xs font-medium">Regenerate</span></button>
      </div>
    </div>
  )
}

function StepReview({ config }: { config: Config }) {
  const reviewItems = [
    { label: "School Name", value: config.name || "—", ok: !!config.name },
    { label: "School Code", value: config.code || "—", ok: !!config.code },
    { label: "Location", value: `${config.city || "—"}, ${config.state}`, ok: !!config.city },
    { label: "Board", value: config.board, ok: true },
    { label: "Subscription Plan", value: config.plan, ok: true },
    { label: "Billing", value: config.billing, ok: true },
    { label: "Max Students", value: config.maxStudents?.toLocaleString("en-IN"), ok: true },
    { label: "Max Storage", value: `${config.maxStorage} GB`, ok: true },
    { label: "Payment Provider", value: PAYMENT_PROVIDERS.find((p) => p.id === config.provider)?.name, ok: true },
    { label: "Domain Type", value: config.domain, ok: true },
    { label: "Environment", value: config.env, ok: true },
    { label: "Auto Backup", value: config.autoBackup ? "Enabled" : "Disabled", ok: config.autoBackup },
    { label: "AI Services", value: config.aiEnabled ? `Enabled (${config.aiCredits} credits)` : "Disabled", ok: true },
    { label: "Primary Colour", value: config.primaryColor, ok: true },
    { label: "Admin Email", value: `admin@${(config.name || "school").toLowerCase().replace(/\s/g, "")}.scholario-os.com`, ok: !!config.name },
  ]
  const allOk = reviewItems.every((r) => r.ok)
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Review & Deploy</h3>
      <p className="text-sm text-muted-foreground">Verify all configurations before deploying the school.</p>
      {!allOk && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-3">
          <p className="text-sm font-semibold text-amber-600">⚠️ Some fields are incomplete</p>
          <p className="text-xs text-muted-foreground">You can still deploy, but consider completing the missing items.</p>
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {reviewItems.map((r) => (
          <div key={r.label} className={cn("flex items-center justify-between rounded-xl border p-3", r.ok ? "border-border/60" : "border-amber-500/30 bg-amber-500/5")}>
            <span className="text-xs text-muted-foreground">{r.label}</span>
            <span className="flex items-center gap-1.5 text-sm font-medium">{r.value}{r.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <span className="text-amber-500">⚠</span>}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
        <Rocket className="mx-auto h-8 w-8 text-emerald-600" />
        <p className="mt-2 text-sm font-semibold">Ready to Deploy</p>
        <p className="text-xs text-muted-foreground">Click "Deploy School" to provision. This takes ~30 seconds.</p>
      </div>
    </div>
  )
}

function DeployProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative mb-6">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
      <h3 className="text-lg font-semibold">Deploying School…</h3>
      <p className="text-sm text-muted-foreground">Provisioning resources. Please don't close this window.</p>
      <div className="mt-6 w-full max-w-md space-y-2">
        {DEPLOYMENT_STEPS.map((s, i) => {
          const done = i < currentStep
          const active = i === currentStep
          return (
            <motion.div key={s.id} initial={{ opacity: 0.4 }} animate={{ opacity: done || active ? 1 : 0.4 }} className={cn("flex items-center gap-3 rounded-lg p-2", active && "bg-primary/5")}>
              {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : active ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <div className="h-5 w-5 rounded-full border-2 border-muted" />}
              <span className={cn("text-sm", done ? "text-foreground" : active ? "font-medium" : "text-muted-foreground")}>{s.label}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function DeploySuccess({ config, onDone }: { config: Config; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500"><CheckCircle2 className="h-12 w-12 text-white" /></motion.div>
      <h3 className="mt-4 text-xl font-bold">School Deployed Successfully! 🎉</h3>
      <p className="mt-1 text-sm text-muted-foreground">{config.name || "New School"} is now live and available in School Management.</p>
      <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-4 text-left">
        <p className="text-xs text-muted-foreground">ACCESS URL</p>
        <p className="font-mono text-sm font-semibold text-primary">https://{(config.name || "school").toLowerCase().replace(/\s/g, "")}.scholario-os.com</p>
        <p className="mt-2 text-xs text-muted-foreground">ADMIN LOGIN</p>
        <p className="font-mono text-sm">admin@{(config.name || "school").toLowerCase().replace(/\s/g, "")}.scholario-os.com</p>
      </div>
      <button onClick={onDone} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">Go to School Management <ChevronRight className="h-4 w-4" /></button>
    </div>
  )
}
