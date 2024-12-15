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
        Êtes-vous sûr de vouloir supprimer cet entrée article ?
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

export const EntreeArticleFormModal = ({ show, handleClose, entreeArticle, onSubmit }) => {
    const [formData, setFormData] = useState({
        dateEntreeArticle:'',
        prixUnitaire:'',
        fournisseurId:'',
        articleId:'',
        quantite:'',
        prixTotal:''
    });
    const [articles, setArticles] = useState([]);
    const [fournisseur, setFournisseur] = useState([]);
    useEffect(() => {
      setFormData(entreeArticle || {});
      fetchArticles();
      fetchFournisseur();
  }, [entreeArticle]);
  
  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/article/articles');
      setArticles(response.data);
    } catch (error) {
      //showAlert('Erreur lors de la récupération des articles', 'danger');
      console.error(error)
    }
  };
  const fetchFournisseur = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/fournisseur/fournisseur');
      setFournisseur(response.data);
    } catch (error) {
      //showAlert('Erreur lors de la récupération des fournisseurs', 'danger');
    }
  };
  const handleArticleSelect = (value) => {
    setFormData(prev => ({ ...prev, articleId: value }));
  };
  const handleFournisseurSelect = (value) => {
    setFormData(prev => ({ ...prev, fournisseurId: value }));
  };
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      handleClose();
    };
  
    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{entreeArticle ? 'Modifier EntreeArticle' : 'Ajouter EntreeArticle'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
             
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>prixUnitaire</Form.Label>
                  <Form.Control
                    type="text"
                    name="prixUnitaire"
                    value={formData.prixUnitaire}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>fournisseurId</Form.Label>
                  <Form.Control
                     as="select"
                    name="fournisseurId"
                    value={formData.fournisseurId}
                    onChange={(e) =>handleFournisseurSelect(e.target.value)}
                    required
                  >
                    <option   value="">Sélectionnez un fournisseur</option>
                    {fournisseur.map((fournisseur,i)=>(
                    <option key={i} value={fournisseur.id} > {fournisseur.nomSociete}</option>
                  ))}
                   </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Article</Form.Label>
                  <Form.Control
                    as="select"
                    name="articleId"
                    value={formData.articleId}
                    onChange={(e) => handleArticleSelect(e.target.value)}
                    required
                  >
                      <option   value="">Sélectionnez une article</option>
                    {articles.map((article,i)=>(
                    <option key={i} value={article.id} > {article.marque}</option>
                  ))}
                  
                </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>quantite</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleChange}
                   
                  />
                </Form.Group>
              </Col>
            </Row>
        
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {entreeArticle ? 'Modifier' : 'Ajouter'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
