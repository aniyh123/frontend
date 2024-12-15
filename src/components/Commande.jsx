import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export const DeleteConfirmationModal = ({ show, handleClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir supprimer cette commande ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const CommandeFormModal = ({ show, handleClose, commande, onSubmit }) => {
  const [formData, setFormData] = useState({
    personneId: '',
    details: [{ articleId: '', Quantite: '' }],
    error: ''
  });
  const [client, setClient] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (commande) {
      setFormData({
        personneId: commande.personneId || '',
        details: commande.details?.length > 0 
          ? commande.details 
          : [{ articleId: '', Quantite: '' }],
        error: ''
      });
    }
    fetchClient();
    fetchArticles();
  }, [commande]);
  const fetchClient = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/personne/client');
      setClient(response.data);
      console.log(setClient)
    } catch (error) {
     
      console.error(error)
    }
  };
  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/article/articles');
      setArticles(response.data);
    } catch (error) {
  
      console.error(error)
    }
  };
  const handleClientSelect = (value) => {
    setFormData(prev => ({ ...prev, personneId: value }));
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      error: ''
    });
  };

  const handleDetailChange = (index, e) => {
    const newDetails = [...formData.details];
    newDetails[index] = {
      ...newDetails[index],
      [e.target.name]: e.target.value
    };
    
    setFormData({
      ...formData,
      details: newDetails,
      error: ''
    });
  };

  const addDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { articleId: '', Quantite: '' }]
    });
  };

  const removeDetail = (index) => {
    if (formData.details.length > 1) {
      const newDetails = formData.details.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        details: newDetails
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.personneId) {
      setFormData({
        ...formData,
        error: 'Veuillez sélectionner un client'
      });
      return;
    }

    // Validation des détails
    const invalidDetails = formData.details.some(
      detail => !detail.articleId || !detail.Quantite
    );

    if (invalidDetails) {
      setFormData({
        ...formData,
        error: 'Veuillez remplir tous les champs pour chaque article'
      });
      return;
    }

    try {
      // Formatage des données pour l'API
      const commandeData = {
        personneId: formData.personneId,
        details: formData.details.map(detail => ({
          articleId: detail.articleId,
          Quantite: parseInt(detail.Quantite)
        }))
      };

      await onSubmit(commandeData);
      handleClose();
    } catch (error) {
      setFormData({
        ...formData,
        error: error.message || 'Une erreur est survenue'
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {commande ? 'Modifier Commande' : 'Ajouter Commande'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {formData.error && (
            <div className="alert alert-danger">
              {formData.error}
            </div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Client</Form.Label>
            <Form.Control
                    as="select"
                    name="personneId"
                    value={formData.personneId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    required
                  >
                      <option   value="">Sélectionnez un client</option>
                    {client.map((client,i)=>(
                    <option key={i} value={client.id} > {client.nom} {client.prenom}  </option>
                  ))}
                  
                </Form.Control>
          </Form.Group>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Articles</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={addDetail}
                type="button"
              >
                + Ajouter un article
              </Button>
            </div>

            {formData.details.map((detail, index) => (
              <div key={index} className="border p-3 mb-3 rounded">
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-2">
                      <Form.Label>Article</Form.Label>
                      <Form.Control
                    as="select"
                    name="articleId"
                    value={formData.articleId}
                    onChange={(e) => handleDetailChange(index, e)}
                    required
                  >
                      <option   value="">Sélectionnez une article</option>
                    {articles.map((article,i)=>(
                    <option key={i} value={article.id} > {article.marque} **disponible:{article.quantiteStock}</option>
                  ))}
                  
                </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-2">
                      <Form.Label>Quantité</Form.Label>
                      <Form.Control
                        type="number"
                        name="Quantite"
                        value={detail.Quantite}
                        onChange={(e) => handleDetailChange(index, e)}
                        min="1"
                        placeholder="Quantité"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    {formData.details.length > 1 && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeDetail(index)}
                        type="button"
                        className="mb-2"
                      >
                        Supprimer
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {commande ? 'Modifier' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};