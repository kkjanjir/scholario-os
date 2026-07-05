# 🎓 SCHOLARIO-OS

> **The School Operating System** — A premium, enterprise-grade, multi-tenant SaaS school ERP platform.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New_York-000000)](https://ui.shadcn.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0066?logo=framer)](https://www.framer.com/motion/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Roles & Access Control](#roles--access-control)
- [Module Structure](#module-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [Project Structure](#project-structure)
- [Features](#features)
- [License](#license)

---

## 🌟 Overview

SCHOLARIO-OS is a high-fidelity, production-grade demonstration of a complete school ERP platform. It features **5 fully-isolated roles**, **67+ interactive modules**, premium glassmorphism UI, real-time chat, gamification, payment simulations, and a complete multi-tenant Super Admin control plane.

Every screen looks production-ready. Every interaction feels real. Every page contains believable Indian school data.

---

## 🏗 Architecture

```
Single-route SPA (Next.js 16 App Router)
├── Zustand store manages auth, navigation, theme, impersonation & control plane state
├── Role-based routing (no URL changes — state-driven)
├── Lazy-loaded modules (React.lazy + Suspense for optimal memory)
├── Strict role isolation (separate nav, theme, data per role)
└── Mock data layer (realistic Indian school data, no backend needed)
```

---

## 👥 Roles & Access Control

| Role | Theme Color | Modules | Description |
|------|-------------|---------|-------------|
| **Super Admin** | Slate | 10 + Control Plane | Complete platform control — provision, configure, deploy, monitor schools |
| **Principal** | Emerald | 23 | Full school control center — admissions, finance, academics, analytics |
| **Teacher** | Amber | 11 | Focused productivity — attendance, homework, marks, lessons |
| **Student** | Violet | 13 | Modern & youthful — gamification, challenges, friends, results |
| **Parent** | Cyan | 10 | Stay connected — child progress, chat, fees, schedule |

### Role Isolation
- Each role has completely separate navigation
- Each role has its own color theme (via `data-role` CSS attributes)
- No module from one role appears in another
- No shared dashboards or data leakage

---

## 📦 Module Structure

### Super Admin (Platform Owner)
```
├── Global Dashboard          — 20+ KPIs, revenue charts, live activity feed
├── School Management         — Provision, configure, deploy, monitor schools
│   ├── Provisioning Wizard   — 10-step guided school setup with deploy simulation
│   └── School Control Plane  — Full-screen workspace per school
│       ├── Overview          — School profile, resources, services, activity
│       ├── Configuration     — Edit all provisioning settings post-deployment
│       ├── Monitoring        — CPU, RAM, storage, API, AI, SMS, email metrics
│       ├── Audit Trail       — Change tracking with old→new values
│       ├── Feature Flags     — Hierarchical control + live preview mode
│       ├── Modules           — Installable extensions + safe registration
│       ├── Branding          — Logo, theme, templates, website builder
│       ├── Deployment        — Domain, environment, deploy animation
│       ├── Open As Role      — Impersonate any of 10 roles
│       └── Security          — Events, policies, API keys, sessions
├── Feature Flags             — Platform-wide hierarchical feature control
├── Subscription & Billing    — Plans, invoices, renewals, GST
├── Platform Monitoring       — System health, logs, service status
├── Security Center           — RBAC matrix, sessions, blocked IPs
├── Global Communication      — Broadcast email/SMS/push
├── White Label               — Custom branding, domains, templates
├── Support Center            — Tickets, incidents, feature requests
└── Developer Center          — API reference, webhooks, env vars, system info
```

### Principal / School Admin
```
├── Dashboard                 — 8 animated KPIs, charts, lists, fleet status
├── Action Center             — Unified critical items from all modules
├── Analytics                 — 6-tab analytics with radar/treemap/funnel charts
├── At-Risk Students          — AI predictive analytics with recommendations
├── Student Admission         — 12-step wizard with receipt generation
├── Teacher Management        — Faculty profiles, salary slips, attendance
├── Class Management          — Classes, sections, subjects, timetables
├── Attendance                — Daily/monthly/calendar heatmap views
├── Fee Management            — Invoices, payment simulation, receipts
├── Fee Defaulters            — Follow-up workflow with email/SMS/push
├── Salary Management         — Payroll, slips, process animation
├── Examination               — Exams, marks entry, report cards, rankings
├── Homework                  — Assign, track submissions, review
├── Assignments               — Rubric builder, evaluation
├── Calendar                  — Month grid with event types
├── Communication             — Announcements, SMS/email/push previews
├── Library                   — Books, issues, returns, fines
├── Transport                 — Routes, live tracking map, drivers
├── Inventory                 — Assets, stock levels, reorder alerts
├── Certificates              — 7 types with real print/download
└── Settings                  — School profile, theme, language, backup
```

### Teacher
```
├── Dashboard                 — Today's classes, pending tasks, analytics
├── Attendance                — Per-student Present/Absent/Late/Leave + save
├── Homework                  — Create, track submissions, review
├── Assignments               — Rubric builder, evaluation dialog
├── Marks Entry               — Auto-save, publish results
├── Students                  — Profiles, performance charts, parent messaging
├── Timetable                 — Today + weekly grid, live period indicator
├── Lesson Planner            — Create plans, objectives, activities, resources
├── Parent Chat               — Real-time messaging with typing indicator
├── Communication             — Announcements, parent messages
└── Analytics                 — Class performance, attendance trends
```

### Student
```
├── Dashboard                 — Gamification widget, challenges, progress
├── Profile                   — Student info, parents, IDs, academic summary
├── Achievements              — 12 badges, XP history, season leaderboard
├── Daily Challenges          — XP rewards, claim animation, weekly quests
├── Friends                   — XP comparison, encouragement system
├── Attendance                — 3-month heatmap, radial gauge
├── Homework                  — Submit with confetti, teacher feedback
├── Assignments               — Rubric, submission, marks
├── Results                   — Radar chart, report card download, progress
├── Fees                      — Payment simulation with receipt
├── Timetable                 — Today timeline + weekly grid
├── Calendar                  — Events, exams, holidays, birthdays
└── Announcements             — Priority-ribbon notice cards
```

### Parent
```
├── Dashboard                 — Child overview, achievements, schedule, fees
├── Teacher Chat              — Real-time messaging with typing indicator
├── Academic Progress         — Subject performance, term trends
├── Attendance                — Heatmap, radial gauge
├── Results                   — Exam results, report card download
├── Messages                  — Inbox with reply composer
├── Fees                      — Payment simulation, history
├── Calendar                  — Events, exams, holidays
├── Notices                   — Type-colored notice cards
└── Teachers                  — Teacher profiles, contact actions
```

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16 (App Router) | Framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | New York | Component library |
| Framer Motion | 12 | Animations |
| Recharts | 2.15 | Charts (area, bar, line, pie, radar, treemap, funnel, composed) |
| Zustand | 5 | State management |
| Lucide React | 0.525 | Icons |
| Sonner | 2 | Toast notifications |
| React Hook Form | 7 | Forms |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/kkjanjir/scholario-os.git
cd scholario-os

# Install dependencies
bun install

# Push database schema
bun run db:push

# Start development server
bun run dev

# Open http://localhost:3000
```

---

## 🔑 Demo Credentials

Click any credential card on the login page to auto-fill:

| Role | Username | Password |
|------|----------|----------|
| Super Admin | `superadmin` | `scholario` |
| Principal | `principal` | `scholario` |
| Teacher | `teacher` | `scholario` |
| Student | `student` | `scholario` |
| Parent | `parent` | `scholario` |

---

## 📁 Project Structure

```
scholario-os/
├── src/
│   ├── app/
│   │   ├── globals.css          # Design system, themes, animations
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   └── page.tsx             # SPA router (lazy-loaded role apps)
│   ├── components/
│   │   ├── login/               # Premium glassmorphism login
│   │   ├── shared/              # Shared components (AppShell, charts, UI, etc.)
│   │   ├── principal/           # Principal role (23 modules)
│   │   ├── teacher/             # Teacher role (11 modules)
│   │   ├── student/             # Student role (13 modules)
│   │   ├── parent/              # Parent role (10 modules)
│   │   ├── superadmin/          # Super Admin role (10 modules + control plane)
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       ├── store.ts             # Zustand store (auth, nav, theme, impersonation)
│       ├── utils.ts             # Utility functions
│       ├── db.ts                # Prisma client
│       └── mock/
│           ├── data.ts          # School mock data (students, teachers, fees, etc.)
│           └── superadmin-data.ts # Platform mock data (schools, billing, security)
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                      # Static assets (favicon, logo)
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## ✨ Key Features

### Premium UI/UX
- Glassmorphism design with aurora backgrounds and floating particles
- Role-based color themes (emerald/amber/violet/cyan/slate)
- Framer Motion animations throughout (page transitions, counters, confetti)
- Premium dark mode with optimized shadows and glass surfaces
- Fully responsive (mobile-first design)

### Gamification
- XP system with 6 levels (Beginner → Legend)
- 12 achievement badges with unlock animations
- Daily challenges with XP rewards + confetti burst
- Weekly quests with countdown
- Class leaderboard with podium
- Student friend system with encouragement messages
- Reward notification system (global confetti toasts)

### Multi-Tenant SaaS
- 10-step School Provisioning Wizard (Vercel/Shopify-style)
- School Control Plane (full-screen workspace per school)
- Feature Flag system with 4-level hierarchy + live preview mode
- Module marketplace with safe extensibility workflow
- Role impersonation with clear banner + return action
- Payment gateway configuration (Razorpay/Cashfree/PhonePe/PayU)
- Deployment simulation with 9-step progress animation

### Realistic Data
- 308 students across 8 classes with Indian names
- 12 teachers with departments, qualifications, salaries
- Fee invoices, salary slips, exam results, attendance records
- Library books, transport routes, inventory items
- Chat threads, announcements, calendar events
- All data interconnected across modules

---

## 📄 License

This is a demonstration project. All data is simulated.

---

<p align="center">Built with ❤️ as a premium enterprise SaaS demonstration</p>
