// ============================================================================
// SCHOLARIO-OS — Super Admin / Platform mock data
// ============================================================================

export interface School {
  id: string
  name: string
  shortName: string
  city: string
  state: string
  plan: "Trial" | "Starter" | "Professional" | "Enterprise"
  status: "Active" | "Trial" | "Suspended" | "Expired"
  students: number
  teachers: number
  staff: number
  parents: number
  storageUsed: number // GB
  storageLimit: number // GB
  mrr: number // monthly revenue
  createdAt: string
  lastActive: string
  domain: string
  avatarColor: string
  modulesEnabled: number
  modulesTotal: number
  health: number // %
}

export const SCHOOLS: School[] = [
  { id: "s1", name: "Sri Vidya Mandir Senior Secondary School", shortName: "SVM", city: "Pune", state: "Maharashtra", plan: "Enterprise", status: "Active", students: 1004, teachers: 68, staff: 42, parents: 980, storageUsed: 42.5, storageLimit: 100, mrr: 25000, createdAt: "2023-06-15", lastActive: "2 min ago", domain: "svm.scholario-os.com", avatarColor: "emerald", modulesEnabled: 18, modulesTotal: 18, health: 98 },
  { id: "s2", name: "Delhi Public School", shortName: "DPS", city: "New Delhi", state: "Delhi", plan: "Enterprise", status: "Active", students: 2480, teachers: 145, staff: 88, parents: 2310, storageUsed: 78.2, storageLimit: 200, mrr: 45000, createdAt: "2023-02-10", lastActive: "5 min ago", domain: "dps.scholario-os.com", avatarColor: "violet", modulesEnabled: 18, modulesTotal: 18, health: 96 },
  { id: "s3", name: "Bombay Scottish School", shortName: "BSS", city: "Mumbai", state: "Maharashtra", plan: "Professional", status: "Active", students: 1820, teachers: 102, staff: 55, parents: 1740, storageUsed: 35.8, storageLimit: 75, mrr: 18000, createdAt: "2023-09-22", lastActive: "12 min ago", domain: "bss.scholario-os.com", avatarColor: "sky", modulesEnabled: 16, modulesTotal: 18, health: 94 },
  { id: "s4", name: "Greenwood High International", shortName: "GWH", city: "Bengaluru", state: "Karnataka", plan: "Professional", status: "Active", students: 1450, teachers: 88, staff: 48, parents: 1380, storageUsed: 28.4, storageLimit: 75, mrr: 15000, createdAt: "2024-01-08", lastActive: "1 hour ago", domain: "gwh.scholario-os.com", avatarColor: "teal", modulesEnabled: 15, modulesTotal: 18, health: 92 },
  { id: "s5", name: "Heritage School Kolkata", shortName: "HSK", city: "Kolkata", state: "West Bengal", plan: "Starter", status: "Trial", students: 420, teachers: 28, staff: 15, parents: 395, storageUsed: 8.2, storageLimit: 25, mrr: 0, createdAt: "2025-11-20", lastActive: "3 hours ago", domain: "hsk.scholario-os.com", avatarColor: "amber", modulesEnabled: 10, modulesTotal: 18, health: 88 },
  { id: "s6", name: "Chinmaya Vidyalaya", shortName: "CV", city: "Chennai", state: "Tamil Nadu", plan: "Professional", status: "Active", students: 980, teachers: 62, staff: 35, parents: 920, storageUsed: 22.1, storageLimit: 75, mrr: 12000, createdAt: "2024-03-14", lastActive: "20 min ago", domain: "cv.scholario-os.com", avatarColor: "rose", modulesEnabled: 17, modulesTotal: 18, health: 95 },
  { id: "s7", name: "Modern Public School", shortName: "MPS", city: "Jaipur", state: "Rajasthan", plan: "Starter", status: "Suspended", students: 310, teachers: 22, staff: 12, parents: 285, storageUsed: 5.8, storageLimit: 25, mrr: 4000, createdAt: "2024-07-01", lastActive: "5 days ago", domain: "mps.scholario-os.com", avatarColor: "orange", modulesEnabled: 8, modulesTotal: 18, health: 72 },
  { id: "s8", name: "Ryan International School", shortName: "RIS", city: "Hyderabad", state: "Telangana", plan: "Enterprise", status: "Active", students: 2100, teachers: 128, staff: 72, parents: 1980, storageUsed: 65.3, storageLimit: 200, mrr: 38000, createdAt: "2023-05-18", lastActive: "8 min ago", domain: "ris.scholario-os.com", avatarColor: "cyan", modulesEnabled: 18, modulesTotal: 18, health: 97 },
  { id: "s9", name: "St. Xavier's School", shortName: "SXS", city: "Ahmedabad", state: "Gujarat", plan: "Professional", status: "Expired", students: 680, teachers: 45, staff: 24, parents: 640, storageUsed: 15.6, storageLimit: 75, mrr: 0, createdAt: "2023-11-30", lastActive: "2 weeks ago", domain: "sxs.scholario-os.com", avatarColor: "pink", modulesEnabled: 0, modulesTotal: 18, health: 45 },
  { id: "s10", name: "Sunbeam School Varanasi", shortName: "SSV", city: "Varanasi", state: "Uttar Pradesh", plan: "Starter", status: "Trial", students: 520, teachers: 34, staff: 18, parents: 490, storageUsed: 10.4, storageLimit: 25, mrr: 0, createdAt: "2025-11-28", lastActive: "1 hour ago", domain: "ssv.scholario-os.com", avatarColor: "lime", modulesEnabled: 12, modulesTotal: 18, health: 90 },
]

