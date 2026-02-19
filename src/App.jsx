import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./Component/Login";
import Diary from "./Component/Diary";
import WriteDiary from "./Component/Write";
import Calendar from "./Component/Calender";

import Achieve from "./MainComponent/Achieve";
import FolderNew from "./MainComponent/FolderNew";
import Trash from "./MainComponent/Trash";
import LoadingPage from "./MainComponent/LoadingPage";
import Register from "./Component/Register";

import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";

import VerifyOtp from "./Component/VerifyOtp";
import LandingContent from "./MainComponent/LandingContent";
import ForgetPassword from "./Component/ForgetPassword";
import ResetPassword from "./Component/ResetPassword";
import FolderDiary from "./MainComponent/FolderDiary";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

/* ---------------- ANIMATED ROUTES ---------------- */

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<PublicRoute><LoadingPage /></PublicRoute>} path="/" />
        <Route element={<PublicRoute><Login /></PublicRoute>} path="/login" />
        <Route element={<PublicRoute><Register /></PublicRoute>} path="/register" />
        <Route element={<PublicRoute><VerifyOtp /></PublicRoute>} path="/verify-otp" />
        <Route element={<PublicRoute><ForgetPassword /></PublicRoute>} path="/forget-password" />
        <Route element={<PublicRoute><ResetPassword /></PublicRoute>} path="/reset-password" />

        {/* ================= PRIVATE ROUTES ================= */}
        <Route element={<RequireAuth><LandingContent /></RequireAuth>} path="/home" />
        <Route element={<RequireAuth><Diary /></RequireAuth>} path="/diary" />
        <Route element={<RequireAuth><WriteDiary /></RequireAuth>} path="/write_diary" />
        <Route element={<RequireAuth><WriteDiary /></RequireAuth>} path="/write_diary/:diaryId" />
        <Route element={<RequireAuth><Calendar /></RequireAuth>} path="/calender" />
        <Route element={<RequireAuth><Achieve /></RequireAuth>} path="/achieve" />
        <Route element={<RequireAuth><FolderNew /></RequireAuth>} path="/folder" />
        <Route element={<RequireAuth><FolderDiary /></RequireAuth>} path="/folder/:id" />
        <Route element={<RequireAuth><Trash /></RequireAuth>} path="/trash" />

      </Routes>
    </AnimatePresence>
  );
}

/* ---------------- APP ROOT ---------------- */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
