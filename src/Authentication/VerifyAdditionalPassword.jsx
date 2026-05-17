import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function VerifyAdditionalPassword() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail");
  
  const [additionalPassword, setAdditionalPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/forget-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/verify-additional-password", {
        email,
        additionalPassword
      });

      navigate("/reset-password");
    } catch (err) {
      if (err.code === "INVALID_CREDENTIALS") {
        setError("Invalid additional password. Try the other one.");
      } else {
        setError(err.message || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-3">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-cyan-100 flex items-center justify-center mb-4">
            <i className="bi bi-shield-check text-3xl text-cyan-600"></i>
          </div>
          <h2 className="text-2xl font-semibold">Verify Recovery Password</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter any one of your additional passwords
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Additional Password"
            className="w-full rounded-pill py-2 my-3 px-4 bg-gray-200 border-2"
            value={additionalPassword}
            onChange={(e) => setAdditionalPassword(e.target.value)}
            autoFocus
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-pill text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            className="text-gray-500 text-sm hover:underline"
            onClick={() => navigate("/forget-password")}
          >
            Try different email
          </button>
        </div>
      </div>
    </div>
  );
}