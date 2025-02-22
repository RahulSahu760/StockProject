import React, { useEffect, useState } from "react";
import "./Weightage.css";
import axios from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Weightage = () => {
  const [companies, setCompanies] = useState([]);
  const [uCompanies, setUCompanies] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [selectedCompany, setSelectedCompany] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");

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

  const calculateWeightage = (updatedCompanies) => {
    //extract totalValue form each company, add them and divide by totalValue of specific company
    const totalInvest = updatedCompanies.reduce(
      (sum, company) => sum + (company.shareDetails[0]?.totalValue || 0),
      0
    );

    if (totalInvest === 0)
      return updatedCompanies.map((c) => ({
        ...c,
        shareDetails: c.shareDetails.map((s) => ({ ...s, weightage: 0 })),
      }));

    return updatedCompanies.map((company) => ({
      ...company,
      shareDetails: company.shareDetails.map((share) => ({
        ...share,
        weightage: (share.totalValue / totalInvest) * 100,
      })),
    }));
  };

  const handleUpdate = () => {
    if (!selectedCompany || !newRate || !newQuantity) return;

    const updatedCompanies = companies.map((company) =>
      company._id === selectedCompany
        ? {
            ...company,
            shareDetails: company.shareDetails.map((share) => ({
              ...share,
              date: date,
              rate: Number(newRate),
              quantity: Number(newQuantity),
              totalValue: Number(newRate) * Number(newQuantity),
            })),
          }
        : company
    );

    const finalCompanies = calculateWeightage(updatedCompanies);
    setUCompanies(finalCompanies);
    console.log("finalCompanies", finalCompanies);
    setNewRate("");
    setNewQuantity("");
    setDate("");
  };

  return (
    <div className="weightage-container">
      <h1 className="wieghtage-title">Stock Weightage</h1>
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
          {companies.map((company, index) => (
            <tr key={index}>
              <td>{company.name}</td>
              <td>{company.shareDetails[0]?.rate || "N/A"}</td>
              <td>{company.shareDetails[0]?.quantity || "N/A"}</td>
              <td>{company.shareDetails[0]?.totalValue || "N/A"}</td>
              <td>{company.shareDetails[0]?.date || "N/A"}</td>
              <td>{company.shareDetails[0]?.weightage || "N/A"}</td>
            </tr>
          ))}
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
    </div>
  );
};

export default Weightage;
