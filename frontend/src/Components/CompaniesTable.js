import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import Accordion from "@mui/material/Accordion";
// import AccordionActions from "@mui/material/AccordionActions";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import Button from "@mui/material/Button";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// const companies = [
//   { name: "Company A", returns: [-18.59, 83.92, 41.64, 81.66, 27.1] },
//   { name: "Company B", returns: [12.34, -45.67, 23.89, 67.89, 78.12] },
// ];

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [fields, setFields] = useState([{ name: "" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addField = () => {
    setFields([...fields, { name: "" }]);
  };

  const handleFieldChange = (index, event) => {
    const updatedFields = [...fields];
    updatedFields[index].name = event.target.value; // Update the specific field
    setFields(updatedFields);
  };

  const fetchAllCompanies = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/companies/fetch`);
      if (response.data) {
        setCompanies(response.data);
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllCompanies();
  }, []);
  console.log("Companies: ", companies);

  const maxReturnsLength = Math.max(
    ...companies.map((company) => company.returns.length)
  ); // stores length of each company's returns

  return (
    <div>
      <div className="Companies">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            {/* Table Header */}
            <TableHead>
              <TableRow>
                {companies.map((company, index) => (
                  <StyledTableCell key={index} align="center">
                    {company.name}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            {/* Table Body */}
            <TableBody>
              {/* For each row, loop through up to the longest array of returns */}
              {Array.from({ length: maxReturnsLength }).map((_, rowIndex) => (
                <StyledTableRow key={rowIndex}>
                  {companies.map((company, columnIndex) => (
                    <StyledTableCell key={columnIndex} align="center">
                      {company.returns[rowIndex] || "--"}{" "}
                      {/* Handle if a company has fewer return values */}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div>
        <h3>Dynamic Name Fields</h3>
        {fields.map((field, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <label>Name {index + 1}:</label>
            <input
              type="text"
              value={field.name}
              onChange={(event) => handleFieldChange(index, event)} // Handle change of each field
              placeholder={`Enter Name ${index + 1}`}
            />
          </div>
        ))}
        <button onClick={addField}>+ Add Name Field</button>
      </div>
    </div>
  );
};

export default CompanyTable;
