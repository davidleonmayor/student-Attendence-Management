// components/Navbar.jsx — Top navigation bar
// Member 1 contribution: navigation shell used across all modules.

import React, { useState } from "react";
import DarkMode from "./DarkMode";

const TABS = [
  { id: "dashboard",  label: "Dashboard",  icon: "⬡" },
  { id: "students",   label: "Students",   icon: "👤" },
  { id: "attendance", label: "Attendance", icon: "✓" },
  { id: "reports",    label: "Reports",    icon: "◫" },
];

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTab = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="brand-icon">Ψ</span>
        <span className="brand-name">AttendIQ</span>
        <span className="brand-sub">Management System</span>
      </div>

      {/* Desktop tabs */}
      <ul className="navbar-tabs">
        {TABS.map((t) => (
          <li key={t.id}>
            <button
              className={`nav-btn${activeTab === t.id ? " active" : ""}`}
              onClick={() => handleTab(t.id)}
            >
              <span className="nav-icon">{t.icon}</span>
              {t.label}
            </button>.
          </li>
        ))}
      </ul>

      {/* Right controls */}
      <div className="navbar-right">
        <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
        {/* Hamburger for mobile */}
        <button className="hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <ul className="mobile-menu">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                className={`nav-btn${activeTab === t.id ? " active" : ""}`}
                onClick={() => handleTab(t.id)}
              >
                <span className="nav-icon">{t.icon}</span>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
