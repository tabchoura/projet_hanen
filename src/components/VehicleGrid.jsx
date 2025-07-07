import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/VehicleCard.css";
import Login from "./Login";

export default function VehicleCard({ vehicle }) {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleReserve = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLogin(true);
    } else {
      // ✅ Vérifier que l'ID existe et est valide
      const vehicleId = vehicle._id || vehicle.id;
      
      // ✅ Vérifier que ce n'est pas un ID statique comme "1"
      if (!vehicleId || vehicleId === "1") {
        alert("❌ Erreur : ID de véhicule invalide. Veuillez contacter l'administrateur.");
        return;
      }
      
      console.log("🚗 Navigation vers véhicule ID:", vehicleId);
      navigate(`/dashboardclient/reserver/${vehicleId}`);
    }
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    const vehicleId = vehicle._id || vehicle.id;
    
    // ✅ Même vérification après login
    if (!vehicleId || vehicleId === "1") {
      alert("❌ Erreur : ID de véhicule invalide. Veuillez contacter l'administrateur.");
      return;
    }
    
    navigate(`/dashboardclient/reserver/${vehicleId}`);
  };

  if (!vehicle) return null;

  const imageUrl = vehicle.image?.startsWith("/uploads/")
    ? `http://localhost:5000${vehicle.image}`
    : vehicle.image;

  return (
    <div className="vehicle-card">
      <img src={imageUrl} alt={vehicle.name} className="vehicle-img" />
      <div className="vehicle-info">
        <h3 className="vehicle-name">{vehicle.name}</h3>
        <p className="vehicle-desc">{vehicle.description}</p>
        <br />
        <p className="vehicle-price">{vehicle.price} TND / jour</p>
        {/* ✅ Debug: Afficher l'ID pour vérifier */}
        <small style={{color: '#666'}}>ID: {vehicle._id || vehicle.id}</small>
      </div>

      <button className="voir-plus-btn" onClick={handleReserve}>
        Cliquez pour réserver
      </button>

      {showLogin && (
        <div className="login-overlay">
          <Login 
            onClose={handleCloseLogin}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}
    </div>
  );
}