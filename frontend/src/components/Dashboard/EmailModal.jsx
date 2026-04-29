import React, { useState } from "react";
import { generateEmail, sendEmail } from "../../api/outreach";

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const modal = {
  background: "#1e293b", borderRadius: 12, padding: 28,
  width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
};
const input = {
  width: "100%", background: "#0f172a", border: "1px solid #334155",
  borderRadius: 6, padding: "8px 10px", color: "#f1f5f9", fontSize: 14,
  boxSizing: "border-box", marginBottom: 12,
};
const btn = (color, text) => ({
  padding: "9px 18px", borderRadius: 6, border: "none", cursor: "pointer",
  fontSize: 14, fontWeight: 600, background: color, color: text,
});

const VOICES = ["professional", "friendly", "direct", "educational"];

export default function EmailModal({ lead, onClose, onSent }) {
  const [goal, setGoal] = useState("introduce our services and book a discovery call");
  const [voice, setVoice] = useState("professional");
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true); setError("");
    try {
      const res = await generateEmail({ lead_id: lead.id, goal, voice });
      setDraft(res.data);
    } catch (e) {
      setError(e.response?.data?.error || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!draft) return;
    setSending(true); setError("");
    try {
      await sendEmail(draft.id);
      setSent(true);
      if (onSent) onSent();
    } catch (e) {
      setError(e.response?.data?.error || "Send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 4px", fontSize: 18 }}>Generate Outreach Email</h2>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>
          For: <strong style={{ color: "#94a3b8" }}>{lead.name}</strong> at {lead.company || "—"}
        </p>

        {!draft && (
          <>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Campaign Goal</label>
            <input style={input} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="What do you want to achieve?" />
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Voice / Tone</label>
            <select style={input} value={voice} onChange={(e) => setVoice(e.target.value)}>
              {VOICES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={btn("#334155", "#f1f5f9")} onClick={onClose}>Cancel</button>
              <button style={btn("#38bdf8", "#0f172a")} onClick={handleGenerate} disabled={loading}>
                {loading ? "Generating…" : "Generate with Claude AI"}
              </button>
            </div>
          </>
        )}

        {draft && !sent && (
          <>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Subject</label>
            <input style={input} value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })} />
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Body</label>
            <textarea style={{ ...input, height: 200, resize: "vertical" }} value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
            {!lead.email && (
              <p style={{ color: "#fbbf24", fontSize: 13, margin: "4px 0 12px" }}>
                ⚠ This lead has no email address — add one before sending.
              </p>
            )}
            {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={btn("#334155", "#f1f5f9")} onClick={() => setDraft(null)}>Regenerate</button>
              <button style={btn("#334155", "#f1f5f9")} onClick={onClose}>Close</button>
              <button style={btn("#4ade80", "#0f172a")} onClick={handleSend}
                disabled={sending || !lead.email}>
                {sending ? "Sending…" : "Send Email"}
              </button>
            </div>
          </>
        )}

        {sent && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <p style={{ color: "#4ade80", fontSize: 16, fontWeight: 600 }}>Email sent to {lead.email}</p>
            <button style={{ ...btn("#334155", "#f1f5f9"), marginTop: 12 }} onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
