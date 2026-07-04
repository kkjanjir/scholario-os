// ============================================================================
// SCHOLARIO-OS — Central mock data store (realistic Indian school data)
// All modules import from here so data stays interconnected & believable.
// ============================================================================

import type { Role } from "@/lib/store"

export const SCHOOL = {
  name: "Sri Vidya Mandir Senior Secondary School",
  shortName: "SVM",
  tagline: "Vidya Dadati Vinayam",
  address: "42, Education City Road, Sector 18, Pune, Maharashtra 411014",
  phone: "+91 20 2456 7890",
  email: "office@srividya-mandir.edu.in",
  website: "www.srividya-mandir.edu.in",
  affiliation: "CBSE — Affiliation No. 1130456",
  session: "2025–2026",
  estd: 1994,
  principal: "Dr. Anjali Deshpande",
  logoColor: "emerald",
}

// ---------------------------------------------------------------------------
// Classes, sections, subjects
// ---------------------------------------------------------------------------
export const CLASSES = [
  "Nursery", "LKG", "UKG",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11 Sci", "Grade 11 Comm", "Grade 12 Sci", "Grade 12 Comm",
]
export const SECTIONS = ["A", "B", "C"]
export const SUBJECTS = [
  "English", "Hindi", "Marathi", "Mathematics", "Science", "Social Science",
  "Computer Science", "Physics", "Chemistry", "Biology", "Accountancy",
  "Business Studies", "Economics", "Physical Education", "Art", "Music",
  "General Knowledge", "Moral Science",
]

export interface ClassInfo {
  id: string
  name: string
  sections: { name: string; classTeacher: string; strength: number; room: string }[]
}

export const CLASSES_INFO: ClassInfo[] = [
  { id: "g10", name: "Grade 10", sections: [
    { name: "A", classTeacher: "tch_003", strength: 38, room: "B-201" },
    { name: "B", classTeacher: "tch_007", strength: 36, room: "B-202" },
  ]},
  { id: "g9", name: "Grade 9", sections: [
    { name: "A", classTeacher: "tch_002", strength: 40, room: "B-101" },
    { name: "B", classTeacher: "tch_009", strength: 39, room: "B-102" },
  ]},
  { id: "g8", name: "Grade 8", sections: [
    { name: "A", classTeacher: "tch_004", strength: 42, room: "A-301" },
    { name: "B", classTeacher: "tch_010", strength: 41, room: "A-302" },
  ]},
  { id: "g7", name: "Grade 7", sections: [
    { name: "A", classTeacher: "tch_005", strength: 37, room: "A-201" },
  ]},
  { id: "g6", name: "Grade 6", sections: [
    { name: "A", classTeacher: "tch_006", strength: 35, room: "A-101" },
  ]},
]

// ---------------------------------------------------------------------------
// Teachers
// ---------------------------------------------------------------------------
export interface Teacher {
  id: string
  empId: string
  name: string
  gender: "Male" | "Female"
  designation: string
  department: string
  subjects: string[]
  classes: string[]
  qualification: string
  experience: number
  joiningDate: string
  email: string
  phone: string
  salary: number
  attendance: number
  avatarColor: string
  bloodGroup: string
  address: string
}

export const TEACHERS: Teacher[] = [
  { id: "tch_001", empId: "SVM-EMP-1001", name: "Dr. Anjali Deshpande", gender: "Female", designation: "Principal", department: "Administration", subjects: ["Physics"], classes: ["Grade 12 Sci"], qualification: "Ph.D. Physics, M.Ed.", experience: 22, joiningDate: "2008-06-15", email: "anjali.d@srividya-mandir.edu.in", phone: "+91 98220 14523", salary: 145000, attendance: 98, avatarColor: "emerald", bloodGroup: "O+", address: "Kothrud, Pune" },
  { id: "tch_002", empId: "SVM-EMP-1002", name: "Rajesh Kulkarni", gender: "Male", designation: "Senior PGT", department: "Mathematics", subjects: ["Mathematics"], classes: ["Grade 9 A", "Grade 10 A"], qualification: "M.Sc. Maths, B.Ed.", experience: 15, joiningDate: "2011-07-01", email: "rajesh.k@srividya-mandir.edu.in", phone: "+91 98225 33412", salary: 78000, attendance: 96, avatarColor: "amber", bloodGroup: "B+", address: "Baner, Pune" },
  { id: "tch_003", empId: "SVM-EMP-1003", name: "Meera Nair", gender: "Female", designation: "PGT", department: "English", subjects: ["English"], classes: ["Grade 10 A", "Grade 10 B"], qualification: "M.A. English, B.Ed.", experience: 11, joiningDate: "2014-06-10", email: "meera.n@srividya-mandir.edu.in", phone: "+91 98700 23110", salary: 72000, attendance: 99, avatarColor: "rose", bloodGroup: "A+", address: "Aundh, Pune" },
  { id: "tch_004", empId: "SVM-EMP-1004", name: "Suresh Patil", gender: "Male", designation: "TGT", department: "Science", subjects: ["Science", "Physics"], classes: ["Grade 8 A", "Grade 9 A"], qualification: "M.Sc. Physics, B.Ed.", experience: 9, joiningDate: "2016-07-12", email: "suresh.p@srividya-mandir.edu.in", phone: "+91 91580 45678", salary: 62000, attendance: 94, avatarColor: "violet", bloodGroup: "AB+", address: "Wakad, Pune" },
  { id: "tch_005", empId: "SVM-EMP-1005", name: "Priya Sharma", gender: "Female", designation: "TGT", department: "Social Science", subjects: ["Social Science", "History"], classes: ["Grade 7 A", "Grade 8 A"], qualification: "M.A. History, B.Ed.", experience: 7, joiningDate: "2018-06-20", email: "priya.s@srividya-mandir.edu.in", phone: "+91 99230 18765", salary: 58000, attendance: 97, avatarColor: "teal", bloodGroup: "O-", address: "Hinjawadi, Pune" },
  { id: "tch_006", empId: "SVM-EMP-1006", name: "Amit Verma", gender: "Male", designation: "TGT", department: "Computer Science", subjects: ["Computer Science"], classes: ["Grade 6 A", "Grade 7 A"], qualification: "MCA, B.Ed.", experience: 6, joiningDate: "2019-07-01", email: "amit.v@srividya-mandir.edu.in", phone: "+91 98330 56712", salary: 56000, attendance: 95, avatarColor: "sky", bloodGroup: "B-", address: "Pimpri, Pune" },
  { id: "tch_007", empId: "SVM-EMP-1007", name: "Lakshmi Iyer", gender: "Female", designation: "PGT", department: "Chemistry", subjects: ["Chemistry"], classes: ["Grade 10 B", "Grade 11 Sci"], qualification: "M.Sc. Chemistry, B.Ed.", experience: 13, joiningDate: "2013-06-18", email: "lakshmi.i@srividya-mandir.edu.in", phone: "+91 90011 23456", salary: 75000, attendance: 98, avatarColor: "orange", bloodGroup: "A-", address: "Kalyani Nagar, Pune" },
  { id: "tch_008", empId: "SVM-EMP-1008", name: "Vikram Singh", gender: "Male", designation: "PTI", department: "Physical Education", subjects: ["Physical Education"], classes: ["All"], qualification: "M.P.Ed.", experience: 8, joiningDate: "2017-07-05", email: "vikram.s@srividya-mandir.edu.in", phone: "+91 98600 78901", salary: 48000, attendance: 93, avatarColor: "lime", bloodGroup: "O+", address: "Camp, Pune" },
  { id: "tch_009", empId: "SVM-EMP-1009", name: "Sneha Joshi", gender: "Female", designation: "TGT", department: "Hindi", subjects: ["Hindi", "Marathi"], classes: ["Grade 9 B", "Grade 8 B"], qualification: "M.A. Hindi, B.Ed.", experience: 10, joiningDate: "2015-06-25", email: "sneha.j@srividya-mandir.edu.in", phone: "+91 90210 34567", salary: 60000, attendance: 96, avatarColor: "pink", bloodGroup: "AB-", address: "Hadapsar, Pune" },
  { id: "tch_010", empId: "SVM-EMP-1010", name: "Rohan Mehta", gender: "Male", designation: "TGT", department: "Biology", subjects: ["Biology", "Science"], classes: ["Grade 8 B", "Grade 9 B"], qualification: "M.Sc. Botany, B.Ed.", experience: 5, joiningDate: "2020-07-01", email: "rohan.m@srividya-mandir.edu.in", phone: "+91 97300 11223", salary: 54000, attendance: 92, avatarColor: "cyan", bloodGroup: "A+", address: "Viman Nagar, Pune" },
  { id: "tch_011", empId: "SVM-EMP-1011", name: "Fatima Sheikh", gender: "Female", designation: "PRT", department: "Primary", subjects: ["English", "EVS"], classes: ["Grade 3", "Grade 4"], qualification: "B.A., D.Ed.", experience: 4, joiningDate: "2021-06-15", email: "fatima.s@srividya-mandir.edu.in", phone: "+91 98440 55667", salary: 42000, attendance: 97, avatarColor: "indigo", bloodGroup: "B+", address: "Kondhwa, Pune" },
  { id: "tch_012", empId: "SVM-EMP-1012", name: "Arjun Reddy", gender: "Male", designation: "PGT", department: "Commerce", subjects: ["Accountancy", "Business Studies"], classes: ["Grade 11 Comm", "Grade 12 Comm"], qualification: "M.Com., B.Ed.", experience: 12, joiningDate: "2014-07-08", email: "arjun.r@srividya-mandir.edu.in", phone: "+91 99110 67890", salary: 74000, attendance: 95, avatarColor: "fuchsia", bloodGroup: "O+", address: "Boat Club Road, Pune" },
]

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------
export interface Student {
  id: string
  admissionNo: string
  rollNo: number
  name: string
  gender: "Male" | "Female"
  className: string
  section: string
  fatherName: string
  motherName: string
  guardianPhone: string
  dob: string
  bloodGroup: string
  address: string
  admissionDate: string
  feeStatus: "Paid" | "Partial" | "Pending"
  feePaid: number
  feeTotal: number
  attendancePct: number
  avgMarks: number
  avatarColor: string
  transport: boolean
  hostel: boolean
  libraryId: string
  transportId?: string
}

