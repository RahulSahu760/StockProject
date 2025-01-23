import React, { useState, useMemo } from "react";
import { useTable } from "react-table";
import "./CompanyTable.css";

const CompanyTable = ({ data, onScaledValueChange }) => {
  console.log("Data", data);
  const [selectedScaledValues, setSelectedScaledValues] = useState([]);

  const handleCheckboxChange = (value) => {
    const updatedValues = selectedScaledValues.includes(value)
      ? selectedScaledValues.filter((val) => val !== value)
      : [...selectedScaledValues, value];
    setSelectedScaledValues(updatedValues);
    onScaledValueChange(updatedValues);
  };
  console.log("selectedScaledValues", selectedScaledValues);

  const dataArray = useMemo(() => [data], [data]);

  const columns = useMemo(
    () => [
      {
        Header: "Company Name",
        accessor: "name",
      },
      {
        Header: "Company Code",
        accessor: "code",
      },
      {
        Header: "Returns",
        accessor: "returns",
        Cell: ({ value }) => (
          <ul>
            {value.map((returnVal, index) => (
              <li key={index}>{returnVal}</li>
            ))}
          </ul>
        ),
      },
      {
        Header: "Scaled Returns",
        accessor: "scaledReturns",
        Cell: ({ value }) => (
          <ul>
            {value.map((scaledReturn, index) => (
              <li key={`${scaledReturn}-${index}`}>
                <label>
                  <input
                    type="checkbox"
                    value={scaledReturn}
                    checked={selectedScaledValues.includes(
                      `${scaledReturn}-${index}`
                    )}
                    onChange={() =>
                      handleCheckboxChange(`${scaledReturn}-${index}`)
                    }
                  />
                  {scaledReturn}
                </label>
              </li>
            ))}
          </ul>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: dataArray });

  return (
    <div className="CalculationTable-container">
      <table {...getTableProps()} className="CalculationTable-table">
        <thead className="CalculationTable-thead">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="CalculationTable-headerRow"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="CalculationTable-headerCell"
                  style={{
                    backgroundColor: "black",
                  }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="CalculationTable-tbody">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="CalculationTable-row">
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="CalculationTable-cell"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;
