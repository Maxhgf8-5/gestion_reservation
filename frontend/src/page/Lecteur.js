import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";

const Lecteur = () => {
  const [lecteurs, setLecteurs] = useState([]);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState(null);
  const { idEdit } = useParams();
  useEffect(() => {
    api.get("/lecteur").then((res) => {
      setLecteurs(res.data.lecteurs);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const initialiserForm = () => {
    setFormData({
      name: "",
      email: "",
    });
  };
  // Ajouter un produit
  const ajouterLecteur = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (idEdit) {
        res = await api.put(`/lecteur/update/${idEdit}`, formData);
      } else {
        res = await api.post(`/lecteur/store`, formData);
      }
      // Mettre à jour le state avec le nouveau produit
      setLecteurs((prev) => [...prev, res.data.lecteur]);
      await api.get(`/lecteur`).then((r) => setLecteurs(r.data.lecteurs));
      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
      });
      setMessage(res.data.message);
      setTimeout(() => setErrors({}), 4000);
      setTimeout(() => setMessage(null), 5000);
      setStatus(1);
      navigate("/lecteur");
    } catch (error) {
      if (error.response) {
        setTimeout(() => setMessage(null), 5000);
        setTimeout(() => setErrors(null), 5000);
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          setMessage(error.response.data.message);
          setStatus(0);
        }
      } else {
        setTimeout(() => setMessage(null), 5000);
        setMessage("Erreur de connexion au serveur");
      }
    }
  };
  const supprimerLecteur = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce lecteur ?",
    );
    if (!confirmation) return; // si l'utilisateur annule, on arrête

    try {
      const res = await api.delete(`/lecteur/delete/${id}`);
      // Récupérer le message du backend
      setLecteurs((prev) => prev.filter((lecteur) => lecteur.id !== id));
      setStatus(res.data.status);
      setMessage(res.data.message);
      setTimeout(() => setErrors({}), 4000);
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      if (error.response) {
        setTimeout(() => setMessage(null), 5000);
        setTimeout(() => setErrors(null), 5000);
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          setMessage(error.response.data.message);
          setStatus(0);
        }
      } else {
        setTimeout(() => setMessage(null), 5000);
        setMessage("Erreur de connexion au serveur");
      }
    }
  };
  // function pour recharger le lecteur a editer
  useEffect(() => {
    if (idEdit) {
      api
        .get(`/lecteur/edit/${idEdit}`)
        .then((res) => {
          setFormData(res.data.lecteur);
        })
        .catch((err) => console.error(err));
    }
  }, [idEdit]);
  return (
    <div>
      <Navigation>
        <div className="page" id="page-commandes">
          {message && (
            <div
              style={{
                position: "fixed", // fixé à l’écran
                top: "40px", // marge en haut
                right: "20px", // marge à droite
                background: "#fff", // fond blanc pour contraste
                color: "#333", // texte sombre
                padding: "24px 50px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderLeft: `6px solid ${status === 1 ? "green" : "red"}`,
                maxWidth: "400px",
                zIndex: "10001",
              }}
            >
              {message}
            </div>
          )}
          {/* Header */}
          <div className="page-header">
            <div className="ph-left">
              <h1>Lecteurs</h1>
              <p>Suivi et gestion des lecteura.</p>
            </div>
            <div className="ph-actions">
              <button className="btn btn-primary">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nouveau Lecteur
              </button>
            </div>
          </div>

          <div className="grid-cols-2-3 mb-24">
            {/* Formulaire */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Ajouter un lecteur</div>
              </div>
              <div className="card-body">
                <form onSubmit={ajouterLecteur}>
                  <div className="form-grid">
                    <div class="form-group form-full">
                      <label for="nom" class="form-label">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="nom"
                        onChange={handleChange}
                        value={formData.name}
                        name="name"
                        placeholder="Entrez votre nom"
                      />
                      {errors?.name && (
                        <span style={{ color: "red" }}>{errors?.name[0]}</span>
                      )}
                    </div>

                    <div class="form-group">
                      <label for="email" class="form-label">
                        Adresse email
                      </label>
                      <input
                        type="email"
                        class="form-control"
                        id="email"
                        onChange={handleChange}
                        value={formData.email}
                        name="email"
                        placeholder="exemple@mail.com"
                      />
                      {errors?.email && (
                        <span style={{ color: "red" }}>{errors?.email[0]}</span>
                      )}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={initialiserForm}
                      className="btn btn-outline"
                    >
                      Réinitialiser
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                        />
                      </svg>
                      {idEdit ? "Mis à jour" : " Créer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Commandes récentes */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Liste Lecteurs</div>
              </div>
              <div className="card-body">
                <div className="orders-list">
                  <div className="card-body" style={{ padding: 0 }}>
                    <div
                      className="table-wrapper"
                      style={{
                        border: "none",
                        borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
                        boxShadow: "none",
                      }}
                    >
                      <table style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lecteurs && lecteurs.length > 0 ? (
                            lecteurs.map((l) => (
                              <tr key={l.id}>
                                <td>{l.id}</td>
                                <td>{l.name}</td>
                                <td>{l.email}</td>
                                <td>
                                  <div className="td-actions">
                                    <Link
                                      to={`/lecteur/edit/${l.idEncrypt}`}
                                      className="btn btn-success btn-sm"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>{" "}
                                    <button
                                      onClick={() => supprimerLecteur(l.id)}
                                      class="btn btn-danger btn-sm"
                                    >
                                      <i class="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td style={{ textAlign: "center" }} colSpan="4">
                                Aucun lecteur dans votre base de donnée
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navigation>
    </div>
  );
};

export default Lecteur;