export const PLATFORM_STATS = {
  totalSchools: 156,
  activeSchools: 128,
  trialSchools: 18,
  suspendedSchools: 6,
  expiredSchools: 4,
  totalStudents: 184250,
  totalTeachers: 12480,
  totalStaff: 6820,
  totalParents: 172400,
  activeSessions: 8420,
  activeDevices: 12480,
  monthlyRevenue: 2840000,
  arr: 34080000,
  mrr: 2840000,
  pendingPayments: 12,
  apiUsage: 84.2, // %
  storageUsage: 62.8, // %
  platformHealth: 98.6,
  systemHealth: 99.2,
  errorRate: 0.04,
}

export const REVENUE_TREND_SA = [
  { month: "Jan", mrr: 1820000, arr: 21840000 },
  { month: "Feb", mrr: 1950000, arr: 23400000 },
  { month: "Mar", mrr: 2080000, arr: 24960000 },
  { month: "Apr", mrr: 2210000, arr: 26520000 },
  { month: "May", mrr: 2350000, arr: 28200000 },
  { month: "Jun", mrr: 2480000, arr: 29760000 },
  { month: "Jul", mrr: 2560000, arr: 30720000 },
  { month: "Aug", mrr: 2620000, arr: 31440000 },
  { month: "Sep", mrr: 2690000, arr: 32280000 },
  { month: "Oct", mrr: 2740000, arr: 32880000 },
  { month: "Nov", mrr: 2790000, arr: 33480000 },
  { month: "Dec", mrr: 2840000, arr: 34080000 },
]

export const SCHOOL_GROWTH = [
  { month: "Jan", schools: 98 }, { month: "Feb", schools: 105 }, { month: "Mar", schools: 112 },
  { month: "Apr", schools: 118 }, { month: "May", schools: 124 }, { month: "Jun", schools: 131 },
  { month: "Jul", schools: 138 }, { month: "Aug", schools: 142 }, { month: "Sep", schools: 146 },
  { month: "Oct", schools: 149 }, { month: "Nov", schools: 153 }, { month: "Dec", schools: 156 },
]

