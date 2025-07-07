const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  userId: String,
  nomClient: String,
  prenomClient: String,
  vehicleId: String,
  vehicleName: String,
  location: String,
  date: String,
  heureDepart: String,
  heureRetour: String,
  price: Number,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reservation", reservationSchema);
