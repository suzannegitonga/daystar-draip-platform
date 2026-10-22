import { useState } from "react";
import axios from "axios";

export default function SubmitAsset() {
  const [formData, setFormData] = useState({
    title: "",
    school: "",
    discipline: "",
    status: "draft",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/assets",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === "success") {
        setMessage("Asset submitted successfully!");
        setFormData({ title: "", school: "", discipline: "", status: "draft" });
      }
    } catch (error) {
      setMessage(
        "Error submitting asset: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

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
      <h2
        style={{
          color: "#0A2540",
          marginTop: 0,
          marginBottom: "1.5rem",
          borderBottom: "2px solid #f1f5f9",
          paddingBottom: "0.75rem",
        }}
      >
        Submit Research Asset
      </h2>

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
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "#0A2540",
            }}
          >
            Title:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "#0A2540",
            }}
          >
            School:
          </label>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "#0A2540",
            }}
          >
            Discipline:
          </label>
          <input
            type="text"
            name="discipline"
            value={formData.discipline}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "#0A2540",
            }}
          >
            Status:
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              boxSizing: "border-box",
              backgroundColor: "#fff",
            }}
          >
            <option value="draft">Draft</option>
            <option value="under review">Under Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "0.85rem",
            backgroundColor: "#00b4d8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            marginTop: "1rem",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0096c7")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#00b4d8")}
        >
          Submit to Register
        </button>
      </form>
    </div>
  );
}
