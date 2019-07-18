import React from "react";

const Homepage = props => {
  return (
    <div className="jumbotron">
      <h1 className="display-3">CRM de factures SymReact!</h1>
      <p className="lead">
        Cet outil permet de gérer ses factures et ses clients.
      </p>
      <hr className="my-4" />
      <p>
        Il utilise Symfony 4.3.2 avec Api Platform pour gérer le backend et
        React pour recevoir et afficher les informations
      </p>
      <p className="lead">
        <a
          className="btn btn-primary btn-lg"
          href="https://github.com/christopher-fourgeaud/SymReact"
          role="button"
          target="_blank"
        >
          Github du projet ici
        </a>
      </p>
    </div>
  );
};

export default Homepage;
