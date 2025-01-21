import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";

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
  const [expanded, setExpanded] = useState(false);
  const [fields, setFields] = useState([
    { name: "", code: "", returns: [], scaledReturns: [] },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addField = () => {
    setFields([
      ...fields,
      { name: "", code: "", returns: [], scaledReturns: [] },
    ]);
  };

  const addReturnField = (index) => {
    const updatedFields = [...fields];
    updatedFields[index].returns.push(0);
    setFields(updatedFields);
  };

  const handleReturnChange = (fieldIndex, returnIndex, event) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].returns[returnIndex] = event.target.value;
    setFields(updatedFields);
  };

  const handleChange = (index, event, field) => {
    const updatedFields = [...fields];

    if (field === "name") {
      updatedFields[index].name = event.target.value;
    } else if (field === "code") {
      updatedFields[index].code = event.target.value;
    }

    setFields(updatedFields);
  };

  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const removeReturnField = (fieldIndex, returnIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].returns.splice(returnIndex, 1);
    setFields(updatedFields);
  };

  const calculateScaledReturn = (value) => {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) return 0;

    if (numericValue < 0) {
      return 1 - Math.abs(numericValue) / 100;
    } else {
      return 1 + numericValue / 100;
    }
  };

  const saveData = async () => {
    const updatedFields = fields.map((field) => {
      const scaledReturns = field.returns.map((value) =>
        calculateScaledReturn(value)
      );
      return { ...field, scaledReturns };
    });

    setFields(updatedFields);

    const isValid = updatedFields.every(
      (field) => field.scaledReturns.length === field.returns.length
    );

    if (!isValid) {
      console.error("Error: Scaled Returns are missing for some fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/companies/add`,
        updatedFields
      );
      console.log("Data saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
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
  console.log("Fields: ", fields);

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
      <div className="Accordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Add Company</Typography>
          </AccordionSummary>
          <div>
            <Button onClick={() => addField()}>{<AddIcon />}</Button>
          </div>
          <div>
            <AccordionDetails>
              {fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <div>
                    <span>Name</span>
                    <input
                      type="text"
                      value={field.name}
                      onChange={(event) =>
                        handleChange(fieldIndex, event, "name")
                      }
                    />
                    <span>Code</span>
                    <input
                      type="text"
                      value={field.code}
                      onChange={(event) =>
                        handleChange(fieldIndex, event, "code")
                      }
                    />
                    <div>
                      <Button onClick={() => removeField(fieldIndex)}>
                        {<RemoveIcon />}
                      </Button>
                    </div>
                    <span>Returns</span>
                    {field.returns.map((returnValue, returnIndex) => (
                      <div>
                        <div key={returnIndex}>
                          <input
                            type="Number"
                            placeholder={`Return ${returnIndex + 1}`}
                            value={returnValue}
                            onChange={(event) =>
                              handleReturnChange(fieldIndex, returnIndex, event)
                            }
                          />
                        </div>
                        <div>
                          <Button onClick={() => removeReturnField(fieldIndex)}>
                            Remove Return Value
                          </Button>
                        </div>
                      </div>
                    ))}{" "}
                    <div>
                      <div>
                        <Button onClick={() => addReturnField(fieldIndex)}>
                          Add Return Value
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </div>
        </Accordion>
      </div>
      <div>
        <Button onClick={saveData}>Confirm</Button>
      </div>
    </div>
  );
};

export default CompanyTable;
