import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import customersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  // Gestion des states avec Hooks
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT"
  });
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });
  const [editing, setEditing] = useState(false);
  const [customers, setCustomers] = useState([]);

  // Récupération du paramètre de l'url
  const { id = "new" } = match.params;

  // Récupération des clients
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      console.log(error.response);
      // TODO : flash notification d'erreur
      history.replace("/invoices");
    }
  };

  // Récupération d'une facture
  const fetchInvoice = async id => {
    try {
      const { amount, status, customer } = await InvoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      console.log(error.response);
      // TODO : flash notification d'erreur
      history.replace("/invoices");
    }
  };

  // Récupération de la liste des clients à chaque chargement du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Récupération de la bonne facture quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        const response = await InvoicesAPI.update(id, invoice);
        // To do : Flash notification success
        console.log(response);
      } else {
        await InvoicesAPI.create(invoice);
        // To do : Flash notification success
        history.replace("/invoices");
      }
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        // TODO : flash notification d'erreur
      }
    }
  };

  return (
    <>
      {(editing && <h1>Modification d'une facture</h1>) || (
        <h1>Création d'un facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map(customer => (
            <option value={customer.id} key={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour à la liste des factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