const FIRST_M = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Rohan", "Dhruv", "Kabir", "Ayaan", "Ansh", "Atharv", "Aryan", "Shivansh", "Pranav", "Yash", "Naksh", "Ved", "Rudra", "Arnav", "Advik", "Shaurya", "Parth", "Manav", "Daksh", "Kian", "Veer"]
const FIRST_F = ["Ananya", "Diya", "Saanvi", "Aadhya", "Pari", "Myra", "Anika", "Navya", "Aaradhya", "Ira", "Ishita", "Saumya", "Riya", "Sara", "Aanya", "Kavya", "Pooja", "Shreya", "Tanvi", "Nisha", "Avni", "Mahi", "Sneha", "Zara", "Khushi", "Aishwarya", "Bhavya", "Trisha", "Meera", "Kiara"]
const LAST = ["Sharma", "Verma", "Patel", "Gupta", "Reddy", "Nair", "Iyer", "Kulkarni", "Deshpande", "Joshi", "Mehta", "Patil", "Shetty", "Rao", "Desai", "Pawar", "Jadhav", "More", "Kamble", "Bhosale", "Sinha", "Kapoor", "Malhotra", "Chopra", "Agarwal", "Bhat", "Pillai", "Menon", "Ghosh", "Das"]
const AREAS = ["Kothrud", "Baner", "Aundh", "Wakad", "Hinjawadi", "Pimpri", "Kalyani Nagar", "Hadapsar", "Viman Nagar", "Kondhwa", "Boat Club Road", "Camp", "Wagholi", "Kharadi", "Magarpatta"]

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length] }

function buildStudents(): Student[] {
  const out: Student[] = []
  const cls = [["Grade 10","A",38],["Grade 10","B",36],["Grade 9","A",40],["Grade 9","B",39],["Grade 8","A",42],["Grade 8","B",41],["Grade 7","A",37],["Grade 6","A",35]] as const
  let idx = 0
  let adm = 2401
  for (const [cn, sec, n] of cls) {
    for (let r = 1; r <= n; r++) {
      // Ensure the very first generated student is "Aarav Sharma" (the demo student)
      const female = idx === 0 ? false : (idx * 7 + r) % 5 < 2
      const name = idx === 0 ? "Aarav Sharma" : `${female ? pick(FIRST_F, idx) : pick(FIRST_M, idx)} ${pick(LAST, idx + r)}`
      const total = cn.includes("10") || cn.includes("9") ? 58500 : cn.includes("8") ? 48500 : 42500
      const paidRatio = idx === 0 ? 0.5 : [1, 1, 1, 1, 0.5, 0, 1, 0.5][(idx + r) % 8]
      const feePaid = Math.round((total * (paidRatio === 0 ? 0 : paidRatio)) / 100) * 100
      idx++
      out.push({
        id: `stu_${idx}`,
        admissionNo: `SVM2025${String(adm).padStart(4, "0")}`,
        rollNo: r,
        name,
        gender: female ? "Female" : "Male",
        className: cn,
        section: sec,
        fatherName: `${pick(FIRST_M, idx + 3)} ${name.split(" ")[1]}`,
        motherName: `${pick(FIRST_F, idx + 5)} ${name.split(" ")[1]}`,
        guardianPhone: `+91 9${String(800000000 + idx * 12345).slice(0, 9)}`,
        dob: `${2010 - (cn.includes("10") ? 0 : cn.includes("9") ? 1 : cn.includes("8") ? 2 : cn.includes("7") ? 3 : 4)}-0${(idx % 9) + 1}-1${(idx % 9)}`,
        bloodGroup: pick(["A+", "B+", "O+", "AB+", "A-", "O-"], idx),
        address: `${10 + idx}, ${pick(AREAS, idx)}, Pune`,
        admissionDate: `2024-0${(idx % 6) + 1}-1${(idx % 9)}`,
        feeStatus: feePaid === total ? "Paid" : feePaid === 0 ? "Pending" : "Partial",
        feePaid,
        feeTotal: total,
        attendancePct: idx === 0 ? 94 : 70 + ((idx * 13) % 30),
        avgMarks: idx === 0 ? 87 : 52 + ((idx * 7) % 46),
        avatarColor: pick(["emerald","violet","amber","rose","teal","sky","cyan","orange","pink","lime"], idx),
        transport: (idx % 3) === 0,
        hostel: (idx % 11) === 0,
        libraryId: `LIB-${2400 + idx}`,
        transportId: (idx % 3) === 0 ? `TRP-${100 + (idx % 6)}` : undefined,
      })
      adm++
    }
  }
  return out
}

export const STUDENTS: Student[] = buildStudents()

// ---------------------------------------------------------------------------
// Finance — fees, salary, revenue
// ---------------------------------------------------------------------------
export const FEE_STRUCTURE = [
  { category: "Tuition Fee", grade: "Grade 10", amount: 42000, frequency: "Annual" },
  { category: "Tuition Fee", grade: "Grade 9", amount: 38000, frequency: "Annual" },
  { category: "Tuition Fee", grade: "Grade 8", amount: 32000, frequency: "Annual" },
  { category: "Tuition Fee", grade: "Grade 7", amount: 28000, frequency: "Annual" },
  { category: "Transport Fee", grade: "All", amount: 12000, frequency: "Annual" },
  { category: "Library Fee", grade: "All", amount: 1500, frequency: "Annual" },
  { category: "Lab Fee", grade: "Grade 9+", amount: 3500, frequency: "Annual" },
  { category: "Exam Fee", grade: "All", amount: 2000, frequency: "Annual" },
  { category: "Hostel Fee", grade: "Optional", amount: 65000, frequency: "Annual" },
]

export const REVENUE_TREND = [
  { month: "Apr", revenue: 38.2, collection: 34.5, pending: 3.7 },
  { month: "May", revenue: 42.1, collection: 39.8, pending: 2.3 },
  { month: "Jun", revenue: 56.4, collection: 48.2, pending: 8.2 },
  { month: "Jul", revenue: 49.8, collection: 44.1, pending: 5.7 },
  { month: "Aug", revenue: 47.3, collection: 43.6, pending: 3.7 },
  { month: "Sep", revenue: 52.9, collection: 47.2, pending: 5.7 },
  { month: "Oct", revenue: 44.6, collection: 40.1, pending: 4.5 },
  { month: "Nov", revenue: 51.2, collection: 46.8, pending: 4.4 },
  { month: "Dec", revenue: 48.7, collection: 45.3, pending: 3.4 },
  { month: "Jan", revenue: 46.1, collection: 42.9, pending: 3.2 },
  { month: "Feb", revenue: 50.4, collection: 47.6, pending: 2.8 },
  { month: "Mar", revenue: 54.8, collection: 50.2, pending: 4.6 },
]

