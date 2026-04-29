import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/accounts";
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await loginUser({ username, password });
      login({ access: res.data.access, refresh: res.data.refresh }, res.data.user || { username });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "calc(100vh - 120px)", color: "#f1f5f9" }}>
      <div style={card}>
        <h1 style={{ textAlign: "center", margin: "0 0 24px", fontSize: 22 }}>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input style={inp} placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)} required />
          <input style={inp} type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "11px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, background: "#38bdf8", color: "#0f172a" }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: 14, marginTop: 20 }}>
          No account? <Link to="/register" style={{ color: "#38bdf8" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
