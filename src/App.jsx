import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./Authentication/Login";
import Diary from "./Diary/Diary";
import WriteDiary from "./Component/Write";
import Calendar from "./Calender/Calender";
import Achieve from "./Diary/Achieve";
import FolderPage from "./Folder/FolderPage";
import Trash from "./Diary/Trash";
import LoadingPage from "./HomePages/LandingPage";
import Register from "./Authentication/Register";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";
import SetAdditionalPasswords from "./Authentication/SetAdditionalPasswords";
import ForgetPassword from "./Authentication/ForgetPassword";
import VerifyAdditionalPassword from "./Authentication/VerifyAdditionalPassword";
import ResetPassword from "./Authentication/ResetPassword";
import FolderDiary from "./Folder/FolderDiary";
import NotFound from "./Component/NotFound";
import "bootstrap-icons/font/bootstrap-icons.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES - accessible only when NOT logged in */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/set-additional-passwords" element={<PublicRoute><SetAdditionalPasswords /></PublicRoute>} />
        <Route path="/forget-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
        <Route path="/verify-additional-password" element={<PublicRoute><VerifyAdditionalPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* PRIVATE ROUTES - accessible only when logged in */}
        <Route path="/" element={<RequireAuth><LoadingPage /></RequireAuth>} />
        <Route path="/home" element={<RequireAuth><LoadingPage /></RequireAuth>} />
        <Route path="/diary" element={<RequireAuth><Diary /></RequireAuth>} />
        <Route path="/write-diary" element={<RequireAuth><WriteDiary /></RequireAuth>} />
        <Route path="/write-diary/:diaryId" element={<RequireAuth><WriteDiary /></RequireAuth>} />
        <Route path="/calender" element={<RequireAuth><Calendar /></RequireAuth>} />
        <Route path="/achieve-diary" element={<RequireAuth><Achieve /></RequireAuth>} />
        <Route path="/folder" element={<RequireAuth><FolderPage /></RequireAuth>} />
        <Route path="/folder/:id" element={<RequireAuth><FolderDiary /></RequireAuth>} />
        <Route path="/trash-diary" element={<RequireAuth><Trash /></RequireAuth>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

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