import React from "react";
import "../styles/bonplan.css";

const bonsPlans = [
  {
    title: "Réduction en ligne",
    description: "Réservez sur notre site et bénéficiez de 15 % de réduction immédiate.",
    validity: "Valable jusqu'au 31 juillet 2025",
  },
  {
    title: "Offre longue durée",
    description: "Louez 7 jours ou plus et obtenez jusqu’à 20 % de remise.",
    validity: "Offre permanente",
  },
  {
    title: "Spécial week-end",
    description: "Profitez d’un tarif exclusif à partir de 89 TND pour 3 jours du vendredi au lundi.",
    validity: "Valable tous les week-ends",
  },
  {
    title: "Joyeux anniversaire",
    description: "-10 % sur votre location le jour de votre anniversaire (avec CIN).",
    validity: "Sur présentation d’une pièce d’identité",
  },
  {
    title: "Pack famille",
    description: "Louez un véhicule familial et bénéficiez d’un siège bébé gratuit.",
    validity: "Offre valable pendant les vacances scolaires",
  },
  
  {
    title: "Carte fidélité",
    description: "Profitez de 10 % de remise sur toutes vos locations avec notre carte pro.",
    validity: "Réservé aux membres fidèles",
  },
 
];

const BonsPlansSection = () => {
  return (
    <section className="bons-plans-section">
      <h2 className="bons-plans-title">Nos Bons Plans</h2>
      <div className="bons-plans-list">
        {bonsPlans.map((plan, index) => (
          <div className="bon-plan-card" key={index}>
            <h3 className="bon-plan-title">{plan.title}</h3>
            <p className="bon-plan-description">{plan.description}</p>
            <p className="bon-plan-validity">{plan.validity}</p>
            <button className="bon-plan-button">Profiter de l’offre</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BonsPlansSection;
