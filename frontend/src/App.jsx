import React, { useContext } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";

export default function App() {
  const { user, loading } = useContext(AuthContext);
  const isAuthenticated = !!user;

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <AiOutlineLoading3Quarters className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="text-xl font-semibold text-gray-700">Loading your workspace...</div>
          <div className="text-sm text-gray-500 mt-2">Please wait while we set things up</div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/playground/:projectId" element={isAuthenticated ? <Playground /> : <Navigate to="/login" />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
            <div className="text-center">
              <div className="text-6xl font-bold text-red-500 mb-4">404</div>
              <div className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</div>
              <div className="text-gray-500">The page you're looking for doesn't exist</div>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
