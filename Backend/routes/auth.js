const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");

// Enregistrement d'un nouvel utilisateur
router.post("/register", async (req, res) => {
const {
  nom, prenom, email, password, cin, phone,
  typePermis, numeroPermis, dateNaissance,
  numeroCarte, nomCarte, role
} = req.body;

  try {
    const emailExist = await User.findOne({ email });
    const cinExist = await User.findOne({ cin });

    if (emailExist || cinExist) {
      return res.status(400).json({ message: "Email ou CIN déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nom,
      prenom,
      email,
      cin,
      phone,
      typePermis,
      numeroPermis,
      dateNaissance,
      numeroCarte,
      nomCarte,
        role: role || "client",  
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "Compte créé avec succès !" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email incorrect ou non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
        cin: user.cin,
        phone: user.phone,
        typePermis: user.typePermis,
        numeroPermis: user.numeroPermis,
        dateNaissance: user.dateNaissance,
        numeroCarte: user.numeroCarte,
        nomCarte: user.nomCarte
      },
      "SECRET_TOKEN",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
  _id: user._id,  
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        cin: user.cin,
        phone: user.phone,
        typePermis: user.typePermis,
        numeroPermis: user.numeroPermis,
        dateNaissance: user.dateNaissance,
        numeroCarte: user.numeroCarte,
        nomCarte: user.nomCarte
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
router.get('/profileadmin', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const updateData = req.body;

    console.log("🛠 ID utilisateur :", userId);
    console.log("📦 Données reçues :", updateData);

    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur manquant" });
    }
console.log("🟡 Données reçues dans PUT /profile :", req.body);

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
      strict: false  
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ Erreur mise à jour profil :", err.stack);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil." });
  }
});

router.put("/profileadmin", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const updateData = req.body;

    console.log("🛠 ID utilisateur :", userId);
    console.log("📦 Données reçues :", updateData);

    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur manquant" });
    }
console.log("🟡 Données reçues dans PUT /profile :", req.body);

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
      strict: false  
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ Erreur mise à jour profil :", err.stack);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil." });
  }
});

// ADMIN – Obtenir tous les utilisateurs (clients)
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const users = await User.find({ role: "client" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Erreur récupération utilisateurs :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
//  Supprimer un utilisateur (ADMIN uniquement)
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    console.error("❌ Erreur suppression utilisateur :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
