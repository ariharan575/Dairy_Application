import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register, login } = useAuth(); // Add login
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
      // Register the user
      const response = await register(form);
      
      // Auto login after registration
      await login({ email: form.email, password: form.password });
      
          // Store credentials for additional passwords setup
    sessionStorage.setItem("tempEmail", form.email);
    sessionStorage.setItem("tempUsername", form.username);
    sessionStorage.setItem("tempPassword", form.password); // Store password

      
      // Navigate directly to home
      navigate("/", { replace: true });
      
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
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        <form className="space-y-4" autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              className="form-control rounded-pill py-2 px-4 bg-gray-200 border-2 w-full"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              className="form-control rounded-pill py-2 px-4 bg-gray-200 border-2 w-full"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              className="form-control rounded-pill py-2 px-4 bg-gray-200 border-2 w-full"
              placeholder="Password (min 8 characters)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {message && <p className="text-red-600 text-sm text-center">{message}</p>}

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
          <button className="text-cyan-600 font-semibold" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}