import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faIdCard,
  faPhone,
  faLock,
  faCar,
  faEnvelope,
  faBirthdayCake,
  faEye,
  faEyeSlash,
  faUserShield,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/register.css";

function Inscription() {
  const [formData, setFormData] = useState({
    role: "client",
    nom: "",
    prenom: "",
    cin: "",
    email: "",
    password: "",
    phone: "",
    typePermis: "",
    numeroPermis: "",
    dateNaissance: "",
    numeroCarte: "",
    nomCarte: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nom":
      case "prenom":
      case "nomCarte":
        if (!value.trim()) error = "Ce champ est requis.";
        break;
      case "cin":
      case "numeroPermis":
      case "numeroCarte":
        if (!/^\d{8}$/.test(value)) error = "8 chiffres requis.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email invalide.";
        break;
      case "password":
        if (value.length < 8) error = "Au moins 8 caractères, majuscules, minuscules, chiffres et spéciaux";
        break;
      case "typePermis":
        if (!value) error = "Sélectionnez un type.";
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

      case "phone":

        if (!value) error = "Téléphone requis.";
        break;



        
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumericField = ["cin", "numeroPermis", "numeroCarte"];
    const cleanedValue = isNumericField.includes(name) ? value.replace(/\D/g, "").slice(0, 8) : value;

    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    validateField(name, cleanedValue);
  };

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phone }));
    validateField("phone", phone);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
      if (value === "") newErrors[key] = "Ce champ est requis.";
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage("❌ Veuillez corriger les erreurs du formulaire.");
      return;
    }

    try {
await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      setMessage("✅ Inscription réussie !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("❌ Erreur : " + (error.response?.data?.message || error.message));
    }
  };

  const renderInput = (name, type, placeholder, icon, title) => (
    <div className="input-group">
      <label htmlFor={name} className="label-with-icon" title={title}>
        <FontAwesomeIcon icon={icon} className="fa-icon" />
        {placeholder}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        inputMode={["cin", "numeroPermis", "numeroCarte"].includes(name) ? "numeric" : "text"}
        maxLength={["cin", "numeroPermis", "numeroCarte"].includes(name) ? 8 : undefined}
        className={errors[name] ? "input-error" : ""}
      />
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="inscription-container">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="role" className="label-with-icon">
            <FontAwesomeIcon icon={faUserShield} className="fa-icon" />
            Rôle
          </label>
          <select name="role" id="role" value={formData.role} onChange={handleChange}>
            <option value="client">Client</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        {renderInput("nom", "text", "Nom", faUser, "Exemple : Dupont")}
        {renderInput("prenom", "text", "Prénom", faUser, "Exemple : Jean")}
        {renderInput("cin", "text", "CIN", faIdCard, "8 chiffres")}
        {renderInput("email", "email", "Email", faEnvelope, "exemple@email.com")}

        <div className="input-group password-group">
          <label htmlFor="password" className="label-with-icon">
            <FontAwesomeIcon icon={faLock} className="fa-icon" />
            Mot de passe
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          <span className="toggle-password" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="phone" className="label-with-icon">
            <FontAwesomeIcon icon={faPhone} className="fa-icon" />
            Téléphone
          </label>
          <PhoneInput
            country={"tn"}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%" }}
            inputClass={errors.phone ? "input-error" : ""}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="typePermis" className="label-with-icon">
            <FontAwesomeIcon icon={faCar} className="fa-icon" />
            Type de permis
          </label>
          <select name="typePermis" id="typePermis" value={formData.typePermis} onChange={handleChange}>
            <option value="">Type de permis</option>
            <option value="A">A - Moto</option>
            <option value="B">B - Voiture</option>
            <option value="C">C - Camion</option>
            <option value="D">D - Bus</option>
          </select>
          {errors.typePermis && <span className="error-text">{errors.typePermis}</span>}
        </div>

        {renderInput("numeroPermis", "text", "Numéro de permis", faIdCard)}
        {renderInput("dateNaissance", "date", "Date de naissance", faBirthdayCake)}

        {/* <div className="facturation-section">
          <h3>Coordonnées de facturation</h3>
          <p className="info-facturation">Aucun paiement ne sera débité au moment de l’adhésion.</p>
          <div className="cartes-images">
            <img src="/images/visa.png" alt="Visa" />
            <img src="/images/mastercard.png" alt="MasterCard" />
            <img src="/images/paypal.png" alt="PayPal" />
            <img src="/images/e-dinar.jpg" alt="e-Dinar" />
          </div>
        </div> */}

        {renderInput("numeroCarte", "text", "Numéro de carte", faCreditCard)}
        {renderInput("nomCarte", "text", "Nom sur la carte", faUser)}

        <button type="submit">S'inscrire</button>
      </form>

      {message && <p className="message">{message}</p>}
      <p className="retour">⬅ Retour à la connexion</p>
    </div>
  );
}

export default Inscription;
