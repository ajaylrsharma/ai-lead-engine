import React from "react";

const tile = {
  background: "#1e293b",
  borderRadius: 10,
  padding: "16px 20px",
  flex: 1,
  minWidth: 120,
};

export default function StatsBar({ stats }) {
  if (!stats) return null;
  const items = [
    { label: "Total Leads", value: stats.total_leads, color: "#38bdf8" },
    { label: "New This Week", value: stats.new_this_week, color: "#a78bfa" },
    { label: "Contacted", value: stats.contacted, color: "#fb923c" },
    { label: "Replied", value: stats.replied, color: "#34d399" },
    { label: "Converted", value: stats.converted, color: "#4ade80" },
    { label: "Emails Sent", value: stats.emails_sent, color: "#60a5fa" },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
      {items.map((item) => (
        <div key={item.label} style={tile}>
          <div style={{ fontSize: 26, fontWeight: 700, color: item.color }}>{item.value ?? 0}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
