import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LeadsDashboard from "../components/Dashboard/LeadsDashboard";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ background: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
      Loading…
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return <LeadsDashboard />;
}
