import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "#0A2540", marginBottom: "1.5rem" }}>
        DRAIP Dashboard
      </h2>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {/* Shortcut Card 1: Asset Register */}
        <Link
          to="/register"
          style={{
            backgroundColor: "#0A2540",
            padding: "1.5rem",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#fff",
            width: "250px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{ color: "#C5A059", marginTop: 0, marginBottom: "0.5rem" }}
          >
            Asset Register
          </h3>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            View, search, and edit the institutional research repository.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
