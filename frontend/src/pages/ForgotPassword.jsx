import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("request"); // request | reset | done

  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email },
      );
      setMessage(res.data.message);
      if (res.data.resetToken) {
        setToken(res.data.resetToken);
      }
      setStep("reset");
    } catch (err) {
      setMessage(
        "Request failed: " + (err.response?.data?.message || err.message),
      );
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { token, newPassword },
      );
      setMessage(res.data.message);
      setStep("done");
    } catch (err) {
      setMessage(
        "Reset failed: " + (err.response?.data?.message || err.message),
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
          {step === "request"
            ? "Forgot Password"
            : step === "reset"
              ? "Reset Password"
              : "Password Reset Complete"}
        </h2>

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

        {step === "request" && (
          <form
            onSubmit={handleRequest}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
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
              }}
            >
              Send Reset Token
            </button>
          </form>
        )}

        {step === "reset" && (
          <form
            onSubmit={handleReset}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={labelStyle}>Reset Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                placeholder="Paste token from console/email"
                style={inputStyle}
              />
              <p
                style={{
                  margin: "0.3rem 0 0",
                  fontSize: "0.75rem",
                  color: "#64748b",
                }}
              >
                For this study project, the token is auto-filled above. In
                production it would arrive via email.
              </p>
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
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
              }}
            >
              Reset Password
            </button>
          </form>
        )}

        {step === "done" && (
          <p
            style={{ textAlign: "center", color: "#2e7d32", fontWeight: "600" }}
          >
            ✅ You can now log in with your new password.
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          <Link to="/login" style={{ color: "#0A2540", fontWeight: "600" }}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
