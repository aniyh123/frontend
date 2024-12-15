import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export const DeleteConfirmationModal = ({ show, handleClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>Êtes-vous sûr de vouloir supprimer cet entrée article ?</Modal.Body>
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

export const PaiementFormModal = ({ show, handleClose, paiement, onSubmit }) => {
  const [formData, setFormData] = useState({
    datePaiement: '',
    methodePaiement: 'Espèces', // Valeur par défaut
    montantApayer: '',
    montantpaye: '',
    reste: '',
    commandeId: '',
    personneId: ''
  });

  const [commande, setCommande] = useState([]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...paiement,
      methodePaiement: paiement?.methodePaiement || 'Espèces' // Préserve "Espèces" comme valeur par défaut
    }));
    fetchCommande();
  }, [paiement]);

  const fetchCommande = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/commande/commande');
      setCommande(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommandeSelect = (value) => {
    const selectedCommande = commande.find((cmd) => cmd.id === parseInt(value));
    setFormData((prev) => ({
      ...prev,
      commandeId: value,
      personneId: selectedCommande ? selectedCommande.personneId : '',
      montantApayer: selectedCommande ? selectedCommande.montantTotal : '' // Mettre à jour automatiquement le montantApayer
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
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

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{paiement ? 'Modifier Paiement' : 'Ajouter Paiement'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Méthode de Paiement</Form.Label>
                <Form.Control
                  type="text"
                  name="methodePaiement"
                  value={formData.methodePaiement}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Commande</Form.Label>
                <Form.Control
                  as="select"
                  name="commandeId"
                  value={formData.commandeId}
                  onChange={(e) => handleCommandeSelect(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez une commande</option>
                  {commande.map((commande, i) => (
                    <option key={i} value={commande.id}>
                      N° {commande.id} le {formatDate(commande.dateCommande)} de {( commande.Personne.nom)}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Montant à Payer</Form.Label>
                <Form.Control
                  name="montantApayer"
                  value={formData.montantApayer}
                  onChange={handleChange}
                  required
                  readOnly // Empêche la modification manuelle car ce champ est rempli automatiquement
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Montant Payé</Form.Label>
                <Form.Control
                  type="number"
                  name="montantpaye"
                  value={formData.montantpaye}
                  onChange={handleChange}
                  required
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
            {paiement ? 'Modifier' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
