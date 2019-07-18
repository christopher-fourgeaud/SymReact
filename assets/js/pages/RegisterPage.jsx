import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import UsersAPI from "../services/usersAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
  // Gestion des states avec Hooks
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  // Gestion de la soumission
  const handleSubmit = async event => {
    event.preventDefault();
    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre mot de passe n'est pas conforme avec le mot de passe original";
      setErrors(apiErrors);
      toast.error("Des erreurs dans votre formulaire !");
      return;
    }
    try {
      await UsersAPI.register(user);
      setErrors({});
      toast.success(
        "Vous êtes désormais inscrit, vous pouvez vous connecter !"
      );
      history.replace("/login");
    } catch (error) {
      const { violations } = error.response.data;
      if (violations) {
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
      toast.error("Des erreurs dans votre formulaire !");
    }
  };

  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placholder="Votre prénom"
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        />
        <Field
          name="lastName"
          label="nom"
          placholder="Votre nom"
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="Adresse email"
          placholder="Votre adresse"
          type="email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Mot de passe"
          type="password"
          placholder="Votre mot de passe"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Confirmation de mot de passe"
          type="password"
          placholder="Confirmez votre mot de passe"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte !
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
