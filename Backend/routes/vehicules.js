const express = require("express");
const router = express.Router();
const Vehicule = require("../models/vehicule");
const multer = require("multer");
const path = require("path");

// Configuration du stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads", "images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//  GET - récupérer tous les véhicules
router.get("/", async (req, res) => {
  try {
    const data = await Vehicule.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  POST - ajouter un véhicule avec image
router.post("/", upload.single("image"), async (req, res) => {
  const { name, type, price, description } = req.body;
  const imagePath = req.file ? `/uploads/images/${req.file.filename}` : "";

  const v = new Vehicule({
    name,
    type,
    price,
    description,
    image: imagePath,
  });

  try {
    await v.save();
    res.status(201).json(v);
  } catch (err) {
    console.error("Erreur lors de l'ajout :", err);
    res.status(500).json({ message: "Erreur lors de l'ajout du véhicule" });
  }
});

// ✅ PUT - modifier un véhicule avec ou sans nouvelle image
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, type, price, description } = req.body;
  const updateData = { name, type, price, description };

  if (req.file) {
    updateData.image = `/uploads/images/${req.file.filename}`;
  }

  try {
    const v = await Vehicule.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(v);
  } catch (err) {
    console.error("Erreur modification :", err);
    res.status(500).json({ message: "Erreur lors de la modification du véhicule" });
  }
});

//  DELETE - supprimer un véhicule
router.delete("/:id", async (req, res) => {
  try {
    await Vehicule.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error("Erreur suppression :", err);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
});

//  GET - récupérer un seul véhicule par son ID
router.get("/:id", async (req, res) => {
  try {
    const vehicule = await Vehicule.findById(req.params.id);
    if (!vehicule) {
      return res.status(404).json({ message: "Véhicule non trouvé" });
    }
    res.json(vehicule);
  } catch (err) {
    console.error("Erreur récupération :", err);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
});

module.exports = router;
