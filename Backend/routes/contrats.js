const express = require("express");
const router = express.Router();
const Contrat = require("../models/contrat"); // ✅ Nom correct avec majuscule
const authMiddleware = require("../middleware/auth.middleware");

// Créer un contrat
router.post("/", authMiddleware, async (req, res) => {
  console.log("➡️ Données reçues pour créer un contrat :", req.body);
  console.log("➡️ Utilisateur connecté :", req.user);

  try {
    const {
      reservationId,
      cin,
      dateNaissance,
      permisNumero,
      permisType,
      vehicleId,
      vehicleName,
      dateReservation,
      heureDepart,
      heureRetour,
      location,
      montantTotal,
      modePaiement
    } = req.body;

    //  Vérification des champs requis
    if (!reservationId || !cin || !dateNaissance || !permisNumero || !vehicleId) {
      return res.status(400).json({ 
        message: "Champs requis manquants",
        missing: { reservationId, cin, dateNaissance, permisNumero, vehicleId }
      });
    }

    //  Vérification que l'utilisateur est connecté
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const newContrat = new Contrat({
      userId: req.user.id,
      nomClient: req.user.nom || "Non spécifié",
      prenomClient: req.user.prenom || "Non spécifié",
      reservationId,
      cin,
      dateNaissance,
      permisNumero,
      permisType: permisType || "B",
      vehicleId,
      vehicleName,
      dateReservation,
      heureDepart,
      heureRetour,
      location,
      montantTotal,
      modePaiement,
      statutPaiement: "payé"
    });

    console.log("➡️ Contrat à sauvegarder :", newContrat);
    
    const savedContrat = await newContrat.save();
    
    console.log("✅ Contrat sauvegardé avec succès :", savedContrat);
    
    res.status(201).json({ 
      message: "Contrat créé avec succès", 
      contrat: savedContrat 
    });

  } catch (err) {
    console.error("❌ Erreur création contrat :", err);
    console.error("❌ Stack trace :", err.stack);
    
    //  Réponse d'erreur plus détaillée
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

//  Voir les contrats d'un client
router.get("/mes", authMiddleware, async (req, res) => {
  try {
    const contrats = await Contrat.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(contrats);
  } catch (err) {
    console.error("❌ Erreur récupération contrats :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//  Voir tous les contrats (ADMIN)
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès interdit" });
  }

  try {
    const contrats = await Contrat.find().sort({ createdAt: -1 });
    res.status(200).json(contrats);
  } catch (err) {
    console.error("❌ Erreur admin contrats :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;