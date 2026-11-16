import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/assets";

const FORM_FIELDS = [
  { name: "title", label: "Research Title", required: true },
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
    required: true,
  },
  { name: "researchQuestion", label: "Research Question", type: "textarea" },
  { name: "datasetAvailability", label: "Dataset Availability" },
  { name: "sampleSize", label: "Sample Size" },
  { name: "methodology", label: "Methodology", type: "textarea" },
  { name: "findings", label: "Key Findings", type: "textarea" },
  { name: "novelty", label: "Novelty / Contribution", type: "textarea" },
  {
    name: "potentialUsers",
    label: "Potential Users / Beneficiaries",
    type: "textarea",
  },
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
  { name: "sdgTheme", label: "SDG / Theme Alignment" },
  { name: "keywords", label: "Keywords (comma-separated)" },
];

const inputStyle = {
  width: "100%",
  padding: "0.7rem",
  border: "1px solid var(--border-color)",
  borderRadius: "4px",
  boxSizing: "border-box",
  backgroundColor: "var(--bg-card)",
  color: "var(--text-primary)",
};
const labelStyle = {
  display: "block",
  marginBottom: "0.4rem",
  fontWeight: "600",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
};

export default function SubmitAsset() {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        ...formData,
        keywords: formData.keywords
          ? formData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
      };
      await axios.post(API, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage("Asset submitted successfully!");
      setFormData({});
    } catch (err) {
      setMessage(
        "Submission failed: " + (err.response?.data?.message || err.message),
      );
    }
  };

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
        Submit New Research Asset
      </h2>

      {message && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            backgroundColor: message.includes("failed") ? "#ffebee" : "#e8f5e9",
            color: message.includes("failed") ? "#c62828" : "#2e7d32",
            borderRadius: "4px",
            fontSize: "0.9rem",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {FORM_FIELDS.map((field) => (
          <div
            key={field.name}
            style={{
              gridColumn: field.type === "textarea" ? "1 / -1" : undefined,
            }}
          >
            <label style={labelStyle}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                style={{ ...inputStyle, backgroundColor: "var(--bg-card)" }}
              >
                <option value="">Select...</option>
                {field.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                rows={3}
                value={formData[field.name] || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            ) : (
              <input
                type="text"
                name={field.name}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            )}
          </div>
        ))}

        <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
          <button
            type="submit"
            style={{
              padding: "0.85rem 2rem",
              backgroundColor: "#C5A059",
              color: "#0A2540",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            Submit Asset
          </button>
        </div>
      </form>
    </div>
  );
}
