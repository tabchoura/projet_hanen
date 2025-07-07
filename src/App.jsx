import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";

import Homepage from "./components/Homepage";
import Flotte from "./components/flotte";
import Login from "./components/Login";
import Register from "./components/register";
import DashboardLayout from "./components/dashboardclient";
import ProfileClient from "./components/profileclient";
import MesReservations from "./components/mesreservations";
import Reclamation from "./components/reclamation";
import Reserver from "./components/reserver";
import ProfileAdmin from "./components/profileadmin";
import Dashboardadmin from "./components/dashboardadmin";
import AdminVehicles from "./components/AdminVehicles";
import ReservationRecues from "./components/reservationrecues";
import ReclamationsRecues from "./components/reclamationsrecues";
import GestionClients from "./components/gestionclient";
import Contrat from "./components/contrat";
import Paiement from "./components/paiement";
import MesContrats from "./components/mescontrats";
import ContratsRecus from "./components/contratsrecues";
import BonPlan from "./components/bonplan";
import Apropos from "./components/apropos";
import Contact from "./components/contact";

import "./styles/App.css";

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);
  const navigate = useNavigate();

  const handleLoginClick = () => {
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
        console.error("❌ Erreur de décodage du token :", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">🚗 LocationAuto</Link>
        <div className="nav-links">
 <div
      className="menu-wrapper"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >            <button className="menu-link" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} /> Menu
            </button>
            <div className={`Menu-Sidebar ${showMenu ? "active" : ""}`}>
              <ul>
                <li><Link to="/flotte">🚗 Flotte</Link></li>
                                <li><Link to="/apropos">ℹ️ À propos de nous</Link></li>

                <li><Link to="/bonplan">💸 Bons plans</Link></li>
                
                <li><Link to="/contact">📞 Contact</Link></li>
                <li><Link to="/register">🛒 Créer votre compte</Link></li>
                <li>
                  <button className="menu-link" onClick={handleLoginClick}>
                    <FontAwesomeIcon icon={faUser} /> Se connecter
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/flotte" element={<Flotte />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bonplan" element={<BonPlan />} />

        {/* DASHBOARD CLIENT */}
        <Route path="/dashboardclient" element={<DashboardLayout />}>
          <Route path="profile" element={<ProfileClient />} />
          <Route path="cars" element={<Flotte />} />
          <Route path="reserver/:id" element={<Reserver />} />
          <Route path="mesreservations" element={<MesReservations />} />
          <Route path="reclamation" element={<Reclamation />} />
            <Route path="contrat" element={<Contrat />} />
  <Route path="paiement" element={<Paiement />} />

  <Route path="mescontrats" element={<MesContrats />} /> ✅ c’est parfait !
        </Route>

        {/*  DASHBOARD ADMIN */}
        <Route path="/dashboardadmin" element={<Dashboardadmin />}>
          <Route path="profileadmin" element={<ProfileAdmin />} />
          <Route path="voitures" element={<AdminVehicles />} />
          <Route path="reservationsrecues" element={<ReservationRecues />} />
          <Route path="reclamationsrecues" element={<ReclamationsRecues />} />
          <Route path="gestionclients" element={<GestionClients />} />
          <Route path="contratsrecues" element={<ContratsRecus />} />
        </Route>
      </Routes>
    </>
  );
}
