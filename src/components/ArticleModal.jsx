import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';



export const DeleteConfirmationModal = ({ show, handleClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir supprimer cet article ?
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

export const ArticleFormModal = ({ show, handleClose, article, onSubmit }) => {
    const [formData, setFormData] = useState({
      marque: '',
      modele: '',
      type: '',
      photoArticle: '',
      prixArticle: null,
      quantiteStock: ''
    });
  
    useEffect(() => {
      setFormData(article || {});
  }, [article]);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e) => {
      setFormData({ ...formData, photoArticle: e.target.files[0] });
    };
  
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      handleClose();
    };
  
    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{article ? 'Modifier Article' : 'Ajouter Article'} </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marque</Form.Label>
                  <Form.Control
                    type="text"
                    name="marque"
                    value={formData.marque}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Modèle</Form.Label>
                  <Form.Control
                    type="text"
                    name="modele"
                    value={formData.modele}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix</Form.Label>
                  <Form.Control
                    type="number"
                    name="prixArticle"
                    value={formData.prixArticle}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
           
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                type="file"
                name="photoArticle"
               
                onChange={handleFileChange}
                
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {article ? 'Modifier' : 'Ajouter'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };
