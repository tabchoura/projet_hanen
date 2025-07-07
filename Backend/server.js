const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const reservationRoutes = require("./routes/reservations");
const reclamationRoutes = require("./routes/reclamations");
const userRoutes = require("./routes/users");
const contratsRoute = require("./routes/contrats");
const vehiculeRoutes = require("./routes/vehicules");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/autoapp")
.then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur MongoDB :", err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/vehicules", vehiculeRoutes);    // ✅ Correspond à votre frontend
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reclamations", reclamationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contrats", contratsRoute);

const PORT = 5000;
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));