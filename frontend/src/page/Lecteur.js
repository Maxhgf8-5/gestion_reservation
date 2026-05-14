import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";

const Lecteur = () => {
  const [lecteurs, setLecteurs] = useState([]);
   
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
  });
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
        nom: "",
        email: "",
      });
      setMessage(res.data.message);
      setTimeout(() => setMessage(null), 5000);
      navigate('/lecteur');
    } catch (error) {
      setMessage("Le mail existe déjà !");
      setTimeout(() => setMessage(null), 5000);
       if (error.response && error.response.status === 422) {
        // Laravel renvoie les erreurs de validation dans error.response.data.errors
        setErrors(error.response.data.errors);
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
      setMessage(res.data.message);
      setLecteurs((prev) => prev.filter((lecteur) => lecteur.id !== id));
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
        <div className="d-flex">
          <div class="container my-5">
            {message && <div className="alert alert-info">{message}</div>}

            <h3 class="mb-4">Ajouter un lecteur</h3>
            <form onSubmit={ajouterLecteur}>
              {/* <form> */}
              <div class="mb-3">
                <label for="nom" class="form-label">
                  Nom complet
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="nom"
                  onChange={handleChange}
                  value={formData.nom}
                  name="nom"
                  placeholder="Entrez votre nom"
                />
                {errors.nom && <span style={{ color: 'red' }}>{errors.nom[0]}</span>}
              </div>
              <div class="mb-3">
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
                {errors.email && <span style={{ color: 'red' }}>{errors.email[0]}</span>}
              </div>

              <button type="submit" class="btn btn-primary">
               {idEdit?'Mis à jour':'Envoyer'} 
              </button>
            </form>
          </div>
          <div class="container my-5">
            <h3 class="mb-4">Liste des lecteurs</h3>
            <table class="table table-striped table-bordered table-hover">
              <thead class="table-dark">
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
                      <td>{l.nom}</td>
                      <td>{l.email}</td>
                      <td>
                        <div class="d-flex gap-2">
                          <Link
                            class="btn btn-warning btn-sm"
                            to={`/lecteur/edit/${l.idEncrypted}`}
                          >
                            <i class="bi bi-pencil"></i>{" "}
                          </Link>
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
      </Navigation>
    </div>
  );
};

export default Lecteur;
