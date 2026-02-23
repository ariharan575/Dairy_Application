import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function VerifyOtp() {

  const { verifyOtpApi } = useAuth();
  const navigate = useNavigate();

  const email = sessionStorage.getItem("otpEmail");
  const usage = sessionStorage.getItem("otpUsage");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email || !usage) {
      navigate("/login");
    }
  }, [email, usage, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await verifyOtpApi({ email, otp, usage });
      
      // REGISTER FLOW
      if (usage === "REGISTER") {
        sessionStorage.setItem("accessToken", res.data.accessToken);
        window.location.href = "/home";
      }

      // FORGET PASSWORD FLOW
      if (usage === "FORGET_PASSWORD") {
        navigate("/reset-password");
      }

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center px-3 justify-center bg-gray-200">
         <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
        {/* Logo / Title */}
        <div className="text-center mb-6">
           <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 shadow-inner flex items-center justify-center mb-4">
            <span className="text-xl font-bold"><h1><i className="bi bi-envelope-check"></i></h1></span>
          </div> 
          <h2 className="text-2xl font-semibold">
                Email Verification
          </h2>
          <p className="text-gray-500 text-sm my-3">
            We just sent your authentication code via email to <br /> {email.charAt(0)} **********@gmail.com. The code will expire in 5 Minutes
          </p>
          <p>Device Verification Code</p>
        </div>
         <form className="space-y-4 " onSubmit={submit}>
                  <div className="form-group">
            <input
              type="number"
              className="form-control my-3  rounded-pill py-2 px-4 bg-gray-200 shadow-inner border-2"
              value={otp}
              placeholder="otp-code"
              onChange={(e)=> setOtp(e.target.value)  }
            />
          </div>
          <p className="text-danger">{message}</p>
          <button
            type="submit"
            className="w-full py-2 my-3 rounded-pill text-white font-semibold bg-cyan-500 shadow-md hover:bg-cyan-600 transition"
          >
            {loading ? "Verifying..." :  "Verifiy" }
          </button>
        </form>
      </div>
      </div>
    </>
  )
}
