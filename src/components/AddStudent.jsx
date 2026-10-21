// components/AddStudent.jsx — Modal form for adding or editing a student
// Member 1: Student Management module.
// Props:
//   onSave(data)  — called with form values when submitted
//   onClose()     — called to close the modal
//   initial       — pre-filled values when editing (optional)

import React, { useState } from "react";

const EMPTY = { name: "", roll: "", course: "", email: "" };

export default function AddStudent({ onSave, onClose, initial = null }) {
  const [form, setForm]     = useState(initial ? { ...initial } : { ...EMPTY });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  /* Basic validation */
  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = "Name is required.";
    if (!form.roll.trim())   e.roll   = "Roll number is required.";
    if (!form.course.trim()) e.course = "Course is required.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(ev) => ev.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? "Edit Student" : "Add New Student"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <Field label="Full Name *" error={errors.name}>
            <input
              type="text"
              placeholder="e.g. Aisha Patel"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={errors.name ? "input-error" : ""}
            />
          </Field>

          <Field label="Roll Number *" error={errors.roll}>
            <input
              type="text"
              placeholder="e.g. 101"
              value={form.roll}
              onChange={(e) => update("roll", e.target.value)}
              className={errors.roll ? "input-error" : ""}
            />
          </Field>

          <Field label="Course / Class *" error={errors.course}>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={form.course}
              onChange={(e) => update("course", e.target.value)}
              className={errors.course ? "input-error" : ""}
            />
          </Field>

          <Field label="Email (optional)" error={errors.email}>
            <input
              type="email"
              placeholder="e.g. student@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
          </Field>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {initial ? "Save Changes" : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Small helper to keep label + input + error message together */
function Field({ label, error, children }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
