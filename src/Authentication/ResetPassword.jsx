import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ResetPassword() {

  const navigate = useNavigate();

  const { resetPasswordApi } = useAuth();

  const email = sessionStorage.getItem("otpEmail");
  
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      await resetPasswordApi({ email, password });

      sessionStorage.clear();
      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-3">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <i className="bi bi-lock text-xl"></i>
          </div>
          <h2 className="text-2xl font-semibold">Reset Password</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            autoFocus
            className="w-full rounded-pill py-2 border-gray-200 px-4 bg-white-200 border-2"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-pill py-2 my-4  border-gray-200 px-4 bg-white-200 border-2"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-pill text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
}
