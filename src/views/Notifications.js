import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Alert, FormControl, InputGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

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

import { PaiementFormModal } from "../components/PaiementModal";
import { DeleteConfirmationModal } from "../components/PaiementModal";


const Paiement = () => {
  const [paiements, setPaiements] = useState([]);
  const [filteredPaiements, setFilteredPaiements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [paiementToDelete, setPaiementToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:7000/paiement/paiement");
      setPaiements(response.data);
      setFilteredPaiements(response.data);
    } catch (error) {
      showAlert("Erreur lors de la récupération des paiements", "danger");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = paiements.filter((paiement) =>
      paiement.Personne?.nom.toLowerCase().includes(value.toLowerCase()) ||
      paiement.methodePaiement.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPaiements(filtered);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedPaiement) {
        await axios.put(`http://127.0.0.1:7000/paiement/paiement/${selectedPaiement.id}`, formData);
        showAlert("Paiement mis à jour avec succès", "success");
      } else {
        await axios.post("http://127.0.0.1:7000/paiement/paiement", formData);
        showAlert("Paiement ajouté avec succès", "success");
      }
      fetchPaiements();
      setShowModal(false);
      setSelectedPaiement(null);
    } catch (error) {
      showAlert("Erreur lors de l'opération", "danger");
    }
  };

  const handleDelete = async (id) => {
    setPaiementToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/paiement/paiement/${paiementToDelete}`);
      showAlert("Paiement supprimé avec succès", "success");
      fetchPaiements();
      setShowDeleteModal(false);
    } catch (error) {
      showAlert("Erreur lors de la suppression", "danger");
    }
  };

  const handleEdit = (paiement) => {
    setSelectedPaiement(paiement);
    setShowModal(true);
  };

  

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaiement(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMontant = (montant) => {
    const montantNumber = parseFloat(montant);
    return !isNaN(montantNumber) ? montantNumber.toLocaleString("fr-FR") : montant;
  };
  const handleGenerateFacture = async (paiementId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:7000/facture/facture/${paiementId}`, {
        responseType: 'blob', // Important pour recevoir un fichier PDF
      });
  
      // Créez un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Facture-${paiementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      showAlert("Facture générée avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la génération de la facture :", error);
      showAlert("Erreur lors de la génération de la facture", "danger");
    }
  };
  

  return (
    <div className="content">
      <br /> <br /> <br />
      <Row>
        <Col md="12">
          <Card
            className="card-plain shadow"
            style={{ borderRadius: "0.75rem 0.75rem 0 0", backgroundColor: "white" }}
          >
            <CardHeader
              className="position-relative mt-n4 mx-3 z-index-2 text-white"
              style={{ borderRadius: "0.75rem 0.75rem 0 0", backgroundColor: "#EC407A" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4" className="mb-0">
                  Paiements
                </CardTitle>
                <div className="d-flex gap-3">
                  <InputGroup className="no-border" style={{ width: "300px" }}>
                    <FormControl
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        color: "white",
                      }}
                    />
                  </InputGroup>
                  <Button
                    variant="light"
                    className="d-flex align-items-center gap-2"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="bi bi-plus-circle"></i>
                    Nouveau Paiement
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
                    <th className="text-primary">Méthode</th>
                    <th className="text-primary">Montant payé</th>
                    <th className="text-primary">Reste</th>
                    <th className="text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaiements.map((paiement, i) => (
                    <tr key={i}>
                      <td>{formatDate(paiement.datePaiement)}</td>
                      <td>{paiement.Personne ? `${paiement.Personne.nom}` : "Inconnu"}</td>
                      <td>{paiement.methodePaiement}</td>
                      <td>{formatMontant(paiement.montantpaye)}</td>
                      <td>{formatMontant(paiement.reste)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleEdit(paiement)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(paiement.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleGenerateFacture(paiement.id)}
                          >
                            <i className="bi bi-file-earmark-pdf"></i> Facture
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

      <PaiementFormModal
        show={showModal}
        handleClose={handleCloseModal}
        paiement={selectedPaiement}
        onSubmit={handleSubmit}
      />
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    
    </div>
  );
};

export default Paiement;
