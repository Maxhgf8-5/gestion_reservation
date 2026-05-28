import React, { Children, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../css/style.scss";

const Navigation = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef(null); 

   const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };
   useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);
  return (
    <>
      <div className="app"> 
        
        <Sidebar ref={sidebarRef} collapsed={collapsed} />
 
        <div className="main-wrapper">
          <Header 
            toggleSidebar={toggleSidebar}/>

          <main className="content">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Navigation;
