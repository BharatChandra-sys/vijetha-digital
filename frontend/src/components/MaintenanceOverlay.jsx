import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

/**
 * Full-screen maintenance overlay.
 * Polls /status every 30s. Shows overlay on public pages when maintenance is active.
 * Admin/staff routes are never blocked.
 */
export default function MaintenanceOverlay() {
  const location = useLocation();
  const [maintenance, setMaintenance] = useState(null); // null = not checked yet

  const isPrivateRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/staff") ||
    location.pathname === "/maintenance";

  const check = async () => {
    if (isPrivateRoute) return;
    try {
      const res = await api.get("/status");
      setMaintenance(res.data.maintenance ? res.data : null);
    } catch {
      setMaintenance(null);
    }
  };

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Don't show on admin/staff routes
  if (isPrivateRoute || !maintenance) return null;

  const msg = maintenance.message || "We're performing scheduled maintenance. We'll be back shortly.";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0F1220",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500, height: 500,
        background: "rgba(232,67,26,0.08)",
        borderRadius: "50%", filter: "blur(100px)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 40 }}>
          <img src="/vd-logo.jpeg" alt="Vijetha Digital"
            style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "-0.01em" }}>
            VIJETHA DIGITAL
          </span>
        </div>

        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#E8431A" }}>
            construction
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 28, fontWeight: 800, color: "#fff",
          lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 12,
        }}>
          Under Maintenance
        </h1>

        {/* Message */}
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: 36 }}>
          {msg}
        </p>

        {/* Status indicator */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 100, padding: "8px 16px",
          marginBottom: 36,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#F59E0B",
            boxShadow: "0 0 8px #F59E0B",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>
            MAINTENANCE IN PROGRESS
          </span>
        </div>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Need urgent help?
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="tel:+917942643004"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 8,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600,
                textDecoration: "none",
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>call</span>
              +91 79426 43004
            </a>
            <a href="https://wa.me/917942643004" target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 8,
                background: "rgba(37,211,102,0.12)",
                border: "1px solid rgba(37,211,102,0.2)",
                color: "#25D366", fontSize: 13, fontWeight: 600,
                textDecoration: "none",
              }}>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Admin link */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a href="/admin/login"
            style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", textDecoration: "none" }}>
            Admin access
          </a>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
