import React, { useEffect, useState } from "react";
import "../styles/profileclient.css";
import axios from "axios";

export default function ProfileClient() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        console.log("📤 Données envoyées au serveur :", formData);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClient(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple
    const isEightDigits = val => /^\d{8}$/.test(val);
    if (
      !isEightDigits(formData.cin) ||
      !isEightDigits(formData.numeroPermis) ||
      !isEightDigits(formData.numeroCarte)
    ) {
      alert("CIN, Numéro de permis et Numéro de carte doivent contenir 8 chiffres.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClient(response.data);
      setIsEditing(false);
      alert("✅ Profil mis à jour avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error.response?.data || error.message);
      alert("❌ Une erreur est survenue lors de la mise à jour du profil.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!client) return <p>Erreur lors du chargement du profil.</p>;

  return (
    <div className="profile-container">
      <h2>Mon Profil </h2>

      {!isEditing ? (
        <div className="profile-section">
          <p><strong>Nom :</strong> {client.nom}</p>
          <p><strong>Prénom :</strong> {client.prenom}</p>
          <p><strong>Email :</strong> {client.email}</p>
          <p><strong>CIN :</strong> {client.cin}</p>
          <p><strong>Téléphone :</strong> {client.phone}</p>
          <p><strong>Date de naissance :</strong> {client.dateNaissance?.slice(0, 10)}</p>
          <p><strong>Type de permis :</strong> {client.typePermis}</p>
          <p><strong>Numéro de permis :</strong> {client.numeroPermis}</p>
          <p><strong>Numéro de carte :</strong> {client.numeroCarte}</p>
          <p><strong>Nom sur la carte :</strong> {client.nomCarte}</p>

          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Modifier mon profil
          </button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <input name="nom" value={formData.nom || ""} onChange={handleChange} placeholder="Nom" />
          <input name="prenom" value={formData.prenom || ""} onChange={handleChange} placeholder="Prénom" />
          <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" />
          <input name="cin" value={formData.cin || ""} onChange={handleChange} placeholder="CIN" />
          <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Téléphone" />
          <input type="date" name="dateNaissance" value={formData.dateNaissance?.slice(0, 10) || ""} onChange={handleChange} />
          <input name="typePermis" value={formData.typePermis || ""} onChange={handleChange} placeholder="Type de permis (A, B, C...)" />
          <input name="numeroPermis" value={formData.numeroPermis || ""} onChange={handleChange} placeholder="Numéro de permis" />
          <input name="numeroCarte" value={formData.numeroCarte || ""} onChange={handleChange} placeholder="Numéro de carte" />
          <input name="nomCarte" value={formData.nomCarte || ""} onChange={handleChange} placeholder="Nom sur la carte" />

          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
        </form>
      )}
    </div>
  );
}
