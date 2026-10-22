import { Link, useNavigate, Outlet } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f4f6f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Left Sidebar */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#0A2540",
          color: "white",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          zIndex: 10,
        }}
      >
        {/* Logo Area */}
        <div
          style={{
            padding: "1.5rem 1rem",
            backgroundColor: "#0A2540",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.2rem",
              color: "#00b4d8",
              letterSpacing: "1px",
            }}
          >
            DAYSTAR
          </h2>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#C5A059",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Research & Innovation
          </span>
        </div>

        {/* Navigation Links Group */}
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

          <Link
            to="/register"
            style={{
              display: "block",
              padding: "0.75rem 1.5rem",
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: "0.9rem",
              borderLeft: "3px solid transparent",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.target.style.borderLeftColor = "#00b4d8";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderLeftColor = "transparent";
            }}
          >
            📋 Asset Register
          </Link>

          <Link
            to="/"
            style={{
              display: "block",
              padding: "0.75rem 1.5rem",
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: "0.9rem",
              borderLeft: "3px solid transparent",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.target.style.borderLeftColor = "#00b4d8";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderLeftColor = "transparent";
            }}
          >
            ➕ Submit Asset
          </Link>
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
            backgroundColor: "#00b4d8",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
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
                backgroundColor: "#0A2540",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#C5A059",
                fontSize: "0.85rem",
              }}
            >
              DR
            </div>
            <span>DRICE ADMIN</span>
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
