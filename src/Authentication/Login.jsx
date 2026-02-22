import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin,setIsLogin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); 

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await login(form);
      window.location.href = "/home";
    } catch (err) {

      if (err?.code === "INVALID_CREDENTIALS") {
        setMessage("Incorrect email or password");
      }
      else if (err?.code === "EMAIL_NOT_VERIFIED") {
        setMessage("Email not verified. Please verify");
        setTimeout(() => navigate("/register"));
      }
      else {
        setMessage(err?.message || "Request failed. Try again.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center px-3.5 justify-center bg-gray-200">

        <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">

          {/* Logo / Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">
              Login
            </h2>
            <p className="text-gray-500 text-sm">
              Web Development made easy!
            </p>
          </div>

          {/* Form */}

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            autoComplete="off"   
          >

            <div className="form-group">
              <input
                type="email"
                className="form-control rounded-pill py-2 px-4 bg-gray-200 shadow-inner border-2"
                placeholder="Email"
                autoFocus
                autoComplete="username"   
                value={form.email}        
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-control rounded-pill py-2 px-4 bg-gray-200 shadow-inner border-2"
                placeholder="Password"
                autoComplete="new-password"  
                value={form.password}       
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {/* ERROR MESSAGE */}
            
            {message && (
              <p className="text-red-500 text-sm text-center">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-pill text-white font-semibold bg-cyan-500 shadow-md hover:bg-cyan-600 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4 text-sm my-3">
            <>
              Don’t have an account?{" "}
              <button
                className="text-cyan-600 font-semibold"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          </div>
           <button className="text-cyan-600 font-semibold ps-2" onClick={()=> navigate("/forget-password")}>Forget Password</button>

        </div>
      </div>
    </>
  );
}
