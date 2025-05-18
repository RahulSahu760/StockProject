const Company = require("../Models/Company");

const addCompanies = async (req, res) => {
  const companiesData = req.body;

  if (!Array.isArray(companiesData) || companiesData.length === 0) {
    return res.status(400).send({
      message: "Invalid data format. Expected an array of companies.",
    });
  }

  for (let company of companiesData) {
    const { name, code, cagr, sd, returns, scaledReturns, shareDetails } =
      company;

    if (!name || !code || !returns || !scaledReturns) {
      return res.status(400).send({
        message: "Invalid data format. Expected an array of companies.",
      });
    }

    const duplicate = await Company.findOne({ code });
    if (duplicate) {
      return res.status(400).send({ message: "Duplicate company code.", code });
    }

    if (shareDetails && Array.isArray(shareDetails)) {
      for (let share of shareDetails) {
        const { date, rate, quantity, totalValue, weightage } = share;
        if (
          !date ||
          typeof rate !== "number" ||
          typeof quantity !== "number" ||
          typeof totalValue !== "number" ||
          typeof weightage !== "number"
        ) {
          return res.status(400).send({
            message: `Invalid shareDetails entry for company: ${name}. Ensure all fields are present and valid.`,
          });
        }
        if (isNaN(new Date(date).getTime())) {
          return res.status(400).send({
            message: `Invalid data format in shareDetails for company: ${name}.`,
          });
        }
      }
    } else if (shareDetails !== undefined && !Array.isArray(shareDetails)) {
      return res.status(400).send({
        message: `Invalid data format in shareDetails for company: ${name}.`,
      });
    }
  }
  try {
    const companiesWithDefaults = companiesData.map((company) => ({
      ...company,
      shareDetails:
        company.shareDetails?.map((share) => ({
          date: share.date,
          rate: share.rate,
          quantity: share.quantity,
          totalValue: share.totalValue,
          weightage: share.weightage,
        })) || [],
    }));
    const companies = await Company.insertMany(companiesWithDefaults);
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

const updateCagrAndSd = async (req, res) => {
  const { id } = req.params;
  const { cagr, sd } = req.body;

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }

    company.cagr = cagr;
    company.sd = sd;

    await company.save();

    res.status(200).json({ message: "CAGR and SD updated successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const updateWeightage = async (req, res) => {
  const updatedCompanies = req.body;

  if (!Array.isArray(updatedCompanies) || updatedCompanies.length === 0) {
    return res.status(400).send({
      message: "Invalid data format. Expected an array of companies.",
    });
  }

  try {
    const bulkUpdates = updatedCompanies.map((company) => ({
      updateOne: {
        filter: { code: company.code },
        update: { $set: { shareDetails: company.shareDetails } },
      },
    }));

    const result = await Company.bulkWrite(bulkUpdates);
    res
      .status(200)
      .json({ message: "Weightage updated successfully", updatedCompanies });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating weightage", error: error.message });
  }
};

const addReturnValues = async (req, res) => {
  const { code } = req.params;
  const { returns, scaledReturns } = req.body;

  try {
    const company = await Company.findOne({ code });
    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }
    company.returns.push(...returns);
    company.scaledReturns.push(...scaledReturns);
    await company.save();
    res.status(200).json({ message: "Return values added successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = {
  addCompanies,
  getCompanies,
  updateCagrAndSd,
  updateWeightage,
  addReturnValues,
};
