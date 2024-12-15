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

import { EntreeArticleFormModal } from '../components/EntreeArticleModal';
import { DeleteConfirmationModal } from '../components/EntreeArticleModal';

const EntreeArticle = () => {
  const [entreeArticles, setEntreeArticles] = useState([]);
  const [filteredEntreeArticles, setFilteredEntreeArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntreeArticle, setSelectedEntreeArticle] = useState(null);
  const [entreeArticleToDelete, setEntreeArticleToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEntreeArticles();
  }, []);

  const fetchEntreeArticles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/entreeArticle/entreearticle');
      setEntreeArticles(response.data);
      setFilteredEntreeArticles(response.data);
    } catch (error) {
      showAlert('Erreur lors de la récupération des entrée articles', 'danger');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = entreeArticles.filter((entree) =>
      entree.Article?.marque.toLowerCase().includes(value.toLowerCase()) ||
      entree.Fournisseur?.nomSociete.toLowerCase().includes(value.toLowerCase()) 
    );
    setFilteredEntreeArticles(filtered);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedEntreeArticle) {
        await axios.put(`http://127.0.0.1:7000/entreeArticle/update/${selectedEntreeArticle.id}`, formData);
        showAlert('Entrée article mis à jour avec succès', 'success');
      } else {
        await axios.post('http://127.0.0.1:7000/entreeArticle/ajout', formData);
        showAlert('Entrée article ajouté avec succès', 'success');
      }
      fetchEntreeArticles();
      setShowModal(false);
      setSelectedEntreeArticle(null);
    } catch (error) {
      showAlert('Erreur lors de l\'opération', 'danger');
    }
  };

  const handleDelete = async (id) => {
    setEntreeArticleToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/entreeArticle/delete/${entreeArticleToDelete}`);
      showAlert('Article supprimé avec succès', 'success');
      fetchEntreeArticles();
      setShowDeleteModal(false);
    } catch (error) {
      showAlert('Erreur lors de la suppression', 'danger');
    }
  };

  const handleEdit = (entreearticle) => {
    setSelectedEntreeArticle(entreearticle);
    setShowModal(true);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEntreeArticle(null);
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
      <br></br><br></br><br></br>
      <Row>
        <Col md="12">
          <Card className="card-plain shadow" style={{borderRadius: '0.75rem 0.75rem 0 0', backgroundColor:"white"}}>
            <CardHeader className=" position-relative mt-n4 mx-3 z-index-2 text-white" style={{ borderRadius: '0.75rem 0.75rem 0 0' ,backgroundColor:"#EC407A"}}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <CardTitle tag="h4" className="mb-0">Entrée Article</CardTitle>
                </div>
                <div className="d-flex gap-3">
                  <InputGroup className="no-border" style={{ width: '300px' }}>
                    <FormControl
                      placeholder="Rechercher..."
                      className="bg-primary-light text-white"
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
                    Nouvel Entrée
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
                    <th className="text-primary">Date d'entrée</th>
                    <th className="text-primary">Prix unitaire</th>
                    <th className="text-primary">Fournisseur</th>
                    <th className="text-primary">Marque d'article</th>
                    <th className="text-primary">Quantité</th>
                    <th className="text-primary">Prix total</th>
                    <th className="text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntreeArticles.map((entreeArticle, i) => (
                    <tr key={i}>
                      <td className="d-flex align-items-center gap-2">
                        <div className="avatar bg-light rounded-circle p-2">
                          <i className="bi bi-calendar text-primary"></i>
                        </div>
                        {formatDate(entreeArticle.dateEntreeArticle)}
                      </td>
                      <td>{formatMontant(entreeArticle.prixUnitaire)}</td>
                      <td>{entreeArticle.Fournisseur ? entreeArticle.Fournisseur.nomSociete : 'N/A'}</td>
                      <td>{entreeArticle.Article ? entreeArticle.Article.marque : 'N/A'}</td>
                      <td>{entreeArticle.quantite}</td>
                      <td>{formatMontant(entreeArticle.prixTotal)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="info"
                            className="d-flex align-items-center"
                            onClick={() => handleEdit(entreeArticle)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="d-flex align-items-center"
                            onClick={() => handleDelete(entreeArticle.id)}
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

      <EntreeArticleFormModal
        show={showModal}
        handleClose={handleCloseModal}
        entreeArticle={selectedEntreeArticle}
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

export default EntreeArticle;