export interface LiveActivity {
  id: string
  type: "login" | "registration" | "payment" | "error" | "alert" | "backup"
  school: string
  user: string
  detail: string
  time: string
  color: string
}
export const LIVE_ACTIVITY: LiveActivity[] = [
  { id: "la1", type: "login", school: "Sri Vidya Mandir", user: "Dr. Anjali Deshpande", detail: "Principal logged in", time: "2 min ago", color: "emerald" },
  { id: "la2", type: "payment", school: "Delhi Public School", user: "Accounts Office", detail: "Paid ₹45,000 (Enterprise)", time: "5 min ago", color: "violet" },
  { id: "la3", type: "registration", school: "Sunbeam School Varanasi", user: "Admin", detail: "New school registered (Trial)", time: "18 min ago", color: "sky" },
  { id: "la4", type: "login", school: "Bombay Scottish", user: "Rajesh Kulkarni", detail: "Teacher logged in", time: "22 min ago", color: "amber" },
  { id: "la5", type: "backup", school: "Ryan International", user: "System", detail: "Auto-backup completed (2.4 GB)", time: "35 min ago", color: "teal" },
  { id: "la6", type: "alert", school: "Modern Public School", user: "System", detail: "Storage at 92% — upgrade recommended", time: "1 hour ago", color: "rose" },
  { id: "la7", type: "error", school: "St. Xavier's School", user: "System", detail: "Subscription expired — access disabled", time: "2 hours ago", color: "orange" },
  { id: "la8", type: "payment", school: "Chinmaya Vidyalaya", user: "Accounts", detail: "Paid ₹12,000 (Professional)", time: "3 hours ago", color: "cyan" },
]

export interface RecentLogin {
  id: string
  user: string
  role: string
  school: string
  ip: string
  device: string
  location: string
  time: string
  status: "success" | "failed"
  avatarColor: string
}
export const RECENT_LOGINS: RecentLogin[] = [
  { id: "rl1", user: "Dr. Anjali Deshpande", role: "Principal", school: "SVM Pune", ip: "103.21.45.89", device: "Chrome / Windows", location: "Pune, MH", time: "2 min ago", status: "success", avatarColor: "emerald" },
  { id: "rl2", user: "Rajesh Kulkarni", role: "Teacher", school: "SVM Pune", ip: "103.21.45.92", device: "Safari / macOS", location: "Pune, MH", time: "8 min ago", status: "success", avatarColor: "amber" },
  { id: "rl3", user: "Priya Sharma", role: "Principal", school: "DPS Delhi", ip: "49.36.12.45", device: "Chrome / Android", location: "New Delhi, DL", time: "15 min ago", status: "success", avatarColor: "violet" },
  { id: "rl4", user: "unknown", role: "—", school: "BSS Mumbai", ip: "45.127.89.12", device: "Firefox / Linux", location: "Unknown", time: "22 min ago", status: "failed", avatarColor: "rose" },
  { id: "rl5", user: "Aarav Sharma", role: "Student", school: "SVM Pune", ip: "103.21.45.101", device: "Chrome / iOS", location: "Pune, MH", time: "30 min ago", status: "success", avatarColor: "violet" },
  { id: "rl6", user: "Suresh Sharma", role: "Parent", school: "SVM Pune", ip: "103.21.45.110", device: "Chrome / Android", location: "Pune, MH", time: "45 min ago", status: "success", avatarColor: "cyan" },
]

