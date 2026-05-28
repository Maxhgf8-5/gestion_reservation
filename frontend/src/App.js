// import logo from './logo.svg';
// import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./page/Dashboard";
import Lecteur from "./page/Lecteur";
import Reservation from "./page/Reservation";
import Livre from "./page/Livre";
import Admin from "./page/Admin";
import Login from "./page/Login";
import PrivateRoute from "./component/PrivateRoute";
import LecteurReservation from "./page/LecteurReservation";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute requiredRole="Admin|Lecteur">
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecteur"
            element={
              <PrivateRoute requiredRole="Admin">
                <Lecteur />
              </PrivateRoute>
            }
          />
          <Route path="/lecteur/edit/:idEdit" element={<Lecteur />} />
          <Route
            path="/reservation"
            element={
              <PrivateRoute requiredRole="Admin">
                <Reservation />
              </PrivateRoute>
            }
          />
          <Route
            path="/livre"
            element={
              <PrivateRoute  >
                <Livre />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecteur/reservation"
            element={
              <PrivateRoute requiredRole="Lecteur">
                <LecteurReservation />
              </PrivateRoute>
            }
          />
          <Route path="/livre/edit/:idEdit" element={<Livre />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="Admin">
                <Admin />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
