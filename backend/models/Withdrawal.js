const mongoose = require("mongoose");

const WithdrawalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    sellerId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ["completed", "failed"], default: "completed" },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", WithdrawalSchema);

