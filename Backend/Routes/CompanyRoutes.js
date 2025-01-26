const express = require("express");
const router = express.Router();
const {
  addCompanies,
  getCompanies,
  updateCagrAndSd,
} = require("../Controllers/CompanyController.js");

// add companies
router.post("/add", addCompanies);
// fetch all companies
router.get("/fetch", getCompanies);
// update cagr and sd
router.patch("/update-cagr-and-sd/:id", updateCagrAndSd);
// fetch company by id
// update company by id
// delete company by id

module.exports = router;
