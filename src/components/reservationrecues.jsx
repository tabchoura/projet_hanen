import React, { useEffect, useState } from "react";
import "../styles/reservationsrecues.css";

export default function ReservationRecues() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchReservations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("✅ Réservations reçues :", data);

      if (!Array.isArray(data)) throw new Error("Réponse invalide");
      setReservations(data);
    } catch (err) {
      console.error("❌ Erreur récupération des réservations :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) return <p>Chargement des réservations...</p>;
  if (!Array.isArray(reservations)) return <p>Erreur lors du chargement.</p>;
  if (reservations.length === 0) return <p>Aucune réservation reçue.</p>;

  return (
    <div className="reservations-recues">
      <h2>Réservations reçues</h2>
       <div className="scrollable-section">

      <ul>
        {reservations.map((res) => (
          <li key={res._id}>
            <p><strong>Nom Client :</strong> {res.nomClient || "N/A"}</p>
            <p><strong>Prénom :</strong> {res.prenomClient || "N/A"}</p>
            <p><strong>Voiture :</strong> {res.vehicleName}</p>
            <p><strong>Lieu :</strong> {res.location}</p>
            <p><strong>Date :</strong> {res.date}</p>
            <p><strong>Départ :</strong> {res.heureDepart}</p>
            <p><strong>Retour :</strong> {res.heureRetour}</p>
            <p><strong>Réservé le :</strong> {new Date(res.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
