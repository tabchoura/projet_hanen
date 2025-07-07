const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nomClient: { type: String, required: true },
  prenomClient: { type: String, required: true },
  
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  
  vehicleId: { type: String, required: true },
  vehicleName: { type: String, required: true },
  
  dateReservation: { type: String, required: true },
  heureDepart: { type: String, required: true },
  heureRetour: { type: String, required: true },
  location: { type: String, required: true },
  
  cin: { type: String, required: true },
  dateNaissance: { type: String, required: true },
  permisNumero: { type: String, required: true },
  permisType: { type: String, default: "B" },
  
  montantTotal: { type: Number, required: true },
  modePaiement: {
    type: String,
    enum: ["Carte", "Paypal", "Virement"],
    required: true,
  },
  statutPaiement: { 
    type: String, 
    enum: ["payé", "en attente", "échoué"], 
    default: "payé" 
  },
  
  dateCreation: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contrat', contratSchema);