import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // API Base URL from .env file
  const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { email, password };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and admin name in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("adminName", data.admin.name);

        // Redirect to payment link page
        navigate("/paymentLink");
      } else {
        setErrorMessage(data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred while logging in.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, redirect to /paymentLink page
      navigate("/paymentLink");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-xl rounded-lg p-8 w-96 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign In</h2>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-semibold text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-600 text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-600 text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            SIGN IN
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300">
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

