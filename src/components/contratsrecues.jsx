import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/contratsrecues.css";

export default function ContratsRecus() {
  const [contrats, setContrats] = useState([]);

  useEffect(() => {
    const fetchContrats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/contrats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContrats(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération contrats :", err);
      }
    };

    fetchContrats();
  }, []);

  if (contrats.length === 0) {
    return (
      <div className="contratsrecus-container">
        <h2>📄 Contrats Reçus</h2>
        <p className="empty-state">Aucun contrat reçu pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="contratsrecus-container">
      <h2>📄 Contrats Reçus</h2>
                   <div className="scrollable-section">

      <div className="contrat-list">
        {contrats.map((contrat) => (
          <div key={contrat._id} className="contrat-card">
            <p>
              <strong>Client :</strong> {contrat.nomClient} {contrat.prenomClient}
            </p>
            <p>
              <strong>CIN :</strong> {contrat.cin}
            </p>
             <p>
              <strong>date naissance :</strong> {contrat.dateNaissance}
            </p>
             <p>
              <strong>Numero de permis  :</strong> {contrat.permisNumero}
            </p>
              <p>
              <strong>Type de permis  :</strong> {contrat.permisType}
            </p>
            <p>
              <strong>Voiture :</strong> {contrat.vehicleName}
            </p>
            <p>
              <strong>Lieu :</strong> {contrat.location}
            </p>
            <p>
              <strong>Date :</strong> {contrat.dateReservation}
            </p>
            <p>
              <strong>Mode de paiement :</strong> {contrat.modePaiement}
            </p>
            <p>
              <strong>Montant :</strong> {contrat.montantTotal} TND
            </p>
            
            <p>
              <strong>Statut :</strong>{" "}
              <span className={`badge ${contrat.statutPaiement === "payé" ? "badge-success" : "badge-pending"}`}>
                {contrat.statutPaiement || "En attente"}
              </span>
            </p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
