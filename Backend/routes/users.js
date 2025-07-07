const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");

// ADMIN – Obtenir tous les utilisateurs
router.get("/", authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès interdit" });
  }

  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur récupération utilisateurs :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
