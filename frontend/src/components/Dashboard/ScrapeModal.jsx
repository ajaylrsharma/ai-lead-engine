import React, { useState } from "react";
import { scrapeLeads } from "../../api/leads";

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const modal = {
  background: "#1e293b", borderRadius: 12, padding: 28, width: "100%", maxWidth: 460,
};
const inp = {
  width: "100%", background: "#0f172a", border: "1px solid #334155",
  borderRadius: 6, padding: "8px 10px", color: "#f1f5f9", fontSize: 14,
  boxSizing: "border-box", marginBottom: 14,
};
const btn = (primary) => ({
  padding: "9px 18px", borderRadius: 6, border: "none", cursor: "pointer",
  fontSize: 14, fontWeight: 600,
  background: primary ? "#38bdf8" : "#334155",
  color: primary ? "#0f172a" : "#f1f5f9",
});

export default function ScrapeModal({ onClose, onScraped }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    if (!query.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await scrapeLeads({ query, location });
      setResult(res.data.created);
      if (onScraped) onScraped();
    } catch (e) {
      setError(e.response?.data?.error || "Scrape failed. Check your Google Maps API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 8px", fontSize: 18 }}>Scrape Google Maps</h2>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>
          Pull real businesses as leads from Google Maps Places API.
        </p>
        {!result ? (
          <>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>
              Business Type / Query *
            </label>
            <input style={inp} value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Plumbers, Coffee shops, Law firms" />
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>
              Location (optional)
            </label>
            <input style={inp} value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Austin TX, London UK" />
            {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={btn(false)} onClick={onClose}>Cancel</button>
              <button style={btn(true)} onClick={handleScrape} disabled={!query.trim() || loading}>
                {loading ? "Scraping…" : "Find Leads"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 36 }}>✅</div>
            <p style={{ color: "#4ade80", fontSize: 16, fontWeight: 600, margin: "8px 0" }}>
              {result} lead{result !== 1 ? "s" : ""} added
            </p>
            <button style={{ ...btn(false), marginTop: 8 }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
