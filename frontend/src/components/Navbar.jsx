import React from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName"); // Get Admin Name

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("adminName");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white py-3 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      
      {adminName && (
        <div className="flex items-center gap-4">
          <span>Welcome, {adminName}!</span>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};


