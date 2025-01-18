const Company = require("../Models/Company");

const addCompanies = async (req, res) => {
  const { name, code, returns } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!code) {
    return res.status(400).json({ message: "Code is required" });
  }
  if (!returns) {
    return res.status(400).json({ message: "Returns is required" });
  }
  //check if company already exists
  const duplicate = await Company.findOne({ code });
  if (duplicate) {
    return res.status(400).json({ message: "Company already exists" });
  }
  try {
    const company = new Company({ name, code, returns });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addCompanies, getCompanies };
