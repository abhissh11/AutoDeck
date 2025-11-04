import React, { useState } from "react";
import { Menu, LogIn, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    onMenuClick?.();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 sm:px-8 py-3 border-b border-gray-800 bg-[#0d0d0f]/95 backdrop-blur-md text-gray-100 shadow-lg">
      {/* Left: Menu button + Brand */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle button */}
        <button
          onClick={toggleMenu}
          className="block sm:hidden text-gray-300 hover:text-white transition-all"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <h1
          className="text-xl font-bold cursor-pointer bg-linear-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent select-none"
          onClick={() => navigate("/chat")}
        >
          AutoDeck
        </h1>
      </div>

      {/* Right: Auth buttons */}
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#232323] border border-gray-700 rounded-md text-sm text-gray-200 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#232323] border border-gray-700 rounded-md text-sm text-gray-200 transition-all"
          >
            <LogIn size={16} /> Login
          </button>
        )}
      </div>
    </header>
  );
}
