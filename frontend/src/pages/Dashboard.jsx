import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const cards = [
    {
      to: "/submit",
      label: "➕ Submit New Asset",
      desc: "Create a new research asset entry",
      roles: ["researcher", "lecturer", "reviewer", "admin"],
    },
    {
      to: "/register",
      label: "📋 Asset Register",
      desc: "Browse and search all registered assets",
      roles: ["researcher", "lecturer", "reviewer", "admin"],
    },
    {
      to: "/my-assets",
      label: "📂 My Submissions",
      desc: "Track your submitted assets and their status",
      roles: ["researcher", "lecturer"],
    },
    {
      to: "/review",
      label: "✅ Review Queue",
      desc: "Review and approve pending submissions",
      roles: ["reviewer", "admin"],
    },
    {
      to: "/leadership",
      label: "📊 Leadership Dashboard",
      desc: "Institutional overview and KPIs",
      roles: ["reviewer", "admin"],
    },
  ];

  const visibleCards = cards.filter((c) => c.roles.includes(role));

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        padding: "2.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          color: "var(--text-primary)",
          marginTop: 0,
          borderBottom: "2px solid #C5A059",
          paddingBottom: "0.75rem",
        }}
      >
        Welcome, {user.name || "User"}
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Select an action below to get started.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {visibleCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            style={{
              textDecoration: "none",
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "1.5rem",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                color: "var(--text-primary)",
                fontSize: "1.1rem",
              }}
            >
              {card.label}
            </h3>
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
              }}
            >
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
