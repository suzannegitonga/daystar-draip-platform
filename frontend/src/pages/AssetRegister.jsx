import { useState, useEffect } from "react";
import axios from "axios";

export default function AssetRegister() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Inline Edit state
  const [editingAsset, setEditingAsset] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    school: "",
    discipline: "",
    status: "draft",
  });

  // State for CSV Upload
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/assets", {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleEditClick = (asset) => {
    setEditingAsset(asset._id);
    setEditFormData({
      title: asset.title,
      school: asset.school,
      discipline: asset.discipline,
      status: asset.status,
    });
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/assets/${id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingAsset(null);
      fetchAssets();
    } catch (err) {
      alert(
        "Failed to update asset: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

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
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "2.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          color: "#0A2540",
          marginTop: 0,
          marginBottom: "1.5rem",
          borderBottom: "2px solid #f1f5f9",
          paddingBottom: "0.75rem",
        }}
      >
        DRAIP Asset Register
      </h2>

      {/* CSV Import Section */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.25rem",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#0A2540",
            fontSize: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          Bulk Import Records (CSV)
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ fontSize: "0.9rem" }}
          />
          <button
            onClick={handleFileUpload}
            style={{
              padding: "0.5rem 1.25rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            Upload CSV
          </button>
        </div>
        {uploadMessage && (
          <p
            style={{
              marginTop: "0.75rem",
              marginBottom: 0,
              color: uploadMessage.includes("failed") ? "#d32f2f" : "#2e7d32",
              fontWeight: "600",
              fontSize: "0.9rem",
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
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            outline: "none",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            minWidth: "150px",
            backgroundColor: "#fff",
            outline: "none",
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
        <p style={{ color: "#64748b", fontStyle: "italic" }}>
          No matching research assets found.
        </p>
      )}

      {!loading && !error && filteredAssets.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f1f5f9",
                  borderBottom: "2px solid #cbd5e1",
                  color: "#0A2540",
                }}
              >
                <th style={{ padding: "0.85rem", textAlign: "left" }}>Title</th>
                <th style={{ padding: "0.85rem", textAlign: "left" }}>
                  School
                </th>
                <th style={{ padding: "0.85rem", textAlign: "left" }}>
                  Discipline
                </th>
                <th style={{ padding: "0.85rem", textAlign: "left" }}>
                  Status
                </th>
                <th style={{ padding: "0.85rem", textAlign: "left" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset._id}
                  style={{ borderBottom: "1px solid #e2e8f0" }}
                >
                  {editingAsset === asset._id ? (
                    <td
                      colSpan="5"
                      style={{ padding: "1rem", backgroundColor: "#f8fafc" }}
                    >
                      <form
                        onSubmit={(e) => handleUpdateSubmit(e, asset._id)}
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          required
                          style={{
                            flex: 2,
                            padding: "0.5rem",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                          }}
                        />
                        <input
                          type="text"
                          value={editFormData.school}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              school: e.target.value,
                            })
                          }
                          required
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                          }}
                        />
                        <input
                          type="text"
                          value={editFormData.discipline}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              discipline: e.target.value,
                            })
                          }
                          required
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                          }}
                        />
                        <select
                          value={editFormData.status}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              status: e.target.value,
                            })
                          }
                          style={{
                            padding: "0.5rem",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                            backgroundColor: "#fff",
                          }}
                        >
                          <option value="draft">Draft</option>
                          <option value="under review">Under Review</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          type="submit"
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#00b4d8",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAsset(null)}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#64748b",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td
                        style={{
                          padding: "0.85rem",
                          color: "#1e293b",
                          fontWeight: "500",
                        }}
                      >
                        {asset.title}
                      </td>
                      <td style={{ padding: "0.85rem", color: "#475569" }}>
                        {asset.school}
                      </td>
                      <td style={{ padding: "0.85rem", color: "#475569" }}>
                        {asset.discipline}
                      </td>
                      <td style={{ padding: "0.85rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.6rem",
                            borderRadius: "4px",
                            backgroundColor:
                              asset.status === "completed"
                                ? "#e8f5e9"
                                : "#fff3e0",
                            color:
                              asset.status === "completed"
                                ? "#2e7d32"
                                : "#e65100",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                          }}
                        >
                          {asset.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem" }}>
                        <button
                          onClick={() => handleEditClick(asset)}
                          style={{
                            padding: "0.4rem 0.8rem",
                            backgroundColor: "#0A2540",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
