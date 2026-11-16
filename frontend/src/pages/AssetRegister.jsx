import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/assets";
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

const EDIT_FIELDS = [
  { name: "title", label: "Title", required: true },
  { name: "school", label: "School", required: true },
  { name: "discipline", label: "Discipline", required: true },
  {
    name: "assetType",
    label: "Asset Type",
    type: "select",
    options: [
      "Thesis",
      "Dataset",
      "Paper",
      "Prototype",
      "Algorithm",
      "Innovation",
    ],
  },
  { name: "researchQuestion", label: "Research Question", type: "textarea" },
  { name: "datasetAvailability", label: "Dataset Availability" },
  { name: "sampleSize", label: "Sample Size" },
  { name: "methodology", label: "Methodology", type: "textarea" },
  { name: "findings", label: "Findings", type: "textarea" },
  { name: "novelty", label: "Novelty", type: "textarea" },
  { name: "potentialUsers", label: "Potential Users", type: "textarea" },
  { name: "industryRelevance", label: "Industry Relevance", type: "textarea" },
  { name: "policyRelevance", label: "Policy Relevance", type: "textarea" },
  {
    name: "commercialPotential",
    label: "Commercial Potential",
    type: "textarea",
  },
  { name: "ipPotential", label: "IP Potential", type: "textarea" },
  {
    name: "publicationPotential",
    label: "Publication Potential",
    type: "textarea",
  },
  { name: "sdgTheme", label: "SDG / Theme" },
  { name: "keywords", label: "Keywords (comma-separated)" },
  { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
];

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  border: "1px solid #cbd5e1",
  borderRadius: "4px",
  boxSizing: "border-box",
};
const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: "600",
  color: "#0A2540",
  fontSize: "0.85rem",
};

export default function AssetRegister() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sdgFilter, setSdgFilter] = useState("all");
  const [editingAsset, setEditingAsset] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const fetchAssets = async () => {
    try {
      const response = await axios.get(API, { headers: authHeaders() });
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

  const handleFileUpload = async () => {
    if (!file) return setUploadMessage("Please select a CSV file first.");
    const formData = new FormData();
    formData.append("file", file);
    setUploadMessage("Uploading...");
    try {
      const response = await axios.post(`${API}/import`, formData, {
        headers: { "Content-Type": "multipart/form-data", ...authHeaders() },
      });
      const { imported, skipped, errors } = response.data;
      let msg = `Imported ${imported} asset${imported !== 1 ? "s" : ""}.`;
      if (skipped > 0) {
        msg += ` Skipped ${skipped} row${skipped !== 1 ? "s" : ""}.`;
        if (errors && errors.length > 0) {
          msg +=
            "\n\nErrors:\n" +
            errors.map((e) => `Row ${e.row}: ${e.reason}`).join("\n");
        }
      }
      setUploadMessage(msg);
      setFile(null);
      fetchAssets();
    } catch (err) {
      setUploadMessage(
        "Upload failed: " + (err.response?.data?.message || err.message),
      );
    }
  };

  const handleEditClick = (asset) => {
    const data = {};
    EDIT_FIELDS.forEach((f) => {
      data[f.name] =
        f.name === "keywords"
          ? (asset.keywords || []).join(", ")
          : asset[f.name] || "";
    });
    if (!data.status) data.status = "draft";
    if (!data.assetType) data.assetType = "Thesis";
    setEditFormData(data);
    setEditingAsset(asset._id);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editFormData,
        keywords: editFormData.keywords
          ? editFormData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
      };
      await axios.put(`${API}/${editingAsset}`, payload, {
        headers: authHeaders(),
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset permanently?")) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: authHeaders() });
      fetchAssets();
    } catch (err) {
      alert(
        "Failed to delete: " + (err.response?.data?.message || err.message),
      );
    }
  };

  const sdgOptions = [
    ...new Set(assets.map((a) => a.sdgTheme).filter(Boolean)),
  ];

  const filteredAssets = assets.filter((asset) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (asset.title || "").toLowerCase().includes(term) ||
      (asset.school || "").toLowerCase().includes(term) ||
      (asset.discipline || "").toLowerCase().includes(term) ||
      (asset.keywords || []).some((k) => k.toLowerCase().includes(term));
    const matchesStatus =
      statusFilter === "all" || asset.status === statusFilter;
    const matchesSdg = sdgFilter === "all" || asset.sdgTheme === sdgFilter;
    return matchesSearch && matchesStatus && matchesSdg;
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
          borderBottom: "2px solid #C5A059",
          paddingBottom: "0.75rem",
        }}
      >
        DRAIP Asset Register
      </h2>

      {/* CSV Import */}
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
            onChange={(e) => {
              setFile(e.target.files[0]);
              setUploadMessage("");
            }}
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
              color:
                uploadMessage.includes("Skipped") ||
                uploadMessage.includes("failed")
                  ? "#e65100"
                  : "#2e7d32",
              fontWeight: "600",
              fontSize: "0.9rem",
              whiteSpace: "pre-line",
            }}
          >
            {uploadMessage}
          </p>
        )}
      </div>

      {/* Search & Filters */}
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
          placeholder="Search title, school, discipline, keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "250px",
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
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
          }}
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={sdgFilter}
          onChange={(e) => setSdgFilter(e.target.value)}
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            minWidth: "150px",
            backgroundColor: "#fff",
          }}
        >
          <option value="all">All SDGs / Themes</option>
          {sdgOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
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
                {[
                  "Title",
                  "Type",
                  "School",
                  "Discipline",
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
              {filteredAssets.map((asset) => (
                <tr
                  key={asset._id}
                  style={{ borderBottom: "1px solid #e2e8f0" }}
                >
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
                    {asset.assetType || "—"}
                  </td>
                  <td style={{ padding: "0.85rem", color: "#475569" }}>
                    {asset.school}
                  </td>
                  <td style={{ padding: "0.85rem", color: "#475569" }}>
                    {asset.discipline}
                  </td>
                  <td style={{ padding: "0.85rem", color: "#475569" }}>
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
                      {(asset.status || "draft")
                        .replace("_", " ")
                        .toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem", whiteSpace: "nowrap" }}>
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
                        marginRight: "0.5rem",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(asset._id)}
                      style={{
                        padding: "0.4rem 0.8rem",
                        backgroundColor: "#c62828",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingAsset && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(10,37,64,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                color: "#0A2540",
                marginTop: 0,
                borderBottom: "2px solid #C5A059",
                paddingBottom: "0.5rem",
              }}
            >
              Edit Research Asset
            </h3>
            <form
              onSubmit={handleUpdateSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {EDIT_FIELDS.map((f) => (
                <div key={f.name}>
                  <label style={labelStyle}>
                    {f.label}
                    {f.required ? " *" : ""}
                  </label>
                  {f.type === "select" ? (
                    <select
                      value={editFormData[f.name]}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          [f.name]: e.target.value,
                        })
                      }
                      style={{ ...inputStyle, backgroundColor: "#fff" }}
                    >
                      {f.options.map((o) =>
                        typeof o === "string" ? (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ) : (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ),
                      )}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      rows={2}
                      value={editFormData[f.name]}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          [f.name]: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      type="text"
                      required={f.required}
                      value={editFormData[f.name]}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          [f.name]: e.target.value,
                        })
                      }
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}
              >
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#C5A059",
                    color: "#0A2540",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
