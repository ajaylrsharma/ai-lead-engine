import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/accounts";
import { useAuth } from "../context/AuthContext";

const card = {
  maxWidth: 400, margin: "80px auto", background: "#1e293b",
  borderRadius: 12, padding: 32, border: "1px solid #334155",
};
const inp = {
  width: "100%", background: "#0f172a", border: "1px solid #334155",
  borderRadius: 6, padding: "10px 12px", color: "#f1f5f9",
  fontSize: 15, boxSizing: "border-box", marginBottom: 14,
};

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", first_name: "", last_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await registerUser(form);
      login({ access: res.data.access, refresh: res.data.refresh }, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.username?.[0] || data?.email?.[0] || data?.password?.[0] || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "calc(100vh - 120px)", color: "#f1f5f9" }}>
      <div style={card}>
        <h1 style={{ textAlign: "center", margin: "0 0 24px", fontSize: 22 }}>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 10 }}>
            <input style={{ ...inp, flex: 1 }} placeholder="First name" value={form.first_name} onChange={set("first_name")} />
            <input style={{ ...inp, flex: 1 }} placeholder="Last name" value={form.last_name} onChange={set("last_name")} />
          </div>
          <input style={inp} placeholder="Username" value={form.username} onChange={set("username")} required />
          <input style={inp} type="email" placeholder="Email" value={form.email} onChange={set("email")} />
          <input style={inp} type="password" placeholder="Password (8+ chars)" value={form.password} onChange={set("password")} required />
          {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "11px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, background: "#38bdf8", color: "#0f172a" }}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: 14, marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color: "#38bdf8" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
