import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/adminvehicles.css";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: "", type: "", price: "", description: "", imageFile: null
  });
  const [editId, setEditId] = useState(null);
  const formRef = useRef(null);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/vehicules`);
      setVehicles(res.data);
    } catch (err) {
      console.error("Erreur de récupération :", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData(prev => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("price", formData.price);
      data.append("description", formData.description);
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }

      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/vehicules/${editId}`, data);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/vehicules`, data);
      }

      setFormData({ name: "", type: "", price: "", description: "", imageFile: null });
      setEditId(null);
      fetchVehicles();
    } catch (err) {
      console.error("Erreur d'envoi :", err.response?.data || err.message || err);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      price: vehicle.price,
      description: vehicle.description,
      imageFile: null,
    });
    setEditId(vehicle._id);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce véhicule ?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/vehicules/${id}`);
        fetchVehicles();
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  return (
    <div className="admin-vehicles">
      <h2>Gestion des voitures</h2>
      <div className="scrollable-section">

        <form
          className="vehicle-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          ref={formRef}
        >
          <h3>{editId ? "Modifier un véhicule" : "Ajouter un nouveau véhicule"}</h3>

          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom" required />
          <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" required />
          <input name="price" value={formData.price} type="number" onChange={handleChange} placeholder="Prix" required />
          <input type="file" name="imageFile" accept="image/*" onChange={handleChange} required={!editId} />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
          <button type="submit">{editId ? "Modifier" : "Ajouter"}</button>

          {editId && (
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setEditId(null);
                setFormData({ name: "", type: "", price: "", description: "", imageFile: null });
              }}
            >
              Annuler la modification
            </button>
          )}
        </form>

        <div className="table-container">
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Nom</th><th>Type</th><th>Prix</th><th>Description</th><th>Image</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id}>
                  <td style={{ color: "black" }}>{v.name}</td>
                  <td style={{ color: "black" }}>{v.type}</td>
                  <td style={{ color: "black" }}>{v.price} TND</td>
                  <td style={{ color: "black" }}>{v.description}</td>
                  <td><img src={`http://localhost:5000${v.image}`} alt={v.name} width="80" /></td>
                  <td>
                    <button onClick={() => handleEdit(v)}>✏️</button>
                    <button onClick={() => handleDelete(v._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
