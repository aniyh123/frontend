import { Modal, Button, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const CommandeDetailModal = ({ show, handleClose, commande, onEdit, onDelete }) => {
   // État pour stocker les détails de la commande
   const [commandeDetails, setCommandeDetails] = useState([]);
    // Récupération des détails de la commande
  useEffect(() => {
    fetchCommandeDetails();
  
}, []);
  if (!commande) return null;

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchCommandeDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:7000/detailCommande/detailCommande/${commande.id}`);
      if (Array.isArray(response.data.details)) {
        setCommandeDetails(response.data.details);
      } else {
        setCommandeDetails([]); // Gérer le cas où les données ne sont pas un tableau
      }
      console.log(commandeDetails)
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la commande :', error);
    }
  };
  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'warning';
      case 'VALIDÉE':
        return 'success';
      case 'ANNULÉE':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détails de la commande N°{commande.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Informations générales de la commande */}
        <div className="mb-4">
          <h5>Informations générales</h5>
          <Table striped bordered>
            <tbody>
              <tr>
                <th width="200">Numéro de commande</th>
                <td>{commande.id}</td>
              </tr>
              <tr>
                <th>Date de commande</th>
                <td>{formatDate(commande.dateCommande)}</td>
              </tr>
              <tr>
                <th>Client</th>
              {commandeDetails.map((d,i)=>{
                <td key={d.id}>{ d.Personne?.nom || 'Non spécifiée'}</td>
              })}
              </tr>
              <tr>
                <th>Statut</th>
                <td>
                  <Badge bg={getStatusBadgeVariant(commande.status)}>
                    {commande.status}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* Liste des articles */}
        <div>
          <h5>Articles commandés</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Article</th>
                <th className="text-center">Prix unitaire</th>
                <th className="text-center">Quantité</th>
                <th className="text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
  {commandeDetails.map((detail, index) => {
    const prixArticle = Number(detail.Article?.prixArticle) || 0; // Convertit en nombre ou utilise 0 par défaut
    const montant = prixArticle * detail.Quantite; // Calcul du montant

    return (
      <tr key={detail.id}>
        <td>{index + 1}</td>
        <td>{detail.Article?.marque || 'Non spécifiée'}</td>
        <td className="text-center">{prixArticle.toFixed(2)} MGA</td>
        <td className="text-center">{detail.Quantite}</td>
        <td className="text-right">{montant.toFixed(2)} MGA</td>
      </tr>
    );
  })}
  <tr className="table-active font-weight-bold">
    <td colSpan="5" className="text-right">
      <strong>Total</strong>
    </td>
    <td className="text-right">
      <strong>{commande.montantTotal?.toFixed(2) || '0.00'} MGA</strong>
    </td>
  </tr>
</tbody>

          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 d-flex justify-content-between">
          <div>
            <Button
              variant="danger"
              onClick={() => {
                onDelete(commande.id);
                handleClose();
              }}
            >
              Supprimer la commande
            </Button>
          </div>
          <div>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="me-2"
            >
              Fermer
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onEdit(commande);
                handleClose();
              }}
            >
              Modifier
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
