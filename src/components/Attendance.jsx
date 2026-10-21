// components/Attendance.jsx — Daily attendance marking + history view
// Member 2: Attendance Module.
// Features: date picker, mark present/absent per student, mark-all-present,
//           live summary bar, and a collapsible attendance history table.

import React, { useState } from "react";

/* Today in YYYY-MM-DD format */
const today = () => new Date().toISOString().split("T")[0];

export default function Attendance({ students, attendance, markAttendance, markAllPresent }) {
  const [selectedDate, setSelectedDate] = useState(today());
  const [showHistory,  setShowHistory]  = useState(false);

  /* Records for the selected date */
  const dayRecord = attendance[selectedDate] || {};

  const presentCount = students.filter((s) => dayRecord[s.id] === true).length;
  const absentCount  = students.filter((s) => dayRecord[s.id] === false).length;
  const unmarkedCount = students.length - presentCount - absentCount;

  /* Dates that have at least one record, sorted newest first */
  const recordedDates = Object.keys(attendance)
    .filter((d) => Object.keys(attendance[d]).length > 0)
    .sort((a, b) => b.localeCompare(a));

  /* Toggle a single student */
  const toggle = (studentId, current) => {
    // If unmarked → present; if present → absent; if absent → remove mark
    if (current === undefined) markAttendance(selectedDate, studentId, true);
    else if (current === true)  markAttendance(selectedDate, studentId, false);
    else                        markAttendance(selectedDate, studentId, undefined);
  };

  const statusLabel = (v) => {
    if (v === true)      return { label: "Present", cls: "badge-present" };
    if (v === false)     return { label: "Absent",  cls: "badge-absent"  };
    return                      { label: "—",       cls: "badge-none"    };
  };

  /* Format YYYY-MM-DD → readable */
  const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  /* History summary for a given date */
  const historySummary = (d) => {
    const rec = attendance[d] || {};
    const p   = Object.values(rec).filter(Boolean).length;
    const total = Object.keys(rec).length;
    return total ? `${p}/${total} present` : "—";
  };

  return (
    <section className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-sub">Mark attendance for any date</p>
        </div>
      </div>

      {/* Date picker + actions */}
      <div className="att-controls">
        <div className="att-date-wrap">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="date-input"
            value={selectedDate}
            max={today()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="att-actions">
          <button
            className="btn btn-secondary"
            onClick={() => markAllPresent(selectedDate)}
            disabled={students.length === 0}
          >
            ✓ Mark All Present
          </button>
        </div>
      </div>

      {/* Summary bar */}
      {students.length > 0 && (
        <div className="att-summary">
          <Pill label="Present"  count={presentCount}  color="var(--green)" />
          <Pill label="Absent"   count={absentCount}   color="var(--red)"   />
          <Pill label="Unmarked" count={unmarkedCount}  color="var(--muted)" />
          {students.length > 0 && (
            <span className="att-pct">
              {Math.round((presentCount / students.length) * 100)}% attendance
            </span>
          )}
        </div>
      )}

      {/* Student roster */}
      {students.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✓</span>
          <p>Add students first to mark attendance.</p>
        </div>
      ) : (
        <div className="att-list">
          <div className="att-list-head">
            <span>Student</span>
            <span>Roll</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {students.map((s) => {
            const val = dayRecord[s.id];
            const { label, cls } = statusLabel(val);
            return (
              <div key={s.id} className={`att-row${val === false ? " row-absent" : val === true ? " row-present" : ""}`}>
                <span className="att-name">{s.name}</span>
                <span className="att-roll">#{s.roll}</span>
                <span className={`badge ${cls}`}>{label}</span>
                <div className="att-btns">
                  <button
                    className={`btn btn-sm ${val === true ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => markAttendance(selectedDate, s.id, true)}
                  >P</button>
                  <button
                    className={`btn btn-sm ${val === false ? "btn-danger" : "btn-ghost"}`}
                    onClick={() => markAttendance(selectedDate, s.id, false)}
                  >A</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Attendance History */}
      <div className="history-section">
        <button className="btn btn-ghost history-toggle" onClick={() => setShowHistory((h) => !h)}>
          {showHistory ? "▲ Hide" : "▼ Show"} Attendance History ({recordedDates.length} days)
        </button>

        {showHistory && (
          recordedDates.length === 0 ? (
            <p className="muted-text">No attendance records yet.</p>
          ) : (
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Summary</th>
                    {students.map((s) => <th key={s.id}>{s.name.split(" ")[0]}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {recordedDates.map((d) => (
                    <tr key={d} className={d === selectedDate ? "row-highlight" : ""}>
                      <td><button className="link-btn" onClick={() => setSelectedDate(d)}>{fmt(d)}</button></td>
                      <td>{historySummary(d)}</td>
                      {students.map((s) => {
                        const v = (attendance[d] || {})[s.id];
                        return (
                          <td key={s.id}>
                            <span className={`dot ${v === true ? "dot-present" : v === false ? "dot-absent" : "dot-none"}`} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </section>
  );
}

/* Small summary pill */
function Pill({ label, count, color }) {
  return (
    <div className="summary-pill" style={{ "--pill-color": color }}>
      <span className="pill-count">{count}</span>
      <span className="pill-label">{label}</span>
    </div>
  );
}
