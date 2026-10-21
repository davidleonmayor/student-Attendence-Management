// components/Reports.jsx — Attendance analytics and summaries
// Member 3: Dashboard, Reports, and Local Storage module.
// Features: student-wise % table (sortable), monthly summary, export hint.

import React, { useState, useMemo } from "react";
import SearchStudent from "./SearchStudent";

export default function Reports({ students, attendance }) {
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = highest first
  const [query,     setQuery]     = useState("");
  const [activeView, setActiveView] = useState("student"); // "student" | "monthly"

  /* ── Student-wise attendance summary ── */
  const studentStats = useMemo(() => {
    return students.map((s) => {
      let present = 0, absent = 0;
      Object.values(attendance).forEach((rec) => {
        if (rec[s.id] === true)  present++;
        if (rec[s.id] === false) absent++;
      });
      const total = present + absent;
      const pct   = total ? Math.round((present / total) * 100) : null;
      return { ...s, present, absent, total, pct };
    });
  }, [students, attendance]);

  const filtered = studentStats
    .filter((s) => {
      const q = query.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.roll.includes(q) || s.course.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const pa = a.pct ?? -1;
      const pb = b.pct ?? -1;
      return sortOrder === "desc" ? pb - pa : pa - pb;
    });

  /* ── Monthly summary ── */
  const monthlyStats = useMemo(() => {
    const map = {};
    Object.entries(attendance).forEach(([date, rec]) => {
      const month = date.slice(0, 7); // YYYY-MM
      if (!map[month]) map[month] = { days: 0, totalPresent: 0, totalSlots: 0 };
      const p = Object.values(rec).filter(Boolean).length;
      const t = Object.values(rec).filter((v) => v === true || v === false).length;
      map[month].days++;
      map[month].totalPresent += p;
      map[month].totalSlots   += t;
    });
    return Object.entries(map)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, data]) => ({
        month,
        label: new Date(month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" }),
        ...data,
        pct: data.totalSlots ? Math.round((data.totalPresent / data.totalSlots) * 100) : 0,
      }));
  }, [attendance]);

  /* Color coding */
  const pctColor = (pct) => {
    if (pct === null) return "var(--muted)";
    if (pct >= 75)   return "var(--green)";
    if (pct >= 50)   return "var(--amber)";
    return "var(--red)";
  };

  const PctBadge = ({ pct }) =>
    pct === null ? <span className="badge badge-none">No data</span> :
    <span className="badge" style={{ background: pctColor(pct) + "22", color: pctColor(pct), borderColor: pctColor(pct) + "55" }}>
      {pct}%
    </span>;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-sub">Analyse attendance trends</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="report-tabs">
        <button className={`tab-btn${activeView === "student" ? " active" : ""}`} onClick={() => setActiveView("student")}>
          Student-wise
        </button>
        <button className={`tab-btn${activeView === "monthly" ? " active" : ""}`} onClick={() => setActiveView("monthly")}>
          Monthly Summary
        </button>
      </div>

      {/* ── Student-wise view ── */}
      {activeView === "student" && (
        <>
          <div className="report-controls">
            <SearchStudent query={query} setQuery={setQuery} placeholder="Filter students…" />
            <div className="sort-wrap">
              <label className="form-label">Sort by attendance</label>
              <div className="sort-btns">
                <button
                  className={`btn btn-sm ${sortOrder === "desc" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setSortOrder("desc")}
                >↓ Highest</button>
                <button
                  className={`btn btn-sm ${sortOrder === "asc" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setSortOrder("asc")}
                >↑ Lowest</button>
              </div>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◫</span>
              <p>Add students and mark attendance to see reports.</p>
            </div>
          ) : (
            <div className="report-table-wrap">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Roll</th>
                    <th>Course</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Total Days</th>
                    <th>Attendance %</th>
                    <th>Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} className={s.pct !== null && s.pct < 75 ? "row-warn" : ""}>
                      <td>{i + 1}</td>
                      <td className="bold-cell">{s.name}</td>
                      <td>{s.roll}</td>
                      <td>{s.course}</td>
                      <td style={{ color: "var(--green)" }}>{s.present}</td>
                      <td style={{ color: "var(--red)"   }}>{s.absent}</td>
                      <td>{s.total}</td>
                      <td><PctBadge pct={s.pct} /></td>
                      <td>
                        <div className="mini-bar-track">
                          <div
                            className="mini-bar-fill"
                            style={{ width: `${s.pct ?? 0}%`, background: pctColor(s.pct) }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Legend */}
          <div className="legend">
            <span className="legend-item" style={{ "--lc": "var(--green)" }}>● ≥ 75% Good</span>
            <span className="legend-item" style={{ "--lc": "var(--amber)" }}>● 50–74% Average</span>
            <span className="legend-item" style={{ "--lc": "var(--red)"   }}>● &lt; 50% Low</span>
          </div>
        </>
      )}

      {/* ── Monthly view ── */}
      {activeView === "monthly" && (
        <>
          {monthlyStats.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◫</span>
              <p>No attendance records yet to generate monthly summaries.</p>
            </div>
          ) : (
            <div className="monthly-grid">
              {monthlyStats.map((m) => (
                <div key={m.month} className="monthly-card">
                  <div className="monthly-header">
                    <span className="monthly-label">{m.label}</span>
                    <span className="monthly-pct" style={{ color: pctColor(m.pct) }}>{m.pct}%</span>
                  </div>
                  <div className="monthly-track">
                    <div className="monthly-fill" style={{ width: `${m.pct}%`, background: pctColor(m.pct) }} />
                  </div>
                  <div className="monthly-meta">
                    <span>{m.days} school day{m.days !== 1 ? "s" : ""}</span>
                    <span>{m.totalPresent} present of {m.totalSlots} slots</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
