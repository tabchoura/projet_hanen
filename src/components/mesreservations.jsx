import React, { useEffect, useState } from "react";
import "../styles/mesreservations.css";
import { useNavigate } from "react-router-dom";

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ date: "", heureDepart: "", heureRetour: "" });
const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchReservations = () => {
    fetch("http://localhost:5000/api/reservations/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("Réponse invalide du serveur");
        }
        setReservations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur récupération réservations :", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette réservation ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchReservations();
      } else {
        const err = await res.json();
        alert("Suppression échouée : " + err.message);
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEdit = (res) => {
    setEditId(res._id);
    setEditData({
      date: res.date,
      heureDepart: res.heureDepart,
      heureRetour: res.heureRetour
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setEditId(null);
        fetchReservations();
      } else {
        const err = await res.json();
        alert("Modification échouée : " + err.message);
      }
    } catch (err) {
      console.error("Erreur modification :", err);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!Array.isArray(reservations)) return <p>Erreur de données.</p>;
  if (reservations.length === 0) return <p>Vous n'avez pas encore de réservations.</p>;

  return (
    <div className="mes-reservations">
      <h2>Mes Réservations</h2>
                     <div className="scrollable-section">

      <ul>
        {reservations.map(res => (
          <li key={res._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
            {editId === res._id ? (
              <form onSubmit={handleEditSubmit}>
                <p><strong>Date :</strong> <input type="date" name="date" value={editData.date} onChange={handleEditChange} /></p>
                <p><strong>Départ :</strong> <input type="time" name="heureDepart" value={editData.heureDepart} onChange={handleEditChange} /></p>
                <p><strong>Retour :</strong> <input type="time" name="heureRetour" value={editData.heureRetour} onChange={handleEditChange} /></p>
                <button type="submit">💾 Enregistrer</button>{" "}
                <button type="button" onClick={() => setEditId(null)}>Annuler</button>
              </form>
            ) : (
              <>
                <p><strong>Voiture :</strong> {res.vehicleName}</p>
                <p><strong>Lieu :</strong> {res.location}</p>
                <p><strong>Date :</strong> {res.date}</p>
                <p><strong>Départ :</strong> {res.heureDepart}</p>
                <p><strong>Retour :</strong> {res.heureRetour}</p>
                <p><strong>Réservé le :</strong> {new Date(res.createdAt).toLocaleString()}</p>
<button onClick={() => handleEdit(res)}>✏️ Modifier</button>
<button className="red" onClick={() => handleDelete(res._id)}>🗑 Supprimer</button>

<button
  type="button"
  className="contrat-button"
  onClick={() => 
  navigate("/dashboardclient/contrat", { state: { reservation: res } })
  
  }
>
  📄 Passer au contrat
</button>




              </>
            )}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
