import React, { useEffect, useState } from "react";
import Navigation from "../component/Navigation";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import FormatHelpers from "../Helpers/FormatHelpers";

const Admin = () => {
  const [errors, setErrors] = useState({});

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(1);
  const [message, setMessage] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [adminAll, setAdminAll] = useState([]);
  const [roles, setRoles] = useState([]);
  const { idEdit } = useParams();
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
  });
  // initialiser le formulaire
  const initialiserForm = () => {
    setFormData({
      name: "",
      email: "",
      telephone: "",
      adresse: "",
    });
  };
  const handleChange = (e) => {
    // setFilters({ ...filters, [e.target.name]: e.target.value });
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    api.get(`/admin?page=${page}&per_page=5`).then((res) => {
      setAdmins(res.data.admins.data);
      setAdminAll(res.data.adminAll);
      setRoles(res.data.roles);
    });
  }, [page]);
  const ajouter = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (idEdit) {
        res = await api.put(`/admin/update/${idEdit}`, formData);
      } else {
        res = await api.post(`/admin/store`, formData);
        setAdmins((prev) => [...prev, res.data.admin]);
        setAdminAll(res.data.adminAll);
      }
      // Mettre à jour   le nouveu produit

        await api.get(`/admin?page=${page}&per_page=5`).then((r) =>
          setPagination({
            current: r.data.admins.current_page,
            last: r.data.admins.last_page,
          }),
        );
      setStatus(res.data.status);
      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        telephone: "",
      });
      setMessage(res.data.message);
      setTimeout(() => setErrors({}), 4000);
      setTimeout(() => setMessage(null), 5000);
      setStatus(1);
      navigate("/admin");
    } catch (error) {
      if (error.response) {
        setTimeout(() => setMessage(null), 5000);
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
  return (
    <>
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
              <h1>Administrateurs</h1>
              <p>Gestion des comptes et droits d'accès administrateurs.</p>
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
                Nouvel administrateur
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
                        Nom&Prénom <span className="req">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nom et Prénom"
                      />
                      {errors.name &&
                        errors.name.map((err, i) => (
                          <span key={i} style={{ color: "red" }}>
                            {err}
                          </span>
                        ))}
                    </div>

                    <div className="form-group form-full">
                      <label className="form-label">
                        Email <span className="req">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@gestipro.com"
                      />
                      {errors.email &&
                        errors.email.map((err, i) => (
                          <span key={i} style={{ color: "red" }}>
                            {err}
                          </span>
                        ))}
                    </div>
                    <div class="form-group">
                      <label class="form-label">
                        Téléphone<span className="req">*</span>
                      </label>
                      <input
                        class="form-control"
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="+226 xx xx xx xx"
                      />
                      {errors.telephone &&
                        errors.telephone.map((err, i) => (
                          <span key={i} style={{ color: "red" }}>
                            {err}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button
                      onClick={initialiserForm}
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
              {/* <div className="card-body">
                <div className="activity-list">
                  {connectedUsers && connectedUsers.length > 0 ? (
                    connectedUsers.map((c) => (
                      <div class="activity-item">
                        <div
                          class="avatars"
                          style={{
                            background:
                              "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          }}
                        >
                          {FormatHelpers.formatString(c.name)}
                        </div>
                        <div class="activity-text">
                          <strong>{c.name}</strong>
                          <p>{c.email}</p>
                        <p>{FormatHelpers.formatDateTimeFr(c.date_connexion)}</p>

                        </div>
                        <span class="badge badge-info">
                          {" "}
                          {Array.isArray(c.roles) && c.roles.length > 0
                            ? c.roles[0]
                            : "Aucun rôle"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div
                      className="activity-list"
                      style={{ textAlign: "center" }}
                    >
                      Aucun admin connecté
                    </div>
                  )}
                </div>
              </div> */}
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
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Telephone</th>
                      <th>Rôle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins && admins.length > 0 ? (
                      admins.map((a) => (
                        <tr>
                          <td>
                            <div className="flex-center">
                              <div
                                className="avatars"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #f472b6, #a78bfa)",
                                }}
                              >
                                {FormatHelpers.formatString(a.name ?? "")}
                              </div>
                              {a.name ?? ""}
                            </div>
                          </td>
                          <td>{a.email}</td>
                          <td>{a.telephone}</td>
                          <td>
                            <span className="badge badge-accent">Admin</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                          Pas d'administrateur dans la base de données{" "}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* pagination  */}
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
    </>
  );
};

export default Admin;
