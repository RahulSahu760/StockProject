const express = require("express");
const router = express.Router();
const {
  addCompanies,
  getCompanies,
  updateCagrAndSd,
  updateWeightage,
  addReturnValues,
  updateReturnValues,
} = require("../Controllers/CompanyController.js");

// add companies
router.post("/add", addCompanies);
// fetch all companies
router.get("/fetch", getCompanies);
// update cagr and sd
router.patch("/update-cagr-and-sd/:id", updateCagrAndSd);
// update weightage
router.patch("/update-weightage", updateWeightage);
/// add return values of exisiting companies
router.post("/add-return-values/:code", addReturnValues);
// update return values of exisiting companies
router.patch("/update-return-values/:code", updateReturnValues);
// fetch company by id
// update company by id
// delete company by id

module.exports = router;
