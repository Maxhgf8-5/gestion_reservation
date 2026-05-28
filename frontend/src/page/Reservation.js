import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import FormatHelpers from "../Helpers/FormatHelpers";

const Reservation = () => {
  const [livres, setLivre] = useState([]);
  const [lecteurs, setLecteur] = useState([]);
  const [reservations, setReservation] = useState([]);
  const navigate = useNavigate();
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(1);
  const [formData, setFormData] = useState({
    livre_id: "",
    lecteur_id: "",
    date_reservation: getToday(),
  });
  const [reservationActive, setReservationActive] = useState(0);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get("/reservation").then((res) => {
      setReservation(res.data.reservations);
      setLecteur(res.data.lecteurs);
      setLivre(res.data.livres);
      setReservationActive(res.data.reservationActive);
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
      api
        .get("/reservation")
        .then((res) => {
          setReservation(res.data.reservations);
          setLecteur(res.data.lecteurs);
          setLivre(res.data.livres);
          setReservationActive(res.data.reservationActive);
        })
        .catch((err) => console.error(err));
      // Réinitialiser le formulaire
      setFormData({
        livre_id: "",
        lecteur_id: "",
        date_reservation: getToday(),
      });
      setMessage(res.data.message);
      setTimeout(() => setErrors({}), 4000);
      setTimeout(() => setMessage(null), 5000);
      setStatus(res.data.status);
      navigate("/reservation");
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
      api
        .get("/reservation")
        .then((res) => {
          setReservationActive(res.data.reservationActive);
        })
        .catch((err) => console.error(err));
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage("Erreur lors de l'annulation !");
      setTimeout(() => setMessage(null), 5000);
    }
  };
  return (
    <div>
      <Navigation>
        <div className="page" id="page-administrateurs">
          {/* Header */}
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

          <div className="page-header">
            <div className="ph-left">
              <h1>Reservations</h1>
              <p>Gestion des reservation lecteurs</p>
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
                Nouvelle Reservation
              </button>
            </div>
          </div>

          <div className="grid-cols-2-3 mb-24">
            {/* Formulaire */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Ajouter un administrateur</div>
              </div>
              <div className="card-body">
                <form onSubmit={ajouter}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Sélectionner un livre <span className="req">*</span>
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
                      {errors?.livre_id?.[0] && (
                        <span style={{ color: "red" }}>
                          {errors?.livre_id[0]}
                        </span>
                      )}
                    </div>

                    <div className="form-group form-full">
                      <label className="form-label">
                        Sélectionner un Lecteur <span className="req">*</span>
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
                              {lecteur?.user.name} - {lecteur?.user.email}
                            </option>
                          ))
                        ) : (
                          <optio>Aucun lecteur dans la base de donnée</optio>
                        )}
                      </select>
                      {errors?.lecteur_id?.[0] && (
                        <span style={{ color: "red" }}>
                          {errors?.lecteur_id[0]}
                        </span>
                      )}
                    </div>

                    <div class="form-group">
                      <label class="form-label">
                        Date de réservation<span className="req">*</span>
                      </label>
                      <input
                        type="date"
                        name="date_reservation"
                        onChange={handleChange}
                        value={formData.date_reservation}
                        class="form-control"
                        id="password"
                      />
                      {errors?.date_reservation?.[0] && (
                        <span style={{ color: "red" }}>
                          {errors?.date_reservation[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button
                      // onClick={initialiserForm}
                      className="btn btn-outline"
                    >
                      Réinitialiser
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Créer le compte
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Administrateurs actuels */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Administrateurs actuels</div>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  <div class="activity-item">
                    <div>Reservation</div>

                    <div class="activity-text">
                      <strong>{reservations.length}</strong>
                    </div>
                  </div>

                  <div class="activity-item">
                    <div>Reservation Active</div>

                    <div class="activity-text">
                      <strong>{reservationActive}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Liste complète</div>
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
                          <td>
                            {FormatHelpers.formatDateFr(r.date_reservation)}
                          </td>
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
          </div>
        </div>
      </Navigation>
    </div>
  );
};

export default Reservation;
