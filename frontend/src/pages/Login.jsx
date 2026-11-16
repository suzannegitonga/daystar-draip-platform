import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );

      if (response.data.status === "success") {
        const { token, ...user } = response.data.data;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      }
    } catch (error) {
      setMessage(
        "Login failed: " + (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        margin: "-2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Left Side: Campus Visual Backdrop */}
      <div
        style={{
          flex: "1.2",
          backgroundColor: "#0A2540",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "3rem",
          color: "white",
          backgroundImage:
            'linear-gradient(rgba(10, 37, 64, 0.3), rgba(10, 37, 64, 0.7)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(10, 37, 64, 0.85)",
            padding: "2rem",
            borderRadius: "8px",
            borderLeft: "4px solid #C5A059",
          }}
        >
          <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.8rem" }}>
            Daystar Research & Innovation
          </h1>
          <p style={{ margin: 0, color: "#e2e8f0", fontSize: "1rem" }}>
            Excellence • Transformation • Servant-Leadership
          </p>
        </div>
      </div>

      {/* Right Side: Login Card */}
      <div
        style={{
          flex: "1",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                color: "#0A2540",
                fontSize: "1.75rem",
                marginBottom: "0.5rem",
              }}
            >
              Welcome back
            </h2>
            <p style={{ color: "#666", fontSize: "0.95rem", margin: 0 }}>
              Log in to DRAIP — Students & Lecturers Portal
            </p>
          </div>

          {message && (
            <div
              style={{
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
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
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#0A2540",
                  fontSize: "0.9rem",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  outline: "none",
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
                  fontSize: "0.9rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 3rem 0.75rem 1rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
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

            <button
              type="submit"
              style={{
                padding: "0.85rem",
                backgroundColor: "#0A2540",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                marginTop: "0.5rem",
              }}
            >
              Log in
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.9rem",
              color: "#666",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Link
              to="/forgot-password"
              style={{ color: "#0A2540", fontWeight: "600" }}
            >
              Forgot your password?
            </Link>
            <span>
              New student or lecturer?{" "}
              <Link
                to="/signup"
                style={{ color: "#C5A059", fontWeight: "600" }}
              >
                Create an account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
