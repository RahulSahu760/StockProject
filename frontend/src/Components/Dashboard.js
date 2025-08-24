import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import "./Dashboard.css";
import ScaleIcon from "@mui/icons-material/Scale";
import FunctionsIcon from "@mui/icons-material/Functions";
// import bg from "./bg.jpg";
// import Weightage from "../Pages/Weightage";
import CompanyGraphPage from "./CompanyGraphPage";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const DashboardLayout = () => {
  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);

  const fetchAllCompanies = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/companies/fetch`);
      if (response.data) {
        setCompanies(response.data);
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);
  useEffect(() => {
    if (location.pathname === "/") {
      fetchAllCompanies();
    }
  }, [location.pathname]);

  const headers = {
    "/companies": "Companies",
    "/calculations": "Calculations",
    "/weightage": "Weightage",
    "/portfolio-sd": "Portfolio SD",
  };

  const currentHeader = headers[location.pathname] || "Dashboard";
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <Link to="/">
            <h2>Stock Analysis</h2>
          </Link>
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
              <Link to="/weightage">{<ScaleIcon />} Weightage</Link>
            </li>
            <li
              className={location.pathname === "/Portfolio SD" ? "active" : ""}
            >
              <Link to="/portfolio-sd">{<FunctionsIcon />} Portfolio SD</Link>
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
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "50px",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
              ) : companies.length > 0 ? (
                <CompanyGraphPage companies={companies} />
              ) : (
                <p>No companies found.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
