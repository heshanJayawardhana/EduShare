const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    date: { type: String, required: true },
    resourceName: { type: String, required: true },
    resourceId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ["pending", "verified", "paid"], default: "pending" },
    buyerId: { type: String, required: true, index: true },
    sellerId: { type: String, required: true, index: true },

    // Payment metadata (demo-level; no real card storage)
    paymentMethod: { type: String, enum: ["card", "paypal"], required: false },
    cardLast4: { type: String, required: false },
    expiryMonth: { type: Number, required: false },
    expiryYear: { type: Number, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);

