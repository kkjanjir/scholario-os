"use client"

import { motion } from "framer-motion"

export function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className || ""}`} />
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-3 w-40" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-48" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  )
}

// Triggers browser print for a specific element by adding 'printable' class
export function printElement(elementId: string) {
  const el = document.getElementById(elementId)
  if (!el) {
    window.print()
    return
  }
  el.classList.add("printable")
  document.querySelectorAll("body > *:not(.printable)").forEach((n) => {
    if (n instanceof HTMLElement) n.classList.add("no-print")
  })
  window.print()
  // cleanup
  el.classList.remove("printable")
  document.querySelectorAll(".no-print").forEach((n) => {
    if (n instanceof HTMLElement) n.classList.remove("no-print")
  })
}

// Downloads text content as a file
export function downloadFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Generate a simple text-based report card and download it
export function downloadReportCard(student: { name: string; className: string; section: string; rollNo: number; admissionNo: string }, result: { subject: string; marks: number; max: number; grade: string }[]) {
  const total = result.reduce((a, r) => a + r.marks, 0)
  const maxTotal = result.reduce((a, r) => a + r.max, 0)
  const pct = Math.round((total / maxTotal) * 100)
  const lines = [
    "============================================",
    "      SRI VIDYA MANDIR SR. SEC. SCHOOL      ",
    "          CBSE • Affiliation 1130456        ",
    "============================================",
    "",
    "           PROGRESS REPORT CARD             ",
    "           Session: 2025-2026               ",
    "",
    `  Student Name : ${student.name}`,
    `  Class/Section: ${student.className} - ${student.section}`,
    `  Roll No      : ${String(student.rollNo).padStart(2, "0")}`,
    `  Admission No : ${student.admissionNo}`,
    "",
    "--------------------------------------------",
    "  SUBJECT            MARKS    MAX    GRADE",
    "--------------------------------------------",
    ...result.map((r) => `  ${r.subject.padEnd(20)}${String(r.marks).padStart(4)}    ${String(r.max).padStart(3)}    ${r.grade}`),
    "--------------------------------------------",
    `  TOTAL              ${String(total).padStart(4)}    ${String(maxTotal).padStart(3)}    ${pct >= 90 ? "A1" : pct >= 80 ? "A2" : "B1"}`,
    "",
    `  Overall Percentage: ${pct}%`,
    `  Result: PASS`,
    "",
    "  Principal's Signature: _______________",
    "  Class Teacher's Sig. : _______________",
    "",
    `  Date: ${new Date().toLocaleDateString("en-IN")}`,
    "============================================",
  ]
  downloadFile(`ReportCard_${student.name.replace(/\s/g, "_")}.txt`, lines.join("\n"))
}
