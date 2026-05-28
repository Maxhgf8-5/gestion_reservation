import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (requiredRole) {
    // Sépare "Admin|Lecteur" en ["Admin", "Lecteur"]
    const allowedRoles = requiredRole.split("|");

    // Vérifie si l'utilisateur a AU MOINS un des rôles autorisés
    const hasRole = allowedRoles.some((role) => roles.includes(role));

    if (!hasRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
}