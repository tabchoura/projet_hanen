const mongoose = require("mongoose");

const VehiculeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Vehicule", VehiculeSchema);