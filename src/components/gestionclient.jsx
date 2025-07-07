import React, { useEffect, useState } from "react";
import "../styles/gestionclients.css";

export default function GestionClients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("❗ Supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Utilisateur supprimé.");
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert("❌ Erreur : " + data.message);
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur réseau");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="gestion-clients">
      <h2>👥 Liste des clients</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            <p><strong>Nom :</strong> {u.nom}</p>
            <p><strong>Prénom :</strong> {u.prenom}</p>
            <p><strong>Email :</strong> {u.email}</p>
            <p><strong>CIN :</strong> {u.cin}</p>
            <p><strong>Téléphone :</strong> {u.phone}</p>
            <p><strong>Date de naissance :</strong> {u.dateNaissance?.slice(0, 10)}</p>
            <p><strong>Type de permis :</strong> {u.typePermis}</p>
            <p><strong>Numéro de permis :</strong> {u.numeroPermis}</p>
            <p><strong>Numéro de carte :</strong> {u.numeroCarte}</p>
            <p><strong>Nom sur la carte :</strong> {u.nomCarte}</p>
            <button onClick={() => handleDelete(u._id)}>❌ Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
