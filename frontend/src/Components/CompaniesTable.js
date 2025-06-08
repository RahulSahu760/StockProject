import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import "./CompaniesTable.css";
import { v4 as uuidv4 } from "uuid";

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
  const [alert, setAlert] = useState({ message: "", severity: "" }); //
  const [showAlert, setShowAlert] = useState(false);
  const [addReturnCompany, setAddReturnCompany] = useState("");
  const [editReturnCompany, setEditReturnCompany] = useState("");
  const [selectedCompanyReturns, setSelectedCompanyReturns] = useState([]);
  const [selectedCompanyScaledReturns, setSelectedCompanyScaledReturns] =
    useState([]);
  const [addReturnValues, setAddReturnValues] = useState([]);
  const [scaledValues, setScaledValues] = useState([]);
  const [aRV, setARV] = useState([{ index: 0, value: 0 }]);
  const [aSV, setASV] = useState([{ index: 0, value: 0 }]);
  const [save, setSave] = useState(false);
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

  const validateFields = () => {
    for (const field of fields) {
      for (const company of companies) {
        if (field.name === company.name || field.code === company.code) {
          setShowAlert(true);
          setAlert({
            message: `${field.name} is already present`,
            severity: "error",
          });
          return false;
        }
      }
      if (!field.name || !field.code) {
        setShowAlert(true);
        setAlert({ message: "Name and Code are required!", severity: "error" });
        return false;
      }
      if (field.returns.some((value) => isNaN(value) || value === "")) {
        setShowAlert(true);
        setAlert({ message: "Returns should be numbers!", severity: "error" });
        return false;
      }
    }
    return true;
  };

  const saveData = async () => {
    if (!validateFields()) return;
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
      setShowAlert(true);
      setAlert({ message: "Scaled Returns are missing", severity: "error" });
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/companies/add`,
        updatedFields
      );
      setShowAlert(true);
      setAlert({ message: "Data saved successfully", severity: "success" });
      setFields([{ name: "", code: "", returns: [], scaledReturns: [] }]);
      await fetchAllCompanies();
    } catch (error) {
      setShowAlert(true);
      setAlert({ message: error.response.data, severity: "error" });
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
  console.log("Add Return Company: ", addReturnCompany);
  console.log("Add Return Values: ", addReturnValues);
  console.log("Scaled Values: ", scaledValues);

  const maxReturnsLength = Math.max(
    ...companies.map((company) => company.returns.length)
  ); // stores length of each company's returns

  const handleReturnCompanyChange = (value) => {
    if (!value || value === "") return;
    setAddReturnCompany(value);
    setAddReturnValues(
      companies.find((company) => company.code === value).returns
    );
    setScaledValues(
      companies.find((company) => company.code === value).scaledReturns
    );
  };

  const addNewField = () => {
    const anfid = uuidv4();
    setARV([...aRV, { index: anfid, value: 0 }]);
    setASV([...aSV, { index: anfid, value: 0 }]);
  };

  const handleaRVChange = (index, value) => {
    setARV(
      aRV.map((item) => (item.index === index ? { ...item, value } : item))
    );
    const scaledValue = calculateScaledReturn(value);
    setASV(
      aSV.map((item) =>
        item.index === index ? { ...item, value: scaledValue } : item
      )
    );
  };
  console.log("ARV: ", aRV);
  console.log("ASV: ", aSV);

  const handleRemoveField = (index) => {
    if (!index) return;
    setARV(aRV.filter((item) => item.index !== index));
    setASV(aSV.filter((item) => item.index !== index));
  };

  const handleSaveaRV = async () => {
    if (!addReturnCompany) return;
    const saveReturn = aRV.map((item) => Number(item.value));
    const saveScaledReturn = aSV.map((item) => Number(item.value));

    try {
      const response = await axios.post(
        `${baseUrl}/api/companies/add-return-values/${addReturnCompany}`,
        {
          returns: saveReturn,
          scaledReturns: saveScaledReturn,
        }
      );
      if (response.status === 200) {
        setShowAlert(true);
        setAlert({
          message: "Data saved successfully",
          severity: "success",
        });
      }

      await fetchAllCompanies();
    } catch {
      setShowAlert(true);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";

      setAlert({ message, severity: "error" });
    }
  };

  const handleEditSelectedCompany = (value) => {
    setEditReturnCompany(value);
    setSelectedCompanyReturns(
      companies.find((company) => company.code === value).returns
    );
    setSelectedCompanyScaledReturns(
      companies.find((company) => company.code === value).scaledReturns
    );
  };

  const handleSaveEditReturnValues = async () => {
    console.log("newreturnValues", selectedCompanyReturns);
    console.log("newscaledValues", selectedCompanyScaledReturns);
    console.log("CompanyCode", editReturnCompany);
    if (!editReturnCompany) return;
    try {
      const response = await axios.patch(
        `${baseUrl}/api/companies/update-return-values/${editReturnCompany}`,
        {
          returns: selectedCompanyReturns,
          scaledReturns: selectedCompanyScaledReturns,
        }
      );
      if (response.status === 200) {
        setShowAlert(true);
        setAlert({
          message: "Data saved successfully",
          severity: "success",
        });
      }
      await fetchAllCompanies();
      setEditReturnCompany(null);
      setSelectedCompanyReturns([]);
      setSelectedCompanyScaledReturns([]);
    } catch {
      setShowAlert(true);
      setAlert({ message: error.response.data, severity: "error" });
    }
  };
  return (
    <div className="container">
      {alert.message && showAlert && (
        <Stack sx={{ width: "100%", mb: 2 }} spacing={2}>
          <Alert
            severity={alert.severity}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setShowAlert(false)}
              >
                Close
              </Button>
            }
          >
            {alert.message}
          </Alert>
        </Stack>
      )}
      <div className="companies-section">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            {/* Table Header */}
            <TableHead>
              <TableRow>
                {companies.map((company, index) => (
                  <StyledTableCell key={index} align="center" colSpan={2}>
                    {company.name}
                  </StyledTableCell>
                ))}
              </TableRow>
              <TableRow>
                {companies.map((_, index) => (
                  <>
                    <StyledTableCell key={`returns-${index}`} align="center">
                      Returns
                    </StyledTableCell>
                    <StyledTableCell
                      key={`scaledReturns-${index}`}
                      align="center"
                    >
                      Scaled Returns
                    </StyledTableCell>
                  </>
                ))}
              </TableRow>
            </TableHead>
            {/* Table Body */}
            <TableBody>
              {Array.from({ length: maxReturnsLength }).map((_, rowIndex) => (
                <StyledTableRow key={rowIndex}>
                  {companies.map((company, columnIndex) => (
                    <>
                      <StyledTableCell
                        key={`returns-${columnIndex}-${rowIndex}`}
                        align="center"
                      >
                        {company.returns[rowIndex] || "--"}
                      </StyledTableCell>
                      <StyledTableCell
                        key={`scaledReturns-${columnIndex}-${rowIndex}`}
                        align="center"
                        style={{ borderRight: "1px solid #ddd" }}
                      >
                        {company.scaledReturns[rowIndex] || "--"}
                      </StyledTableCell>
                    </>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="accordion-section">
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Add Company</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="accordion-buttons">
              <Button className="add-field-btn" onClick={() => addField()}>
                <AddIcon />
                Add New Field
              </Button>
            </div>
            {fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="field-container">
                <div className="field-inputs">
                  <span className="input-label">Name</span>
                  <input
                    className="input-field"
                    type="text"
                    value={field.name}
                    onChange={(event) =>
                      handleChange(fieldIndex, event, "name")
                    }
                  />
                  <span className="input-label">Code</span>
                  <input
                    className="input-field"
                    type="text"
                    value={field.code}
                    onChange={(event) =>
                      handleChange(fieldIndex, event, "code")
                    }
                  />
                  <Button
                    className="remove-field-btn"
                    onClick={() => removeField(fieldIndex)}
                  >
                    <RemoveIcon />
                    Remove Company
                  </Button>
                </div>
                <div className="returns-section">
                  <span className="input-label">Returns</span>
                  {field.returns.map((returnValue, returnIndex) => (
                    <div className="return-field" key={returnIndex}>
                      <input
                        className="input-return"
                        type="number"
                        placeholder={`Return ${returnIndex + 1}`}
                        value={returnValue}
                        onChange={(event) =>
                          handleReturnChange(fieldIndex, returnIndex, event)
                        }
                      />
                      <Button
                        className="remove-return-btn"
                        onClick={() => removeReturnField(fieldIndex)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="add-return-btn"
                    onClick={() => addReturnField(fieldIndex)}
                  >
                    Add Return Value
                  </Button>
                </div>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="confirm-section">
        <Button className="confirm-btn" onClick={saveData}>
          Confirm
        </Button>
      </div>
      <div className="accordion-section" style={{ marginTop: "20px" }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">
              Add Return Values To Existing Companies
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <select
              value={addReturnCompany}
              placeholder="Select a company"
              onChange={(e) => handleReturnCompanyChange(e.target.value)}
              style={{
                padding: "8px",
                fontSize: "16px",
                maxWidth: "300px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select a company</option>
              {companies.map((company, index) => (
                <option key={index} value={company.code}>
                  {company.name}
                </option>
              ))}
            </select>

            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                maxWidth: "600px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    Return Values for {addReturnCompany}
                  </th>
                </tr>
              </thead>
              <tbody>
                {addReturnValues?.map((value, index) => (
                  <tr key={index}>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                    >
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {addReturnCompany && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div>
                  <Button
                    onClick={addNewField}
                    style={{
                      padding: "6px 12px",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  >
                    Add Return Values
                  </Button>
                </div>

                {aRV?.map((field, index) => (
                  <div
                    key={field.index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <input
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        handleaRVChange(field.index, e.target.value)
                      }
                      style={{
                        padding: "6px 8px",
                        fontSize: "14px",
                        width: "120px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <Button
                      onClick={() => handleRemoveField(field.index)}
                      style={{ padding: "6px 12px", fontSize: "14px" }}
                    >
                      Remove Field
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={handleSaveaRV}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    alignSelf: "flex-start",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    borderRadius: "4px",
                    marginTop: "8px",
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="accordion-section" style={{ marginTop: "20px" }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Edit Return Values</Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <select
              value={editReturnCompany}
              placeholder="Select a company"
              onChange={(e) => handleEditSelectedCompany(e.target.value)}
              style={{
                padding: "8px",
                fontSize: "16px",
                maxWidth: "300px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select a company</option>
              {companies.map((company, index) => (
                <option key={index} value={company.code}>
                  {company.name}
                </option>
              ))}
            </select>

            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                maxWidth: "600px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    Return Values for {editReturnCompany}
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCompanyReturns?.map((value, index) => (
                  <tr key={index}>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                    >
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                          const updatedValues = [...selectedCompanyReturns];
                          updatedValues[index] = e.target.value;
                          setSelectedCompanyReturns(updatedValues);
                          const scaledValue = calculateScaledReturn(
                            e.target.value
                          );
                          const updatedScaledValues = [
                            ...selectedCompanyScaledReturns,
                          ];
                          updatedScaledValues[index] = scaledValue;
                          setSelectedCompanyScaledReturns(updatedScaledValues);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedCompanyReturns && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Button
                  onClick={handleSaveEditReturnValues}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    alignSelf: "flex-start",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    borderRadius: "4px",
                    marginTop: "8px",
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default CompanyTable;