export interface FeeInvoice {
  id: string
  studentName: string
  admissionNo: string
  className: string
  amount: number
  paid: number
  status: "Paid" | "Partial" | "Pending"
  dueDate: string
  invoiceNo: string
  method?: string
}
export const FEE_INVOICES: FeeInvoice[] = STUDENTS.slice(0, 40).map((s, i) => ({
  id: `inv_${i + 1}`,
  invoiceNo: `INV-2025-${String(1001 + i)}`,
  studentName: s.name,
  admissionNo: s.admissionNo,
  className: `${s.className}-${s.section}`,
  amount: s.feeTotal,
  paid: s.feePaid,
  status: s.feeStatus,
  dueDate: `2025-${String(((i % 12) + 1)).padStart(2, "0")}-15`,
  method: s.feePaid > 0 ? pick(["UPI", "Card", "Net Banking", "Cash", "Cheque"], i) : undefined,
}))

export interface SalarySlip {
  id: string
  empId: string
  name: string
  designation: string
  month: string
  basic: number
  hra: number
  allowances: number
  deductions: number
  net: number
  status: "Paid" | "Pending"
  paidOn?: string
}
export const SALARY_SLIPS: SalarySlip[] = TEACHERS.map((t, i) => {
  const basic = Math.round(t.salary * 0.55)
  const hra = Math.round(t.salary * 0.2)
  const allowances = Math.round(t.salary * 0.15)
  const deductions = Math.round(t.salary * 0.1)
  return {
    id: `sal_${i + 1}`,
    empId: t.empId,
    name: t.name,
    designation: t.designation,
    month: "November 2025",
    basic, hra, allowances, deductions,
    net: basic + hra + allowances - deductions,
    status: i % 5 === 0 ? "Pending" : "Paid",
    paidOn: i % 5 === 0 ? undefined : "2025-12-01",
  }
})

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------
export function attendanceForClass(className: string, section: string) {
  const days = 30
  const data: { date: string; present: number; absent: number; late: number; leave: number }[] = []
  const total = STUDENTS.filter((s) => s.className === className && s.section === section).length || 38
  const today = new Date("2025-12-01")
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const weekend = d.getDay() === 0 || d.getDay() === 6
    const present = weekend ? 0 : total - (3 + ((i * 5) % 6))
    const absent = weekend ? 0 : 1 + ((i * 3) % 4)
    const late = weekend ? 0 : 1 + ((i * 2) % 3)
    const leave = weekend ? 0 : 1 + (i % 2)
    data.push({ date: d.toISOString().slice(0, 10), present, absent, late, leave })
  }
  return { data, total }
}

export function studentAttendanceHeatmap(studentId: string) {
  const seed = studentId.charCodeAt(5) || 1
  const grid: { week: number; day: number; status: "present" | "absent" | "late" | "leave" | "holiday" }[] = []
  for (let w = 0; w < 12; w++) {
    for (let d = 0; d < 7; d++) {
      if (d === 0 || d === 6) { grid.push({ week: w, day: d, status: "holiday" }); continue }
      const r = (seed + w * 7 + d * 3) % 20
      const status = r === 0 ? "absent" : r === 1 ? "late" : r === 2 ? "leave" : "present"
      grid.push({ week: w, day: d, status })
    }
  }
  return grid
}

// ---------------------------------------------------------------------------
// Examinations & results
// ---------------------------------------------------------------------------
export interface Exam { id: string; name: string; term: string; startDate: string; endDate: string; className: string; status: "Scheduled" | "Ongoing" | "Completed" }
export const EXAMS: Exam[] = [
  { id: "ex1", name: "First Term Examination", term: "Term 1", startDate: "2025-09-10", endDate: "2025-09-20", className: "All Grades", status: "Completed" },
  { id: "ex2", name: "Half-Yearly Examination", term: "Term 1", startDate: "2025-10-05", endDate: "2025-10-16", className: "Grade 6–12", status: "Completed" },
  { id: "ex3", name: "Unit Test 2", term: "Term 2", startDate: "2025-12-08", endDate: "2025-12-12", className: "Grade 6–10", status: "Ongoing" },
  { id: "ex4", name: "Annual Examination", term: "Term 2", startDate: "2026-02-20", endDate: "2026-03-05", className: "All Grades", status: "Scheduled" },
  { id: "ex5", name: "Pre-Board Examination", term: "Term 2", startDate: "2026-01-12", endDate: "2026-01-22", className: "Grade 10 & 12", status: "Scheduled" },
]

