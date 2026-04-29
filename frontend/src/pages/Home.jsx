import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "🗺", title: "Google Maps Scraping", desc: "Pull real business leads by type and location in seconds." },
  { icon: "🤖", title: "AI Lead Scoring", desc: "Claude scores every lead 0–100 and explains why they're worth pursuing." },
  { icon: "✉️", title: "AI Email Generation", desc: "One click generates a personalized cold email, ready to send." },
  { icon: "📂", title: "CSV Import", desc: "Drop in any CSV export from your existing tools." },
  { icon: "📊", title: "Pipeline Tracking", desc: "Track every lead from new → contacted → replied → converted." },
  { icon: "🚀", title: "Resend Integration", desc: "Send emails directly from the dashboard via Resend." },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ background: "#0f172a", minHeight: "calc(100vh - 120px)", color: "#f1f5f9" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-block", background: "#1e293b", borderRadius: 99, padding: "4px 16px", fontSize: 13, color: "#38bdf8", marginBottom: 20 }}>
            Powered by Claude AI
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, margin: "0 0 20px", lineHeight: 1.1, letterSpacing: -1 }}>
            Turn any business into<br />
            <span style={{ color: "#38bdf8" }}>a qualified lead</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 500, margin: "0 auto 36px" }}>
            Scrape leads from Google Maps, score them with AI, generate personalized cold emails, and track your pipeline — all in one place.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {user ? (
              <Link to="/dashboard">
                <button style={{ padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, background: "#38bdf8", color: "#0f172a" }}>
                  Go to Dashboard →
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <button style={{ padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, background: "#38bdf8", color: "#0f172a" }}>
                    Get Started Free
                  </button>
                </Link>
                <Link to="/login">
                  <button style={{ padding: "12px 28px", borderRadius: 8, border: "1px solid #334155", cursor: "pointer", fontSize: 16, fontWeight: 600, background: "transparent", color: "#f1f5f9" }}>
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: "#1e293b", borderRadius: 10, padding: "20px 22px", border: "1px solid #334155" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
