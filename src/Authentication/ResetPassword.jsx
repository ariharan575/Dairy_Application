import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail");
  
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forget-password", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", { email, password });
      
      setSuccess(true);
      
      // Clear session storage
      sessionStorage.removeItem("resetEmail");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-3">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <i className="bi bi-lock text-xl"></i>
          </div>
          <h2 className="text-2xl font-semibold">Set New Password</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="password"
            placeholder="New Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-pill py-2 my-3 px-4 bg-gray-200 border-2"
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-pill py-2 mb-3 px-4 bg-gray-200 border-2"
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center">
              Password reset successful! Redirecting to login...
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2 rounded-pill text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
        
        {!success && (
          <div className="text-center mt-4">
            <button
              className="text-gray-500 text-sm hover:underline"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}