export function studentResult(studentId: string) {
  const s = STUDENTS.find((x) => x.id === studentId) || STUDENTS[0]
  const subj = s.className.includes("Comm")
    ? ["English", "Accountancy", "Business Studies", "Economics", "Mathematics", "Computer Science"]
    : s.className.includes("Sci")
    ? ["English", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"]
    : ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Science"]
  const seed = s.name.charCodeAt(0)
  return subj.map((sub, i) => {
    const marks = 52 + ((seed + i * 17) % 46)
    const grade = marks >= 90 ? "A1" : marks >= 80 ? "A2" : marks >= 70 ? "B1" : marks >= 60 ? "B2" : marks >= 50 ? "C1" : "C2"
    return { subject: sub, marks, max: 100, grade }
  })
}

export function topPerformers(className: string) {
  return STUDENTS
    .filter((s) => s.className === className)
    .sort((a, b) => b.avgMarks - a.avgMarks)
    .slice(0, 8)
    .map((s, i) => ({ rank: i + 1, ...s }))
}

// ---------------------------------------------------------------------------
// Homework & assignments
// ---------------------------------------------------------------------------
export interface Homework {
  id: string
  title: string
  subject: string
  className: string
  assignedBy: string
  dueDate: string
  status: "Pending" | "Submitted" | "Reviewed" | "Late"
  submissions: number
  total: number
  description: string
}
export const HOMEWORK: Homework[] = [
  { id: "hw1", title: "Quadratic Equations — Exercise 4.3", subject: "Mathematics", className: "Grade 10 A", assignedBy: "Rajesh Kulkarni", dueDate: "2025-12-05", status: "Pending", submissions: 28, total: 38, description: "Solve problems 1–12 from NCERT Exercise 4.3. Show complete working." },
  { id: "hw2", title: "Letter to Editor — Climate Change", subject: "English", className: "Grade 10 A", assignedBy: "Meera Nair", dueDate: "2025-12-06", status: "Submitted", submissions: 36, total: 38, description: "Write a formal letter to the editor of a national daily about climate change impact." },
  { id: "hw3", title: "Chemical Reactions — Lab Report", subject: "Science", className: "Grade 9 A", assignedBy: "Suresh Patil", dueDate: "2025-12-04", status: "Reviewed", submissions: 40, total: 40, description: "Submit observations and conclusions from the acid-base titration experiment." },
  { id: "hw4", title: "Mughal Empire — Map Work", subject: "Social Science", className: "Grade 8 A", assignedBy: "Priya Sharma", dueDate: "2025-12-08", status: "Pending", submissions: 12, total: 42, description: "Mark important Mughal cities on the outline map of India." },
  { id: "hw5", title: "Python — Loops Worksheet", subject: "Computer Science", className: "Grade 7 A", assignedBy: "Amit Verma", dueDate: "2025-12-07", status: "Late", submissions: 30, total: 37, description: "Complete the for/while loop worksheet problems 1–15." },
  { id: "hw6", title: "Trigonometry — Identities", subject: "Mathematics", className: "Grade 10 B", assignedBy: "Rajesh Kulkarni", dueDate: "2025-12-09", status: "Pending", submissions: 18, total: 36, description: "Prove trigonometric identities from worksheet 3." },
]

export interface Assignment {
  id: string
  title: string
  subject: string
  className: string
  marks: number
  dueDate: string
  status: "Open" | "Submitted" | "Evaluated"
  obtained?: number
  rubric: string
}
export const ASSIGNMENTS: Assignment[] = [
  { id: "as1", title: "Investigatory Project — Renewable Energy", subject: "Science", className: "Grade 10 A", marks: 50, dueDate: "2025-12-20", status: "Open", rubric: "Research (15) | Experimentation (20) | Presentation (10) | Viva (5)" },
  { id: "as2", title: "Poetry Analysis — 'The Road Not Taken'", subject: "English", className: "Grade 10 A", marks: 25, dueDate: "2025-12-12", status: "Submitted", rubric: "Comprehension (10) | Literary devices (8) | Personal response (7)" },
  { id: "as3", title: "Case Study — Monopolistic Competition", subject: "Economics", className: "Grade 11 Comm", marks: 40, dueDate: "2025-12-15", status: "Evaluated", obtained: 34, rubric: "Analysis (15) | Application (15) | Conclusion (10)" },
  { id: "as4", title: "Geometry — Construction Portfolio", subject: "Mathematics", className: "Grade 9 A", marks: 30, dueDate: "2025-12-18", status: "Open", rubric: "Accuracy (12) | Presentation (10) | Steps (8)" },
]

// ---------------------------------------------------------------------------
// Library
// ---------------------------------------------------------------------------
export const LIBRARY_BOOKS = [
  { id: "bk1", title: "Wings of Fire", author: "Dr. A.P.J. Abdul Kalam", category: "Biography", copies: 8, available: 3, isbn: "978-8173711466" },
  { id: "bk2", title: "The Discovery of India", author: "Jawaharlal Nehru", category: "History", copies: 5, available: 2, isbn: "978-0143031031" },
  { id: "bk3", title: "NCERT Mathematics X", author: "NCERT", category: "Textbook", copies: 40, available: 12, isbn: "978-8174506634" },
  { id: "bk4", title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", copies: 6, available: 4, isbn: "978-0553380163" },
  { id: "bk5", title: "Train to Pakistan", author: "Khushwant Singh", category: "Fiction", copies: 7, available: 1, isbn: "978-8129135610" },
  { id: "bk6", title: "The Argumentative Indian", author: "Amartya Sen", category: "Essays", copies: 4, available: 2, isbn: "978-0141012117" },
  { id: "bk7", title: "Atomic Habits", author: "James Clear", category: "Self-Help", copies: 10, available: 5, isbn: "978-1847941831" },
  { id: "bk8", title: "Sapiens", author: "Yuval Noah Harari", category: "History", copies: 6, available: 0, isbn: "978-0062316110" },
]
export const LIBRARY_ISSUES = [
  { id: "li1", book: "Wings of Fire", student: "Aarav Sharma", admNo: "SVM20252401", issueDate: "2025-11-20", dueDate: "2025-12-04", status: "Overdue", fine: 15 },
  { id: "li2", book: "A Brief History of Time", student: "Diya Patel", admNo: "SVM20252402", issueDate: "2025-11-25", dueDate: "2025-12-09", status: "Issued", fine: 0 },
  { id: "li3", book: "Sapiens", student: "Vivaan Gupta", admNo: "SVM20252403", issueDate: "2025-11-15", dueDate: "2025-11-29", status: "Overdue", fine: 30 },
  { id: "li4", book: "Atomic Habits", student: "Ananya Reddy", admNo: "SVM20252404", issueDate: "2025-11-28", dueDate: "2025-12-12", status: "Issued", fine: 0 },
  { id: "li5", book: "Train to Pakistan", student: "Aditya Nair", admNo: "SVM20252405", issueDate: "2025-11-10", dueDate: "2025-11-24", status: "Returned", fine: 0 },
]

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------
export const TRANSPORT_ROUTES = [
  { id: "r1", routeNo: "R-01", name: "Kothrud — Baner Loop", stops: 12, students: 42, driver: "Ramesh Pawar", vehicle: "MH-12 AB 4521", capacity: 48, status: "On Route" },
  { id: "r2", routeNo: "R-02", name: "Aundh — Wakad Express", stops: 9, students: 38, driver: "Suresh Jadhav", vehicle: "MH-14 CD 8832", capacity: 48, status: "Reached School" },
  { id: "r3", routeNo: "R-03", name: "Hadapsar — Magarpatta", stops: 14, students: 51, driver: "Prakash More", vehicle: "MH-12 EF 1190", capacity: 52, status: "On Route" },
  { id: "r4", routeNo: "R-04", name: "Kharadi — Viman Nagar", stops: 10, students: 33, driver: "Dilip Kamble", vehicle: "MH-14 GH 7765", capacity: 48, status: "Maintenance" },
  { id: "r5", routeNo: "R-05", name: "Pimpri — Chinchwad", stops: 11, students: 45, driver: "Anil Bhosale", vehicle: "MH-12 IJ 3344", capacity: 52, status: "Reached School" },
]
export const DRIVERS = [
  { id: "d1", name: "Ramesh Pawar", phone: "+91 98220 11234", license: "MH1220190001234", experience: 9, routes: "R-01" },
  { id: "d2", name: "Suresh Jadhav", phone: "+91 98220 22345", license: "MH1420180002345", experience: 12, routes: "R-02" },
  { id: "d3", name: "Prakash More", phone: "+91 98220 33456", license: "MH1220170003456", experience: 15, routes: "R-03" },
  { id: "d4", name: "Dilip Kamble", phone: "+91 98220 44567", license: "MH1420160004567", experience: 7, routes: "R-04" },
  { id: "d5", name: "Anil Bhosale", phone: "+91 98220 55678", license: "MH1220150005678", experience: 18, routes: "R-05" },
]

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------
export const INVENTORY = [
  { id: "i1", category: "Furniture", item: "Student Desks", total: 420, available: 412, condition: "Good", value: 630000 },
  { id: "i2", category: "Furniture", item: "Chairs", total: 420, available: 415, condition: "Good", value: 252000 },
  { id: "i3", category: "Lab Equipment", item: "Microscopes", total: 36, available: 34, condition: "Good", value: 180000 },
  { id: "i4", category: "Lab Equipment", item: "Beakers (Set)", total: 240, available: 198, condition: "Fair", value: 48000 },
  { id: "i5", category: "Stationery", item: "Notebooks", total: 5000, available: 1240, condition: "New", value: 62000 },
  { id: "i6", category: "Electronics", item: "Projectors", total: 18, available: 16, condition: "Good", value: 540000 },
  { id: "i7", category: "Sports", item: "Cricket Kits", total: 12, available: 9, condition: "Good", value: 36000 },
  { id: "i8", category: "Lab Equipment", item: "Chemicals (Kits)", total: 80, available: 22, condition: "Reorder", value: 96000 },
]

// ---------------------------------------------------------------------------
// Communication / notices
// ---------------------------------------------------------------------------
export const ANNOUNCEMENTS = [
  { id: "a1", title: "Winter Break Notice", body: "School will remain closed from 24th December 2025 to 1st January 2026 for winter break. Classes resume on 2nd January.", date: "2025-12-01", priority: "high", channel: "All", audience: "Everyone" },
  { id: "a2", title: "Pre-Board Examination Schedule Released", body: "Pre-board exams for Grade 10 & 12 begin 12th January 2026. Detailed timetable available in the Examination module.", date: "2025-11-29", priority: "high", channel: "Parents + Students", audience: "Grade 10 & 12" },
  { id: "a3", title: "Annual Sports Day — 18th December", body: "The 31st Annual Sports Day will be held on 18th December. Field events begin at 9:00 AM. Parents are cordially invited.", date: "2025-11-27", priority: "medium", channel: "All", audience: "Everyone" },
  { id: "a4", title: "Parent-Teacher Meeting — Grade 9 & 10", body: "PTM scheduled for Saturday, 13th December, 9:00 AM to 12:30 PM. Slot booking opens on the parent portal.", date: "2025-11-25", priority: "medium", channel: "Parents", audience: "Grade 9 & 10" },
  { id: "a5", title: "Library Overdue Reminder", body: "Students with books overdue beyond 7 days are requested to return them immediately. Fines apply @ ₹5/day.", date: "2025-11-22", priority: "low", channel: "Students", audience: "All Students" },
  { id: "a6", title: "Inter-House Quiz Competition", body: "The Inter-House General Knowledge Quiz will be conducted on 11th December during 6th & 7th period.", date: "2025-11-20", priority: "low", channel: "Students", audience: "Grade 6–10" },
]

// ---------------------------------------------------------------------------
// Calendar events
// ---------------------------------------------------------------------------
export const CALENDAR_EVENTS = [
  { id: "e1", date: "2025-12-08", title: "Unit Test 2 Begins", type: "exam", time: "08:00" },
  { id: "e2", date: "2025-12-11", title: "Science Exhibition", type: "event", time: "10:00" },
  { id: "e3", date: "2025-12-13", title: "PTM — Grade 9 & 10", type: "ptm", time: "09:00" },
  { id: "e4", date: "2025-12-15", title: "Aarav Sharma — Birthday", type: "birthday", time: "—" },
  { id: "e5", date: "2025-12-18", title: "Annual Sports Day", type: "event", time: "09:00" },
  { id: "e6", date: "2025-12-20", title: "Staff Meeting", type: "meeting", time: "15:30" },
  { id: "e7", date: "2025-12-24", title: "Winter Break Begins", type: "holiday", time: "—" },
  { id: "e8", date: "2026-01-01", title: "New Year Holiday", type: "holiday", time: "—" },
  { id: "e9", date: "2026-01-12", title: "Pre-Board Exams Begin", type: "exam", time: "08:00" },
  { id: "e10", date: "2025-12-05", title: "Diya Patel — Birthday", type: "birthday", time: "—" },
  { id: "e11", date: "2025-12-09", title: "Vivaan Gupta — Birthday", type: "birthday", time: "—" },
  { id: "e12", date: "2025-12-22", title: "Christmas Celebration", type: "event", time: "11:00" },
]

export const TODAY_BIRTHDAYS = [
  { name: "Aarav Sharma", class: "Grade 10 A", avatarColor: "emerald" },
  { name: "Saanvi Patel", class: "Grade 8 B", avatarColor: "rose" },
  { name: "Reyansh Gupta", class: "Grade 7 A", avatarColor: "amber" },
]
export const NEW_ADMISSIONS = [
  { name: "Kiara Desai", class: "Grade 6 A", date: "2025-11-28", fee: "Paid" },
  { name: "Veer Kulkarni", class: "Nursery", date: "2025-11-26", fee: "Paid" },
  { name: "Myra Reddy", class: "Grade 3 B", date: "2025-11-25", fee: "Partial" },
  { name: "Atharv Nair", class: "Grade 5 A", date: "2025-11-22", fee: "Paid" },
  { name: "Anika Joshi", class: "LKG", date: "2025-11-20", fee: "Paid" },
]

// ---------------------------------------------------------------------------
// Timetable
// ---------------------------------------------------------------------------
export const TIMETABLE = [
  { period: 1, time: "08:00–08:45", subject: "Mathematics", teacher: "Rajesh Kulkarni", room: "B-201" },
  { period: 2, time: "08:45–09:30", subject: "English", teacher: "Meera Nair", room: "B-201" },
  { period: 3, time: "09:30–10:15", subject: "Science", teacher: "Suresh Patil", room: "Lab-1" },
  { period: 4, time: "10:30–11:15", subject: "Social Science", teacher: "Priya Sharma", room: "B-201" },
  { period: 5, time: "11:15–12:00", subject: "Hindi", teacher: "Sneha Joshi", room: "B-201" },
  { period: 6, time: "13:00–13:45", subject: "Computer Science", teacher: "Amit Verma", room: "Lab-2" },
  { period: 7, time: "13:45–14:30", subject: "Physical Education", teacher: "Vikram Singh", room: "Ground" },
  { period: 8, time: "14:30–15:15", subject: "Art", teacher: "Fatima Sheikh", room: "Art Room" },
]

// ---------------------------------------------------------------------------
// Gamification — achievements, streaks, leaderboard, XP
// ---------------------------------------------------------------------------
export interface Achievement {
  id: string
  title: string
  desc: string
  icon: string
  color: string
  unlocked: boolean
  date?: string
  progress?: number
  total?: number
}
export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "Perfect Attendance", desc: "Attend 30 consecutive days", icon: "🔥", color: "amber", unlocked: true, date: "2025-11-28" },
  { id: "a2", title: "Math Whiz", desc: "Score 90+ in Mathematics", icon: "🧮", color: "emerald", unlocked: true, date: "2025-11-15" },
  { id: "a3", title: "Bookworm", desc: "Read 10 library books", icon: "📚", color: "violet", unlocked: true, date: "2025-10-20" },
  { id: "a4", title: "Early Bird", desc: "Submit homework before time", icon: "⏰", color: "sky", unlocked: true, date: "2025-11-30" },
  { id: "a5", title: "Quiz Champion", desc: "Win an inter-house quiz", icon: "🏆", color: "amber", unlocked: false, progress: 2, total: 3 },
  { id: "a6", title: "Science Star", desc: "Complete 5 lab experiments", icon: "🔬", color: "teal", unlocked: false, progress: 3, total: 5 },
  { id: "a7", title: "Top 3 Ranker", desc: "Rank in top 3 of class", icon: "🥇", color: "rose", unlocked: false, progress: 5, total: 3 },
  { id: "a8", title: "All-Rounder", desc: "Excel in academics + sports + arts", icon: "⭐", color: "fuchsia", unlocked: false, progress: 2, total: 3 },
  { id: "a9", title: "Helping Hand", desc: "Help 10 classmates with doubts", icon: "🤝", color: "cyan", unlocked: true, date: "2025-11-10" },
  { id: "a10", title: "100 Days Strong", desc: "100 days of attendance", icon: "💯", color: "violet", unlocked: false, progress: 82, total: 100 },
  { id: "a11", title: "Coding Wizard", desc: "Complete all CS assignments", icon: "💻", color: "indigo", unlocked: false, progress: 7, total: 10 },
  { id: "a12", title: "Green Warrior", desc: "Participate in 3 eco drives", icon: "🌱", color: "emerald", unlocked: true, date: "2025-09-05" },
]

