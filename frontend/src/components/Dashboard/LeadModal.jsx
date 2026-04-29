import React, { useState, useEffect } from "react";

const STATUSES = ["new", "contacted", "replied", "converted", "lost"];
const SOURCES = ["manual", "google_maps", "linkedin", "yelp", "csv"];

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const modal = {
  background: "#1e293b", borderRadius: 12, padding: 28, width: "100%",
  maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
};
const field = { marginBottom: 16 };
const label = { display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 4 };
const input = {
  width: "100%", background: "#0f172a", border: "1px solid #334155",
  borderRadius: 6, padding: "8px 10px", color: "#f1f5f9", fontSize: 14, boxSizing: "border-box",
};
const row = { display: "flex", gap: 12 };
const btn = (primary) => ({
  padding: "9px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
  background: primary ? "#38bdf8" : "#334155", color: primary ? "#0f172a" : "#f1f5f9",
});

export default function LeadModal({ lead, onSave, onClose }) {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", website: "",
    address: "", category: "", source: "manual", status: "new", notes: "",
  });

  useEffect(() => {
    if (lead) setForm({ ...form, ...lead });
  }, [lead]); // eslint-disable-line

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 20px", fontSize: 18 }}>
          {lead ? "Edit Lead" : "Add Lead"}
        </h2>
        <div style={row}>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Name *</label>
            <input style={input} value={form.name} onChange={set("name")} placeholder="Contact name" />
          </div>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Company</label>
            <input style={input} value={form.company} onChange={set("company")} placeholder="Company name" />
          </div>
        </div>
        <div style={row}>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Email</label>
            <input style={input} type="email" value={form.email} onChange={set("email")} placeholder="email@company.com" />
          </div>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Phone</label>
            <input style={input} value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
          </div>
        </div>
        <div style={field}>
          <label style={label}>Website</label>
          <input style={input} value={form.website} onChange={set("website")} placeholder="https://..." />
        </div>
        <div style={field}>
          <label style={label}>Address</label>
          <input style={input} value={form.address} onChange={set("address")} placeholder="Street, City, State" />
        </div>
        <div style={row}>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Category</label>
            <input style={input} value={form.category} onChange={set("category")} placeholder="e.g. Restaurant" />
          </div>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Source</label>
            <select style={input} value={form.source} onChange={set("source")}>
              {SOURCES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Status</label>
            <select style={input} value={form.status} onChange={set("status")}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={field}>
          <label style={label}>Notes</label>
          <textarea style={{ ...input, height: 72, resize: "vertical" }} value={form.notes} onChange={set("notes")} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button style={btn(false)} onClick={onClose}>Cancel</button>
          <button style={btn(true)} onClick={() => onSave(form)} disabled={!form.name}>
            {lead ? "Save Changes" : "Add Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
