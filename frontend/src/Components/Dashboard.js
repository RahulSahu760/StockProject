import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import "./Dashboard.css";
import bg from "./bg.jpg";
import Weightage from "../Pages/Weightage";

const DashboardLayout = () => {
  const location = useLocation();

  const headers = {
    "/companies": "Companies",
    "/calculations": "Calculations",
    "/weightage": "Weightage",
  };

  const currentHeader = headers[location.pathname] || "Dashboard";
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <h2>Stock Analysis</h2>
        </div>
        <nav className="dashboard-nav-menu">
          <ul>
            <li className={location.pathname === "/companies" ? "active" : ""}>
              <Link to="/companies">
                {<CorporateFareIcon />}
                Companies
              </Link>
            </li>
            <li
              className={location.pathname === "/calculations" ? "active" : ""}
            >
              <Link to="/calculations">{<CalculateIcon />} Calculations</Link>
            </li>
            <li className={location.pathname === "/weightage" ? "active" : ""}>
              <Link to="/weightage">{""} Weightage</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="dashboard-content">
        <div className="dashboard-content-header">
          <h1>{currentHeader}</h1>
        </div>
        <div className="dashboard-content-body">
          {location.pathname !== "/" ? (
            <Outlet />
          ) : (
            <div>
              <img
                src={bg}
                alt="background image"
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