export interface StreakDay {
  date: string
  completed: boolean
  type: "homework" | "attendance" | "quiz" | "none"
}
export function studentStreak(_studentId: string): StreakDay[] {
  const days: StreakDay[] = []
  const today = new Date("2025-12-01")
  for (let i = 20; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dow = d.getDay()
    if (dow === 0) { days.push({ date: d.toISOString().slice(0, 10), completed: false, type: "none" }); continue }
    const r = (i * 7 + 3) % 10
    const completed = r !== 0
    const type = r === 1 ? "quiz" : r === 2 ? "attendance" : "homework"
    days.push({ date: d.toISOString().slice(0, 10), completed, type: completed ? type : "none" })
  }
  return days
}

export interface LeaderboardEntry {
  rank: number
  name: string
  className: string
  xp: number
  level: number
  avatarColor: string
  trend: "up" | "down" | "same"
  badges: number
}
export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Diya Patel", className: "Grade 10 A", xp: 4820, level: 12, avatarColor: "rose", trend: "same", badges: 11 },
  { rank: 2, name: "Vivaan Gupta", className: "Grade 10 A", xp: 4610, level: 11, avatarColor: "emerald", trend: "up", badges: 10 },
  { rank: 3, name: "Ananya Reddy", className: "Grade 10 A", xp: 4380, level: 11, avatarColor: "amber", trend: "up", badges: 9 },
  { rank: 4, name: "Aarav Sharma", className: "Grade 10 A", xp: 4150, level: 10, avatarColor: "violet", trend: "same", badges: 8 },
  { rank: 5, name: "Saanvi Iyer", className: "Grade 10 A", xp: 3990, level: 10, avatarColor: "teal", trend: "down", badges: 8 },
  { rank: 6, name: "Aditya Nair", className: "Grade 10 A", xp: 3840, level: 9, avatarColor: "sky", trend: "up", badges: 7 },
  { rank: 7, name: "Ishita Desai", className: "Grade 10 A", xp: 3720, level: 9, avatarColor: "pink", trend: "same", badges: 7 },
  { rank: 8, name: "Reyansh Kulkarni", className: "Grade 10 A", xp: 3580, level: 9, avatarColor: "cyan", trend: "down", badges: 6 },
  { rank: 9, name: "Myra Joshi", className: "Grade 10 A", xp: 3410, level: 8, avatarColor: "orange", trend: "up", badges: 6 },
  { rank: 10, name: "Kabir Mehta", className: "Grade 10 A", xp: 3290, level: 8, avatarColor: "lime", trend: "same", badges: 5 },
]

