// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "manager"],
      default: "staff",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
