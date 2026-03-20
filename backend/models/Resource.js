const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    uploadedBy: { type: String, required: true, index: true },
    status: { type: String, required: true, enum: ["pending", "verified", "rejected"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", ResourceSchema);

