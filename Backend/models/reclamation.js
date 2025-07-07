const mongoose = require("mongoose");

const reclamationSchema = new mongoose.Schema({
  userId: { type: String },
  nomClient: { type: String },
  prenomClient: { type: String },
  sujet: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reclamation", reclamationSchema);