export const XP_HISTORY = [
  { week: "W1", xp: 280 }, { week: "W2", xp: 340 }, { week: "W3", xp: 410 },
  { week: "W4", xp: 380 }, { week: "W5", xp: 460 }, { week: "W6", xp: 520 },
  { week: "W7", xp: 490 }, { week: "W8", xp: 580 },
]

export const STUDENT_LEVELS = [
  { level: 1, title: "Beginner", min: 0, icon: "🌱" },
  { level: 5, title: "Learner", min: 1500, icon: "📖" },
  { level: 8, title: "Scholar", min: 2800, icon: "🎓" },
  { level: 10, title: "Achiever", min: 4000, icon: "⭐" },
  { level: 12, title: "Champion", min: 5500, icon: "🏆" },
  { level: 15, title: "Legend", min: 8000, icon: "👑" },
]

// ---------------------------------------------------------------------------
// Daily challenges for student gamification
// ---------------------------------------------------------------------------
export interface DailyChallenge {
  id: string
  title: string
  desc: string
  icon: string
  xp: number
  type: "homework" | "quiz" | "attendance" | "reading" | "practice"
  status: "completed" | "active" | "locked"
  progress: number
  total: number
  expires: string
}
export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: "dc1", title: "Math Master", desc: "Solve 10 quadratic equation problems", icon: "🧮", xp: 50, type: "practice", status: "active", progress: 7, total: 10, expires: "Today 11:59 PM" },
  { id: "dc2", title: "Word Wizard", desc: "Learn 15 new vocabulary words", icon: "📖", xp: 30, type: "reading", status: "active", progress: 15, total: 15, expires: "Today 11:59 PM" },
  { id: "dc3", title: "Perfect Attendance", desc: "Attend all classes on time", icon: "✅", xp: 40, type: "attendance", status: "completed", progress: 8, total: 8, expires: "Completed" },
  { id: "dc4", title: "Science Quiz", desc: "Complete the Physics quiz with 80%+", icon: "🔬", xp: 60, type: "quiz", status: "active", progress: 0, total: 10, expires: "Today 11:59 PM" },
  { id: "dc5", title: "Book Club", desc: "Read 20 pages of your library book", icon: "📚", xp: 35, type: "reading", status: "active", progress: 12, total: 20, expires: "Today 11:59 PM" },
  { id: "dc6", title: "Homework Hero", desc: "Submit all pending homework", icon: "✏️", xp: 45, type: "homework", status: "locked", progress: 0, total: 3, expires: "Unlocks at Level 11" },
]

export const WEEKLY_QUESTS = [
  { id: "wq1", title: "Week Scholar", desc: "Score 80%+ in 3 quizzes this week", icon: "🎯", xp: 200, progress: 2, total: 3, daysLeft: 3 },
  { id: "wq2", title: "Streak Keeper", desc: "Maintain a 5-day activity streak", icon: "🔥", xp: 150, progress: 4, total: 5, daysLeft: 3 },
  { id: "wq3", title: "Helping Hand", desc: "Help 5 classmates with doubts", icon: "🤝", xp: 120, progress: 3, total: 5, daysLeft: 3 },
]

// ---------------------------------------------------------------------------
// At-risk students (predictive analytics)
// ---------------------------------------------------------------------------
export interface AtRiskStudent {
  id: string
  name: string
  className: string
  rollNo: number
  riskScore: number
  riskLevel: "High" | "Medium" | "Low"
  factors: { label: string; value: string; severity: "high" | "medium" | "low" }[]
  attendancePct: number
  avgMarks: number
  trend: number[]
  avatarColor: string
  lastAbsent: string
  recommendedAction: string
}
export const AT_RISK_STUDENTS: AtRiskStudent[] = [
  {
    id: "ar1", name: "Kabir Mehta", className: "Grade 10 B", rollNo: 14, riskScore: 82, riskLevel: "High",
    factors: [
      { label: "Attendance", value: "64%", severity: "high" },
      { label: "Avg Marks", value: "48%", severity: "high" },
      { label: "Homework", value: "30% submitted", severity: "high" },
      { label: "Participation", value: "Low", severity: "medium" },
    ],
    attendancePct: 64, avgMarks: 48, trend: [62, 58, 55, 52, 49, 48], avatarColor: "rose",
    lastAbsent: "2025-11-29", recommendedAction: "Schedule parent meeting & assign mentor",
  },
  {
    id: "ar2", name: "Ishita Desai", className: "Grade 9 B", rollNo: 22, riskScore: 71, riskLevel: "High",
    factors: [
      { label: "Attendance", value: "71%", severity: "medium" },
      { label: "Avg Marks", value: "52%", severity: "high" },
      { label: "Homework", value: "45% submitted", severity: "medium" },
      { label: "Behavior", value: "Concerns noted", severity: "medium" },
    ],
    attendancePct: 71, avgMarks: 52, trend: [65, 62, 58, 55, 53, 52], avatarColor: "amber",
    lastAbsent: "2025-11-28", recommendedAction: "Counselor session & learning support",
  },
  {
    id: "ar3", name: "Reyansh Kulkarni", className: "Grade 8 A", rollNo: 31, riskScore: 58, riskLevel: "Medium",
    factors: [
      { label: "Attendance", value: "78%", severity: "medium" },
      { label: "Avg Marks", value: "58%", severity: "medium" },
      { label: "Homework", value: "60% submitted", severity: "low" },
      { label: "Participation", value: "Average", severity: "low" },
    ],
    attendancePct: 78, avgMarks: 58, trend: [70, 66, 63, 61, 59, 58], avatarColor: "orange",
    lastAbsent: "2025-11-25", recommendedAction: "Extra tutoring in Mathematics",
  },
  {
    id: "ar4", name: "Myra Joshi", className: "Grade 9 A", rollNo: 18, riskScore: 52, riskLevel: "Medium",
    factors: [
      { label: "Attendance", value: "82%", severity: "low" },
      { label: "Avg Marks", value: "61%", severity: "medium" },
      { label: "Homework", value: "70% submitted", severity: "low" },
      { label: "Recent Drop", value: "-8% this month", severity: "medium" },
    ],
    attendancePct: 82, avgMarks: 61, trend: [72, 70, 68, 64, 62, 61], avatarColor: "pink",
    lastAbsent: "2025-11-24", recommendedAction: "Monitor closely, check home situation",
  },
  {
    id: "ar5", name: "Vivaan Gupta", className: "Grade 10 A", rollNo: 27, riskScore: 38, riskLevel: "Low",
    factors: [
      { label: "Attendance", value: "88%", severity: "low" },
      { label: "Avg Marks", value: "68%", severity: "low" },
      { label: "Homework", value: "85% submitted", severity: "low" },
      { label: "Trend", value: "Improving", severity: "low" },
    ],
    attendancePct: 88, avgMarks: 68, trend: [60, 63, 65, 66, 67, 68], avatarColor: "teal",
    lastAbsent: "2025-11-20", recommendedAction: "Continue current trajectory, praise improvement",
  },
  {
    id: "ar6", name: "Saanvi Iyer", className: "Grade 8 B", rollNo: 9, riskScore: 29, riskLevel: "Low",
    factors: [
      { label: "Attendance", value: "91%", severity: "low" },
      { label: "Avg Marks", value: "72%", severity: "low" },
      { label: "Homework", value: "90% submitted", severity: "low" },
      { label: "Trend", value: "Stable", severity: "low" },
    ],
    attendancePct: 91, avgMarks: 72, trend: [74, 73, 72, 73, 72, 72], avatarColor: "cyan",
    lastAbsent: "2025-11-18", recommendedAction: "No action needed, performing well",
  },
]

export const ADMISSION_FUNNEL = [
  { name: "Applications", value: 186, fill: "var(--chart-1)" },
  { name: "Documents Verified", value: 142, fill: "var(--chart-2)" },
  { name: "Assessment", value: 118, fill: "var(--chart-3)" },
  { name: "Interview", value: 96, fill: "var(--chart-4)" },
  { name: "Admitted", value: 78, fill: "var(--chart-5)" },
]

