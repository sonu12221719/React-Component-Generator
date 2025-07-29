import React from "react";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow">
      <div className="text-xl font-bold text-gray-800">Your SaaS</div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-600">Hello, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        )}
      </div>
    </header>
  );
}
