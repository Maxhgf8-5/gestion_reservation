import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";

const Dashboard = () => {
  const [livresDisponibles, setLivreDispo] = useState(0);
  const [livresReserves, setLivresReserves] = useState(0);
  const [reservationLecteur, setReservationLecteur] = useState([]);
   
useEffect(() => {
  api.get("/dashboard")
    .then((r) => {
          console.log(r.data); 
      setLivreDispo(r.data.livresDisponibles);
      setLivresReserves(r.data.livresReserves);
      setReservationLecteur(r.data.reservationLecteur); 
    })
    .catch((err) => console.error(err));
}, []);


  return (
    <div>
      <Navigation>
        <div class="container my-5">
          <div class="row">
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Livres Disponibles</h5>
                  <p class="card-text">{livresDisponibles}</p>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Livres Reservés</h5>
                  <p class="card-text">{livresReserves ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container my-5">
          <h3 class="mb-4">Liste lecteur avec reservation</h3>
          <table class="table table-striped table-bordered table-hover">
            <thead class="table-dark">
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
                    <td>{i+1}</td>
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
      </Navigation>
    </div>
  );
};

export default Dashboard;
