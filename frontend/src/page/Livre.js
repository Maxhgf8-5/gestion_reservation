import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";

const Livre = () => {
  // initailisation des state
  const [livres, setLivre] = useState([]);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    titre: "",
    annee_publication: "",
    auteur: "",
  });
  const [message, setMessage] = useState(null);
  const { idEdit } = useParams();
  const [filters, setFilters] = useState({
    search: "",
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [annee, setAnnee] = useState("");
  const [status, setStatus] = useState(1);
  const [livreAll, setLivreAll] = useState([]);
  const [livreActif, setLivreActif] = useState(0);
  // fin  init state

  // chargement d'affichage
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() !== "" || annee.trim() !== "") {
        api
          .get(`/livre?page=${page}&per_page=4`, {
            params: {
              search: search,
              annee: annee,
            },
          })
          .then((res) => {
            setLivre(res.data.livres.data);
            setLivreActif(res.data.livreActif);
            setLivreAll(res.data.livreAll);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        api.get(`livre?page=${page}&per_page=4`).then((res) => {
          setLivre(res.data.livres.data);
          setLivre(res.data.livres.data);
          setLivreActif(res.data.livreActif);
          setLivreAll(res.data.livreAll);
          setPagination({
            current: res.data.livres.current_page,
            last: res.data.livres.last_page,
          });
        });
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, annee, page]);
  const initialiserForm = () => {
    setFormData({
      titre: "",
      annee_publication: "",
      auteur: "",
    });
  };
  // saisi de formulaire
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Ajouter un livre
  const ajouterLivre = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (idEdit) {
        res = await api.put(`/livre/update/${idEdit}`, formData);
        if (res.data && res.data.livre) {
          setLivre((prev) =>
            prev.map((s) => (s.id === res.data.livre.id ? res.data.livre : s)),
          );
        }
      } else {
        res = await api.post(`/livre/store`, formData);
        setLivre((prev) => [...prev, res.data.livre]);
        setLivreActif(res.data.livreActif);
        setLivreAll(res.data.livreAll);
      }
      // Mettre à jour   le nouveu produit

      await api.get(`/livre?page=${page}&per_page=4`).then((r) => {
        setPagination({
          current: r.data.livres.current_page,
          last: r.data.livres.last_page,
        });
        setLivreAll(r.data.livreAll);
        setLivreActif(r.data.livreActif);
      });
      setStatus(res.data.status);
      // Réinitialiser le formulaire
      setFormData({
        titre: "",
        annee_publication: "",
        auteur: "",
      });
      setMessage(res.data.message);
      setTimeout(() => setErrors({}), 4000);
      setTimeout(() => setMessage(null), 5000);
      setStatus(1);
      navigate("/livre");
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
  // function pour supprimer un livre
  const supprimerLivre = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce livre ?",
    );
    if (!confirmation) return;

    try {
      const res = await api.delete(`/livre/delete/${id}`);
      await api.get(`/livre?page=${page}&per_page=4`).then((r) => {
        setPagination({
          current: r.data.livres.current_page,
          last: r.data.livres.last_page,
        });
        setLivre(r.data.livres.data);
        setLivreAll(r.data.livreAll);
        setLivreActif(r.data.livreActif);

      });
      // msg backd

      setMessage(res.data.message);
      setLivre((prev) => prev.filter((livre) => livre.id !== id));
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage("Erreur lors de la suppression !");
      setTimeout(() => setMessage(null), 5000);
    }
  };
  // function pour recharger le lecteur a editer
  useEffect(() => {
    if (idEdit) {
      api
        .get(`/livre/edit/${idEdit}`)
        .then((res) => {
          setFormData(res.data.livre);
        })
        .catch((err) => console.error(err));
    }
  }, [idEdit]);

  return (
    <div>
      <Navigation>
        <div className="page" id="page-contrats">
          {/* {message && <AlertWithProgress message={message} duration={5000} />} */}
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
              <h1>Livres</h1>
              <p>Gestion des livres.</p>
            </div>
          </div>

          {/* Form + Stats */}
          <div className="grid-cols-2-3 mb-24">
            {/* Formulaire */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Ajouter un livre</div>
              </div>
              <div className="card-body">
                <form onSubmit={ajouterLivre}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label for="nom" class="form-label">
                        Titre
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="nom"
                        placeholder="Entrez le titre"
                        name="titre"
                        onChange={handleChange}
                        value={formData.titre}
                      />
                      {errors?.titre?.[0] && (
                        <span style={{ color: "red" }}>{errors?.titre[0]}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label for="email" class="form-label">
                        Année de publication
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="email"
                        name="annee_publication"
                        onChange={handleChange}
                        value={formData.annee_publication}
                        placeholder="2025"
                      />
                      {errors?.annee_publication?.[0] && (
                        <span style={{ color: "red" }}>
                          {errors?.annee_publication[0]}
                        </span>
                      )}
                    </div>

                    {/* ... autres champs */}
                    <div class="form-group">
                      <label for="password" class="form-label">
                        Auteur
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="password"
                        placeholder="Le nom de l'auteur"
                        name="auteur"
                        onChange={handleChange}
                        value={formData.auteur}
                      />
                      {errors?.auteur?.[0] && (
                        <span style={{ color: "red" }}>
                          {errors?.auteur[0]}
                        </span>
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
                      {idEdit ? "Mis à jour" : "Ajouter un livre"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Stats */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="stat-card amber">
                <div className="stat-icon">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="stat-value">{livreAll.length}</div>

                <div className="stat-label">Livres</div>
              </div>
              {/* ... autres stats */}
              <div className="stat-card green">
                <div class="stat-icon">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div class="stat-value">{livreActif}</div>
                <div class="stat-label">Livre Actif</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Liste des livres</div>
              <div className="filter-bar" style={{ margin: 0 }}>
                <div className="search-input-wrap">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                    placeholder="Rechercher nom auteur ou titre"
                  />
                </div>
                <div className="search-input-wrap">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Rechercher par année publication"
                    value={annee}
                    onChange={(e) => setAnnee(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div
                className="table-wrapper"
                style={{
                  border: "none",
                  borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
                  boxShadow: "none",
                }}
              >
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Titre</th>
                      <th>Auteur</th>
                      <th>Année de publication</th>
                      <th>Statut</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {livres && livres.length > 0 ? (
                      livres.map((l) => (
                        <tr key={l.id}>
                          <td>{l.id}</td>
                          <td>{l.titre}</td>
                          <td>{l.auteur}</td>
                          <td>{l.annee_publication}</td>
                          <td>
                            <span
                              className={
                                l.is_reserved
                                  ? "badge bg-danger"
                                  : "badge bg-success"
                              }
                            >
                              {l.is_reserved ? "Réservé" : "Disponible"}
                            </span>
                          </td>

                          <td>
                            <div className="td-actions">
                              <Link
                                className="btn btn-warning btn-sm"
                                to={`/livre/edit/${l.idEncrypted}`}
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                onClick={() => supprimerLivre(l.id)}
                                className="btn btn-danger btn-sm"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Aucun livre trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <button
                  disabled={pagination.current === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-left"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <span>
                  Page {pagination.current} / {pagination.last}
                </span>

                <button
                  disabled={pagination.current === pagination.last}
                  onClick={() => setPage(page + 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-right"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Navigation>
    </div>
  );
};

export default Livre;
