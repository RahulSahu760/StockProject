import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CompanyGraphPage = ({ companies }) => {
  // helper to safely format numbers
  const formatNum = (val, digits = 2) =>
    typeof val === "number" ? val.toFixed(digits) : "N/A";

  // initialize state safely
  const [selectedCompany, setSelectedCompany] = useState(
    companies?.[0] ?? null
  );

  const handleSelectChange = (e) => {
    const selected = companies.find((c) => c.code === e.target.value);
    setSelectedCompany(selected ?? null);
  };

  // chart data safe mapping
  const chartData =
    selectedCompany?.returns?.map((val, i) => ({
      period: `Q${i + 1}`,
      Return: val,
      ScaledReturn: selectedCompany?.scaledReturns?.[i],
    })) ?? [];

  // if no company data at all
  if (!selectedCompany) {
    return (
      <div style={{ padding: "30px", fontFamily: "Segoe UI" }}>
        <h2>📈 Company Returns Dashboard</h2>
        <p>No company data available</p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "30px",
        background: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "28px",
          color: "#333",
        }}
      >
        📈 Company Returns Dashboard
      </h2>

      {/* Company selector */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <label style={{ fontWeight: "600", marginRight: "10px" }}>
          Select Company:
        </label>
        <select
          onChange={handleSelectChange}
          value={selectedCompany?.code ?? ""}
          style={{
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          {companies?.length > 0 ? (
            companies.map((company) => (
              <option key={company._id} value={company.code}>
                {company.name}
              </option>
            ))
          ) : (
            <option disabled>No companies</option>
          )}
        </select>
      </div>

      <div
        style={{
          display: "flex",
          gap: "30px",
          alignItems: "flex-start",
          marginBottom: "30px",
        }}
      >
        {/* Left - Company Info */}
        <div
          style={{
            flex: "1",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#444" }}>
            🏢 Company Info
          </h3>
          <p>
            <strong>Name:</strong> {selectedCompany?.name ?? "N/A"}
          </p>
          <p>
            <strong>Code:</strong> {selectedCompany?.code ?? "N/A"}
          </p>
          <p>
            <strong>CAGR:</strong> {formatNum(selectedCompany?.cagr, 2)}
          </p>
          <p>
            <strong>SD:</strong> {formatNum(selectedCompany?.sd, 3)}
          </p>
        </div>

        {/* Right - Chart */}
        <div
          style={{
            flex: "2",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Return"
                stroke="#3f51b5"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="ScaledReturn"
                stroke="#00c49f"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Share Details Bottom */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#444" }}>
          📌 Latest Share Details
        </h3>
        {selectedCompany?.shareDetails?.length > 0 ? (
          (() => {
            const latest =
              selectedCompany.shareDetails[
                selectedCompany.shareDetails.length - 1
              ];
            return (
              <>
                <p>
                  <strong>Date:</strong>{" "}
                  {latest?.date
                    ? new Date(latest.date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Rate:</strong> {latest?.rate ?? "N/A"}
                </p>
                <p>
                  <strong>Quantity:</strong> {latest?.quantity ?? "N/A"}
                </p>
                <p>
                  <strong>Total Value:</strong> {latest?.totalValue ?? "N/A"}
                </p>
                {latest?.weightage !== undefined && (
                  <p>
                    <strong>Weightage:</strong> {formatNum(latest.weightage, 2)}
                  </p>
                )}
              </>
            );
          })()
        ) : (
          <p>No share details available</p>
        )}
      </div>
    </div>
  );
};

export default CompanyGraphPage;