// ---------------------------------------------------------------------------
// Feature Flags
// ---------------------------------------------------------------------------
export interface FeatureFlag {
  id: string
  category: string
  name: string
  description: string
  global: boolean
  schools: { enabled: number; total: number }
  roles: Record<string, boolean>
  modifiedBy: string
  modifiedDate: string
  reason: string
}
export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: "ff1", category: "Admissions", name: "Online Admission Portal", description: "Public-facing admission form & wizard", global: true, schools: { enabled: 156, total: 156 }, roles: { principal: true, teacher: false, student: false, parent: false, accountant: true, receptionist: true }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-11-28", reason: "Enabled platform-wide" },
  { id: "ff2", category: "Attendance", name: "QR Code Attendance", description: "Scan QR code for attendance marking", global: true, schools: { enabled: 142, total: 156 }, roles: { principal: true, teacher: true, student: false, parent: false, accountant: false, receptionist: false }, modifiedBy: "System", modifiedDate: "2025-11-25", reason: "14 schools opted out" },
  { id: "ff3", category: "Attendance", name: "Biometric Attendance", description: "Fingerprint/biometric device integration", global: false, schools: { enabled: 38, total: 156 }, roles: { principal: true, teacher: false, student: false, parent: false, accountant: false, receptionist: true }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-11-20", reason: "Hardware-dependent — opt-in only" },
  { id: "ff4", category: "Fees", name: "Online Payments", description: "Razorpay payment gateway integration", global: true, schools: { enabled: 148, total: 156 }, roles: { principal: true, teacher: false, student: true, parent: true, accountant: true, receptionist: false }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-11-30", reason: "8 schools use offline only" },
  { id: "ff5", category: "AI Features", name: "AI Performance Insights", description: "ML-powered student performance predictions", global: true, schools: { enabled: 156, total: 156 }, roles: { principal: true, teacher: true, student: false, parent: false, accountant: false, receptionist: false }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-12-01", reason: "Premium feature — all plans" },
  { id: "ff6", category: "AI Features", name: "Face Recognition Attendance", description: "Camera-based face recognition", global: false, schools: { enabled: 12, total: 156 }, roles: { principal: true, teacher: false, student: false, parent: false, accountant: false, receptionist: false }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-11-15", reason: "Beta — Enterprise schools only" },
  { id: "ff7", category: "Communication", name: "WhatsApp Integration", description: "Send notices via WhatsApp Business API", global: true, schools: { enabled: 89, total: 156 }, roles: { principal: true, teacher: true, student: false, parent: true, accountant: false, receptionist: true }, modifiedBy: "System", modifiedDate: "2025-11-22", reason: "67 schools awaiting WhatsApp verification" },
  { id: "ff8", category: "Communication", name: "SMS Gateway", description: "Bulk SMS via Msg91/Twilio", global: true, schools: { enabled: 156, total: 156 }, roles: { principal: true, teacher: true, student: false, parent: true, accountant: false, receptionist: true }, modifiedBy: "System", modifiedDate: "2025-10-01", reason: "Platform-wide" },
  { id: "ff9", category: "Library", name: "Library Management", description: "Book catalog, issue/return, fines", global: true, schools: { enabled: 134, total: 156 }, roles: { principal: true, teacher: false, student: true, parent: false, accountant: false, librarian: true }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-11-18", reason: "22 schools don't have libraries" },
  { id: "ff10", category: "Transport", name: "GPS Vehicle Tracking", description: "Real-time bus GPS tracking", global: true, schools: { enabled: 96, total: 156 }, roles: { principal: true, teacher: false, student: false, parent: true, accountant: false, transport: true }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-11-10", reason: "60 schools without transport fleet" },
  { id: "ff11", category: "Reports", name: "PDF Export", description: "Export reports as PDF", global: true, schools: { enabled: 156, total: 156 }, roles: { principal: true, teacher: true, student: true, parent: true, accountant: true, receptionist: true }, modifiedBy: "System", modifiedDate: "2025-09-01", reason: "Core feature" },
  { id: "ff12", category: "Reports", name: "Custom Report Builder", description: "Drag-and-drop custom report creation", global: false, schools: { enabled: 28, total: 156 }, roles: { principal: true, teacher: false, student: false, parent: false, accountant: true, receptionist: false }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-11-05", reason: "Enterprise plan only" },
  { id: "ff13", category: "Integrations", name: "Google Classroom Sync", description: "Two-way sync with Google Classroom", global: true, schools: { enabled: 72, total: 156 }, roles: { principal: true, teacher: true, student: true, parent: false, accountant: false, receptionist: false }, modifiedBy: "System", modifiedDate: "2025-10-15", reason: "Available to all — opt-in" },
  { id: "ff14", category: "Integrations", name: "Tally Export", description: "Export financial data to Tally", global: false, schools: { enabled: 18, total: 156 }, roles: { principal: false, teacher: false, student: false, parent: false, accountant: true, receptionist: false }, modifiedBy: "Arjun Mehta", modifiedDate: "2025-11-12", reason: "Professional+ plans only" },
  { id: "ff15", category: "Mobile", name: "Mobile App Access", description: "iOS/Android app access", global: true, schools: { enabled: 156, total: 156 }, roles: { principal: true, teacher: true, student: true, parent: true, accountant: true, receptionist: true }, modifiedBy: "System", modifiedDate: "2025-08-01", reason: "Core feature" },
]

export const FLAG_CATEGORIES = [
  "Admissions", "Attendance", "Homework", "Assignments", "Examinations", "Results",
  "Fees", "Online Payments", "Payroll", "Certificates", "Library", "Transport",
  "Inventory", "Communication", "Analytics", "AI Features", "Reports", "Downloads",
  "Notifications", "SMS", "Email", "WhatsApp", "API Access", "Integrations",
  "Mobile Access", "Web Access", "Biometric", "QR Attendance", "GPS", "Parent Portal",
]

// ---------------------------------------------------------------------------
// Subscriptions & Billing
// ---------------------------------------------------------------------------
export interface Subscription {
  id: string
  school: string
  plan: "Trial" | "Starter" | "Professional" | "Enterprise"
  status: "Active" | "Trial" | "Suspended" | "Expired" | "Cancelled"
  mrr: number
  startedAt: string
  renewsAt: string
  students: number
  amount: number
  method: string
  invoiceNo: string
}
export const SUBSCRIPTIONS: Subscription[] = [
  { id: "sub1", school: "Sri Vidya Mandir", plan: "Enterprise", status: "Active", mrr: 25000, startedAt: "2023-06-15", renewsAt: "2026-01-15", students: 1004, amount: 25000, method: "Razorpay", invoiceNo: "INV-SA-2025-1001" },
  { id: "sub2", school: "Delhi Public School", plan: "Enterprise", status: "Active", mrr: 45000, startedAt: "2023-02-10", renewsAt: "2026-02-10", students: 2480, amount: 45000, method: "Bank Transfer", invoiceNo: "INV-SA-2025-1002" },
  { id: "sub3", school: "Bombay Scottish", plan: "Professional", status: "Active", mrr: 18000, startedAt: "2023-09-22", renewsAt: "2026-01-22", students: 1820, amount: 18000, method: "Razorpay", invoiceNo: "INV-SA-2025-1003" },
  { id: "sub4", school: "Greenwood High", plan: "Professional", status: "Active", mrr: 15000, startedAt: "2024-01-08", renewsAt: "2026-01-08", students: 1450, amount: 15000, method: "UPI", invoiceNo: "INV-SA-2025-1004" },
  { id: "sub5", school: "Heritage School Kolkata", plan: "Starter", status: "Trial", mrr: 0, startedAt: "2025-11-20", renewsAt: "2025-12-20", students: 420, amount: 0, method: "—", invoiceNo: "—" },
  { id: "sub6", school: "Chinmaya Vidyalaya", plan: "Professional", status: "Active", mrr: 12000, startedAt: "2024-03-14", renewsAt: "2026-01-14", students: 980, amount: 12000, method: "Razorpay", invoiceNo: "INV-SA-2025-1005" },
  { id: "sub7", school: "Modern Public School", plan: "Starter", status: "Suspended", mrr: 4000, startedAt: "2024-07-01", renewsAt: "2025-12-01", students: 310, amount: 4000, method: "Cheque", invoiceNo: "INV-SA-2025-1006" },
  { id: "sub8", school: "Ryan International", plan: "Enterprise", status: "Active", mrr: 38000, startedAt: "2023-05-18", renewsAt: "2026-01-18", students: 2100, amount: 38000, method: "Bank Transfer", invoiceNo: "INV-SA-2025-1007" },
]

export const PLANS = [
  { id: "trial", name: "Trial", price: 0, period: "14 days", maxStudents: 500, features: ["All modules", "5 GB storage", "Email support"], color: "slate" },
  { id: "starter", name: "Starter", price: 4000, period: "month", maxStudents: 800, features: ["15 modules", "25 GB storage", "Email support", "SMS gateway"], color: "emerald" },
  { id: "professional", name: "Professional", price: 15000, period: "month", maxStudents: 2000, features: ["All modules", "75 GB storage", "Priority support", "SMS + Email", "WhatsApp", "Mobile app"], color: "violet" },
  { id: "enterprise", name: "Enterprise", price: 35000, period: "month", maxStudents: 5000, features: ["All modules", "200 GB storage", "24/7 support", "All integrations", "Custom branding", "Dedicated manager", "SLA 99.9%"], color: "amber" },
]

export interface Invoice {
  id: string
  invoiceNo: string
  school: string
  amount: number
  gst: number
  total: number
  date: string
  status: "Paid" | "Pending" | "Overdue"
  method: string
}
export const INVOICES: Invoice[] = [
  { id: "in1", invoiceNo: "INV-SA-2025-1101", school: "Sri Vidya Mandir", amount: 25000, gst: 4500, total: 29500, date: "2025-12-01", status: "Paid", method: "Razorpay" },
  { id: "in2", invoiceNo: "INV-SA-2025-1102", school: "Delhi Public School", amount: 45000, gst: 8100, total: 53100, date: "2025-12-01", status: "Paid", method: "Bank Transfer" },
  { id: "in3", invoiceNo: "INV-SA-2025-1103", school: "Bombay Scottish", amount: 18000, gst: 3240, total: 21240, date: "2025-11-28", status: "Paid", method: "Razorpay" },
  { id: "in4", invoiceNo: "INV-SA-2025-1104", school: "Greenwood High", amount: 15000, gst: 2700, total: 17700, date: "2025-11-25", status: "Pending", method: "—" },
  { id: "in5", invoiceNo: "INV-SA-2025-1105", school: "Modern Public School", amount: 4000, gst: 720, total: 4720, date: "2025-11-20", status: "Overdue", method: "—" },
  { id: "in6", invoiceNo: "INV-SA-2025-1106", school: "Chinmaya Vidyalaya", amount: 12000, gst: 2160, total: 14160, date: "2025-11-18", status: "Paid", method: "Razorpay" },
]

// ---------------------------------------------------------------------------
// Platform Monitoring
// ---------------------------------------------------------------------------
export const MONITORING_METRICS = {
  cpu: 34.2,
  ram: 58.7,
  disk: 62.8,
  bandwidth: 41.3,
  apiRequests: 1284503,
  apiErrors: 482,
  avgResponseTime: 142, // ms
  uptime: 99.97,
}

export const CPU_HISTORY = [
  { time: "00:00", cpu: 28 }, { time: "03:00", cpu: 22 }, { time: "06:00", cpu: 31 },
  { time: "09:00", cpu: 45 }, { time: "12:00", cpu: 52 }, { time: "15:00", cpu: 48 },
  { time: "18:00", cpu: 38 }, { time: "21:00", cpu: 34 }, { time: "Now", cpu: 34 },
]

export const API_TRAFFIC = [
  { time: "00:00", requests: 42000 }, { time: "03:00", requests: 28000 }, { time: "06:00", requests: 38000 },
  { time: "09:00", requests: 185000 }, { time: "12:00", requests: 220000 }, { time: "15:00", requests: 195000 },
  { time: "18:00", requests: 142000 }, { time: "21:00", requests: 84000 }, { time: "Now", requests: 128000 },
]

export interface SystemLog {
  id: string
  level: "info" | "warning" | "error"
  message: string
  service: string
  time: string
}
export const SYSTEM_LOGS: SystemLog[] = [
  { id: "sl1", level: "info", message: "Auto-backup completed for 128 schools", service: "Backup Service", time: "2 min ago" },
  { id: "sl2", level: "info", message: "API gateway healthy — 142ms avg response", service: "API Gateway", time: "5 min ago" },
  { id: "sl3", level: "warning", message: "High memory usage on db-prod-02 (78%)", service: "Database", time: "12 min ago" },
  { id: "sl4", level: "info", message: "CDN cache cleared — 2.4 TB served today", service: "CDN", time: "18 min ago" },
  { id: "sl5", level: "error", message: "Payment webhook retry failed for INV-1104", service: "Payment Service", time: "25 min ago" },
  { id: "sl6", level: "info", message: "New school registered: Sunbeam School Varanasi", service: "Auth Service", time: "1 hour ago" },
  { id: "sl7", level: "warning", message: "SMS gateway latency above threshold (2.4s)", service: "SMS Gateway", time: "2 hours ago" },
  { id: "sl8", level: "info", message: "SSL certificate renewed for *.scholario-os.com", service: "Security", time: "3 hours ago" },
]

// ---------------------------------------------------------------------------
// Security Center
// ---------------------------------------------------------------------------
export interface SecurityEvent {
  id: string
  type: "login" | "failed" | "blocked" | "permission" | "api" | "device"
  user: string
  school: string
  ip: string
  detail: string
  time: string
  severity: "low" | "medium" | "high"
}
export const SECURITY_EVENTS: SecurityEvent[] = [
  { id: "se1", type: "failed", user: "unknown", school: "BSS Mumbai", ip: "45.127.89.12", detail: "5 failed login attempts — account locked", time: "22 min ago", severity: "high" },
  { id: "se2", type: "blocked", user: "—", school: "—", ip: "193.42.15.88", detail: "IP blocked — brute force detected", time: "1 hour ago", severity: "high" },
  { id: "se3", type: "login", user: "Dr. Anjali Deshpande", school: "SVM Pune", ip: "103.21.45.89", detail: "New device login — verified via OTP", time: "2 hours ago", severity: "low" },
  { id: "se4", type: "permission", user: "Accountant", school: "DPS Delhi", ip: "49.36.12.45", detail: "Attempted to access Super Admin panel — denied", time: "3 hours ago", severity: "medium" },
  { id: "se5", type: "api", user: "System", school: "RIS Hyderabad", ip: "—", detail: "API rate limit exceeded — 10,000 req/min", time: "4 hours ago", severity: "medium" },
  { id: "se6", type: "device", user: "Rajesh Kulkarni", school: "SVM Pune", ip: "103.21.45.92", detail: "New device registered — MacBook Pro", time: "5 hours ago", severity: "low" },
]

export interface ApiKey {
  id: string
  name: string
  school: string
  key: string
  created: string
  lastUsed: string
  status: "active" | "revoked"
}
export const API_KEYS: ApiKey[] = [
  { id: "ak1", name: "Production API", school: "Sri Vidya Mandir", key: "sk_live_svm_••••••••8923", created: "2023-06-15", lastUsed: "2 min ago", status: "active" },
  { id: "ak2", name: "Mobile App Key", school: "Delhi Public School", key: "sk_live_dps_••••••••4521", created: "2023-02-10", lastUsed: "5 min ago", status: "active" },
  { id: "ak3", name: "Tally Integration", school: "BSS Mumbai", key: "sk_live_bss_••••••••7812", created: "2024-08-20", lastUsed: "1 hour ago", status: "active" },
  { id: "ak4", name: "Legacy Key", school: "Modern Public School", key: "sk_live_mps_••••••••3318", created: "2024-03-01", lastUsed: "5 days ago", status: "revoked" },
]

// ---------------------------------------------------------------------------
// Support Center
// ---------------------------------------------------------------------------
export interface SupportTicket {
  id: string
  subject: string
  school: string
  user: string
  category: "Bug" | "Feature Request" | "Support" | "Incident"
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  assignedTo: string
  created: string
  lastUpdate: string
}
export const SUPPORT_TICKETS: SupportTicket[] = [
  { id: "TKT-001", subject: "Payment gateway showing error on checkout", school: "Greenwood High", user: "Accounts Manager", category: "Bug", priority: "High", status: "In Progress", assignedTo: "Priya (Eng)", created: "2025-12-01", lastUpdate: "1 hour ago" },
  { id: "TKT-002", subject: "Request: Custom report for board exam analysis", school: "DPS Delhi", user: "Principal", category: "Feature Request", priority: "Medium", status: "Open", assignedTo: "Unassigned", created: "2025-12-01", lastUpdate: "3 hours ago" },
  { id: "TKT-003", subject: "Mobile app crashing on attendance marking", school: "Chinmaya Vidyalaya", user: "Teacher", category: "Bug", priority: "Critical", status: "In Progress", assignedTo: "Rahul (Mobile)", created: "2025-11-30", lastUpdate: "30 min ago" },
  { id: "TKT-004", subject: "Need help importing 500 students from Excel", school: "Heritage School Kolkata", user: "Admin", category: "Support", priority: "Medium", status: "Resolved", assignedTo: "Support Team", created: "2025-11-29", lastUpdate: "Yesterday" },
  { id: "TKT-005", subject: "Platform slow during morning peak hours", school: "Ryan International", user: "Principal", category: "Incident", priority: "High", status: "Open", assignedTo: "DevOps", created: "2025-11-30", lastUpdate: "2 hours ago" },
  { id: "TKT-006", subject: "WhatsApp integration not sending messages", school: "BSS Mumbai", user: "Admin", category: "Bug", priority: "Medium", status: "In Progress", assignedTo: "Priya (Eng)", created: "2025-11-28", lastUpdate: "5 hours ago" },
]
