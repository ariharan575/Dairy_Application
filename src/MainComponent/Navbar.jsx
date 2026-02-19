import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  House,
  PencilSquare,
  Calendar,
  Book,
  Folder,
  Archive,
  Trash,
  ThreeDots
} from "react-bootstrap-icons";

export default function Navbar() {

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navData = [
    { id: 1, name: "Home", navigate: "/home", icon: <House size={16} /> },
    { id: 2, name: "Write", navigate: "/write_diary", icon: <PencilSquare size={16} /> },
    { id: 3, name: "Calender", navigate: "/calender", icon: <Calendar size={16} /> },
    { id: 4, name: "Diaries", navigate: "/diary", icon: <Book size={16} /> },
    { id: 5, name: "Folder", navigate: "/folder", icon: <Folder size={16} /> },
  ];

  const extraData = [
    { id: 6, name: "Achieve", navigate: "/achieve", icon: <Archive size={16} /> },
    { id: 7, name: "Trash", navigate: "/trash", icon: <Trash size={16} /> },
  ];

  // Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b px-3 px-xl-5 py-2 sticky top-0 z-50 mx-auto border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-md-3 px-lg-4">
        <div className="flex justify-between items-center h-12">

          {/* Logo */}
            <h1 className="text-xl d-md-none font-semibold text-gray-800">
              Diary
            </h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-lg-4 gap-3 text-gray-600">

            <h1 className="text-xl font-semibold text-gray-800">
              Diary
            </h1>

            {navData.map((data, index) => (
              <div
                key={index}
                className="flex items-center gap-1 cursor-pointer hover:underline decoration-2"
                onClick={() => navigate(data.navigate)}
              >
                {data.icon}
                <h6 className="m-0 ps-lg-1">{data.name}</h6>
              </div>
            ))}

            {/* Custom Dropdown */}
            <div className="relative flex items-center gap-1 cursor-pointer hover:underline decoration-2" ref={dropdownRef}>
              <div onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1">
                <ThreeDots size={18} />
                <h6 className="m-0">More</h6>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 top-5 mt-2 bg-white border border-gray-200 shadow-md rounded p-2">
                  {extraData.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 fw-semibold cursor-pointer hover:underline decoration-2 px-2 py-1"
                      onClick={() => {
                        navigate(item.navigate);
                        setDropdownOpen(false);
                      }}
                    >
                      {item.icon}
                      <h6 className="m-0">{item.name}</h6>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="d-none d-md-flex items-center gap-2">

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="rounded-full bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-white shadow hover:bg-cyan-600"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-white shadow hover:bg-cyan-600"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative w-8 h-8 me-3"
          >
            <span className={`absolute w-full h-[2px] bg-gray-700 transition-all duration-300 ${open ? "rotate-45 top-4" : "top-2"}`} />
            <span className={`absolute w-full h-[2px] bg-gray-700 transition-all duration-300 top-4 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute w-full h-[2px] bg-gray-700 transition-all duration-300 ${open ? "-rotate-45 top-4" : "top-6"}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white border-t border-gray-200 px-4 py-2 space-y-2">

          {[...navData, ...extraData].map((data, index) => (
            <div
              key={index}
              className="flex items-center gap-2 cursor-pointer hover:underline decoration-2"
              onClick={() => {
                navigate(data.navigate);
                setOpen(false);
              }}
            >
              {data.icon}
              <h6 className="m-0">{data.name}</h6>
            </div>
          ))}

          <hr />

          <h6
            className="cursor-pointer hover:underline decoration-2 text-primary"
            onClick={() => {
              if (isAuthenticated) logout();
              else navigate("/login");
              setOpen(false);
            }}
          >
            {isAuthenticated ? "LogOut" : "Login"}
          </h6>
        </div>
      </div>
    </nav>
  );
}
