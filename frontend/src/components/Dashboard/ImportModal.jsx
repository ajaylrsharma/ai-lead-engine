import React, { useState, useRef } from "react";
import { importCSV } from "../../api/leads";

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const modal = {
  background: "#1e293b", borderRadius: 12, padding: 28, width: "100%", maxWidth: 460,
};
const btn = (primary) => ({
  padding: "9px 18px", borderRadius: 6, border: "none", cursor: "pointer",
  fontSize: 14, fontWeight: 600,
  background: primary ? "#38bdf8" : "#334155",
  color: primary ? "#0f172a" : "#f1f5f9",
});

export default function ImportModal({ onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const ref = useRef();

  const handleImport = async () => {
    if (!file) return;
    setLoading(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await importCSV(fd);
      setResult(res.data.created);
      if (onImported) onImported();
    } catch (e) {
      setError(e.response?.data?.error || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 8px", fontSize: 18 }}>Import Leads from CSV</h2>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>
          Supported columns: <code style={{ color: "#94a3b8" }}>name, company, email, phone, website, address, notes</code>
        </p>
        {!result ? (
          <>
            <div
              style={{
                border: "2px dashed #334155", borderRadius: 8, padding: "32px 20px",
                textAlign: "center", cursor: "pointer", marginBottom: 16,
                color: file ? "#38bdf8" : "#475569",
              }}
              onClick={() => ref.current.click()}
            >
              {file ? `✓ ${file.name}` : "Click to choose a CSV file"}
              <input ref={ref} type="file" accept=".csv" style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])} />
            </div>
            {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={btn(false)} onClick={onClose}>Cancel</button>
              <button style={btn(true)} onClick={handleImport} disabled={!file || loading}>
                {loading ? "Importing…" : "Import"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 36 }}>✅</div>
            <p style={{ color: "#4ade80", fontSize: 16, fontWeight: 600, margin: "8px 0" }}>
              {result} lead{result !== 1 ? "s" : ""} imported
            </p>
            <button style={{ ...btn(false), marginTop: 8 }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
