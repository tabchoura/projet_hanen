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
          <Link to="/dashboardclient/profile">👤 Mon Profil</Link>
          <Link to="/dashboardclient/cars">🚗 Liste des voitures</Link>
          <Link to="/dashboardclient/mesreservations">📅 Mes réservations</Link>
          <Link to="/dashboardclient/reclamation">❗ Réclamation</Link>
<Link to="/dashboardclient/mescontrats"> 📄 Voir le contrat</Link>

          <button onClick={handleLogout} className="logout-button">🚪 Déconnexion</button>
        </nav>
      </aside>

      <div className="admin-content">
  <Outlet />
          </div>
    </div>
  );
}
