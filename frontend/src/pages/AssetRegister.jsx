import { useState, useEffect } from "react";
import axios from "axios";

export default function AssetRegister() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State for CSV Upload
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/assets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssets(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching assets from the server.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploadMessage("Uploading...");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/assets/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUploadMessage(`Success! Imported ${response.data.count} assets.`);
      setFile(null);
      fetchAssets();
    } catch (err) {
      setUploadMessage(
        "Upload failed: " + (err.response?.data?.message || err.message),
      );
    }
  };

  // Filter logic for search bar and status dropdown
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.discipline.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      asset.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>DRAIP Asset Register</h2>

      {/* CSV Import Section */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Bulk Import (CSV)</h3>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          onClick={handleFileUpload}
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Upload CSV
        </button>
        {uploadMessage && (
          <p
            style={{
              marginTop: "1rem",
              color:
                uploadMessage.includes("failed") ||
                uploadMessage.includes("Please")
                  ? "#d32f2f"
                  : "#2e7d32",
              fontWeight: "bold",
            }}
          >
            {uploadMessage}
          </p>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search by title, school, or discipline..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: "1",
            minWidth: "250px",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minWidth: "150px",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="under review">Under Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading && <p>Loading assets...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && filteredAssets.length === 0 && (
        <p>No matching research assets found.</p>
      )}

      {!loading && !error && filteredAssets.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f4f4f4",
                borderBottom: "2px solid #ccc",
              }}
            >
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Title</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>School</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>
                Discipline
              </th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Status</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>
                Date Submitted
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.75rem" }}>{asset.title}</td>
                <td style={{ padding: "0.75rem" }}>{asset.school}</td>
                <td style={{ padding: "0.75rem" }}>{asset.discipline}</td>
                <td style={{ padding: "0.75rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      backgroundColor:
                        asset.status === "completed" ? "#e8f5e9" : "#fff3e0",
                      color:
                        asset.status === "completed" ? "#2e7d32" : "#e65100",
                      fontSize: "0.875rem",
                    }}
                  >
                    {asset.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "0.75rem" }}>
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
