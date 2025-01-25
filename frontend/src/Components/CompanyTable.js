import React from "react";
import "./CompanyTable.css";
import { Button } from "@mui/material";

const CompanyTable = ({ data }) => {
  const returns = data?.returns || [];
  const scaledValues = data?.scaledReturns || [];

  const [selectedValues, setSelectedValues] = React.useState([]);
  console.log("selectedValues", selectedValues);

  const addRemoveSelectedValues = (value, index) => {
    setSelectedValues((prevSelectedValues) => {
      const exists = prevSelectedValues.find((item) => item.index === index); //use to match index of prevstate with the index passed thru function, if index exists then return true

      if (exists) {
        return prevSelectedValues.filter((item) => item.index !== index);
      } else {
        return [...prevSelectedValues, { index, value }];
      }
    });
  };

  return (
    <div className="CompanyTable-container">
      <table className="CompanyTable-table">
        <thead>
          <tr className="CompanyTable-headerRow">
            <th
              colSpan={2}
              className="CompanyTable-headerCell"
              style={{ backgroundColor: "black", color: "white" }}
            >
              Name: {data?.name || "N/A"}
            </th>
            <th
              colSpan={2}
              className="CompanyTable-headerCell"
              style={{ backgroundColor: "black", color: "white" }}
            >
              Code: {data?.code || "N/A"}
            </th>
          </tr>
          <tr className="CompanyTable-columnRow">
            <th
              className="CompanyTable-columnHeader"
              style={{ backgroundColor: "black", color: "white" }}
            >
              Returns
            </th>
            <th
              className="CompanyTable-columnHeader"
              style={{ backgroundColor: "black", color: "white" }}
            >
              Scaled Values
            </th>
          </tr>
        </thead>
        <tbody>
          {returns.map((returnValue, index) => (
            <tr key={index} className="CompanyTable-dataRow">
              <td className="CompanyTable-dataCell">{returnValue}</td>
              <td className="CompanyTable-dataCell">
                {scaledValues[index]}{" "}
                <input
                  type="checkbox"
                  value={scaledValues[index]}
                  checked={selectedValues.some(
                    (item) => item.value === scaledValues[index]
                  )}
                  onChange={(e) => {
                    addRemoveSelectedValues(scaledValues[index], index);
                  }}
                  className="CompanyTable-checkbox"
                />{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <Button variant="contained">Calculate all Scaled Returns</Button>
        <Button variant="contained">Calculate selected Returns</Button>
      </div>
    </div>
  );
};

export default CompanyTable;
