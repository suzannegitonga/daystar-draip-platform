import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/assets";

export default function LeadershipDashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await axios.get(API, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAssets(response.data.data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading dashboard...</p>;

  const total = assets.length;
  const byStatus = assets.reduce((acc, a) => {
    acc[a.status || "draft"] = (acc[a.status || "draft"] || 0) + 1;
    return acc;
  }, {});
  const bySchool = assets.reduce((acc, a) => {
    acc[a.school || "Unknown"] = (acc[a.school || "Unknown"] || 0) + 1;
    return acc;
  }, {});
  const bySdg = assets.reduce((acc, a) => {
    const k = a.sdgTheme || "Unassigned";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const greenAwaiting = assets.filter(
    (a) => a.aiReadinessRating === "Green" && a.status !== "completed",
  ).length;

  const cardStyle = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "1.5rem",
    minWidth: "200px",
  };
  const h3Style = {
    color: "#0A2540",
    marginTop: 0,
    marginBottom: "1rem",
    fontSize: "1rem",
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "2.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          color: "#0A2540",
          marginTop: 0,
          borderBottom: "2px solid #C5A059",
          paddingBottom: "0.75rem",
        }}
      >
        Leadership Dashboard
      </h2>

      {/* KPI Cards */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <div style={cardStyle}>
          <h3 style={h3Style}>Total Assets</h3>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#0A2540",
              margin: 0,
            }}
          >
            {total}
          </p>
        </div>
        <div style={cardStyle}>
          <h3 style={h3Style}>Green Awaiting Action</h3>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#2e7d32",
              margin: 0,
            }}
          >
            {greenAwaiting}
          </p>
        </div>
        <div style={cardStyle}>
          <h3 style={h3Style}>Completed</h3>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#C5A059",
              margin: 0,
            }}
          >
            {byStatus.completed || 0}
          </p>
        </div>
      </div>

      {/* Breakdown Tables */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div>
          <h3
            style={{
              color: "#0A2540",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "0.5rem",
            }}
          >
            By School
          </h3>
          <table
            style={{
              width: "100%",
              fontSize: "0.9rem",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              {Object.entries(bySchool)
                .sort((a, b) => b[1] - a[1])
                .map(([school, count]) => (
                  <tr
                    key={school}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td style={{ padding: "0.5rem 0" }}>{school}</td>
                    <td
                      style={{
                        padding: "0.5rem 0",
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
                      {count}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3
            style={{
              color: "#0A2540",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "0.5rem",
            }}
          >
            By SDG / Theme
          </h3>
          <table
            style={{
              width: "100%",
              fontSize: "0.9rem",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              {Object.entries(bySdg)
                .sort((a, b) => b[1] - a[1])
                .map(([sdg, count]) => (
                  <tr key={sdg} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.5rem 0" }}>{sdg}</td>
                    <td
                      style={{
                        padding: "0.5rem 0",
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
                      {count}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3
            style={{
              color: "#0A2540",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "0.5rem",
            }}
          >
            By Status
          </h3>
          <table
            style={{
              width: "100%",
              fontSize: "0.9rem",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              {Object.entries(byStatus)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => (
                  <tr
                    key={status}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td style={{ padding: "0.5rem 0" }}>
                      {status.replace("_", " ")}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem 0",
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
                      {count}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
