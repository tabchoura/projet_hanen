import React, { useState, useEffect } from "react";
import "../styles/LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role;
        if (role === "admin") {
          navigate("/dashboardadmin/profileadmin");
        } else {
          navigate("/dashboardclient/profile");
        }
      } catch (err) {
        console.error("Erreur décodage token :", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Veuillez remplir tous les champs.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
      setMessage("Connexion réussie !");
      setMessageType("success");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("nomClient", response.data.user.nom);
      localStorage.setItem("prenomClient", response.data.user.prenom);

      const role = response.data.user.role;

      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (onClose) {
        onClose();
      }

      if (role === "admin") {
        navigate("/dashboardadmin/profileadmin");
      } else {
        navigate("/dashboardclient/profile");
      }

    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}

        <h2>Se connecter</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
          />

          {message && <p className={`message ${messageType}`}>{message}</p>}

          <button type="submit">Se connecter</button>
        </form>

        <div className="register-link">
          <p>
            Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
