import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const s = {
  nav: {
    background: "#0f172a",
    borderBottom: "1px solid #1e293b",
    padding: "0 24px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { color: "#38bdf8", fontWeight: 700, fontSize: 18, textDecoration: "none", letterSpacing: -0.5 },
  links: { display: "flex", gap: 8, alignItems: "center" },
  link: { color: "#94a3b8", textDecoration: "none", padding: "6px 12px", borderRadius: 6, fontSize: 14 },
  activeLink: { color: "#f8fafc", background: "#1e293b" },
  btn: {
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: 6,
    padding: "6px 14px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  user: { color: "#64748b", fontSize: 13, marginRight: 8 },
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate("/login"); };

  const navLink = (to, label) => ({
    ...s.link,
    ...(pathname === to ? s.activeLink : {}),
  });

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>⚡ AI Lead Engine</Link>
      <div style={s.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={navLink("/dashboard", "Dashboard")}>Dashboard</Link>
            <span style={s.user}>{user.username}</span>
            <button style={s.btn} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLink("/login", "Login")}>Login</Link>
            <Link to="/register">
              <button style={s.btn}>Get Started</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
