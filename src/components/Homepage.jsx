import { Link } from "react-router-dom";
export default function Homepage() {
  return (
    <>
      <div className="promo">
        <span className="car-icon">🚗</span>
        <span>
          Offre Spéciale Été ! -25% sur toutes les locations en Tunisie jusqu'au 30 juillet !
        </span>
        <br />
        <span>Réservez dès maintenant et profitez des meilleurs tarifs !</span>
      </div>

      <main>
        <section className="hero-section">
          <div className="hero-text">
            <h1 className="title">
              Bienvenue sur LocationAuto – votre agence de location de voitures en Tunisie
            </h1>
            <p className="custom-paragraph">
              Notre plateforme est moderne et fiable. Louez une voiture en quelques clics !
            </p>

            <Link to="/flotte" className="btn-primary">
              🚗 Voir les véhicules
            </Link>
          </div>

          <img
            src="/public/images/acceuil.jpg"
            alt="Clés de voiture"
            className="hero-img-outside"
          />
        </section>
      </main>
    </>
  );
}
