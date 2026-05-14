import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import FormatHelpers from "../Helpers/FormatHelpers";

const Reservation = () => {
  const [livres, setLivre] = useState([]);
  const [lecteurs, setLecteur] = useState([]);
  const [reservations, setReservation] = useState([]);
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    livre_id: "",
    lecteur_id: "",
    date_reservation: getToday(),
  });

  const [message, setMessage] = useState(null);
  const { idEdit } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    api.get("/reservation").then((res) => {
      setReservation(res.data.reservations);
    });
    api.get("/lecteur").then((res) => {
      setLecteur(res.data.lecteurs);
    });
    api.get("/livre/all").then((res) => {
      setLivre(res.data.livres);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Ajouter un produit
  const ajouter = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/reservation/store`, formData);

      // Mettre à jour le state avec le nouveau produit
      setReservation((prev) => [...prev, res.data.reservation]);
      await api
        .get(`/reservation`)
        .then((r) => setReservation(r.data.reservations));
      await api.get(`/livre/all`).then((r) => setLivre(r.data.livres));
      await api.get(`/lecteur`).then((r) => setLecteur(r.data.lecteurs));
      // Réinitialiser le formulaire
      setFormData({
        livre_id: "",
        lecteur_id: "",
        date_reservation: getToday(),
      });
      setMessage(res.data.message);
      setTimeout(() => setMessage(null), 5000);
      // navigate("/reservation");
    } catch (error) {
      setTimeout(() => setMessage(null), 5000);
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };
  const annuler = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment annuler cette reservation ?",
    );
    if (!confirmation) return; // si l'utilisateur annule, on arrête

    try {
      const res = await api.put(`/reservation/annuler/${id}`);
      // Récupérer le message du backend
      setMessage(res.data.message);
      setReservation((prev) =>
        prev.map((r) => (r.id === id ? { ...r, etat: false } : r)),
      );
     
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage("Erreur lors de l'annulation !");
      setTimeout(() => setMessage(null), 5000);
    }
  };
  return (
    <div>
      <Navigation>
        <div className="d-flex">
          <div class="container my-5">
            {message && <div className="alert alert-info">{message}</div>}

            <h3 class="mb-4">Reserver un livre</h3>
            <form onSubmit={ajouter}>
              <div class="mb-3">
                <label for="nom" class="form-label">
                  Livre
                </label>

                <select
                  name="livre_id"
                  id=""
                  onChange={handleChange}
                  value={formData.livre_id}
                  className="form-control"
                >
                  <option value="">-- Sélectionnez un livre --</option>
                  {livres && livres.length > 0 ? (
                    livres.map((l) => (
                      <option key={l.id} value={l.id}>
                        {" "}
                        {l.titre} - {l.auteur}
                      </option>
                    ))
                  ) : (
                    <optio>Aucun livre dans la base de donnée</optio>
                  )}
                </select>
                {errors.livre_id?.[0] && (
                  <span style={{ color: "red" }}>{errors.livre_id[0]}</span>
                )}
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">
                  Lecteur
                </label>
                <select
                  name="lecteur_id"
                  id=""
                  value={formData.lecteur_id}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">-- Sélectionnez un lecteur --</option>
                  {lecteurs && lecteurs.length > 0 ? (
                    lecteurs.map((lecteur) => (
                      <option key={lecteur.id} value={lecteur.id}>
                        {" "}
                        {lecteur.nom} - {lecteur.email}
                      </option>
                    ))
                  ) : (
                    <optio>Aucun lecteur dans la base de donnée</optio>
                  )}
                </select>
                {errors.lecteur_id?.[0] && (
                  <span style={{ color: "red" }}>{errors.lecteur_id[0]}</span>
                )}
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  Date Reservation
                </label>
                <input
                  type="date"
                  name="date_reservation"
                  onChange={handleChange}
                  value={formData.date_reservation}
                  class="form-control"
                  id="password"
                />
                {errors.date_reservation?.[0] && (
                  <span style={{ color: "red" }}>
                    {errors.date_reservation[0]}
                  </span>
                )}
              </div>
              <button type="submit" class="btn btn-primary">
             {idEdit? 'Mis à jour':'Envoyer'}   
              </button>
            </form>
          </div>
          <div class="container my-5">
            <h3 class="mb-4">Liste de reservation</h3>
            <table class="table table-striped table-bordered table-hover">
              <thead class="table-dark">
                <tr>
                  <th>#</th>
                  <th>Livre</th>
                  <th>Lecteur</th>
                  <th>Date Reservation</th>
                  <th>Etat</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations && reservations.length > 0 ? (
                  reservations.map((r, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{r.livre}</td>
                      <td>{r.lecteur}</td>
                      <td>{FormatHelpers.formatDateFr(r.date_reservation)}</td>
                      <td>
                        <span
                          className={
                            r.etat ? "badge bg-success" : "badge bg-warning"
                          }
                        >
                          {r.etat ? "Actif" : "Annulé"}
                        </span>
                      </td>
                      <td>
                        {r.etat ? (
                          <button
                            title="Annuler"
                            onClick={() => annuler(r.id)}
                            className="btn btn-danger btn-sm"
                          >
                            {" "}
                            <i className="bi bi-x-circle"></i>{" "}
                          </button>
                        ) : (
                          <span></span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan="6">
                      Aucune reservation dans votre base de donnée
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

export default Reservation;
