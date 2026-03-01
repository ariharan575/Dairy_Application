import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ForgetPassword() {

    const {forgetPasswordApi} = useAuth();

    const navigate = useNavigate();

  const [email, setEmail] = useState("");
    const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgetPasswordApi(email);

      sessionStorage.setItem("otpEmail", email);
      sessionStorage.setItem("otpUsage", "FORGET_PASSWORD");
      navigate("/verify-otp")
    }
     catch (err) {
        console.log(err);
      switch (err.code) {
        case "USER_NOT_FOUND":
          setError("No account found with this email");
          break;

        case "EMAIL_NOT_VERIFIED":
          setError("Please verify your email first");
          break;

        case "VALIDATION_ERROR":
          setError(err.message);
          break;

        default:
          setError(err.message || "Failed to send OTP");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-3">

      <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">

        {/* ICON */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 shadow-inner flex items-center justify-center mb-4">
          <i className="bi bi-envelope-check text-2xl"></i>
        </div>

        {/* TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Forget Password</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter your registered email to receive OTP
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 "
          autoComplete="off"
        >
          <input
            type="email"
            placeholder="Email"
            className="form-control rounded-pill py-2 my-4 px-4 bg-gray-200 shadow-inner border-2 w-full"
            value={email}
            autoFocus
            autoComplete="username"
            onChange={(e) =>
              setEmail( e.target.value)
            }
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2  rounded-pill text-white font-semibold bg-cyan-500
             hover:bg-cyan-600 transition disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="text-center mt-4 text-sm">
          Remember password?{" "}
          <button
            className="text-cyan-600 font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
