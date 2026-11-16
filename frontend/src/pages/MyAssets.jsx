import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/assets";

export default function MyAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const response = await axios.get(API, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const mine = response.data.data.filter(
          (a) => a.owner && (a.owner._id === user._id || a.owner === user._id),
        );
        setAssets(mine);
        setLoading(false);
      } catch (err) {
        setError("Error fetching your assets.");
        setLoading(false);
      }
    };
    fetchMine();
  }, []);

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
        My Submissions
      </h2>

      {loading && <p style={{ color: "var(--text-secondary)" }}>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && assets.length === 0 && (
        <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
          You haven't submitted any assets yet.{" "}
          <Link to="/submit" style={{ color: "#C5A059", fontWeight: "600" }}>
            Submit your first asset
          </Link>
        </p>
      )}

      {!loading && assets.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderBottom: "2px solid var(--border-color)",
              }}
            >
              {["Title", "Type", "SDG/Theme", "Status", "Submitted"].map(
                (h) => (
                  <th key={h} style={{ padding: "0.85rem", textAlign: "left" }}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset._id}
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td
                  style={{
                    padding: "0.85rem",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                  }}
                >
                  {asset.title}
                </td>
                <td
                  style={{ padding: "0.85rem", color: "var(--text-secondary)" }}
                >
                  {asset.assetType || "—"}
                </td>
                <td
                  style={{ padding: "0.85rem", color: "var(--text-secondary)" }}
                >
                  {asset.sdgTheme || "—"}
                </td>
                <td style={{ padding: "0.85rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.6rem",
                      borderRadius: "4px",
                      backgroundColor:
                        asset.status === "completed" ? "#e8f5e9" : "#fff3e0",
                      color:
                        asset.status === "completed" ? "#2e7d32" : "#e65100",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {(asset.status || "draft").replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td
                  style={{ padding: "0.85rem", color: "var(--text-secondary)" }}
                >
                  {new Date(asset.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
