import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mescontrats.css";

export default function MesContrats() {
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

 fetch("http://localhost:5000/api/contrats/mes", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(async (res) => {
    const text = await res.text(); 
    console.log("🔁 Réponse brute :", text);
    if (!res.ok) throw new Error("Erreur lors du chargement");
    const data = JSON.parse(text);
    setContrats(data);
  })

      .catch((err) => {
        console.error("❌ Erreur récupération contrats :", err);
        setError("Impossible de récupérer vos contrats.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePayer = (contrat) => {
    navigate("/paiement", { state: { contrat } });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;
  if (contrats.length === 0) return <p>Vous n'avez aucun contrat enregistré.</p>;

  return (
    <div className="mes-contrats">
                     <div className="scrollable-section">

      <h2>📄 Mes Contrats</h2>
      <ul>
        {contrats.map((contrat) => (
          <li key={contrat._id} className="contrat-card">
            <p><strong>Voiture :</strong> {contrat.vehicleName}</p>
            <p><strong>Date :</strong> {contrat.dateReservation}</p>
            <p><strong>Heure Départ :</strong> {contrat.heureDepart}</p>
            <p><strong>Heure Retour :</strong> {contrat.heureRetour}</p>
            <p><strong>Lieu :</strong> {contrat.location}</p>
            <p><strong>Montant :</strong> {contrat.montantTotal} TND</p>
            <p><strong>Statut Paiement :</strong> 
              <span className={contrat.statutPaiement === "payé" ? "statut-paye" : "statut-attente"}>
                {contrat.statutPaiement}
              </span>
            </p>
            {contrat.statutPaiement !== "payé" && (
              <button className="btn-payer" onClick={() => handlePayer(contrat)}>💳 Payer maintenant</button>
            )}
          </li>
        ))}
      </ul>
    </div>
   </div> 
  );
}
