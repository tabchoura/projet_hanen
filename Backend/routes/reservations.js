const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const authMiddleware = require("../middleware/auth.middleware");

//  Ajouter une réservation
router.post("/", authMiddleware, async (req, res) => {
  const {
    userId,
    nomClient,
    prenomClient,
    vehicleId,
    vehicleName,
    location,
    date,
    heureDepart,
    heureRetour,
    price 
  } = req.body;

  try {
    const reservation = new Reservation({
      userId,
      nomClient,
      prenomClient,
      vehicleId,
      vehicleName,
      location,
      date,
      heureDepart,
      heureRetour,
      price 
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ message: "Erreur serveur lors de la création" });
  }
});

// Récupérer les réservations du client connecté
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.find({ userId }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    console.error("Erreur récupération client :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//  Récupérer toutes les réservations (admin)
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//  Modifier une réservation
router.put("/:id", authMiddleware, async (req, res) => {
  const { date, heureDepart, heureRetour } = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { date, heureDepart, heureRetour },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.json(reservation);
  } catch (error) {
    console.error("Erreur modification :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//  Supprimer une réservation
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
