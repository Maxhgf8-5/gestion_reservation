import React from 'react';
import { forwardRef, useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';

const Sidebar = forwardRef(({collapsed},ref) => {
    return (
        <div>
               {/* Sidebar */}
        <div
          className={`bg-dark text-white p-3 ${collapsed ? "d-none" : "d-block"}`}
          style={{ width: "250px", minHeight: "100vh" }} ref={ref}
          >
          <h4>Menu</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-white" >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/livre" className="nav-link text-white">
                Livres
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/lecteur" className="nav-link text-white">
                Lecteur
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/reservation" className="nav-link text-white">
                Reservation
              </NavLink>
            </li>
          </ul>
        </div>
        </div>
    );
});

export default Sidebar;