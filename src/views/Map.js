import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Alert, FormControl, InputGroup } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

import { CommandeFormModal } from '../components/Commande';
import { DeleteConfirmationModal } from '../components/Commande';
import { CommandeDetailModal } from '../components/DetailCommande';

const Commande = () => {
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [commandeToDelete, setCommandeToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/commande/commande');
      setCommandes(response.data);
      setFilteredCommandes(response.data);
    } catch (error) {
      showAlert('Erreur lors de la récupération des commandes', 'danger');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = commandes.filter((commande) =>
      commande.Personne?.nom.toLowerCase().includes(value.toLowerCase()) ||
      commande.status.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCommandes(filtered);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCommande) {
        await axios.put(`http://127.0.0.1:7000/commande/commande/${selectedCommande.id}`, formData);
        showAlert('Commande mise à jour avec succès', 'success');
      } else {
        await axios.post('http://127.0.0.1:7000/commande/commande', formData);
        showAlert('Commande ajoutée avec succès', 'success');
      }
      fetchCommandes();
      setShowModal(false);
      setSelectedCommande(null);
    } catch (error) {
      showAlert('Erreur lors de l\'opération', 'danger');
    }
  };

  const handleDelete = async (id) => {
    setCommandeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/commande/commande/${commandeToDelete}`);
      showAlert('Commande supprimée avec succès', 'success');
      fetchCommandes();
      setShowDeleteModal(false);
    } catch (error) {
      showAlert('Erreur lors de la suppression', 'danger');
    }
  };

  const handleEdit = (commande) => {
    setSelectedCommande(commande);
    setShowModal(true);
  };

  const handleShowDetails = (commande) => {
    setSelectedCommande(commande);
    setShowDetailModal(true);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCommande(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMontant = (montant) => {
    const montantNumber = parseFloat(montant);
    return !isNaN(montantNumber) ? montantNumber.toLocaleString('fr-FR') : montant;
  };

  return (
    <div className="content">
      <br />   <br />   <br />
      <Row>
        <Col md="12">
          <Card className="card-plain shadow" style={{ borderRadius: '0.75rem 0.75rem 0 0', backgroundColor: "white" }}>
            <CardHeader className="position-relative mt-n4 mx-3 z-index-2 text-white" style={{ borderRadius: '0.75rem 0.75rem 0 0', backgroundColor: "#EC407A" }}>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4" className="mb-0">Commandes</CardTitle>
                <div className="d-flex gap-3">
                  <InputGroup className="no-border" style={{ width: '300px' }}>
                    <FormControl
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: 'white',
                      }}
                    />
                  </InputGroup>
                  <Button
                    variant="light"
                    className="d-flex align-items-center gap-2"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="bi bi-plus-circle"></i>
                    Nouvelle Commande
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardBody>
              {alert.show && (
                <Alert variant={alert.type} className="mb-4">
                  {alert.message}
                </Alert>
              )}
              <Table responsive hover>
                <thead>
                  <tr>
                    <th className="text-primary">Date</th>
                    <th className="text-primary">Client</th>
                    <th className="text-primary">Status</th>
                    <th className="text-primary">Montant</th>
                    <th className="text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommandes.map((commande, i) => (
                    <tr key={i}>
                      <td className="d-flex align-items-center gap-2">
                      <div className="avatar bg-light rounded-circle p-2">
                          <i className="bi bi-calendar text-primary"></i>
                        </div>
                        {formatDate(commande.dateCommande)}</td>
                      <td>{commande.Personne ? `${commande.Personne.nom}` : 'Inconnu'}</td>
                      <td>{commande.status}</td>
                      <td>{formatMontant(commande.montantTotal)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="info"
                            className="d-flex align-items-center"
                            onClick={() => handleEdit(commande)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="d-flex align-items-center"
                            onClick={() => handleDelete(commande.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleShowDetails(commande)}
                          >
                            <i className="bi bi-eye"></i>
                            Détails
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <CommandeFormModal
        show={showModal}
        handleClose={handleCloseModal}
        commande={selectedCommande}
        onSubmit={handleSubmit}
      />
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
     {selectedCommande && (
  <CommandeDetailModal
    show={showDetailModal}
    handleClose={() => setShowDetailModal(false)}
    commande={selectedCommande}
  />
)}

    </div>
  );
};

export default Commande;
