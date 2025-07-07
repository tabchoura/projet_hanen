const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_TOKEN"); // ou utilise process.env.JWT_SECRET
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erreur vérification token :", err);
    return res.status(403).json({ message: "Token invalide" });
  }
}

module.exports = authMiddleware;
