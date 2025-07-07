import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/dashboardclient.css"
export default function DashboardLayout({ content }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>Mon Espace</h2>
        <nav className="dashboard-nav">
<Link to="profileadmin">👤 Mon Profil</Link>

<Link to="voitures">🚗 Gestion des voitures</Link>
<Link to="reservationsrecues">📅 Réservations recues</Link>
<Link to="gestionclients">👥 Gestion des clients</Link>

<Link to="reclamationsrecues">❗Réclamations Reçues</Link>
<Link to="contratsrecues"> 📄 Contrats Reçues</Link>

          <button onClick={handleLogout} className="logout-button">🚪 Déconnexion</button>
        </nav>
      </aside>

   <div className="admin-content">
        <Outlet /> {/* Ceci affiche le contenu de /dashboardadmin/profileadmin */}
      </div>

    </div>
  );
}
