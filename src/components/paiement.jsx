import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/paiement.css";

export default function Paiement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation, montant = 100, total = 300 } = location.state || {};

  const [formData, setFormData] = useState({
    methodePaiement: "carte",
    numeroCard: "",
    expirationMois: "",
    expirationAnnee: "",
    cvv: "",
    nomTitulaire: "",
    accepteConditions: false,
    cin: "",
    dateNaissance: "",
    permisNumero: "",
    permisType: "B",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // console.log("🔍 Données reçues dans Paiement :", {
  //   reservation,
  //   montant,
  //   total,
  //   fullState: location.state
  // });

  if (!reservation) {
    return (
      <div className="paiement-container">
        <h2>❌ Erreur</h2>
        <p>Aucune réservation trouvée.</p>
        <button className="btn-retour" onClick={() => navigate("/dashboardclient/mesreservations")}>
          Retour aux réservations
        </button>
      </div>
    );
  }

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nomTitulaire":
        if (!value.trim()) error = "Ce champ est requis.";
        break;
      case "cin":
      case "permisNumero":
        if (!/^\d{8}$/.test(value)) error = "8 chiffres requis.";
        break;
      case "dateNaissance":
        if (!value) {
          error = "Date de naissance requise.";
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();

          const isUnder18 = age < 18 || (age === 18 && m < 0) || (age === 18 && m === 0 && today.getDate() < birthDate.getDate());

          if (isUnder18) {
            error = "Vous devez avoir au moins 18 ans.";
          }
        }
        break;
      case "permisType":
        if (!value) error = "Sélectionnez un type de permis.";
        break;
      case "numeroCard":
        if (formData.methodePaiement === "carte" && !/^\d{16}$/.test(value.replace(/\s/g, ""))) {
          error = "16 chiffres requis pour le numéro de carte.";
        }
        break;
      case "cvv":
        if (formData.methodePaiement === "carte" && !/^\d{3}$/.test(value)) {
          error = "3 chiffres requis pour le CVV.";
        }
        break;
      case "expirationMois":
      case "expirationAnnee":
        if (formData.methodePaiement === "carte" && !value) {
          error = "Date d'expiration requise.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "cin" || name === "permisNumero") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
    } else if (name === "numeroCard") {
      newValue = value.replace(/\D/g, "").slice(0, 16);
    } else if (name === "cvv") {
      newValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (type !== "checkbox") {
      validateField(name, newValue);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    const requiredFields = [
      "cin", "dateNaissance", "permisNumero", "permisType"
    ];

    if (formData.methodePaiement === "carte") {
      requiredFields.push("nomTitulaire", "numeroCard", "expirationMois", "expirationAnnee", "cvv");
    }

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "Ce champ est requis.";
        isValid = false;
      } else {
        const fieldValid = validateField(field, formData[field]);
        if (!fieldValid) {
          isValid = false;
        }
      }
    });

    if (!formData.accepteConditions) {
      newErrors.accepteConditions = "Vous devez accepter les conditions.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("❌ Veuillez corriger les erreurs du formulaire.");
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      
      const contratData = {
        reservationId: reservation._id || reservation.id,
        cin: formData.cin,
        dateNaissance: formData.dateNaissance,
        permisNumero: formData.permisNumero,
        permisType: formData.permisType,
        vehicleId: reservation.vehicleId || reservation.vehicule?.id || "vehicule_non_specifie",
        vehicleName: reservation.vehicleName || reservation.vehicule?.nom || reservation.nomVehicule || "Véhicule non spécifié",
        dateReservation: reservation.date || reservation.dateReservation,
        heureDepart: reservation.heureDepart || reservation.heureDebut,
        heureRetour: reservation.heureRetour || reservation.heureFin,
        location: reservation.location || reservation.lieu || "Lieu non spécifié",
        montantTotal: total,
        modePaiement: formData.methodePaiement.charAt(0).toUpperCase() + formData.methodePaiement.slice(1),
      };

      // console.log("Données envoyées au serveur :", contratData);

      // Vérification des champs requis côté client
      const requiredFields = ['reservationId', 'cin', 'dateNaissance', 'permisNumero', 'vehicleId'];
      const missingFields = requiredFields.filter(field => !contratData[field]);
      
      if (missingFields.length > 0) {
        console.error("❌ Champs manquants :", missingFields);
        alert(`❌ Erreur : Champs manquants - ${missingFields.join(', ')}`);
        return;
      }

      const res = await fetch("http://localhost:5000/api/contrats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contratData),
      });

      const data = await res.json();
      
      // console.log("📥 Réponse du serveur :", { status: res.status, data });

      if (res.ok) {
        alert("✅ Contrat enregistré avec succès !");
        navigate("/dashboardclient/mescontrats");
      } else {
        console.error("❌ Erreur serveur :", data);
        alert("❌ Erreur : " + (data.message || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("❌ Erreur paiement :", err);
      alert("❌ Erreur lors du paiement : " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="paiement-container">
      <h2>💳 Paiement de la Réservation</h2>

      <div className="resume-reservation">
        <h3>📋 Résumé de votre réservation</h3>
        <div className="resume-details">
          <p><strong>Véhicule :</strong> {reservation.vehicleName || reservation.nomVehicule || "Non spécifié"}</p>
          <p><strong>Date :</strong> {reservation.date ? new Date(reservation.date).toLocaleDateString("fr-FR") : "Non spécifiée"}</p>
          <p><strong>Horaire :</strong> {reservation.heureDepart || "Non spécifiée"} - {reservation.heureRetour || "Non spécifiée"}</p>
          <p><strong>Lieu :</strong> {reservation.location || reservation.lieu || "Non spécifié"}</p>
        </div>
      </div>

      <div className="details-paiement">
        <h3>💰 Détails du Paiement</h3>
        <div className="montant-breakdown">
          <div className="ligne-montant"><span>Location :</span><span>{montant} TND</span></div>
          <div className="ligne-montant"><span>Caution :</span><span>200 TND</span></div>
          <div className="ligne-montant total"><span><strong>Total :</strong></span><span><strong>{total} TND</strong></span></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="paiement-form">
        <div className="form-group">
          <label>CIN :</label>
          <input
            type="text"
            name="cin"
            value={formData.cin}
            onChange={handleInputChange}
            inputMode="numeric"
            maxLength="8"
            placeholder="8 chiffres"
            className={errors.cin ? "input-error" : ""}
            required
          />
          {errors.cin && <span className="error-text">{errors.cin}</span>}
        </div>

        <div className="form-group">
          <label>Date de naissance :</label>
          <input
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleInputChange}
            className={errors.dateNaissance ? "input-error" : ""}
            required
          />
          {errors.dateNaissance && <span className="error-text">{errors.dateNaissance}</span>}
        </div>

        <div className="form-group">
          <label>Numéro de permis :</label>
          <input
            type="text"
            name="permisNumero"
            value={formData.permisNumero}
            onChange={handleInputChange}
            inputMode="numeric"
            maxLength="8"
            placeholder="8 chiffres"
            className={errors.permisNumero ? "input-error" : ""}
            required
          />
          {errors.permisNumero && <span className="error-text">{errors.permisNumero}</span>}
        </div>

        <div className="form-group">
          <label>Type de permis :</label>
          <select
            name="permisType"
            value={formData.permisType}
            onChange={handleInputChange}
            className={errors.permisType ? "input-error" : ""}
            required
          >
            <option value="">Sélectionnez un type</option>
            <option value="A">A - Moto</option>
            <option value="B">B - Voiture</option>
            <option value="C">C - Camion</option>
            <option value="D">D - Bus</option>
          </select>
          {errors.permisType && <span className="error-text">{errors.permisType}</span>}
        </div>

        <h3>💳 Informations de Paiement</h3>

        <div className="form-group">
          <label>Méthode de paiement :</label>
          <select
            name="methodePaiement"
            value={formData.methodePaiement}
            onChange={handleInputChange}
            required
          >
            <option value="carte">Carte bancaire</option>
            <option value="paypal">PayPal</option>
            <option value="virement">Virement bancaire</option>
          </select>
        </div>

        {formData.methodePaiement === "carte" && (
          <>
            <div className="form-group">
              <label>Nom du titulaire :</label>
              <input
                type="text"
                name="nomTitulaire"
                value={formData.nomTitulaire}
                onChange={handleInputChange}
                className={errors.nomTitulaire ? "input-error" : ""}
                required
              />
              {errors.nomTitulaire && <span className="error-text">{errors.nomTitulaire}</span>}
            </div>

            <div className="form-group">
              <label>Numéro de carte :</label>
              <input
                type="text"
                name="numeroCard"
                value={formData.numeroCard}
                onChange={handleInputChange}
                inputMode="numeric"
                maxLength="16"
                placeholder="16 chiffres"
                className={errors.numeroCard ? "input-error" : ""}
                required
              />
              {errors.numeroCard && <span className="error-text">{errors.numeroCard}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mois d'expiration :</label>
                <select
                  name="expirationMois"
                  value={formData.expirationMois}
                  onChange={handleInputChange}
                  className={errors.expirationMois ? "input-error" : ""}
                  required
                >
                  <option value="">Mois</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.expirationMois && <span className="error-text">{errors.expirationMois}</span>}
              </div>

              <div className="form-group">
                <label>Année d'expiration :</label>
                <select
                  name="expirationAnnee"
                  value={formData.expirationAnnee}
                  onChange={handleInputChange}
                  className={errors.expirationAnnee ? "input-error" : ""}
                  required
                >
                  <option value="">Année</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={2024 + i}>
                      {2024 + i}
                    </option>
                  ))}
                </select>
                {errors.expirationAnnee && <span className="error-text">{errors.expirationAnnee}</span>}
              </div>

              <div className="form-group">
                <label>CVV :</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  maxLength="3"
                  placeholder="3 chiffres"
                  className={errors.cvv ? "input-error" : ""}
                  required
                />
                {errors.cvv && <span className="error-text">{errors.cvv}</span>}
              </div>
            </div>
          </>
        )}

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="accepteConditions"
              checked={formData.accepteConditions}
              onChange={handleInputChange}
              required
            />
            <span>J'accepte les conditions de paiement et la politique de remboursement</span>
          </label>
          {errors.accepteConditions && <span className="error-text">{errors.accepteConditions}</span>}
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboardclient/contrat", { state: { reservation } })}
          >
            Retour au contrat
          </button>
          <button type="submit" className="btn-primary" disabled={isProcessing}>
            {isProcessing ? "Traitement en cours..." : `Payer ${total} TND`}
          </button>
        </div>
      </form>

      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-message">
            <div className="spinner"></div>
            <p>Traitement de votre paiement en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
}