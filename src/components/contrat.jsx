import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/contrat.css";

export default function Contrat() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation;
  console.log("🎯 Reservation reçue dans le contrat :", reservation);

  if (!reservation) {
    return <p>Aucune réservation sélectionnée.</p>;
  }

  //  Fonction pour obtenir le montant depuis différentes propriétés possibles
  const getMontant = () => {
    // Vérifier toutes les propriétés possibles pour le prix
    if (reservation.price) return reservation.price;
    if (reservation.montant) return reservation.montant;
    if (reservation.prix) return reservation.prix;
    if (reservation.tarif) return reservation.tarif;
    if (reservation.cost) return reservation.cost;
    
    return 100;
  };

  const montantEstime = getMontant();
  const caution = 200;
  const totalAPayer = montantEstime + caution;

  console.log("💰 Propriétés de réservation disponibles :", Object.keys(reservation));
  console.log("💰 Montant calculé :", montantEstime);

  const contratContent = (
    <div className="contrat-container">
                         <div className="scrollable-section">

      <h2>📄 Contrat de Réservation</h2>

      <div className="contrat-details">
        <p><strong>Client :</strong> {reservation.nomClient} {reservation.prenomClient}</p>
        <p><strong>Voiture :</strong> {reservation.vehicleName}</p>
        <p><strong>Lieu :</strong> {reservation.location}</p>
        <p><strong>Date :</strong> {reservation.date}</p>
        <p><strong>Heure de départ :</strong> {reservation.heureDepart}</p>
        <p><strong>Heure de retour :</strong> {reservation.heureRetour}</p>
        <p><strong>Date de réservation :</strong> {new Date(reservation.createdAt).toLocaleString()}</p>
      </div>

      <div className="paiement-section">
        <h3>💳 Paiement</h3>
        
        <div className="montant-details">
          <p><strong>Montant location :</strong> {montantEstime} TND</p>
          <p><strong>Caution :</strong> {caution} TND</p>
          <p><strong>Total à payer :</strong> {totalAPayer} TND</p>
        </div>

        <button
          className="payer-button"
          onClick={() =>
            navigate("/dashboardclient/paiement", { 
              state: { 
                reservation,
                montant: montantEstime,
                total: totalAPayer
              } 
            })
          }
        >
          Payer maintenant - {totalAPayer} TND
        </button>
      </div>

    
    </div>
    </div>
  );

  return contratContent;
}