// components/DarkMode.jsx — Animated light/dark toggle
// Accessible toggle with sun/moon icons.

import React from "react";

export default function DarkMode({ darkMode, setDarkMode }) {
  return (
    <button
      className={`dark-toggle${darkMode ? " on" : ""}`}
      onClick={() => setDarkMode((d) => !d)}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
    >
      <span className="toggle-track">
        <span className="toggle-thumb">{darkMode ? "🌙" : "☀️"}</span>
      </span>
    </button>
  );
}
