import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  // Gestion des states avec Hooks
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  // Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion du submit
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse email ou alors les informations ne correpondent pas."
      );
    }
  };

  return (
    <>
      <h1>Page de login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="_username">Addresse email</label>
          <input
            value={credentials.username}
            onChange={handleChange}
            type="email"
            className={"form-control" + (error && " is-invalid")}
            placeholder="Adresse email de connexion"
            name="username"
            id="username"
          />
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="_password">Mot de passe</label>
          <input
            value={credentials.password}
            onChange={handleChange}
            type="password"
            className="form-control"
            placeholder="Mot de passe"
            name="password"
            id="password"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Connexion
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
