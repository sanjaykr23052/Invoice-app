const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  nameOfClient: { type: String, required: true },
  nameOfProject: { type: String, required: true },
  nameOfTechnology: { type: String, required: true },
  nameOfMilestone: { type: String, required: true },
  estimatedDuration: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  invoiceGeneratedBy: { type: String, required: true },
  isRecurring: { type: Boolean, default: false }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
