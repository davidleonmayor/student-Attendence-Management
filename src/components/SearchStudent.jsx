// components/SearchStudent.jsx — Reusable search bar used in StudentList and Reports
// Member 1: Student Management module.
// Props:
//   query (string)        — current search value
//   setQuery (fn)         — setter
//   placeholder (string)  — optional custom placeholder

import React from "react";

export default function SearchStudent({ query, setQuery, placeholder = "Search by name, roll, or course…" }) {
  return (
    <div className="search-bar">
      <span className="search-icon">⌕</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}
