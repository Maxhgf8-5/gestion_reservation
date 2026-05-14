import React, { Children, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Navigation = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef(null);
  const menuRef = useRef(null);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
  };
  return (
    <div>
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar ref={sidebarRef} collapsed={collapsed} />

        {/* Main content */}
        <div className="flex-grow-1">
          <Header  ref={menuRef}
          
            toggleSidebar={toggleSidebar}/>

          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
