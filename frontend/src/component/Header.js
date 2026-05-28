import React, { useState } from "react";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Header = forwardRef(({ toggleSidebar }, ref) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const logout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/logout");
      if (res.data.status === 1) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <header className="topbar">
        <button
          className="tb-toggle"
          title="Ouvrir/Fermer le menu"
          onClick={toggleSidebar}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="tb-breadcrumb">
          <span className="sep"></span>
          <span className="current" id="breadcrumb-current">
            Tableau de bord
          </span>
        </div>

        <div className="tb-actions">
          <button className="tb-btn" title="Notifications">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="tb-notif-dot"></span>
          </button>
          <form onSubmit={logout}>
            <button className="tb-btn" type="submit" disabled={loading}>
              {loading ? (
                "..."
              ) : (
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </header>
    </>
  );
});

export default Header;
