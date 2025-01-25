import React from "react";
import "./CompanyTable.css";
import { Button } from "@mui/material";

const CompanyTable = ({ data }) => {
  const returns = data?.returns || [];
  const scaledValues = data?.scaledReturns || [];

  const [selectedValues, setSelectedValues] = React.useState([]);
  const [checkBox, setCheckBox] = React.useState(true);
  const [cagr, setCagr] = React.useState(0);
  const [sd, setSd] = React.useState(0);
  console.log("selectedValues", selectedValues);
  React.useEffect(() => {
    console.log("selectedValues", selectedValues);
  }, [selectedValues]);

  const calculateScaledReturns = async (scaledReturns) => {
    if (scaledReturns.length > 1) {
      // Ensure there are at least two values to calculate CAGR and SD
      // Calculate CAGR (using the initial and final values)
      const initialValue = scaledReturns[0]; // First value
      const finalValue = scaledReturns[scaledReturns.length - 1]; // Last value
      const numberOfYears = scaledReturns.length - 1; // Assuming each value represents a year

      if (initialValue !== 0 && finalValue !== 0 && numberOfYears > 0) {
        const cagr =
          ((finalValue / initialValue) ** (1 / numberOfYears) - 1) * 100; // Multiply by 100 to convert to percentage

        // Calculate Standard Deviation
        const mean =
          scaledReturns.reduce((acc, value) => acc + value, 0) /
          scaledReturns.length;
        const squaredDifferences = scaledReturns.map((value) =>
          Math.pow(value - mean, 2)
        );
        const variance =
          squaredDifferences.reduce((acc, diff) => acc + diff, 0) /
          scaledReturns.length;
        const standardDeviation = Math.sqrt(variance);

        return { cagr, standardDeviation };
      } else {
        console.log("Invalid data for CAGR or Standard Deviation calculation.");
      }
    } else {
      console.log("Not enough values to calculate CAGR or Standard Deviation.");
    }
  };

  const addScaledReturns = async () => {
    let updatedValues;
    if (selectedValues.length > 0) {
      updatedValues = selectedValues.map((item) => {
        return item.value;
      });
    } else {
      updatedValues = scaledValues;
    }

    const { cagr, standardDeviation } = await calculateScaledReturns(
      updatedValues
    );

    setCagr(cagr);
    setSd(standardDeviation);
  };

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

  const handleReset = () => {
    setSelectedValues([]);
    setCheckBox(!checkBox);
    setCagr(0);
    setSd(0);
  };

  const handleCheckbox = () => {
    setCheckBox(!checkBox);
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
                  onChange={() => {
                    addRemoveSelectedValues(scaledValues[index], index);
                  }}
                  className="CompanyTable-checkbox"
                  disabled={!checkBox}
                  style={{
                    backgroundColor: !checkBox ? "red" : "transparent", // Changes the background color when not disabled
                    cursor: !checkBox ? "not-allowed" : "pointer", // Change cursor style when disabled
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <Button variant="contained" onClick={addScaledReturns}>
          Calculate all Scaled Returns
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleCheckbox();
            calculateScaledReturns();
          }}
        >
          Calculate selected Scaled Returns
        </Button>
      </div>
      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <div>
          <label>CAGR: </label>
          <span>{cagr}</span>
        </div>
        <div>
          <label>SD: </label>
          <span>{sd}</span>
        </div>
      </div>
      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <Button variant="contained">Save</Button>
        <Button variant="contained" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CompanyTable;
