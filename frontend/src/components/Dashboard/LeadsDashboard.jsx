import React, { useState, useEffect, useCallback } from "react";
import { getLeads, updateLead, deleteLead, scoreLead, getStats } from "../../api/leads";
import StatsBar from "./StatsBar";
import LeadModal from "./LeadModal";
import EmailModal from "./EmailModal";
import ImportModal from "./ImportModal";
import ScrapeModal from "./ScrapeModal";
import { createLead } from "../../api/leads";

const STATUS_COLORS = {
  new: "#38bdf8", contacted: "#fb923c", replied: "#a78bfa",
  converted: "#4ade80", lost: "#64748b",
};
const SOURCE_COLORS = {
  google_maps: "#34d399", csv: "#60a5fa", manual: "#94a3b8",
  linkedin: "#818cf8", yelp: "#f87171",
};

const scoreBg = (s) => {
  if (s == null) return "#334155";
  if (s >= 70) return "#166534";
  if (s >= 40) return "#78350f";
  return "#7f1d1d";
};
const scoreColor = (s) => {
  if (s == null) return "#64748b";
  if (s >= 70) return "#4ade80";
  if (s >= 40) return "#fbbf24";
  return "#f87171";
};

const badge = (color, bg) => ({
  display: "inline-block", borderRadius: 99, padding: "2px 10px",
  fontSize: 11, fontWeight: 600, background: bg || color + "22", color,
});

const actionBtn = (color) => ({
  padding: "4px 10px", borderRadius: 5, border: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 600, background: color + "22", color,
  marginRight: 4, whiteSpace: "nowrap",
});

const inputStyle = {
  background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
  padding: "7px 12px", color: "#f1f5f9", fontSize: 14,
};

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [scoring, setScoring] = useState({});

  const [showAddModal, setShowAddModal] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [emailLead, setEmailLead] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showScrape, setShowScrape] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [leadsRes, statsRes] = await Promise.all([getLeads(params), getStats()]);
      setLeads(leadsRes.data.results || leadsRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleSaveLead = async (form) => {
    if (editLead) {
      await updateLead(editLead.id, form);
    } else {
      await createLead(form);
    }
    setShowAddModal(false);
    setEditLead(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await deleteLead(id);
    load();
  };

  const handleStatusChange = async (lead, newStatus) => {
    await updateLead(lead.id, { status: newStatus });
    load();
  };

  const handleScore = async (lead) => {
    setScoring((s) => ({ ...s, [lead.id]: true }));
    try {
      await scoreLead(lead.id);
      load();
    } finally {
      setScoring((s) => ({ ...s, [lead.id]: false }));
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 120px)", background: "#0f172a", padding: 24, color: "#f1f5f9" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Lead Dashboard</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...actionBtn("#a78bfa"), padding: "8px 14px", fontSize: 13 }}
              onClick={() => setShowScrape(true)}>
              🗺 Scrape Google Maps
            </button>
            <button style={{ ...actionBtn("#60a5fa"), padding: "8px 14px", fontSize: 13 }}
              onClick={() => setShowImport(true)}>
              📂 Import CSV
            </button>
            <button
              style={{ padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: "#38bdf8", color: "#0f172a" }}
              onClick={() => { setEditLead(null); setShowAddModal(true); }}>
              + Add Lead
            </button>
          </div>
        </div>

        <StatsBar stats={stats} />

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Search name, company, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select style={inputStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {["new", "contacted", "replied", "converted", "lost"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>Loading leads…</div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
            No leads yet. Add one manually, import a CSV, or scrape Google Maps.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e293b", color: "#475569", textAlign: "left" }}>
                  {["Name / Company", "Contact", "Source", "Status", "Score", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: "1px solid #1e293b" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#1e293b"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{lead.name}</div>
                      {lead.company && <div style={{ color: "#64748b", fontSize: 12 }}>{lead.company}</div>}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      {lead.email && <div style={{ color: "#94a3b8" }}>{lead.email}</div>}
                      {lead.phone && <div style={{ color: "#64748b", fontSize: 12 }}>{lead.phone}</div>}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={badge(SOURCE_COLORS[lead.source] || "#94a3b8")}>
                        {lead.source?.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <select
                        style={{ background: STATUS_COLORS[lead.status] + "22", color: STATUS_COLORS[lead.status], border: "none", borderRadius: 99, padding: "3px 8px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead, e.target.value)}>
                        {["new", "contacted", "replied", "converted", "lost"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      {lead.score != null ? (
                        <span style={{ ...badge(scoreColor(lead.score)), background: scoreBg(lead.score), minWidth: 32, textAlign: "center" }}>
                          {lead.score}
                        </span>
                      ) : (
                        <span style={{ color: "#475569", fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <button style={actionBtn("#a78bfa")} onClick={() => handleScore(lead)}
                        disabled={scoring[lead.id]}>
                        {scoring[lead.id] ? "…" : "AI Score"}
                      </button>
                      <button style={actionBtn("#34d399")} onClick={() => setEmailLead(lead)}>
                        Email
                      </button>
                      <button style={actionBtn("#60a5fa")} onClick={() => { setEditLead(lead); setShowAddModal(true); }}>
                        Edit
                      </button>
                      <button style={actionBtn("#f87171")} onClick={() => handleDelete(lead.id)}>
                        Del
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(showAddModal || editLead) && (
        <LeadModal
          lead={editLead}
          onSave={handleSaveLead}
          onClose={() => { setShowAddModal(false); setEditLead(null); }}
        />
      )}
      {emailLead && (
        <EmailModal
          lead={emailLead}
          onClose={() => setEmailLead(null)}
          onSent={() => { setEmailLead(null); load(); }}
        />
      )}
      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onImported={() => { setShowImport(false); load(); }} />
      )}
      {showScrape && (
        <ScrapeModal onClose={() => setShowScrape(false)} onScraped={() => { setShowScrape(false); load(); }} />
      )}
    </div>
  );
}
