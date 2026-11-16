import { useState } from "react";
import axios from "axios";

const EMPTY_FORM = {
  title: "",
  school: "",
  discipline: "",
  assetType: "Thesis",
  researchQuestion: "",
  datasetAvailability: "",
  sampleSize: "",
  methodology: "",
  findings: "",
  novelty: "",
  potentialUsers: "",
  industryRelevance: "",
  policyRelevance: "",
  commercialPotential: "",
  ipPotential: "",
  publicationPotential: "",
  sdgTheme: "",
  keywords: "",
  status: "draft",
};

const STEPS = [
  {
    name: "Identification",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "school", label: "School", type: "text", required: true },
      { name: "discipline", label: "Discipline", type: "text", required: true },
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
    ],
  },
  {
    name: "Research Substance",
    fields: [
      {
        name: "researchQuestion",
        label: "Research Question",
        type: "textarea",
      },
      {
        name: "datasetAvailability",
        label: "Dataset Availability",
        type: "text",
      },
      { name: "sampleSize", label: "Sample Size", type: "text" },
      { name: "methodology", label: "Methodology", type: "textarea" },
      { name: "findings", label: "Findings", type: "textarea" },
      { name: "novelty", label: "Novelty", type: "textarea" },
    ],
  },
  {
    name: "Application Potential",
    fields: [
      { name: "potentialUsers", label: "Potential Users", type: "textarea" },
      {
        name: "industryRelevance",
        label: "Industry Relevance",
        type: "textarea",
      },
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
    ],
  },
  {
    name: "Classification & Status",
    fields: [
      { name: "sdgTheme", label: "SDG / Theme", type: "text" },
      { name: "keywords", label: "Keywords (comma-separated)", type: "text" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "draft", label: "Draft" },
          { value: "submitted", label: "Submitted" },
          { value: "under_review", label: "Under Review" },
          { value: "completed", label: "Completed" },
          { value: "archived", label: "Archived" },
        ],
      },
    ],
  },
];

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid #cbd5e1",
  borderRadius: "4px",
  boxSizing: "border-box",
};
const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "600",
  color: "#0A2540",
};

export default function SubmitAsset() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        keywords: formData.keywords
          ? formData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
      };
      const response = await axios.post(
        "http://localhost:5000/api/assets",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.status === "success") {
        setMessage("Asset submitted successfully!");
        setFormData(EMPTY_FORM);
        setStep(0);
      }
    } catch (error) {
      setMessage(
        "Error submitting asset: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        padding: "2.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#0A2540", marginTop: 0, marginBottom: "0.5rem" }}>
        Submit Research Asset
      </h2>
      <p
        style={{ color: "#C5A059", fontWeight: "600", marginBottom: "1.5rem" }}
      >
        Step {step + 1} of {STEPS.length}: {current.name}
      </p>

      {message && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1.5rem",
            backgroundColor: message.includes("Error") ? "#ffebee" : "#e8f5e9",
            color: message.includes("Error") ? "#c62828" : "#2e7d32",
            borderRadius: "4px",
            fontWeight: "500",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        {current.fields.map((f) => (
          <div key={f.name}>
            <label style={labelStyle}>
              {f.label}
              {f.required ? " *" : ""}
            </label>
            {f.type === "select" ? (
              <select
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                required={f.required}
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
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                rows={3}
                style={inputStyle}
              />
            ) : (
              <input
                type="text"
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                required={f.required}
                style={inputStyle}
              />
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1,
                padding: "0.85rem",
                backgroundColor: "#e2e8f0",
                color: "#0A2540",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Back
            </button>
          )}
          {!isLast ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              style={{
                flex: 1,
                padding: "0.85rem",
                backgroundColor: "#0A2540",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "0.85rem",
                backgroundColor: "#C5A059",
                color: "#0A2540",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Submit to Register
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
