import { Link, useNavigate, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  {
    to: "/",
    label: "🏠 Dashboard",
    roles: ["researcher", "lecturer", "reviewer", "admin"],
  },
  {
    to: "/submit",
    label: "➕ Submit Asset",
    roles: ["researcher", "lecturer", "reviewer", "admin"],
  },
  {
    to: "/register",
    label: "📋 Asset Register",
    roles: ["researcher", "lecturer", "reviewer", "admin"],
  },
  {
    to: "/my-assets",
    label: "📂 My Submissions",
    roles: ["researcher", "lecturer"],
  },
  { to: "/review", label: "✅ Review Queue", roles: ["reviewer", "admin"] },
  { to: "/leadership", label: "📊 Leadership", roles: ["reviewer", "admin"] },
];

export default function Layout() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const visibleNav = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle = {
    display: "block",
    padding: "0.75rem 1.5rem",
    color: "#e2e8f0",
    textDecoration: "none",
    fontSize: "0.9rem",
    borderLeft: "3px solid transparent",
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "var(--bg-primary)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        transition: "background-color 0.2s",
      }}
    >
      {/* Left Sidebar */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "var(--sidebar-bg)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          zIndex: 10,
          transition: "background-color 0.2s",
        }}
      >
        {/* Logo Area */}
        <div
          style={{
            padding: "1.5rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.2rem",
              color: "#C5A059",
              letterSpacing: "1px",
            }}
          >
            DAYSTAR
          </h2>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Research & Innovation
          </span>
        </div>

        {/* Navigation Links */}
        <div style={{ padding: "1rem 0", flex: 1, overflowY: "auto" }}>
          <div
            style={{
              padding: "0.5rem 1.5rem",
              fontSize: "0.75rem",
              color: "#94a3b8",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Navigation
          </div>
          {visibleNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={linkStyle}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.05)";
                e.target.style.borderLeftColor = "#C5A059";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.borderLeftColor = "transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Session Footer */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.6rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.85rem",
            }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top Header Bar */}
        <header
          style={{
            height: "60px",
            backgroundColor: "var(--header-bg)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s",
          }}
        >
          <button
            onClick={toggle}
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "white",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#C5A059",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#0A2540",
                fontSize: "0.85rem",
                fontWeight: "700",
              }}
            >
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <span>
              {user.name || "User"} —{" "}
              {user.role === "researcher" ? "Student" : user.role || "Guest"}
            </span>
          </div>
        </header>

        {/* Dynamic Page Render View */}
        <main style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
