import React, { useState, useEffect } from "react";
import axios from "axios";
import FiltersFlotte from "./FiltersFlotte";
import VehicleGrid from "./VehicleGrid";
import { vehicleData } from "../data/vehiculedata";
import "../styles/Flotte.css";

function Flotte({ onReserve }) {
  const [selectedType, setSelectedType] = useState("Tous");
  const [dynamicVehicles, setDynamicVehicles] = useState([]);

  // Récupérer les véhicules depuis MongoDB
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/vehicules`)
      .then((res) => setDynamicVehicles(res.data))
      .catch((err) => console.error("Erreur chargement véhicules :", err));
  }, []);

  // Fusionner les deux listes
  const allVehicles = [...vehicleData, ...dynamicVehicles];

  // Appliquer le filtre
  const filteredVehicles =
    selectedType === "Tous"
      ? allVehicles
      : allVehicles.filter((v) => v.type === selectedType);

  return (
    <div className="flotte-container">
                         <div className="scrollable-section">

      <h2>🚗 Liste des voitures</h2>
      <FiltersFlotte
        selectedType={selectedType}
        onFilterChange={setSelectedType}
      />
      <VehicleGrid vehicles={filteredVehicles} onReserve={onReserve} />
    </div>
    </div>
  );
}

export default Flotte;
