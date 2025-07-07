import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleData } from "../data/vehiculedata";
import "../styles/reserver.css";

export default function Reserver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    heureDepart: "",
    heureRetour: ""
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Vérifier si l'ID est valide (ObjectId MongoDB = 24 caractères hex)
        if (!id || (id.length !== 24 && !/^[0-9a-fA-F]{24}$/.test(id))) {
          // Si c'est un ID statique (comme "1"), utiliser les données locales
          const localVehicle = vehicleData.find(v => v.id.toString() === id);
          if (localVehicle) {
            setVehicle(localVehicle);
            setLoading(false);
            return;
          }
          throw new Error("ID de véhicule invalide");
        }

        // ✅ Requête API pour les véhicules de la base
        const response = await fetch(`${import.meta.env.VITE_API_URL}/vehicules/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Véhicule introuvable");
          }
          throw new Error(`Erreur serveur: ${response.status}`);
        }
        
        const data = await response.json();
        setVehicle(data);
        
      } catch (err) {
        console.error("❌ Erreur lors de la récupération du véhicule :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour réserver.");
      return;
    }

    const { location, date, heureDepart, heureRetour } = formData;
    const nomClient = localStorage.getItem("nomClient");
    const prenomClient = localStorage.getItem("prenomClient");
    const userId = localStorage.getItem("userId");

    if (!location || !date || !heureDepart || !heureRetour || !userId || !nomClient || !prenomClient) {
      alert("❌ Veuillez remplir tous les champs de réservation.");
      return;
    }

    const reservationData = {
      userId,
      nomClient,
      prenomClient,
      vehicleId: vehicle._id || vehicle.id,
      vehicleName: vehicle.name,
      location,
      date,
      heureDepart,
      heureRetour,
      price: vehicle.price,
    };

    try {
      console.log("📤 Données envoyées :", reservationData);

      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reservationData)
      });

      if (response.ok) {
        alert("✅ Réservation enregistrée avec succès !");
        navigate("/dashboardclient/mesreservations");
      } else {
        const errorData = await response.json();
        alert("❌ Erreur : " + errorData.message);
      }

    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("❌ Erreur lors de l'envoi de la réservation.");
    }
  };

  // ✅ Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="reserver-container">
        <div className="loading-spinner">
          <p>🔄 Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reserver-container">
        <div className="error-message">
          <h2>❌ Erreur</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/flotte")} className="back-btn">
            Retour à la flotte
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="reserver-container">
        <div className="error-message">
          <h2>❌ Véhicule introuvable</h2>
          <p>Le véhicule demandé n'existe pas.</p>
          <button onClick={() => navigate("/flotte")} className="back-btn">
            Retour à la flotte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reserver-container">
      <div className="scrollable-section">
        <h2>Réservation de : {vehicle.name}</h2>
        <div className="vehicle-details">
          <img
            src={vehicle.image?.startsWith("/uploads/") 
              ? `http://localhost:5000${vehicle.image}`
              : vehicle.image}
            alt={vehicle.name}
            className="vehicle-img"
          />
          <p><strong>Description :</strong> {vehicle.description}</p>
          <p><strong>Prix :</strong> {vehicle.price} TND / jour</p>
        </div>

        <form onSubmit={handleSubmit} className="reserver-form">
          <label>Localisation</label>
          <input
            name="location"
            placeholder="Ex: Tunis, Ariana..."
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Heure de départ</label>
          <input
            type="time"
            name="heureDepart"
            value={formData.heureDepart}
            onChange={handleChange}
            required
          />

          <label>Heure de retour</label>
          <input
            type="time"
            name="heureRetour"
            value={formData.heureRetour}
            onChange={handleChange}
            required
          />

          <button type="submit">Réserver</button>
        </form>
      </div>
    </div>
  );
}