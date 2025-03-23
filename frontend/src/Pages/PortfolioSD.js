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
      setError("Invalid data for correlation calculation.");
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
    let calc2 = 1;
    let calc3 = 1;

    try {
      data.forEach((company, index) => {
        if (company.shareDetails && company.shareDetails.length > 0) {
          calc1 += Math.pow(company.sd, 2 * company.shareDetails[0].weightage);
          calc2 *= company.sd * company.shareDetails[0].weightage;

          if (index < data.length - 1) {
            const correlation = calculateCorrelation(
              company.scaledReturns,
              data[index + 1].scaledReturns
            );
            calc3 *= correlation;
          }
        }
      });
      setPSD(Math.sqrt(calc1 + calc2 + calc3));
    } catch (err) {
      setError("Error occurred during PSD calculation.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-6">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      <Card className="p-6 w-full max-w-md bg-white shadow-lg rounded-2xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Select an Option
        </h2>
        <div className="flex flex-col space-y-4">
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
                  backgroundColor:
                    selectedOption === option ? "#2563EB" : "#F3F4F6",
                  color: selectedOption === option ? "#FFFFFF" : "#1F2937",
                  borderColor:
                    selectedOption === option ? "#1E40AF" : "#D1D5DB",
                  boxShadow:
                    selectedOption === option
                      ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                      : "none",
                }}
              >
                {option}
              </motion.button>
            )
          )}
        </div>
      </Card>
      {selectedOption === "Calculate Portfolio SD" && (
        <h2 className="text-xl font-semibold text-gray-800 mt-4 text-center">
          Portfolio SD: {psd}
        </h2>
      )}
      {selectedOption === "Calculate Selected Portfolio SD" && <div>SPDSD</div>}
    </div>
  );
};

export default PortfolioSD;
