import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";
import { Link } from "react-router-dom";
import FormatHelpers from "../Helpers/FormatHelpers";

const LecteurReservation = () => {
  const [reservation, setReservation] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    api
      .get("/reservation/lecteur")
      .then((res) => setReservation(res.data.reservation.data));
  }, []);
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
                        <th>Livre</th>
                        <th>Date reservation</th>
                        <th>Statut</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservation && reservation.length > 0 ? (
                        reservation.map((l) => (
                          <tr key={l.id}>
                            <td>{l.id}</td>
                            <td>{l.livre}</td>
                            <td>{FormatHelpers.formatDateFr(l.date_reservation)}</td>
                            <td>{l.statut}</td>
                            <td>
                              <div className="td-actions">
                                {l.etat ? (
                                  <button
                                    title="Annuler"
                                    onClick={() => annuler(l.id)}
                                    className="btn btn-danger btn-sm"
                                  >
                                    {" "}
                                    <i className="bi bi-x-circle"></i>{" "}
                                  </button>
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td style={{ textAlign: "center" }} colSpan="4">
                            Aucune reservation
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
      </Navigation>
    </div>
  );
};

export default LecteurReservation;
