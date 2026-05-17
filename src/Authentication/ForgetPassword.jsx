import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/forget-password", { email });
      
      // Store email for next step
      sessionStorage.setItem("resetEmail", email);
      navigate("/verify-additional-password");
    } catch (err) {
      switch (err.code) {
        case "USER_NOT_FOUND":
          setError("No account found with this email");
          break;
        default:
          setError(err.message || "Failed to verify email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-3">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <i className="bi bi-key text-2xl"></i>
          </div>
          <h2 className="text-2xl font-semibold">Forgot Password?</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Registered Email"
            className="form-control rounded-pill py-2 my-3 px-4 bg-gray-200 border-2 w-full"
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-pill text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Remember password?{" "}
          <button className="text-cyan-600 font-semibold" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}