import React from "react";
import "../styles/contact.css";

export default function Contact() {
  return (
    <div className="contact-static-container">
      <h2>📞 Contactez-nous</h2>
      <p>
        Pour toute question, suggestion ou demande d'information, n'hésitez pas
        à nous contacter.
      </p>
      <p>
        ✉️ Email :{" "}
        <a href="mailto:contact@contact.com" className="contact-link">
          contact@contact.com
        </a>
      </p>
      <p>📍 Adresse : 123 Rue de la Location, Tunis, Tunisie</p>
      <p>📱 Téléphone : +216 12 345 678</p>
    </div>
  );
}
