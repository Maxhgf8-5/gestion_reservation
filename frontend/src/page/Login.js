import React, { useState } from "react";
import "../css/login.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
const Login = () => {
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors("");
    setFieldErrors({}); // ← erreurs par champ
    setLoading(true);

    try {
      const res = await api.post("/login", formData);

      if (res.data.status === 1) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
       localStorage.setItem("roles",JSON.stringify(res.data.roles));
      
        navigate("/dashboard");
      }
      setTimeout(() => setMessage(null), 5000);
      setMessage(res.data.message);
      setStatus(res.data.status);
      setTimeout(() => setErrors({}), 4000);
    } catch (error) {
      setTimeout(() => setErrors({}), 4000);
      setTimeout(() => setMessage(null), 5000);
      if (error.response) {
        if (error.response.status === 422) {
          setTimeout(() => setErrors({}), 4000);

          setErrors(error.response.data.errors);
        } else {
          setTimeout(() => setErrors({}), 4000);

          setMessage(error.response.data.message);
          setStatus(0);
        }
        setTimeout(() => setErrors({}), 4000);
      } else {
        setMessage("Erreur de connexion au serveur");
        setTimeout(() => setErrors({}), 4000);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div class="wrap-login">
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
        <form class="card-login" onSubmit={handleLogin}>
          <div class="brand">
            <div class="brand-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a5 5 0 0 0-5 5v4H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 9V7a3 3 0 0 1 6 0v4H9zm3 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
              </svg>
            </div>
            <h1>Bon retour</h1>
            <p>Connectez-vous à votre compte</p>
          </div>

          <div class="field-login">
            <label for="email">Adresse e-mail</label>
            <div class="input-wrap-login">
              <i class="ti ti-mail left" aria-hidden="true"></i>
              <input
                type="email"
                id="email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                value={formData.email}
                name="email"
                placeholder="vous@exemple.com"
                autocomplete="email"
              />
            </div>
            {errors.email &&
              errors.email.map((err, i) => (
                <span key={i} style={{ color: "red" }}>
                  {err}
                </span>
              ))}
          </div>

          <div class="field-login">
            <label for="password">Mot de passe</label>
            <div class="input-wrap-login">
              <i class="ti ti-key left" aria-hidden="true"></i>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                class="toggle"
                id="toggle-pw"
                aria-label="Afficher le mot de passe"
                type="button"
              >
                <i class="ti ti-eye" id="eye-icon" aria-hidden="true"></i>
              </button>
            </div>
            {errors.password &&
              errors.password.map((err, i) => (
                <span key={i} style={{ color: "red" }}>
                  {err}
                </span>
              ))}
          </div>

          <button
            class="btn-login"
            id="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <p class="signup">
            Mot de passe oublié <Link to="#">Cliquer</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
