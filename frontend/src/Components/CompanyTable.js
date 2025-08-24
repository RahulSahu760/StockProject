import React from "react";
import "./CompanyTable.css";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const CompanyTable = ({ data }) => {
  const returns = data?.returns || [];
  const scaledValues = data?.scaledReturns || [];

  const [selectedValues, setSelectedValues] = React.useState([]);
  const [checkBox, setCheckBox] = React.useState(true);
  const [currentCagr, setCurrentCagr] = React.useState(0);
  const [currentSd, setCurrentSd] = React.useState(0);
  const [cagr, setCagr] = React.useState(0);
  const [sd, setSd] = React.useState(0);
  const [average, setAverage] = React.useState([]);
  const [diff, setDiff] = React.useState([]);
  const [sq, setSq] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (data) {
      setCurrentCagr(data.cagr);
      setCurrentSd(data.sd);
    }
    setCagr(0);
    setSd(0);
    setAverage([]);
    setDiff([]);
    setSq([]);
    setSelectedValues([]);
    setCheckBox(true);
  }, [data]);

  const calculateScaledReturns = async (scaledReturns) => {
    if (scaledReturns.length > 1) {
      //calculaing CAGR
      let multipliedValue = 1;
      for (let i = 0; i < scaledReturns.length; i++) {
        console.log(scaledReturns[i], "*", multipliedValue);
        multipliedValue = multipliedValue * scaledReturns[i];
        console.log("multipliedValue", multipliedValue);
      }
      const cagr = Math.pow(multipliedValue, 1 / scaledReturns.length);
      console.log("cagr", cagr);

      //calculating Standard Deviation
      let total = 0;
      for (let i = 0; i < scaledReturns.length; i++) {
        total += scaledReturns[i];
      }
      const avg = total / scaledReturns.length;
      setAverage((prevAvg) => {
        const newValues = Array(scaledReturns.length).fill(avg);
        return [...prevAvg, ...newValues];
      });
      setDiff((prevDiff) => {
        const newValues = Array.from(
          { length: scaledReturns.length },
          (v, index) => {
            return avg - scaledReturns[index];
          }
        );
        return [...prevDiff, ...newValues];
      });
      setSq((prevSq) => {
        const newValues = scaledReturns.map((value) => {
          return Math.pow(value - avg, 2);
        });
        return [...prevSq, ...newValues];
      });
      let total2 = 0;
      for (let i = 0; i < scaledReturns.length; i++) {
        total2 += Math.pow(scaledReturns[i] - avg, 2);
      }
      const standardDeviation = Math.pow(
        total2 / (scaledReturns.length - 1),
        1 / 2
      );
      console.log("sd", standardDeviation);
      return { cagr, standardDeviation };
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

    setSelectedValues(updatedValues);
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

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/companies/update-cagr-and-sd/${data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cagr, sd }),
        }
      );

      if (response.ok) {
        console.log("Saved");
        setCurrentCagr(cagr);
        setCurrentSd(sd);
      } else {
        console.log("Not saved");
      }
      setCheckBox(!checkBox);
      setSelectedValues([]);
      setCagr(0);
      setSd(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Continer">
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
      ) : (
        <div className="CompanyTable-container">
          <table className="CompanyTable-table">
            <thead>
              <tr className="CompanyTable-headerRow">
                <th
                  className="CompanyTable-headerCell"
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Name: {data?.name || "N/A"}
                </th>
                <th
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
              <tr>
                <td
                  className="CompanyTable-dataCell"
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  <span style={{ fontWeight: "bold" }}>Current CAGR:</span>{" "}
                  {currentCagr || "N/A"}
                </td>
                <td
                  className="CompanyTable-dataCell"
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    Current Standard Deviation:
                  </span>{" "}
                  {currentSd || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <p>
              <span style={{ fontStyle: "italic" }}>Note: </span>If no
              checkboxes are selected, pressing the "Calculate Scaled Returns"
              button will calculate the results for all records. If specific
              checkboxes are selected, it will calculate the results only for
              those selected values.
            </p>
          </div>
          <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
            <Button
              variant="contained"
              onClick={() => {
                handleCheckbox();
                addScaledReturns();
              }}
              disabled={!checkBox}
            >
              Calculate Scaled Returns
            </Button>
            {/* <Button
          variant="contained"
          onClick={() => {
            handleCheckbox();
            addScaledReturns();
          }}
        >
          Calculate selected Scaled Returns
        </Button> */}
          </div>
          <div>
            <table
              border="1"
              style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
            >
              <thead>
                <tr>
                  <th>Scaled Returns (SR)</th>
                  <th>Average (A)</th>
                  <th>A - SR</th>
                  <th>(A - SR)^2</th>
                </tr>
              </thead>
              <tbody>
                {selectedValues.length > 0 &&
                selectedValues.length === average.length &&
                selectedValues.length === diff.length &&
                selectedValues.length === sq.length
                  ? selectedValues.map((value, index) => (
                      <tr key={index}>
                        <td>{value || "N/A"}</td>{" "}
                        {/* Assuming value.value holds the scaled return */}
                        <td>{average[index] || "N/A"}</td>
                        <td>{diff[index] || "N/A"}</td>
                        <td>{sq[index] || "N/A"}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
            <div
              style={{ borderRight: "1px solid black", paddingRight: "20px" }}
            >
              <label style={{ fontWeight: "bold" }}>CAGR: </label>
              <span>{cagr}</span>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>
                SD {"("}
                <span>{"\u03C3"}</span>
                {")"}:
              </label>{" "}
              <span>{sd}</span>
            </div>
          </div>
          <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="contained" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
