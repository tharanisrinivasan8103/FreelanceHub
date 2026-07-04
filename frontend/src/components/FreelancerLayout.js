import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const FreelancerLayout = () => {
  return (
    <div style={{display:"flex", minHeight:"100vh", backgroundColor:"#f3f4f6"}}>
      <div style={{width:"256px", flexShrink:0, position:"fixed", left:0, top:0, height:"100vh", zIndex:50, overflowY:"auto"}}>
        <Sidebar />
      </div>
      <div style={{marginLeft:"256px", flex:1, minHeight:"100vh", overflowY:"auto"}}>
        <Outlet />
      </div>
    </div>
  );
};

export default FreelancerLayout;
