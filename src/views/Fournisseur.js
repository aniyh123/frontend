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


import { DeleteConfirmationModal } from '../components/Fournisseur';
import { FournisseurFormModal } from '../components/Fournisseur';

const Fournisseur = () => {
  const [fournisseur, setFournisseur] = useState([]);
  const [filteredFournisseur, setFilteredFournisseur] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [fournisseurToDelete, setFournisseurToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFournisseur();
  }, []);

  const fetchFournisseur = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/fournisseur/fournisseur');
      setFournisseur(response.data);
      setFilteredFournisseur(response.data);
    } catch (error) {
      showAlert('Erreur lors de la récupération des fournisseurs', 'danger');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = fournisseur.filter((fournisseur) =>
        fournisseur.Personne?.nomSociete.toLowerCase().includes(value.toLowerCase()) 
    );
    setFilteredFournisseur(filtered);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedFournisseur) {
        await axios.put(`http://127.0.0.1:7000/fournisseur/fournisseur/${selectedFournisseur.id}`, formData);
        showAlert('Fournisseur mise à jour avec succès', 'success');
      } else {
        await axios.post('http://127.0.0.1:7000/fournisseur/fournisseur', formData);
        showAlert('Fournisseur ajoutée avec succès', 'success');
      }
      fetchFournisseur();
      setShowModal(false);
      setSelectedFournisseur(null);
    } catch (error) {
      showAlert('Erreur lors de l\'opération', 'danger');
    }
  };

  const handleDelete = async (id) => {
    setFournisseurToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/fournisseur/fournisseur/${fournisseurToDelete}`);
      showAlert('Fournisseur supprimée avec succès', 'success');
      fetchFournisseur();
      setShowDeleteModal(false);
    } catch (error) {
      showAlert('Erreur lors de la suppression', 'danger');
    }
  };

  const handleEdit = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setShowModal(true);
  };

  const handleShowDetails = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setShowDetailModal(true);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFournisseur(null);
  };



  return (
    <div className="content">
      <br />   <br />   <br />
      <Row>
        <Col md="12">
          <Card className="card-plain shadow" style={{ borderRadius: '0.75rem 0.75rem 0 0', backgroundColor: "white" }}>
            <CardHeader className="position-relative mt-n4 mx-3 z-index-2 text-white" style={{ borderRadius: '0.75rem 0.75rem 0 0', backgroundColor: "#EC407A" }}>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4" className="mb-0">Fournisseur</CardTitle>
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
                    Nouvelle Fournisseur
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
                  <th className="text-primary">Nom et prénom</th>
                      <th className="text-primary">Téléphone</th>
                      <th className="text-primary">CIN</th>
                      <th className="text-primary">Adresse</th>
                      <th className="text-primary">Email</th>
                    <th className="text-primary">Nom societe</th>
                    <th className="text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFournisseur.map((fournisseur, i) => (
                    <tr key={i}>
                     <td>{fournisseur.Personne ? `${fournisseur.Personne.prenom} ${fournisseur.Personne.nom}` : 'Inconnu'}</td>
                        <td>{fournisseur.Personne ? `${fournisseur.Personne.telephone}` : 'Inconnu'}</td>
                        <td>{fournisseur.Personne ? `${fournisseur.Personne.cin}` : 'Inconnu'}</td>
                        <td>{fournisseur.Personne ? `${fournisseur.Personne.adresse}` : 'Inconnu'}</td>
                        <td>{fournisseur.Personne ? `${fournisseur.Personne.email}` : 'Inconnu'}</td>
                      <td>{fournisseur.nomSociete}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="info"
                            className="d-flex align-items-center"
                            onClick={() => handleEdit(fournisseur)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="d-flex align-items-center"
                            onClick={() => handleDelete(fournisseur.id)}
                          >
                            <i className="bi bi-trash"></i>
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

      <FournisseurFormModal
        show={showModal}
        handleClose={handleCloseModal}
        fournisseur={selectedFournisseur}
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

export default Fournisseur;
