import React from 'react';
import { forwardRef } from "react";

const Header = forwardRef(({toggleSidebar}, ref) => {
    return (
        <div>
               <header class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
              <button
                className="btn btn-outline-primary"
                onClick={toggleSidebar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  class="bi bi-list"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </button>
              

              <div class="collapse navbar-collapse" id="navbarHeader">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">
                      Notifications
                    </a>
                  </li>
                 
                </ul>
              </div>
            </div>
          </header>
        </div>
    );
});

export default Header;