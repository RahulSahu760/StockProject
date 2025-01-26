const Company = require("../Models/Company");

const addCompanies = async (req, res) => {
  const companiesData = req.body;

  if (!Array.isArray(companiesData) || companiesData.length === 0) {
    return res.status(400).send({
      message: "Invalid data format. Expected an array of companies.",
    });
  }

  for (let company of companiesData) {
    const { name, code, cagr, sd, returns, scaledReturns } = company;

    if (!name || !code || !returns || !scaledReturns) {
      return res.status(400).send({
        message: "Invalid data format. Expected an array of companies.",
      });
    }

    const duplicate = await Company.findOne({ code });
    if (duplicate) {
      return res.status(400).send({ message: "Duplicate company code.", code });
    }
  }
  try {
    const companies = await Company.insertMany(companiesData);
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = { addCompanies, getCompanies };
