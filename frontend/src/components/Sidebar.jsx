import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">My SaaS</h2>
      <nav className="flex flex-col gap-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
          }
        >
          Settings
        </NavLink>
        {/* Add more links as needed */}
      </nav>
    </aside>
  );
}
