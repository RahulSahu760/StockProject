import React, { useEffect, useState } from "react";
import "./Calculations.css";
import axios from "axios";
import CompanyTable from "../Components/CompanyTable";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

// const companies = [
//   { id: 1, name: "Company A", returns: [-18.59, 83.92, 41.64, 81.66, 27.1] },
//   { id: 2, name: "Company B", returns: [12.34, -45.67, 23.89, 67.89, 78.12] },
//   { id: 3, name: "Company C", returns: [56.78, 12.34, -98.76, 45.67, 89.01] },
// ];

const Calculations = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedScaledValues, setSelectedScaledValues] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [loading, setLoading] = useState(true);

  const handleScaledValueChange = (updatedValues) => {
    setSelectedScaledValues(updatedValues);
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/companies/fetch`);
      if (response.data) {
        setCompanies(response.data);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      setAlert({ message: error.message, severity: "error" });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  console.log("companies", companies);

  return (
    <div className="calculations-container">
      {alert.message && (
        <Alert severity={alert.severity}>{alert.message}</Alert>
      )}
      {/* Sidebar */}
      <div className="calculations-sidebar">
        <h3>Companies</h3>
        <ul>
          {companies && companies.length > 0 ? (
            companies.map((company, index) => (
              <li
                key={index}
                className={selectedCompany?.id === company.id ? "active" : ""}
                onClick={() => setSelectedCompany(company)}
              >
                {company ? company.name : "No data"}
              </li>
            ))
          ) : (
            <li>No data available</li>
          )}
        </ul>
      </div>

      {/* Content Layout */}
      <div className="calculations-content">
        <h2>Select a company from the sidebar to perform calculations</h2>
        {selectedCompany ? (
          <div>
            <CompanyTable
              data={selectedCompany}
              onScaledValueChange={handleScaledValueChange}
            />
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
};

export default Calculations;
