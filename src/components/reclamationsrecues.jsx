import React, { useEffect, useState } from "react";
import "../styles/reclamationsrecues.css";

export default function ReclamationsRecues() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchReclamations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reclamations", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Réponse non valide");

      setReclamations(data);
    } catch (err) {
      console.error("❌ Erreur récupération :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (!Array.isArray(reclamations)) return <p>Erreur lors du chargement des données.</p>;
  if (reclamations.length === 0) return <p>Aucune réclamation reçue.</p>;

  return (
    <div className="reclamations-recues">
      <h2>📬 Réclamations reçues</h2>
             <div className="scrollable-section">

      <ul>
        {reclamations.map((rec) => (
          <li key={rec._id} className="reclamation-item">
            <p><strong>Nom :</strong> {rec.nomClient || "N/A"}</p>
            <p><strong>Prénom :</strong> {rec.prenomClient || "N/A"}</p>
            <p><strong>Sujet :</strong> {rec.sujet}</p>
            <p><strong>Message :</strong> {rec.message}</p>
            <p style={{ fontSize: "0.9em", color: "#777" }}>
              Envoyée le : {new Date(rec.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
