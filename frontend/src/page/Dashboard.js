import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";

const Dashboard = () => {
  const [livresDisponibles, setLivreDispo] = useState(0);
  const [livresReserves, setLivresReserves] = useState(0);
  const [lecteur, setLecteur] = useState(0);
  const [reservationLecteurCount, setReservationLecteurCount] = useState(0);
  const [reservationLecteurAnnul, setReservationLecteurAnnul] = useState(0);
  const [reservationLecteur, setReservationLecteur] = useState([]);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((r) => {
        console.log(r.data);
        setLivreDispo(r.data.livresDisponibles);
        setLecteur(r.data.lecteur);
        setLivresReserves(r.data.livresReserves);
        setReservationLecteur(r.data.reservationLecteur);
        setReservationLecteurAnnul(r.data.reservationLecteurAnnul);
        setReservationLecteurCount(r.data.reservationLecteurCount);
      })
      .catch((err) => console.error(err));
  }, []);

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const users = JSON.parse(localStorage.getItem("user") || "[]");
  return (
    <div>
      <Navigation>
        <div className="page" id="page-dashboard">
          <div className="page-header">
            <div className="ph-left">
              <h1>Tableau de bord</h1>
              <p>Bienvenue ! Voici un aperçu de votre activité aujourd'hui.</p>
            </div>
          </div>
          {Array.isArray(roles) && roles[0] === "Admin" ? (
            <>
              <div className="stats-grid">
                <div className="stat-card indigo">
                  <div className="stat-icon">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                      />
                    </svg>
                  </div>
                  <div className="stat-value">{livresDisponibles}</div>
                  <div className="stat-label">Livres disponibles</div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7..."
                      />
                    </svg>
                  </div>
                  <div className="stat-value">{livresReserves}</div>
                  <div className="stat-label">Livres reservés</div>
                </div>

                <div className="stat-card rose">
                  <div className="stat-icon">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4..."
                      />
                    </svg>
                  </div>
                  <div className="stat-value">{lecteur}</div>
                  <div className="stat-label">Lecteurs</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">Liste des reservations</div>
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
                          <th>Nom</th>
                          <th>Nombre de reservation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservationLecteur && reservationLecteur.length > 0 ? (
                          reservationLecteur.map((r, i) => (
                            <tr>
                              <td>{i + 1}</td>
                              <td>{r.lecteur.nom}</td>
                              <td>{r.total}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">
                              Aucune réservation trouvée.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card indigo">
                  <div className="stat-icon">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                      />
                    </svg>
                  </div>
                  <div className="stat-value">{reservationLecteurCount}</div>
                  <div className="stat-label">Livres Reservé</div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7..."
                      />
                    </svg>
                  </div>
                  <div className="stat-value">{reservationLecteurAnnul}</div>
                  <div className="stat-label">Reservation annulée</div>
                </div>
              </div>
            </>
          )}
        </div>
      </Navigation>
    </div>
  );
};

export default Dashboard;
