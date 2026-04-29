import React from "react";

export default function Footer() {
  return (
    <footer style={{
      background: "#0f172a",
      borderTop: "1px solid #1e293b",
      padding: "16px 24px",
      textAlign: "center",
      color: "#475569",
      fontSize: 13,
    }}>
      AI Lead Engine &copy; {new Date().getFullYear()} — Find leads, score them, close deals.
    </footer>
  );
}
