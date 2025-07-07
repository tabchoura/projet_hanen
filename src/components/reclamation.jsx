import React, { useState, useEffect } from "react";
import "../styles/reclamation.css";

export default function Reclamation() {
  const [formData, setFormData] = useState({ sujet: "", message: "" });
  const [feedback, setFeedback] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mesReclamations, setMesReclamations] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  //  Fonction isolée pour recharger les réclamations
  const fetchReclamations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reclamations/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMesReclamations(data);
    } catch (err) {
      console.error("Erreur chargement réclamations :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReclamations();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sujet || !formData.message) {
      setFeedback("❌ Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reclamations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const html = await response.text();
        console.error("❌ Réponse inattendue :", html);
        setFeedback("❌ Erreur : réponse inattendue du serveur.");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setFeedback("✅ Votre réclamation a été envoyée avec succès !");
        setFormData({ sujet: "", message: "" });
        setShowForm(false);
        fetchReclamations(); // 🔁 recharge la liste sans rechargement de page
      } else {
        setFeedback("❌ " + (data.message || "Une erreur est survenue."));
      }
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
      setFeedback("❌ Erreur réseau : " + err.message);
    }
  };

  return (
    <div className="reclamation-container">
                           <div className="scrollable-section">

      <h2>Mes Réclamations</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : mesReclamations.length === 0 ? (
        <p>Aucune réclamation enregistrée.</p>
      ) : (
        <ul>
         <ul>
  {mesReclamations.map((rec) => (
    <li key={rec._id} className="reclamation-item">
      <p><strong>Sujet :</strong> {rec.sujet}</p>
      <p><strong>Message :</strong> {rec.message}</p>
      <p style={{ fontSize: "0.9em", color: "#777" }}>
        Envoyée le : {new Date(rec.createdAt).toLocaleString()}
      </p>
    </li>
  ))}
</ul>

        </ul>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginTop: "25px",
          padding: "10px 15px",
          background: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {showForm ? "Annuler" : "➕ Faire une réclamation"}
      </button>

      {showForm && (
        <form className="reclamation-form" onSubmit={handleSubmit}>
          <label htmlFor="sujet">Sujet</label>
          <input
            type="text"
            name="sujet"
            value={formData.sujet}
            onChange={handleChange}
            placeholder="Objet de votre réclamation"
          />

          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Décrivez votre problème ou retour"
          ></textarea>

          <button type="submit">Envoyer</button>
          {feedback && <div className="feedback">{feedback}</div>}
        </form>
      )}
    </div>
    </div>
  );
}
