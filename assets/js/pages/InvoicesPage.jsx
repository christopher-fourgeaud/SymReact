import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger"
};

const STATUS_LABEL = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée"
};

// Gestion des states avec Hooks
const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Permet d'aller récupérer les factures
  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures");
    }
  };

  // Au chargement du composant, on va chercher les factures
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Gestion de la suppression d'une facture
  const handleDelete = async id => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    try {
      await InvoicesAPI.delete(id);
      toast.success("La facture à bien été supprimée !");
    } catch (error) {
      toast.error("Une erreur est survenue !");
      setInvoices(originalInvoices);
    }
  };

  // Configuration du nombre de lignes affichées par page
  const itemsPerPage = 10;

  // Permet de formater une date avec Moment.js
  const formatDate = string => moment(string).format("DD/MM/YYYY");

  // Filtrage des invoices en fonction de la recherche
  const filteredInvoices = invoices.filter(
    i =>
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      i.chrono.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABEL[i.status].toLowerCase().includes(search.toLocaleLowerCase())
  );

  // Pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link className="btn btn-primary" to="/invoices/new">
          Créer une facture
        </Link>
      </div>

      <div className="form-group">
        <input
          onChange={handleSearch}
          value={search}
          type="text"
          className="form-control"
          placeholder="Rechercher par nom, prénom, numéro, montant ou statut de la facture..."
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th />
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedInvoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/invoices/" + invoice.id}>
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </Link>
                </td>
                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                <td className="text-center">
                  <span
                    className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                  >
                    {STATUS_LABEL[invoice.status]}
                  </span>
                </td>
                <td className="text-center">
                  {invoice.amount.toLocaleString()}€
                </td>
                <td>
                  <Link
                    to={"/invoices/" + invoice.id}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Editer
                  </Link>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader />}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChanged={handlePageChange}
        length={filteredInvoices.length}
      />
    </>
  );
};

export default InvoicesPage;
