import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";

export default function SetAdditionalPasswords() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Add login
  const email = sessionStorage.getItem("tempEmail");
  const username = sessionStorage.getItem("tempUsername");
  const password = sessionStorage.getItem("tempPassword"); // Store password temporarily

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email || !password) {
      navigate("/register", { replace: true });
    }
  }, [email, password, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password1.length < 4) {
      setError("Additional password must be at least 4 characters");
      return;
    }
    if (password2.length < 4) {
      setError("Additional password must be at least 4 characters");
      return;
    }
    if (password1 === password2) {
      setError("Both additional passwords must be different");
      return;
    }

    setLoading(true);

    try {
      // Save additional passwords
      await api.post("/api/auth/set-additional-passwords", {
        email,
        additionalPassword1: password1,
        additionalPassword2: password2
      });

      // Auto login
      await login({ email, password });
      
      // Clear temp storage
      sessionStorage.removeItem("tempEmail");
      sessionStorage.removeItem("tempUsername");
      sessionStorage.removeItem("tempPassword");
      
      // Navigate to home
      navigate("/", { replace: true });
      
    } catch (err) {
      setError(err.message || "Failed to set additional passwords");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-3">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-cyan-100 flex items-center justify-center mb-4">
            <i className="bi bi-shield-lock text-3xl text-cyan-600"></i>
          </div>
          <h2 className="text-2xl font-semibold">Set Recovery Passwords</h2>
          <p className="text-gray-500 text-sm mt-2">
            Welcome {username}!<br />
            Set two additional passwords to recover your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Additional Password 1"
              className="w-full rounded-pill py-2 px-4 bg-gray-200 border-2"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Additional Password 2 (different from above)"
              className="w-full rounded-pill py-2 px-4 bg-gray-200 border-2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-pill text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Keep these passwords safe. You'll need any one of them to reset your main password.
        </p>
      </div>
    </div>
  );
}