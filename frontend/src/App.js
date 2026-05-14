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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lecteur" element={<Lecteur />} />
          <Route path="/lecteur/edit/:idEdit" element={<Lecteur />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/livre" element={<Livre />} />
          <Route path="/livre/edit/:idEdit" element={<Livre />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
