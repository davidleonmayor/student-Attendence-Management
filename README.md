# AttendIQ — Attendance Management System

A professional, fully client-side Attendance Management System built with **React 18 + Vite**. No backend, no database — all data persists in `localStorage`.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open http://localhost:5173 in your browser

# 4. Build for production
npm run build
```

---

## 📁 Project Structure

```
attendance-system/
├── index.html                  # HTML entry point (Google Fonts, meta tags)
├── vite.config.js              # Vite + React plugin config
├── package.json
└── src/
    ├── main.jsx                # ReactDOM.createRoot entry
    ├── App.jsx                 # Root component — global state, localStorage, routing
    ├── App.css                 # Complete design system (tokens, components, responsive)
    └── components/
        ├── Navbar.jsx          # Sticky navigation + mobile hamburger menu
        ├── DarkMode.jsx        # Animated dark/light mode toggle
        ├── AddStudent.jsx      # Add / Edit student modal with validation
        ├── SearchStudent.jsx   # Reusable search bar component
        ├── StudentList.jsx     # Student CRUD view (search, add, edit, delete)
        ├── Attendance.jsx      # Daily attendance marking + history table
        ├── Dashboard.jsx       # Stat cards, spark chart, top attendees
        └── Reports.jsx         # Student-wise table + monthly summary
```

---

## 👥 Team Member Module Breakdown

### Member 1 — Student Management
**Files:** `Navbar.jsx`, `DarkMode.jsx`, `AddStudent.jsx`, `SearchStudent.jsx`, `StudentList.jsx`

**Responsibilities:**
- Build the global navigation bar with tab routing and mobile hamburger menu
- Implement the dark mode toggle (persisted to localStorage via App.jsx)
- Create the AddStudent modal form with client-side validation
  - Required fields: Name, Roll Number, Course
  - Optional field: Email with format validation
- Build StudentList with a responsive card grid
  - Search/filter by name, roll number, or course
  - Inline delete confirmation to prevent accidental deletions
  - Edit flow opens pre-filled AddStudent modal
- Build the reusable SearchStudent component (used in StudentList + Reports)

**Key React concepts used:** `useState` for form and filter state, controlled inputs, prop drilling for CRUD callbacks.

---

### Member 2 — Attendance Module
**Files:** `Attendance.jsx`

**Responsibilities:**
- Date picker for selecting any past or present date
- Roster list showing all students for the selected date
- Per-student P / A toggle buttons — clicking cycles: unmarked → present → absent → unmarked
- "Mark All Present" one-click button
- Live summary bar: present count, absent count, unmarked count, attendance %
- Collapsible attendance history table
  - Shows every date that has been recorded
  - Color-coded dots per student per day (green = present, red = absent, grey = unmarked)
  - Click any date in history to jump to it in the main picker

**Data model:** `attendance` is an object keyed by `"YYYY-MM-DD"`, each value is `{ studentId: true|false }`.

**Key React concepts used:** `useState` for date and UI state, derived computation from props (no extra useEffect needed), conditional rendering.

---

### Member 3 — Dashboard, Reports & Local Storage
**Files:** `Dashboard.jsx`, `Reports.jsx`, `App.jsx` (localStorage logic)

**Responsibilities:**

**Dashboard:**
- 4 stat cards: Total Students, Present Today, Absent Today, Overall Attendance %
- Left-accent card design (signature element) with color-coded borders
- Today's Progress: horizontal progress bar
- Last 7 Days: mini spark-bar chart of daily attendance %
- Top Attendees: ranked list of students by overall attendance %

**Reports:**
- Tab switcher: Student-wise | Monthly Summary
- Student-wise table: name, roll, course, present days, absent days, total days, %, mini bar
  - Sortable by Highest / Lowest attendance
  - Search filter integrated (reuses SearchStudent)
  - Rows with <75% attendance are visually flagged
  - Color-coded % badges: green ≥75%, amber 50-74%, red <50%
- Monthly Summary: card grid showing per-month attendance rate with progress bars

**Local Storage (in App.jsx):**
- `ams_students` → JSON array of student objects
- `ams_attendance` → JSON object keyed by date
- `ams_dark` → boolean dark mode preference
- Seed data pre-loaded on first launch (5 demo students)
- All three `useEffect` hooks write to localStorage on every state change

**Key React concepts used:** `useMemo` for expensive derived statistics, `useEffect` for persistence and DOM class toggling.

---

## ✨ Feature Checklist

| Feature | Status |
|---|---|
| Add / Edit / Delete students | ✅ |
| Search students | ✅ |
| Mark Present / Absent | ✅ |
| Mark All Present | ✅ |
| Date-wise attendance | ✅ |
| Attendance history table | ✅ |
| Dashboard stat cards | ✅ |
| Spark chart (last 7 days) | ✅ |
| Student-wise % report | ✅ |
| Monthly summary | ✅ |
| Sort highest / lowest | ✅ |
| Dark mode toggle | ✅ |
| localStorage persistence | ✅ |
| Mobile-responsive layout | ✅ |
| Input validation | ✅ |

---

## 🎨 Design System

**Palette**
| Token | Value | Usage |
|---|---|---|
| `--indigo` | `#6366f1` | Primary accent, nav active, links |
| `--blue`   | `#3b82f6` | Secondary accent |
| `--green`  | `#10b981` | Present, good attendance |
| `--red`    | `#ef4444` | Absent, low attendance |
| `--amber`  | `#f59e0b` | Average attendance warning |

**Signature element:** stat cards with a 4px left-border colored stripe — a data-dense pattern borrowed from financial dashboards, appropriate for an attendance tracking context.

**Typography:** Inter (system-fallback stack) — chosen for legibility at small sizes in tables and data-dense views.

---

## 🛠 Tech Stack

- **React 18** — functional components, hooks only
- **Vite 5** — development server + production build
- **Vanilla CSS** — custom design system, no UI library
- **localStorage** — client-side persistence, no backend required

---

## 📝 Resume Description

> **AttendIQ — Attendance Management System** | React · Vite · localStorage
>
> A fully client-side attendance management application with student CRUD, date-wise attendance marking, real-time dashboard analytics, and sortable reports. Built with React 18 functional components and hooks (useState, useEffect, useMemo). Data persists across sessions via localStorage with no backend. Features dark mode, mobile-responsive design, and a reusable component architecture suited for multi-developer collaboration.
