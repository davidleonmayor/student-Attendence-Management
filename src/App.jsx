// App.jsx — Root component
// Manages global state: students, attendance records, dark mode, active tab.
// Persists everything to localStorage via useEffect.

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import StudentList from "./components/StudentList";
import Attendance from "./components/Attendance";
import Reports from "./components/Reports";

/* ─── LocalStorage helpers ─────────────────────────────────────────────── */
const LS_STUDENTS = "ams_students";
const LS_ATTENDANCE = "ams_attendance";
const LS_DARK = "ams_dark";

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/* ─── Seed data shown on first launch ─────────────────────────────────── */
const SEED_STUDENTS = [
  { id: "s1", name: "Aisha Patel",   roll: "101", course: "Computer Science", email: "aisha@example.com" },
  { id: "s2", name: "Marcus Rivera", roll: "102", course: "Mathematics",       email: "marcus@example.com" },
  { id: "s3", name: "Yuki Tanaka",   roll: "103", course: "Physics",           email: "yuki@example.com" },
  { id: "s4", name: "Fatima Al-Sayed", roll: "104", course: "Chemistry",       email: "fatima@example.com" },
  { id: "s5", name: "Ethan Brooks",  roll: "105", course: "Computer Science",  email: "ethan@example.com" },
];

export default function App() {
  /* ── State ── */
  const [students, setStudents]     = useState(() => load(LS_STUDENTS, SEED_STUDENTS));
  const [attendance, setAttendance] = useState(() => load(LS_ATTENDANCE, {}));
  const [darkMode, setDarkMode]     = useState(() => load(LS_DARK, false));
  const [activeTab, setActiveTab]   = useState("dashboard");

  /* ── Persist to localStorage on every change ── */
  useEffect(() => { localStorage.setItem(LS_STUDENTS,   JSON.stringify(students));    }, [students]);
  useEffect(() => { localStorage.setItem(LS_ATTENDANCE, JSON.stringify(attendance));  }, [attendance]);
  useEffect(() => { localStorage.setItem(LS_DARK,       JSON.stringify(darkMode));    }, [darkMode]);

  /* ── Apply dark-mode class to <html> ── */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ─── Student CRUD ──────────────────────────────────────────────────── */
  const addStudent = (student) => {
    const newStudent = { ...student, id: `s${Date.now()}` };
    setStudents((prev) => [...prev, newStudent]);
  };

  const editStudent = (id, updated) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Also remove their attendance records
    setAttendance((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((date) => {
        if (next[date][id] !== undefined) {
          const day = { ...next[date] };
          delete day[id];
          next[date] = day;
        }
      });
      return next;
    });
  };

  /* ─── Attendance helpers ────────────────────────────────────────────── */
  // attendance shape: { "YYYY-MM-DD": { studentId: true|false, ... } }

  const markAttendance = (date, studentId, present) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: { ...(prev[date] || {}), [studentId]: present },
    }));
  };

  const markAllPresent = (date) => {
    const record = {};
    students.forEach((s) => { record[s.id] = true; });
    setAttendance((prev) => ({ ...prev, [date]: record }));
  };

  /* ─── Shared props ──────────────────────────────────────────────────── */
  const sharedProps = { students, attendance, addStudent, editStudent, deleteStudent, markAttendance, markAllPresent };

  /* ─── Render ────────────────────────────────────────────────────────── */
  return (
    <div className={`app-root${darkMode ? " dark" : ""}`}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="main-content">
        {activeTab === "dashboard"  && <Dashboard  {...sharedProps} />}
        {activeTab === "students"   && <StudentList {...sharedProps} />}
        {activeTab === "attendance" && <Attendance  {...sharedProps} />}
        {activeTab === "reports"    && <Reports     {...sharedProps} />}
      </main>
    </div>
  );
}