// ---------------------------------------------------------------------------
// Parent portal data
// ---------------------------------------------------------------------------
export interface ParentMessage {
  id: string
  from: string
  role: "Teacher" | "School" | "Parent"
  subject: string
  body: string
  date: string
  read: boolean
  priority?: "high" | "medium" | "low"
}
export const PARENT_MESSAGES: ParentMessage[] = [
  { id: "pm1", from: "Rajesh Kulkarni", role: "Teacher", subject: "Aarav's progress in Mathematics", body: "Aarav has shown remarkable improvement in quadratic equations. He scored 92 in the last unit test. Please encourage him to participate in the inter-school math olympiad.", date: "2025-12-01", read: false, priority: "high" },
  { id: "pm2", from: "School Office", role: "School", subject: "PTM Reminder — 13th December", body: "This is a reminder for the Parent-Teacher Meeting scheduled for Saturday, 13th December, 9:00 AM. Please book your slot on the portal.", date: "2025-11-30", read: false, priority: "medium" },
  { id: "pm3", from: "Meera Nair", role: "Teacher", subject: "English assignment feedback", body: "Aarav's poetry analysis was outstanding. He has a natural flair for literary interpretation. Keep it up!", date: "2025-11-28", read: true },
  { id: "pm4", from: "School Office", role: "School", subject: "Fee receipt for November", body: "Your fee payment of ₹29,250 has been received. Receipt No. RCP-2025-1042 is attached.", date: "2025-11-25", read: true },
  { id: "pm5", from: "Suresh Patil", role: "Teacher", subject: "Science exhibition participation", body: "Aarav has been selected to represent the school at the Regional Science Exhibition. Details will follow.", date: "2025-11-22", read: true, priority: "high" },
]

export interface ParentNotice {
  id: string
  title: string
  body: string
  date: string
  type: "event" | "exam" | "holiday" | "meeting" | "circular"
}
export const PARENT_NOTICES: ParentNotice[] = [
  { id: "pn1", title: "Annual Sports Day — 18th December", body: "You are cordially invited to the 31st Annual Sports Day. Field events begin at 9:00 AM.", date: "2025-12-01", type: "event" },
  { id: "pn2", title: "Pre-Board Examinations — January", body: "Pre-board exams for Grade 10 begin 12th January 2026. Ensure your child revises thoroughly.", date: "2025-11-29", type: "exam" },
  { id: "pn3", title: "Winter Break", body: "School closed 24th Dec – 1st Jan. Classes resume 2nd January.", date: "2025-11-28", type: "holiday" },
  { id: "pn4", title: "Parent-Teacher Meeting", body: "PTM on 13th December, 9 AM – 12:30 PM. Slot booking open on portal.", date: "2025-11-26", type: "meeting" },
]

// ---------------------------------------------------------------------------
// Parent-Teacher chat (mock real-time messaging)
// ---------------------------------------------------------------------------
export interface ChatMessage {
  id: string
  sender: "parent" | "teacher"
  name: string
  text: string
  time: string
  read: boolean
}
export const CHAT_THREADS: {
  id: string
  teacherName: string
  teacherSubject: string
  parentName: string
  studentName: string
  unread: number
  lastMessage: string
  lastTime: string
  messages: ChatMessage[]
}[] = [
  {
    id: "ct1",
    teacherName: "Rajesh Kulkarni",
    teacherSubject: "Mathematics",
    parentName: "Suresh Sharma",
    studentName: "Aarav Sharma",
    unread: 1,
    lastMessage: "Thank you sir, we'll ensure he practices more.",
    lastTime: "10:42 AM",
    messages: [
      { id: "m1", sender: "teacher", name: "Rajesh Kulkarni", text: "Good morning Mr. Sharma. Aarav has been performing well in Mathematics, but I noticed he struggled with quadratic equations in the last test.", time: "10:15 AM", read: true },
      { id: "m2", sender: "parent", name: "Suresh Sharma", text: "Good morning sir. Thank you for letting me know. We'll help him practice at home.", time: "10:22 AM", read: true },
      { id: "m3", sender: "teacher", name: "Rajesh Kulkarni", text: "That would be great! I've assigned extra practice problems from Exercise 4.3. Please ensure he completes them by Friday.", time: "10:28 AM", read: true },
      { id: "m4", sender: "parent", name: "Suresh Sharma", text: "Thank you sir, we'll ensure he practices more.", time: "10:42 AM", read: false },
    ],
  },
  {
    id: "ct2",
    teacherName: "Meera Nair",
    teacherSubject: "English",
    parentName: "Suresh Sharma",
    studentName: "Aarav Sharma",
    unread: 0,
    lastMessage: "Aarav's poetry analysis was outstanding!",
    lastTime: "Yesterday",
    messages: [
      { id: "m1", sender: "teacher", name: "Meera Nair", text: "Aarav's poetry analysis was outstanding! He has a natural flair for literary interpretation.", time: "Yesterday 3:15 PM", read: true },
      { id: "m2", sender: "parent", name: "Suresh Sharma", text: "Thank you so much ma'am! We're very happy to hear that.", time: "Yesterday 4:30 PM", read: true },
    ],
  },
  {
    id: "ct3",
    teacherName: "Suresh Patil",
    teacherSubject: "Science",
    parentName: "Suresh Sharma",
    studentName: "Aarav Sharma",
    unread: 0,
    lastMessage: "Aarav has been selected for the Regional Science Exhibition.",
    lastTime: "2 days ago",
    messages: [
      { id: "m1", sender: "teacher", name: "Suresh Patil", text: "Aarav has been selected to represent the school at the Regional Science Exhibition. His project on renewable energy was excellent.", time: "2 days ago 11:00 AM", read: true },
      { id: "m2", sender: "parent", name: "Suresh Sharma", text: "Wonderful news! We're very proud. Please let us know the dates.", time: "2 days ago 1:20 PM", read: true },
    ],
  },
]

// ---------------------------------------------------------------------------
// Teacher lesson planner
// ---------------------------------------------------------------------------
export interface LessonPlan {
  id: string
  subject: string
  className: string
  topic: string
  date: string
  period: number
  objectives: string[]
  resources: string[]
  activities: string[]
  homework: string
  status: "planned" | "completed" | "in-progress"
  duration: string
}
export const LESSON_PLANS: LessonPlan[] = [
  {
    id: "lp1", subject: "Mathematics", className: "Grade 10 A", topic: "Quadratic Equations — Factoring",
    date: "2025-12-02", period: 1, duration: "45 min", status: "completed",
    objectives: ["Understand standard form of quadratic equations", "Factor quadratic expressions using splitting middle term", "Solve real-world problems"],
    resources: ["NCERT Textbook Ch 4", "Whiteboard", "Worksheet 4.1", "GeoGebra demo"],
    activities: ["Recap of linear equations (5 min)", "Introduction to quadratics (10 min)", "Worked examples (15 min)", "Practice problems (10 min)", "Wrap-up & doubts (5 min)"],
    homework: "Exercise 4.2 — Q1 to Q8",
  },
  {
    id: "lp2", subject: "Mathematics", className: "Grade 10 A", topic: "Quadratic Formula & Discriminant",
    date: "2025-12-03", period: 1, duration: "45 min", status: "in-progress",
    objectives: ["Derive quadratic formula", "Calculate discriminant", "Determine nature of roots"],
    resources: ["NCERT Textbook Ch 4", "Projector", "Discriminant chart"],
    activities: ["Homework review (5 min)", "Derivation of formula (15 min)", "Discriminant cases (10 min)", "Practice (10 min)", "Summary (5 min)"],
    homework: "Exercise 4.3 — Q1 to Q6",
  },
  {
    id: "lp3", subject: "Mathematics", className: "Grade 9 A", topic: "Polynomials — Zeroes",
    date: "2025-12-03", period: 3, duration: "45 min", status: "planned",
    objectives: ["Define zeroes of polynomial", "Find zeroes graphically", "Relationship between zeroes & coefficients"],
    resources: ["NCERT Textbook Ch 2", "Graph paper", "Desmos graphing tool"],
    activities: ["Warm-up (5 min)", "Concept introduction (10 min)", "Graphical method demo (15 min)", "Pair activity (10 min)", "Recap (5 min)"],
    homework: "Exercise 2.2 — Q1 to Q4",
  },
  {
    id: "lp4", subject: "Mathematics", className: "Grade 10 A", topic: "Word Problems — Quadratics",
    date: "2025-12-04", period: 1, duration: "45 min", status: "planned",
    objectives: ["Translate word problems to equations", "Solve using appropriate method", "Verify solutions"],
    resources: ["Worksheet 4.4", "Real-world examples"],
    activities: ["Recap (5 min)", "Problem-solving strategies (10 min)", "4 worked examples (20 min)", "Independent practice (5 min)", "Exit ticket (5 min)"],
    homework: "Worksheet 4.4 — complete all",
  },
]

