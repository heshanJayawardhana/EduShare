const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    role: { type: String, required: true, enum: ["student", "admin"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

