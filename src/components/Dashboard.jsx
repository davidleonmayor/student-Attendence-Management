// components/Dashboard.jsx — Overview statistics
// Member 3: Dashboard, Reports, and Local Storage module.
// Shows: total students, today's present/absent, overall attendance %, recent activity.

import React, { useMemo } from "react";

const today = () => new Date().toISOString().split("T")[0];

export default function Dashboard({ students, attendance }) {
  const todayRecord = attendance[today()] || {};

  const todayPresent = students.filter((s) => todayRecord[s.id] === true).length;
  const todayAbsent  = students.filter((s) => todayRecord[s.id] === false).length;
  const todayMarked  = todayPresent + todayAbsent;

  /* Overall attendance % across ALL recorded dates */
  const overallPct = useMemo(() => {
    let totalSlots   = 0;
    let totalPresent = 0;
    Object.values(attendance).forEach((dayRec) => {
      Object.values(dayRec).forEach((v) => {
        if (v === true || v === false) {
          totalSlots++;
          if (v) totalPresent++;
        }
      });
    });
    return totalSlots ? Math.round((totalPresent / totalSlots) * 100) : 0;
  }, [attendance]);

  /* Last 7 recorded dates for the mini bar chart */
  const last7 = useMemo(() => {
    const dates = Object.keys(attendance)
      .filter((d) => Object.keys(attendance[d]).length > 0)
      .sort((a, b) => a.localeCompare(b))
      .slice(-7);
    return dates.map((d) => {
      const rec = attendance[d] || {};
      const p   = Object.values(rec).filter(Boolean).length;
      const t   = Object.values(rec).filter((v) => v === true || v === false).length;
      return { date: d, pct: t ? Math.round((p / t) * 100) : 0 };
    });
  }, [attendance]);

  /* Top 3 most present students overall */
  const topStudents = useMemo(() => {
    return students
      .map((s) => {
        let present = 0, total = 0;
        Object.values(attendance).forEach((rec) => {
          if (rec[s.id] === true)  { present++; total++; }
          if (rec[s.id] === false) { total++; }
        });
        return { ...s, pct: total ? Math.round((present / total) * 100) : null };
      })
      .filter((s) => s.pct !== null)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
  }, [students, attendance]);

  const fmtDate = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard label="Total Students"    value={students.length}  icon="👤" accent="var(--blue)"  />
        <StatCard label="Present Today"     value={todayPresent}     icon="✓"  accent="var(--green)" />
        <StatCard label="Absent Today"      value={todayAbsent}      icon="✗"  accent="var(--red)"   />
        <StatCard label="Overall Attendance" value={`${overallPct}%`} icon="◫"  accent="var(--indigo)" />
      </div>

      {/* Today's quick status */}
      <div className="dash-row">
        <div className="dash-card">
          <h2 className="card-title">Today's Progress</h2>
          {students.length === 0 ? (
            <p className="muted-text">Add students to start tracking.</p>
          ) : todayMarked === 0 ? (
            <p className="muted-text">Attendance not marked yet for today.</p>
          ) : (
            <>
              <ProgressBar value={todayPresent} max={students.length} color="var(--green)" />
              <p className="muted-text" style={{ marginTop: "0.5rem" }}>
                {todayPresent} present · {todayAbsent} absent · {students.length - todayMarked} unmarked
              </p>
            </>
          )}
        </div>

        {/* Mini sparkline bar chart */}
        <div className="dash-card">
          <h2 className="card-title">Last 7 Days</h2>
          {last7.length === 0 ? (
            <p className="muted-text">No history yet.</p>
          ) : (
            <div className="spark-chart">
              {last7.map((d) => (
                <div key={d.date} className="spark-bar-wrap" title={`${fmtDate(d.date)}: ${d.pct}%`}>
                  <div className="spark-bar" style={{ height: `${Math.max(d.pct, 4)}%` }} />
                  <span className="spark-label">{fmtDate(d.date).split(" ")[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top attendees */}
      {topStudents.length > 0 && (
        <div className="dash-card top-students">
          <h2 className="card-title">Top Attendees</h2>
          <div className="top-list">
            {topStudents.map((s, i) => (
              <div key={s.id} className="top-row">
                <span className="top-rank">#{i + 1}</span>
                <span className="top-name">{s.name}</span>
                <span className="top-pct" style={{ color: pctColor(s.pct) }}>{s.pct}%</span>
                <div className="top-bar-wrap">
                  <div className="top-bar" style={{ width: `${s.pct}%`, background: pctColor(s.pct) }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */
function StatCard({ label, value, icon, accent }) {
  return (
    <div className="stat-card" style={{ "--accent": accent }}>
      <span className="stat-icon">{icon}</span>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      <span className="progress-pct">{pct}%</span>
    </div>
  );
}

function pctColor(pct) {
  if (pct >= 75) return "var(--green)";
  if (pct >= 50) return "var(--amber)";
  return "var(--red)";
}
