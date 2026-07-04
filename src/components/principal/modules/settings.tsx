"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Save, School, MapPin, Phone, Mail, Building2, Upload, Image as ImageIcon,
  CalendarDays, GraduationCap, Wallet, Moon, Sun, Languages, Database,
  Loader2, CheckCircle2, FileImage,
} from "lucide-react"

import { PageHeader } from "@/components/shared/module-common"
import { SectionCard } from "@/components/shared/ui"
import { StaggerItem } from "@/components/shared/motion"
import { Logo } from "@/components/shared/brand"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { SCHOOL, FEE_STRUCTURE } from "@/lib/mock/data"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

export function SettingsModule() {
  const [tab, setTab] = useState("profile")
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  const [profile, setProfile] = useState({
    name: SCHOOL.name,
    address: SCHOOL.address,
    phone: SCHOOL.phone,
    email: SCHOOL.email,
    affiliation: SCHOOL.affiliation,
    website: SCHOOL.website,
    tagline: SCHOOL.tagline,
    principal: SCHOOL.principal,
  })

  const [session, setSession] = useState("2025–2026")
  const [term, setTerm] = useState("Term 2")
  const [language, setLanguage] = useState("English")

  const [feeCategories, setFeeCategories] = useState<Record<string, boolean>>(
    FEE_STRUCTURE.reduce((acc, f) => {
      if (!acc[f.category]) acc[f.category] = true
      return acc
    }, {} as Record<string, boolean>)
  )

  const [backupRunning, setBackupRunning] = useState(false)
  const [lastBackup, setLastBackup] = useState("2025-12-01 03:00 AM IST")

  const handleSave = () => {
    toast.success("Settings saved", {
      description: "All changes have been persisted successfully.",
    })
  }

  const handleBackup = () => {
    setBackupRunning(true)
    toast.info("Backup started", { description: "Compressing database & files…" })
    setTimeout(() => {
      setBackupRunning(false)
      const now = new Date().toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
      setLastBackup(`${now} IST`)
      toast.success("Backup completed", {
        description: "scholario-backup-2025-12.zip · 248 MB",
      })
    }, 2200)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="School profile, academic year, fee configuration & system preferences"
        action={
          <Button onClick={handleSave} className="shadow-premium">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="h-auto flex-wrap gap-1 rounded-xl bg-card p-1.5 shadow-premium border border-border/60">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <School className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="academic" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CalendarDays className="h-3.5 w-3.5" /> Academic
          </TabsTrigger>
          <TabsTrigger value="fee" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Wallet className="h-3.5 w-3.5" /> Fees
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sun className="h-3.5 w-3.5" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Database className="h-3.5 w-3.5" /> System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <StaggerItem index={0}>
            <SectionCard title="School Profile" subtitle="Official institutional details" bodyClassName="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldInput label="School Name" icon={School} value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
                <FieldInput label="Tagline" icon={GraduationCap} value={profile.tagline} onChange={(v) => setProfile({ ...profile, tagline: v })} />
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <Textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={2} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldInput label="Phone" icon={Phone} value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
                <FieldInput label="Email" icon={Mail} value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldInput label="Website" icon={Building2} value={profile.website} onChange={(v) => setProfile({ ...profile, website: v })} />
                <FieldInput label="Affiliation" icon={Building2} value={profile.affiliation} onChange={(v) => setProfile({ ...profile, affiliation: v })} />
              </div>
              <FieldInput label="Principal" icon={GraduationCap} value={profile.principal} onChange={(v) => setProfile({ ...profile, principal: v })} />

              <LogoUploadSection />
            </SectionCard>
          </StaggerItem>
        </TabsContent>

        <TabsContent value="academic">
          <StaggerItem index={0}>
            <SectionCard title="Session & Academic Year" subtitle="Configure current academic session and term" bodyClassName="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Academic Session</Label>
                  <Select value={session} onValueChange={setSession}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025–2026">2025–2026</SelectItem>
                      <SelectItem value="2026–2027">2026–2027</SelectItem>
                      <SelectItem value="2024–2025">2024–2025 (Previous)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Current Term</Label>
                  <Select value={term} onValueChange={setTerm}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Term 1">Term 1</SelectItem>
                      <SelectItem value="Term 2">Term 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Term 1 Start</Label>
                  <Input type="date" defaultValue="2025-04-01" />
                </div>
                <div className="grid gap-2">
                  <Label>Term 2 Start</Label>
                  <Input type="date" defaultValue="2025-10-15" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Working Days</Label>
                <div className="flex flex-wrap gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                    <button
                      key={d}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                        i < 6 ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-muted/40 text-muted-foreground"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>
          </StaggerItem>
        </TabsContent>

        <TabsContent value="fee">
          <StaggerItem index={0}>
            <SectionCard title="Fee Configuration" subtitle="Toggle which fee categories are active" bodyClassName="space-y-3">
              {Object.keys(feeCategories).map((cat, i) => {
                const structure = FEE_STRUCTURE.find((f) => f.category === cat)
                return (
                  <div key={cat} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "rounded-lg p-2",
                        feeCategories[cat] ? "bg-emerald-500/10" : "bg-muted"
                      )}>
                        <Wallet className={cn("h-4 w-4", feeCategories[cat] ? "text-emerald-600" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cat}</p>
                        <p className="text-xs text-muted-foreground">
                          {structure?.frequency} · from ₹{structure?.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={feeCategories[cat]}
                      onCheckedChange={(v) => setFeeCategories((p) => ({ ...p, [cat]: v }))}
                    />
                  </div>
                )
              })}
              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                Active fee categories will appear on fee invoices generated for students. Disabled categories will be hidden from new invoices.
              </div>
            </SectionCard>
          </StaggerItem>
        </TabsContent>

        <TabsContent value="appearance">
          <StaggerItem index={0}>
            <SectionCard title="Appearance & Language" subtitle="Customize your interface" bodyClassName="space-y-4">
              <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      {theme === "light" ? <Sun className="h-4 w-4 text-amber-600" /> : <Moon className="h-4 w-4 text-amber-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium", theme === "light" && "text-primary")}>Light</span>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                    <span className={cn("text-xs font-medium", theme === "dark" && "text-primary")}>Dark</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full sm:w-[260px]">
                    <Languages className="h-4 w-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="Marathi">मराठी (Marathi)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Language preference applies to the principal interface and reports.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className={cn(
                  "rounded-xl border-2 p-4 text-left transition-colors",
                  theme === "light" ? "border-primary bg-primary/5" : "border-border/60 hover:bg-accent/30"
                )}>
                  <div className="rounded-lg bg-white p-2 shadow-premium">
                    <Sun className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Light</p>
                  <p className="text-xs text-muted-foreground">Bright & airy</p>
                </button>
                <button
                  onClick={() => theme !== "dark" && toggleTheme()}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-colors",
                    theme === "dark" ? "border-primary bg-primary/5" : "border-border/60 hover:bg-accent/30"
                  )}
                >
                  <div className="rounded-lg bg-slate-900 p-2 shadow-premium">
                    <Moon className="h-4 w-4 text-amber-300" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Dark</p>
                  <p className="text-xs text-muted-foreground">Easy on eyes</p>
                </button>
              </div>
            </SectionCard>
          </StaggerItem>
        </TabsContent>

        <TabsContent value="system">
          <StaggerItem index={0}>
            <SectionCard title="System & Backup" subtitle="Database backup & system info" bodyClassName="space-y-4">
              <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2">
                      <Database className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Database Backup</p>
                      <p className="text-xs text-muted-foreground">
                        Last backup: <span className="font-semibold text-foreground">{lastBackup}</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleBackup}
                    disabled={backupRunning}
                    className="shadow-premium"
                  >
                    {backupRunning ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Backing up…</>
                    ) : (
                      <><Database className="h-4 w-4" /> Create Backup</>
                    )}
                  </Button>
                </div>
                {backupRunning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Compressing database…</span>
                        <span className="font-semibold">62%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "62%" }}
                          transition={{ duration: 1.2 }}
                          className="h-full rounded-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium">System Status</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">All systems operational · v3.4.2</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-medium">Storage Used</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">2.4 GB / 25 GB</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[9.6%] rounded-full bg-violet-500" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Upload className="mt-0.5 h-4 w-4 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium">Auto-Backup Schedule</p>
                    <p className="mt-1 text-xs text-muted-foreground">Backups run daily at 03:00 AM IST. Manual backups can be triggered anytime above. Retention: 30 days.</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </StaggerItem>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FieldInput({ label, icon: Icon, value, onChange }: { label: string; icon: any; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="pl-9" />
      </div>
    </div>
  )
}

function LogoUploadSection() {
  const [uploaded, setUploaded] = useState(false)

  return (
    <div className="grid gap-2">
      <Label>School Logo</Label>
      <button
        type="button"
        onClick={() => {
          setUploaded(true)
          toast.success("Logo uploaded", { description: "svm-logo-2025.png · 124 KB" })
        }}
        className={cn(
          "flex items-center justify-center gap-4 rounded-xl border-2 border-dashed p-6 transition-colors",
          uploaded ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/80 bg-muted/40 hover:bg-accent/30"
        )}
      >
        <div className="rounded-xl bg-white p-3 shadow-premium dark:bg-card">
          {uploaded ? <CheckCircle2 className="h-8 w-8 text-emerald-600" /> : <Logo size={32} />}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium">{uploaded ? "Logo uploaded successfully" : "Drop your logo here or click to upload"}</p>
          <p className="text-xs text-muted-foreground">PNG, SVG or JPG · Recommended 512×512 · Max 2 MB</p>
        </div>
        <div className="ml-2 rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground">
          <ImageIcon className="inline h-3 w-3" /> Preview
        </div>
      </button>
    </div>
  )
}
