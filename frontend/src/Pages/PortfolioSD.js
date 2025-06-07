import { Card, Alert } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const PortfolioSD = () => {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [psd, setPSD] = useState(0);
  const [error, setError] = useState("");
  const [correlations, setCorrelations] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/companies/fetch`);
      if (response.data) {
        setData(response.data);
        setError("");
      } else {
        setData([]);
        setError("No data received from server.");
      }
    } catch (error) {
      setData([]);
      setError("Failed to fetch data. Please try again later.");
    }
  };

  function calculateCorrelation(x, y) {
    if (!x || !y || x.length !== y.length || x.length === 0) {
      setError(
        "Invalid data for correlation calculation. All the companies do not have the same number of return periods"
      );
      return 0;
    }
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0,
      denominatorX = 0,
      denominatorY = 0;

    for (let i = 0; i < n; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY);
      denominatorX += Math.pow(x[i] - meanX, 2);
      denominatorY += Math.pow(y[i] - meanY, 2);
    }

    return denominatorX * denominatorY === 0
      ? 0
      : numerator / Math.sqrt(denominatorX * denominatorY);
  }

  const calculatePSD = () => {
    if (data.length === 0) {
      setError("No company data available for calculation.");
      return;
    }
    setError("");

    let calc1 = 0;
    let calc3 = 0;
    let correlationResults = {};

    try {
      // Step 1: Calculate variance terms
      data.forEach((company) => {
        const lastShare =
          company.shareDetails?.[company.shareDetails.length - 1];

        if (lastShare?.weightage && company.sd) {
          calc1 += Math.pow(company.sd, 2) * Math.pow(lastShare.weightage, 2);
        }
      });

      // Step 2: Calculate correlation for unique pairs
      for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
          const shareDetails1 =
            data[i].shareDetails?.[data[i].shareDetails.length - 1];
          const shareDetails2 =
            data[j].shareDetails?.[data[j].shareDetails.length - 1];

          if (
            shareDetails1?.weightage &&
            data[i].sd &&
            shareDetails2?.weightage &&
            data[j].sd
          ) {
            const key = `Relation (${data[i].name}-${data[j].name})`;

            // Compute correlation once and store it
            const correlationValue = calculateCorrelation(
              data[i].scaledReturns,
              data[j].scaledReturns
            );

            const correlation =
              correlationValue *
              shareDetails1.weightage *
              shareDetails2.weightage *
              data[i].sd *
              data[j].sd *
              2;

            calc3 += correlation;
            correlationResults[key] = correlationValue; // Store correlation value
          }
        }
      }

      setCorrelations(correlationResults);
      setPSD(Math.sqrt(calc1 + calc3));
    } catch (err) {
      setError("Error occurred during PSD calculation.");
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-6"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
        padding: "1.5rem",
      }}
    >
      {error && (
        <Alert
          severity="error"
          className="mb-4"
          style={{ marginBottom: "1rem" }}
        >
          {error}
        </Alert>
      )}

      <Card
        className="p-6 w-full max-w-md bg-white shadow-lg rounded-2xl"
        style={{
          padding: "1.5rem",
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "1rem",
        }}
      >
        <h2
          className="text-xl font-semibold text-gray-800 mb-4 text-center"
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#1F2937",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Select an Option
        </h2>

        <div
          className="flex flex-col space-y-4"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {["Calculate Portfolio SD", "Calculate Selected Portfolio SD"].map(
            (option, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-3 rounded-lg border text-gray-800 font-medium transition-all"
                onClick={() => {
                  setSelectedOption(option);
                  calculatePSD();
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  borderWidth: "1px",
                  fontWeight: "500",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  backgroundColor:
                    selectedOption === option ? "#2563EB" : "#F3F4F6",
                  color: selectedOption === option ? "#FFFFFF" : "#1F2937",
                  borderColor:
                    selectedOption === option ? "#1E40AF" : "#D1D5DB",
                  boxShadow:
                    selectedOption === option
                      ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                      : "none",
                  cursor: "pointer",
                }}
              >
                {option}
              </motion.button>
            )
          )}
        </div>
      </Card>

      {selectedOption === "Calculate Portfolio SD" && (
        <div
          style={{
            marginTop: "2rem",
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#FFFFFF",
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Correlation Matrix
          </h3>
          <table
            className="min-w-full text-sm text-left"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1.5rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#E5E7EB" }}>
                <th
                  style={{
                    padding: "0.75rem 1rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #D1D5DB",
                  }}
                >
                  Pair
                </th>
                <th
                  style={{
                    padding: "0.75rem 1rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #D1D5DB",
                  }}
                >
                  Correlation
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(correlations).map(([key, value], idx) => (
                <tr
                  key={key}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                  }}
                >
                  <td style={{ padding: "0.75rem 1rem", color: "#1F2937" }}>
                    {key}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#1F2937" }}>
                    {value.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2
            className="text-xl font-semibold text-gray-800 mt-4 text-center"
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1F2937",
              textAlign: "center",
            }}
          >
            Portfolio SD: {psd}
          </h2>
        </div>
      )}

      {selectedOption === "Calculate Selected Portfolio SD" && (
        <div
          style={{
            marginTop: "2rem",
            width: "100%",
            maxWidth: "400px",
            padding: "1.5rem",
            backgroundColor: "#F87171", // light red
            color: "#FFFFFF",
            borderRadius: "0.75rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          🚫 Page Not Available
        </div>
      )}
    </div>
  );
};

export default PortfolioSD;
