const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

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
    shareDetails: [
      {
        id: {
          type: String,
          default: uuidv4,
        },
        date: {
          type: Date,
          required: true,
        },
        rate: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalValue: {
          type: Number,
          required: true,
        },
        weightage: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);