// ---------------------------------------------------------------------------
// Fee defaulters — for follow-up workflow
// ---------------------------------------------------------------------------
export interface FeeDefaulter {
  id: string
  studentName: string
  admissionNo: string
  className: string
  guardianName: string
  guardianPhone: string
  amount: number
  overdueDays: number
  remindersSent: number
  lastReminder: string
  status: "critical" | "overdue" | "reminder"
  avatarColor: string
}
export const FEE_DEFAULTERS: FeeDefaulter[] = [
  { id: "fd1", studentName: "Kabir Mehta", admissionNo: "SVM20252438", className: "Grade 10 B", guardianName: "Rahul Mehta", guardianPhone: "+91 98220 44556", amount: 29250, overdueDays: 45, remindersSent: 3, lastReminder: "2025-11-25", status: "critical", avatarColor: "rose" },
  { id: "fd2", studentName: "Ishita Desai", admissionNo: "SVM20252452", className: "Grade 9 B", guardianName: "Amit Desai", guardianPhone: "+91 98220 33445", amount: 19500, overdueDays: 32, remindersSent: 2, lastReminder: "2025-11-28", status: "critical", avatarColor: "amber" },
  { id: "fd3", studentName: "Reyansh Kulkarni", admissionNo: "SVM20252467", className: "Grade 8 A", guardianName: "Deepak Kulkarni", guardianPhone: "+91 98220 22334", amount: 14250, overdueDays: 18, remindersSent: 2, lastReminder: "2025-11-30", status: "overdue", avatarColor: "orange" },
  { id: "fd4", studentName: "Myra Joshi", admissionNo: "SVM20252471", className: "Grade 9 A", guardianName: "Sanjay Joshi", guardianPhone: "+91 98220 11223", amount: 9750, overdueDays: 12, remindersSent: 1, lastReminder: "2025-11-29", status: "overdue", avatarColor: "pink" },
  { id: "fd5", studentName: "Vivaan Gupta", admissionNo: "SVM20252415", className: "Grade 10 A", guardianName: "Mohit Gupta", guardianPhone: "+91 98220 55667", amount: 5850, overdueDays: 5, remindersSent: 1, lastReminder: "2025-11-30", status: "reminder", avatarColor: "teal" },
  { id: "fd6", studentName: "Saanvi Iyer", admissionNo: "SVM20252423", className: "Grade 8 B", guardianName: "Karthik Iyer", guardianPhone: "+91 98220 66778", amount: 3900, overdueDays: 3, remindersSent: 0, lastReminder: "—", status: "reminder", avatarColor: "cyan" },
]


// ---------------------------------------------------------------------------
// Student friend system
// ---------------------------------------------------------------------------
export interface StudentFriend {
  id: string
  name: string
  avatarColor: string
  level: number
  xp: number
  status: "online" | "offline" | "in-class"
  streak: number
  badges: number
  trend: "up" | "down" | "same"
  lastActive: string
  classRank: number
}
export const STUDENT_FRIENDS: StudentFriend[] = [
  { id: "f1", name: "Diya Patel", avatarColor: "rose", level: 12, xp: 4820, status: "online", streak: 12, badges: 11, trend: "same", lastActive: "Online now", classRank: 1 },
  { id: "f2", name: "Vivaan Gupta", avatarColor: "emerald", level: 11, xp: 4610, status: "online", streak: 8, badges: 10, trend: "up", lastActive: "Online now", classRank: 2 },
  { id: "f3", name: "Ananya Reddy", avatarColor: "amber", level: 11, xp: 4380, status: "in-class", streak: 5, badges: 9, trend: "up", lastActive: "In Mathematics class", classRank: 3 },
  { id: "f4", name: "Saanvi Iyer", avatarColor: "teal", level: 10, xp: 3990, status: "online", streak: 3, badges: 8, trend: "down", lastActive: "5 min ago", classRank: 5 },
  { id: "f5", name: "Aditya Nair", avatarColor: "sky", level: 9, xp: 3840, status: "offline", streak: 0, badges: 7, trend: "up", lastActive: "2 hours ago", classRank: 6 },
  { id: "f6", name: "Ishita Desai", avatarColor: "pink", level: 9, xp: 3720, status: "offline", streak: 2, badges: 7, trend: "same", lastActive: "Yesterday", classRank: 7 },
]

export interface FriendRequest {
  id: string
  name: string
  avatarColor: string
  level: number
  mutualFriends: number
  date: string
}
export const FRIEND_REQUESTS: FriendRequest[] = [
  { id: "fr1", name: "Reyansh Kulkarni", avatarColor: "cyan", level: 9, mutualFriends: 3, date: "2 hours ago" },
  { id: "fr2", name: "Myra Joshi", avatarColor: "orange", level: 8, mutualFriends: 5, date: "Yesterday" },
]

export interface EncouragementMessage {
  id: string
  from: string
  avatarColor: string
  emoji: string
  message: string
  time: string
}
export const ENCOURAGEMENTS_RECEIVED: EncouragementMessage[] = [
  { id: "e1", from: "Diya Patel", avatarColor: "rose", emoji: "🔥", message: "Great job on the Math quiz! You're crushing it!", time: "1 hour ago" },
  { id: "e2", from: "Vivaan Gupta", avatarColor: "emerald", emoji: "💪", message: "Keep the streak going buddy!", time: "3 hours ago" },
  { id: "e3", from: "Ananya Reddy", avatarColor: "amber", emoji: "🌟", message: "Your science project was amazing!", time: "Yesterday" },
]

export const ENCOURAGEMENT_EMOJIS = ["🔥", "💪", "🌟", "👏", "🚀", "💯", "🎉", "⭐", "🎓", "✨"]
export const ENCOURAGEMENT_MESSAGES = [
  "Great job today!", "Keep it up!", "You're amazing!", "Proud of you!", "Keep the streak going!",
  "Way to go!", "You're on fire!", "Excellent work!", "Fantastic effort!", "You're a star!",
]

export const DEMO_ACCOUNTS: {
  role: Role
  name: string
  title: string
  username: string
  password: string
  email: string
  avatarColor: string
  accent: string
  desc: string
}[] = [
  {
    role: "principal",
    name: "Dr. Anjali Deshpande",
    title: "Principal / School Administrator",
    username: "principal",
    password: "scholario",
    email: "anjali.d@srividya-mandir.edu.in",
    avatarColor: "emerald",
    accent: "from-emerald-500 to-teal-600",
    desc: "Full control center — admissions, finance, academics, analytics & operations.",
  },
  {
    role: "teacher",
    name: "Rajesh Kulkarni",
    title: "Senior PGT — Mathematics",
    username: "teacher",
    password: "scholario",
    email: "rajesh.k@srividya-mandir.edu.in",
    avatarColor: "amber",
    accent: "from-amber-500 to-orange-600",
    desc: "Focused productivity — attendance, homework, marks entry & student progress.",
  },
  {
    role: "student",
    name: "Aarav Sharma",
    title: "Grade 10 A • Roll No. 01",
    username: "student",
    password: "scholario",
    email: "aarav.s@srividya-mandir.edu.in",
    avatarColor: "violet",
    accent: "from-violet-500 to-fuchsia-600",
    desc: "Modern & youthful — timetable, results, homework, fees & announcements.",
  },
  {
    role: "parent",
    name: "Suresh Sharma",
    title: "Parent of Aarav • Grade 10 A",
    username: "parent",
    password: "scholario",
    email: "suresh.sharma@gmail.com",
    avatarColor: "cyan",
    accent: "from-cyan-500 to-teal-600",
    desc: "Stay connected — track your child's progress, attendance, fees & messages.",
  },
  {
    role: "superadmin",
    name: "Arjun Mehta",
    title: "Platform Super Admin",
    username: "superadmin",
    password: "scholario",
    email: "arjun@scholario-os.com",
    avatarColor: "slate",
    accent: "from-slate-700 to-slate-900",
    desc: "Complete platform control — schools, billing, monitoring, security & feature flags.",
  },
]
