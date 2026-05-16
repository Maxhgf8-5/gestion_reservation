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
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        api.get(`livre?page=${page}&per_page=4`).then((res) => {
          setLivre(res.data.livres.data);
          setPagination({
            current: res.data.livres.current_page,
            last: res.data.livres.last_page,
          });
        });
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, annee, page]);

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
      } else {
        res = await api.post(`/livre/store`, formData);
      }
      // Mettre à jour   le nouveu produit
      setLivre((prev) => [...prev, res.data.livre]);
      await api
        .get(`/livre?page=${page}&per_page=4`)
        .then((r) => setLivre(r.data.livres.data));
      await api.get(`/livre?page=${page}&per_page=4`).then((r) =>
        setPagination({
          current: r.data.livres.current_page,
          last: r.data.livres.last_page,
        }),
      );
      // Réinitialiser le formulaire
      setFormData({
        titre: "",
        annee_publication: "",
        auteur: "",
      });
      setMessage(res.data.message);
      setTimeout(() => setMessage(null), 5000);
      navigate("/livre");
    } catch (error) {
      setTimeout(() => setMessage(null), 5000);
      if (error.response && error.response.status === 422) {
        // Laravel renvoie les erreurs de validation dans error.response.data.errors
        setErrors(error.response.data.errors);
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
      await api.get(`/livre?page=${page}&per_page=4`).then((r) =>
        setPagination({
          current: r.data.livres.current_page,
          last: r.data.livres.last_page,
        }),
      );
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
        <div className="d-flex">
          <div class="container my-5">
            {message && <div className="alert alert-info">{message}</div>}

            <h3 class="mb-4">Ajouter un livre</h3>
            <form onSubmit={ajouterLivre}>
              <div class="mb-3">
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
                {errors.titre?.[0] && (
                  <span style={{ color: "red" }}>{errors.titre[0]}</span>
                )}
              </div>
              <div class="mb-3">
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
                {errors.annee_publication?.[0] && (
                  <span style={{ color: "red" }}>
                    {errors.annee_publication[0]}
                  </span>
                )}
              </div>

              <div class="mb-3">
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
                {errors.auteur?.[0] && (
                  <span style={{ color: "red" }}>{errors.auteur[0]}</span>
                )}
              </div>

              <button type="submit" class="btn btn-primary">
                {idEdit ? "Mis à jour" : "Envoyer"}
              </button>
            </form>
          </div>
          <div class="container my-">
            <h3 class="mb-4">Liste des livres</h3>
            <div className="container mt-5">
              <div className="input-group">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  placeholder="Rechercher nom auteur ou titre"
                />
              <input type="text"
                  className="form-control"
                  placeholder="Rechercher par année publication"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}/>
               
              </div>

              <br />

              <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
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
                          <div className="d-flex gap-2">
                            <a
                              className="btn btn-warning btn-sm"
                              href={`/livre/edit/${l.idEncrypted}`}
                            >
                              <i className="bi bi-pencil"></i>
                            </a>
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
