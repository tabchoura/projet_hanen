const express = require("express");
const router = express.Router();
const Reclamation = require("../models/reclamation");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { sujet, message } = req.body;
    const { id, nom, prenom } = req.user;

    if (!sujet || !message) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const newRec = new Reclamation({
      userId: id,
      nomClient: nom,
      prenomClient: prenom,
      sujet,
      message
    });

    await newRec.save();
    res.status(201).json({ message: "Réclamation envoyée avec succès." });
  } catch (err) {
    console.error("❌ Erreur enregistrement réclamation :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const reclamations = await Reclamation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit : admin requis" });
    }

    const reclamations = await Reclamation.find().sort({ createdAt: -1 });
    res.status(200).json(reclamations);
  } catch (err) {
    console.error("Erreur récupération réclamations :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
