import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";

const CustomersPage = props => {
  // Gestion des states avec Hooks
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Permet d'aller récupérer les customers
  const fetchCustomer = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger les clients !");
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchCustomer();
  }, []);

  // Gestion de la suppression d'un customer
  const handleDelete = async id => {
    const originalCustomers = [...customers];
    setCustomers(customers.filter(customer => customer.id !== id));
    try {
      await CustomersAPI.delete(id);
      toast.success("Le client à bien été supprimé !");
    } catch (error) {
      setCustomers(originalCustomers);
      toast.error("La suppression du client n'à pas fonctionné !");
    }
  };

  // Gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Configuration du nombre de lignes affichées par page
  const itemsPerPage = 10;

  // Filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination des données
  const paginatedCustomers =
    filteredCustomers.length > itemsPerPage
      ? Pagination.getData(filteredCustomers, currentPage, itemsPerPage)
      : filteredCustomers;

  return (
    <>
      <div className="d-flex mb-3 justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>
      <div className="form-group">
        <input
          onChange={handleSearch}
          value={search}
          type="text"
          className="form-control"
          placeholder="Rechercher par nom, prénom, email ou nom de l'entreprise..."
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th />
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id}>
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-primary">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()}€
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
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

      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
