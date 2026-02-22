import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./Authentication/Login";
import Diary from "./Diary/Diary";
import WriteDiary from "./Component/Write";
import Calendar from "./Calender/Calender";

import Achieve from "./Diary/Achieve";
import FolderPage from "./Folder/FolderPage";
import Trash from "./Diary/Trash";
import LoadingPage from "./HomePages/LoadingPage";
import Register from "./Authentication/Register";

import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";

import VerifyOtp from "./Authentication/VerifyOtp";
import LandingPage from "./HomePages/LandingPage";
import ForgetPassword from "./Authentication/ForgetPassword";
import ResetPassword from "./Authentication/ResetPassword";
import FolderDiary from "./Folder/FolderDiary";
import NotFound from "./Component/NotFound";

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
        <Route element={<RequireAuth><LandingPage /></RequireAuth>} path="/home" />
        <Route element={<RequireAuth><Diary /></RequireAuth>} path="/diary" />
        <Route element={<RequireAuth><WriteDiary /></RequireAuth>} path="/write-diary" />
        <Route element={<RequireAuth><WriteDiary /></RequireAuth>} path="/write-diary/:diaryId" />
        <Route element={<RequireAuth><Calendar /></RequireAuth>} path="/calender" />
        <Route element={<RequireAuth><Achieve /></RequireAuth>} path="/achieve-diary" />
        <Route element={<RequireAuth><FolderPage /></RequireAuth>} path="/folder" />
        <Route element={<RequireAuth><FolderDiary /></RequireAuth>} path="/folder/:id" />
        <Route element={<RequireAuth><Trash /></RequireAuth>} path="/trash-diary" />

        <Route path="*" element={<NotFound />} />

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
