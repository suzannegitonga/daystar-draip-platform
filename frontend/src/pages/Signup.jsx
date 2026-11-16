import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "researcher",
    school: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );
      if (response.data.status === "success") {
        setMessage("Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      setMessage(
        "Signup failed: " + (error.response?.data?.message || error.message),
      );
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#0A2540",
    fontSize: "0.9rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A2540",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "450px",
          borderTop: "4px solid #C5A059",
        }}
      >
        <h2 style={{ color: "#0A2540", marginTop: 0, textAlign: "center" }}>
          Create your DRAIP account
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          For Daystar students & lecturers
        </p>

        {message && (
          <div
            style={{
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              backgroundColor: message.includes("failed")
                ? "#ffebee"
                : "#e8f5e9",
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
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{ ...inputStyle, paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label style={labelStyle}>I am a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ ...inputStyle, backgroundColor: "#fff" }}
            >
              <option value="researcher">Student (Researcher)</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>School</label>
            <input
              type="text"
              name="school"
              placeholder="e.g. Health Sciences"
              value={formData.school}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "0.85rem",
              backgroundColor: "#C5A059",
              color: "#0A2540",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              marginTop: "0.5rem",
            }}
          >
            Create Account
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#0A2540", fontWeight: "600" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
