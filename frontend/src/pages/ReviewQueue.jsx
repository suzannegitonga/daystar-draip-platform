import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/assets";
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function ReviewQueue() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmitted = async () => {
      try {
        const response = await axios.get(API, { headers: authHeaders() });
        const submitted = response.data.data.filter(
          (a) => a.status === "submitted" || a.status === "under_review",
        );
        setAssets(submitted);
        setLoading(false);
      } catch (err) {
        setError("Error fetching review queue.");
        setLoading(false);
      }
    };
    fetchSubmitted();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${API}/${id}`,
        { status: newStatus },
        { headers: authHeaders() },
      );
      setAssets((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
      );
    } catch (err) {
      alert(
        "Failed to update status: " +
          (err.response?.data?.message || err.message),
      );
    }
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
        Review Queue
      </h2>
      <p style={{ color: "#64748b", marginTop: 0, marginBottom: "1.5rem" }}>
        Assets awaiting reviewer confirmation. AI pathway suggestions will
        appear here in Phase 2.
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && assets.length === 0 && (
        <p style={{ color: "#64748b", fontStyle: "italic" }}>
          No assets pending review.
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
                backgroundColor: "#f1f5f9",
                color: "#0A2540",
                borderBottom: "2px solid #cbd5e1",
              }}
            >
              {[
                "Title",
                "Type",
                "School",
                "SDG/Theme",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h} style={{ padding: "0.85rem", textAlign: "left" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td
                  style={{
                    padding: "0.85rem",
                    fontWeight: "500",
                    color: "#1e293b",
                  }}
                >
                  {asset.title}
                </td>
                <td style={{ padding: "0.85rem", color: "#475569" }}>
                  {asset.assetType || "—"}
                </td>
                <td style={{ padding: "0.85rem", color: "#475569" }}>
                  {asset.school}
                </td>
                <td style={{ padding: "0.85rem", color: "#475569" }}>
                  {asset.sdgTheme || "—"}
                </td>
                <td style={{ padding: "0.85rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.6rem",
                      borderRadius: "4px",
                      backgroundColor: "#fff3e0",
                      color: "#e65100",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {(asset.status || "").replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "0.85rem", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() =>
                      handleStatusChange(asset._id, "under_review")
                    }
                    style={{
                      padding: "0.4rem 0.8rem",
                      backgroundColor: "#C5A059",
                      color: "#0A2540",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      marginRight: "0.5rem",
                    }}
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleStatusChange(asset._id, "completed")}
                    style={{
                      padding: "0.4rem 0.8rem",
                      backgroundColor: "#2e7d32",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
