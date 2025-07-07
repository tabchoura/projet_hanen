import React, { useEffect, useState } from "react";
import "../styles/profileadmin.css";
import axios from "axios";

export default function ProfileAdmin() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/profileadmin`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdmin(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEightDigits = (val) => /^\d{8}$/.test(val);
    if (
      !isEightDigits(formData.cin) ||
      !isEightDigits(formData.numeroPermis) ||
      !isEightDigits(formData.numeroCarte)
    ) {
      alert("🚫 CIN, Numéro de permis et Numéro de carte doivent contenir 8 chiffres.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profileadmin`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmin(response.data);
      setIsEditing(false);
      alert("✅ Profil mis à jour avec succès !");
    } catch (error) {
      console.error("❌ Erreur mise à jour :", error.response?.data || error.message);
      alert("❌ Une erreur est survenue lors de la mise à jour du profil.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!admin) return <p>Erreur lors du chargement du profil.</p>;

  return (
    <div className="profile-container">
      <h2>Profil Administrateur</h2>

      {!isEditing ? (
        <div className="profile-section">
          <p><strong>Nom :</strong> {admin.nom}</p>
          <p><strong>Prénom :</strong> {admin.prenom}</p>
          <p><strong>Email :</strong> {admin.email}</p>
          <p><strong>CIN :</strong> {admin.cin}</p>
          <p><strong>Téléphone :</strong> {admin.phone}</p>
          <p><strong>Date de naissance :</strong> {admin.dateNaissance?.slice(0, 10)}</p>
          <p><strong>Type de permis :</strong> {admin.typePermis}</p>
          {/* <p><strong>Numéro de permis :</strong> {admin.numeroPermis}</p>
          <p><strong>Numéro de carte :</strong> {admin.numeroCarte}</p> */}
          <p><strong>Nom sur la carte :</strong> {admin.nomCarte}</p>

          <button className="edit-button" onClick={() => setIsEditing(true)}>
            ✏️ Modifier mon profil
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
          <input name="typePermis" value={formData.typePermis || ""} onChange={handleChange} placeholder="Type de permis" />
          <input name="numeroPermis" value={formData.numeroPermis || ""} onChange={handleChange} placeholder="Numéro de permis" />
          {/* <input name="numeroCarte" value={formData.numeroCarte || ""} onChange={handleChange} placeholder="Numéro de carte" />
          <input name="nomCarte" value={formData.nomCarte || ""} onChange={handleChange} placeholder="Nom sur la carte" /> */}

          <button type="submit">💾 Enregistrer</button>
          <button type="button" onClick={() => setIsEditing(false)}>❌ Annuler</button>
        </form>
      )}
    </div>
  );
}
