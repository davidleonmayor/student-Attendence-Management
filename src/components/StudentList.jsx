// components/StudentList.jsx — Full student management view
// Member 1: Student Management module.
// Features: search, add, edit, delete with confirmation.

import React, { useState } from "react";
import AddStudent from "./AddStudent";
import SearchStudent from "./SearchStudent";

export default function StudentList({ students, addStudent, editStudent, deleteStudent }) {
  const [query, setQuery]         = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);   // student object or null
  const [confirmId, setConfirmId] = useState(null);   // id pending deletion

  /* Filter by name, roll, or course */
  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.roll.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
    );
  });

  const openAdd  = () => { setEditing(null); setShowModal(true); };
  const openEdit = (s)  => { setEditing(s);  setShowModal(true); };

  const handleSave = (data) => {
    if (editing) {
      editStudent(editing.id, data);
    } else {
      addStudent(data);
    }
  };

  const handleDelete = (id) => {
    deleteStudent(id);
    setConfirmId(null);
  };

  /* Avatar initials */
  const initials = (name) =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <section className="page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-sub">{students.length} enrolled</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Student</button>
      </div>

      {/* Search */}
      <SearchStudent query={query} setQuery={setQuery} />

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">👤</span>
          <p>{query ? "No students match your search." : "No students yet. Add one to get started."}</p>
        </div>
      )}

      {/* Student cards */}
      <div className="student-grid">
        {filtered.map((s) => (
          <div key={s.id} className="student-card">
            <div className="student-avatar">{initials(s.name)}</div>
            <div className="student-info">
              <h3 className="student-name">{s.name}</h3>
              <span className="student-roll">Roll #{s.roll}</span>
              <span className="student-course">{s.course}</span>
              {s.email && <span className="student-email">{s.email}</span>}
            </div>
            <div className="student-actions">
              <button className="btn btn-sm btn-ghost" onClick={() => openEdit(s)} title="Edit">✎ Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(s.id)} title="Delete">✕ Delete</button>
            </div>

            {/* Inline delete confirmation */}
            {confirmId === s.id && (
              <div className="confirm-banner">
                <span>Delete {s.name}?</span>
                <button className="btn btn-sm btn-danger"  onClick={() => handleDelete(s.id)}>Yes, delete</button>
                <button className="btn btn-sm btn-ghost"   onClick={() => setConfirmId(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <AddStudent
          initial={editing}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
