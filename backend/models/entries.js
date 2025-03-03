const mongoose = require("mongoose");

const qaTestingSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  weekSelection: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  itemList: [{ itemName: { type: String, required: true }, hours: { type: Number, required: true } }],
});

const developmentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  projectName: { type: String, required: true },
  technology: { type: String, required: true },
  milestone: { type: String, required: true },
  duration: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  generatedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const digitalMarketingSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    // vertical: { type: String, required: true },
    milestone: { type: String, required: true },
    duration: {
      from: { type: Date, required: true },
      to: { type: Date, required: true }
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    generatedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const QATestingForm = mongoose.model("QATestingForm", qaTestingSchema);
const DevelopmentForm = mongoose.model("DevelopmentForm", developmentSchema);
const DigitalMarketingForm = mongoose.model("DigitalMarketingForm", digitalMarketingSchema);

module.exports = { QATestingForm, DevelopmentForm, DigitalMarketingForm };
