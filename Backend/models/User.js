const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
    required: true
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  cin: {
  type: String,
  required: true,
  unique: true,
  match: /^\d{8}$/ // → exactement 8 chiffres
},




  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  typePermis: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
numeroPermis: {
  type: String,
  required: true,
  match: /^\d{8}$/
},
  dateNaissance: {
    type: Date,
    required: true
  },
  

numeroCarte: {
  type: String,
  required: true,
  match: /^\d{8}$/
},

  nomCarte: {
    type: String,
    required: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
