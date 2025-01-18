const express = require("express");
const router = express.Router();
const {
  addCompanies,
  getCompanies,
} = require("../Controllers/CompanyController.js");

// add companies
router.post("/add", addCompanies);
// fetch all companies
router.get("/fetch", getCompanies);
// fetch company by id
// update company by id
// delete company by id

module.exports = router;
