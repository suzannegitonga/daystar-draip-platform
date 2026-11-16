import { Link } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user") || "{}");

const CARDS = [
  {
    to: "/submit",
    title: "Submit New Asset",
    desc: "Register a thesis, dataset, paper, prototype, algorithm, or innovation.",
    roles: ["researcher", "lecturer", "reviewer", "admin"],
  },
  {
    to: "/register",
    title: "Asset Register",
    desc: "Browse, search, filter, edit, and bulk-import research assets.",
    roles: ["researcher", "lecturer", "reviewer", "admin"],
  },
  {
    to: "/my-assets",
    title: "My Submissions",
    desc: "Track the status of your own submitted assets.",
    roles: ["researcher", "lecturer"],
  },
  {
    to: "/review",
    title: "Review Queue",
    desc: "Confirm, edit, or reject AI-suggested pathways for submitted assets.",
    roles: ["reviewer", "admin"],
  },
  {
    to: "/leadership",
    title: "Leadership Dashboard",
    desc: "Summary by school, SDG, pathway, and Green-rated assets awaiting action.",
    roles: ["reviewer", "admin"],
  },
];

export default function Dashboard() {
  const visibleCards = CARDS.filter((c) => c.roles.includes(user.role));

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#0A2540", marginBottom: "0.25rem" }}>
        DRAIP Dashboard
      </h2>
      <p style={{ color: "#64748b", marginTop: 0, marginBottom: "2rem" }}>
        Welcome{user.name ? `, ${user.name}` : ""} —{" "}
        <span style={{ color: "#C5A059", fontWeight: "600" }}>
          {user.role === "researcher"
            ? "Student Researcher"
            : user.role || "Guest"}
        </span>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {visibleCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            style={{
              backgroundColor: "#0A2540",
              padding: "1.5rem",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#fff",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderTop: "3px solid #C5A059",
            }}
          >
            <h3
              style={{ color: "#C5A059", marginTop: 0, marginBottom: "0.5rem" }}
            >
              {card.title}
            </h3>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#e2e8f0" }}>
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
