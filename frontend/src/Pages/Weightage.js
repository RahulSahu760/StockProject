import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import "./Weightage.css";
import axios from "axios";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Weightage = () => {
  const [companies, setCompanies] = useState([]);
  const [uCompanies, setUCompanies] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [selectedCompany, setSelectedCompany] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/companies/fetch`);
      if (response.data) {
        setCompanies(response.data);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      setCompanies([]);
      setAlert({ message: error.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [refresh]);

  console.log("companies", companies);

  const calculateWeightage = (updatedCompanies) => {
    const totalInvest = updatedCompanies.reduce(
      (sum, company) =>
        sum +
        company.shareDetails.reduce((subSum, s) => subSum + s.totalValue, 0),
      0
    );

    if (updatedCompanies.length === 0 || totalInvest === 0)
      return updatedCompanies;

    return updatedCompanies.map((company) => ({
      ...company,
      shareDetails: company.shareDetails.map((share) => ({
        ...share,
        weightage: (share.totalValue / totalInvest) * 100,
      })),
    }));
  };

  const handleUpdate = async () => {
    if (!selectedCompany || newRate === "" || newQuantity === "" || !date)
      return;

    const updatedCompanies = companies.map((company) =>
      company._id === selectedCompany
        ? {
            ...company,
            shareDetails: [
              ...company.shareDetails,
              {
                date: date,
                rate: Number(newRate),
                quantity: Number(newQuantity),
                totalValue: Number(newRate) * Number(newQuantity),
              },
            ],
          }
        : company
    );

    const finalCompanies = calculateWeightage(updatedCompanies);
    setUCompanies(finalCompanies);
    console.log("finalCompanies", finalCompanies);

    setTriggerUpdate(true);

    setNewRate("");
    setNewQuantity("");
    setDate("");
  };

  useEffect(() => {
    if (!triggerUpdate) return;

    const updateWeightage = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/companies/update-weightage`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(uCompanies),
          }
        );

        if (response.ok) {
          console.log("updated");
          setAlert({
            message: "Weightage updated successfully",
            severity: "success",
          });
          setRefresh((prev) => !prev);
        } else {
          console.log("not updated");
          setAlert({ message: "Error updating weightage", severity: "error" });
        }
      } catch (error) {
        setAlert({ message: error.message, severity: "error" });
      } finally {
        setTriggerUpdate(false); // Reset trigger
      }
    };

    updateWeightage();
  }, [triggerUpdate, uCompanies]);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div className="weightage-container">
          <h1 className="weightage-title">Stock Weightage</h1>
          <table className="weightage-stock-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Rate per Stock (Rs)</th>
                <th>Total Stocks Owned</th>
                <th>Total Value (Rs)</th>
                <th>Date</th>
                <th>Weightage</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => {
                return (
                  <tr key={index}>
                    <td>{company.name}</td>
                    <td>
                      {company.shareDetails[company.shareDetails.length - 1]
                        ?.rate || "N/A"}
                    </td>
                    <td>
                      {company.shareDetails[company.shareDetails.length - 1]
                        ?.quantity || "N/A"}
                    </td>
                    <td>
                      {company.shareDetails[company.shareDetails.length - 1]
                        ?.totalValue || "N/A"}
                    </td>
                    <td>
                      {company.shareDetails[
                        company.shareDetails.length - 1
                      ]?.date.split("T")[0] || "N/A"}
                    </td>
                    <td>
                      {company.shareDetails[company.shareDetails.length - 1]
                        ?.weightage || "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="weightage-update-section">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="New Rate"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
            />
            <input
              type="number"
              placeholder="New Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
            <input
              type="date"
              placeholder="New Quantity"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={handleUpdate}>Update</button>
          </div>
          {alert.message && (
            <Alert severity={alert.severity}>{alert.message}</Alert>
          )}
        </div>
      )}
    </>
  );
};

export default Weightage;
