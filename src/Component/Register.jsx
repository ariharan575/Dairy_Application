import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {

  const { register } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");          
  const [fieldErrors, setFieldErrors] = useState({}); 

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");            
    setFieldErrors({});       
    setLoading(true);

    try {
      await register(form);
      navigate("/verify-otp");

    } catch (err) {

      switch (err.code) {

        case "EMAIL_ALREADY_EXISTS":
          setFieldErrors({ email: err.message });
          break;

        case "VALIDATION_ERROR":
          setMessage(err.message);
          break;

        default:
          setMessage(err.message || "Registration failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center px-2 justify-center bg-gray-200">

      <div className="w-full max-w-md p-8 rounded-3xl bg-white shadow-lg">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Register</h2>
          <p className="text-gray-500 text-sm">
            Web Development made easy!
          </p>
        </div>

        <form className="space-y-4" autoComplete="off" onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div>
            <input
              type="text"
              className="form-control rounded-pill py-2 px-4 bg-gray-200 border-2"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              className="form-control rounded-pill py-2 px-4 bg-gray-200 border-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              className="form-control rounded-pill py-2 px-4 bg-gray-200 border-2"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {/* GLOBAL MESSAGE */}
          {message && (
            <p className="text-red-600 text-sm text-center">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-pill text-white font-semibold bg-cyan-500 hover:bg-cyan-600"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
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
