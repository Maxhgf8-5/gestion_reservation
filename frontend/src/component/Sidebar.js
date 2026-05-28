import React from "react";
import { forwardRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import FormatHelpers from "../Helpers/FormatHelpers";

const Sidebar = forwardRef(({ collapsed }, ref) => {
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const users = JSON.parse(localStorage.getItem("user") || "[]");

  return (
    <aside
      className={collapsed ? "sidebar collapsed" : "sidebar"}
      id="sidebar"
      ref={ref}
    >
      <div className="sb-logo">
        <div className="sb-logo-icon">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="sb-logo-text">
          M<span>Res</span>
        </div>
      </div>
      <nav className="sb-nav">
        <NavLink to="/dashboard" className="sb-item ">
          <div className="sb-icon">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <span className="sb-label">Dashboard</span>
        </NavLink>

        {Array.isArray(roles) && roles[0] === "Admin" ? (
          <>
            <NavLink to="/livre" className="sb-item ">
              <div className="sb-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLnecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20" />
                  <path d="M6.5 7v10" />
                  <path d="M20 7v10" />
                </svg>
              </div>
              <span className="sb-label">Livres</span>
            </NavLink>

            <NavLink to="/lecteur" className="sb-item ">
              <div className="sb-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="5" r="3" />

                  <path d="M6 20c0-4 12-4 12 0" />
                  <path d="M4 14h7v5H4z" />
                  <path d="M13 14h7v5h-7z" />
                </svg>
              </div>
              <span className="sb-label">Lecteur</span>
            </NavLink>

            <NavLink to="/reservation" className="sb-item ">
              <div className="sb-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span className="sb-label">Reservation</span>
            </NavLink>
            <NavLink to="/admin" className="sb-item ">
              <div className="sb-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="7" r="4" />

                  <path d="M6 21c0-4 12-4 12 0" />

                  <circle cx="18" cy="18" r="3" />
                  <path d="M18 15v-1M18 21v-1M21 18h1M15 18h-1M20.1 16.9l.7-.7M15.2 21.1l-.7.7M20.1 19.1l.7.7M15.2 14.9l-.7-.7" />
                </svg>
              </div>
              <span className="sb-label">Admin</span>
            </NavLink>
          </>
        ) : (
          <NavLink to="/lecteur/reservation" className="sb-item ">
            <div className="sb-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="sb-label">Vos reservations</span>
          </NavLink>
        )}
      </nav>

      <div className="sb-footer">
        <div className="sb-avatar">
          {FormatHelpers.formatString(users.name)}
        </div>
        <div className="sb-user-info">
          <div className="sb-user-name">{users.name}</div>
          <div className="sb-user-role">{roles[0]}</div>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;
