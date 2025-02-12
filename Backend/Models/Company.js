const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    cagr: {
      type: Number,
    },
    sd: {
      type: Number,
    },
    returns: {
      type: [Number],
      default: [],
      required: true,
    },
    scaledReturns: {
      type: [Number],
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);
