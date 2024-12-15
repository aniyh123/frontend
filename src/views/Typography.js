/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React , { useState, useEffect } from "react";
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
import {EntreeArticleFormModal} from '../components/EntreeArticleModal';
import { DeleteConfirmationModal } from '../components/EntreeArticleModal';


const Caisse = () => {
  const [caisses, setCaisses] = useState([]);
  const [mouvement, setMouvement] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCaisse, setSelectedCaisse] = useState(null);
  const [caisseToDelete, setCaisseToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchCaisses();
    fetchMouvement();
  }, []);

  const fetchCaisses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:7000/caisseControlleur/caisse');
      setCaisses(response.data);
      console.log(response.data);
    } catch (error) {
      showAlert('Erreur lors de la récupération des caisses', 'danger');
      console.error(error)
    }
  };
  const fetchMouvement = async () => {
    try {
      const resultat = await axios.get('http://127.0.0.1:7000/caisseControlleur/mouvement');
      setMouvement(resultat.data);
      console.log(resultat.data);
    } catch (error) {
      showAlert('Erreur lors de la récupération des mouvement', 'danger');
      console.error(error)
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCaisse) {
        await axios.put(`http://127.0.0.1:7000/caisseControlleur/caisse/${selectedCaisse.id}`, formData);
        showAlert('Caisse mis à jour avec succès', 'success');
      } else {
        await axios.post('http://127.0.0.1:7000/caisseControlleur/caisse', formData);
        showAlert('Caisse ajouté avec succès', 'success');
      }
      fetchCaisses();
      setSelectedCaisse(null);
    } catch (error) {
      showAlert('Erreur lors de l\'opération', 'danger');
    }
  };

  const handleDelete = async (id) => {
    setCaisseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/caisseControlleur/caisse/${caisseToDelete}`);
      showAlert('Caisse supprimé avec succès', 'success');
      fetchCaisses();
      setShowDeleteModal(false);
    } catch (error) {
      showAlert('Erreur lors de la suppression', 'danger');
    }
  };

  const handleEdit = (caisse) => {
    setSelectedCaisse(caisse);
    setShowModal(true);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCaisse(null);
  };
 // Fonction pour formater la date
 const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
// Fonction pour formater les montants avec une virgule comme séparateur de milliers
const formatMontant = (montant) => {
  // Vérifier si le montant est un nombre, sinon on le convertit
  const montantNumber = parseFloat(montant);
  if (!isNaN(montantNumber)) {
    return montantNumber.toLocaleString('fr-FR'); // Applique le formatage
  }
  return montant; // Si ce n'est pas un nombre, retourne la valeur d'origine
};
  return (
    <>
      <div className="content">
      <br></br><br></br><br></br>
      <Row>
        <Col md="12" xs="8">
          <Card className="card-plain shadow" style={{borderRadius: '0.75rem 0.75rem 0 0', backgroundColor:"white"}}>
            <CardHeader className=" position-relative mt-n4 mx-3 z-index-2 text-white" style={{ borderRadius: '0.75rem 0.75rem 0 0' ,backgroundColor:"#EC407A"}}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <CardTitle tag="h4" className="mb-0">Caisse</CardTitle>
                </div>
                <div className="d-flex gap-3">
                </div>
              </div>
            </CardHeader>

            <CardBody>
              {alert.show && (
                <Alert variant={alert.type} className="mb-4">
                  {alert.message}
                </Alert>
              )}
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                   
              
                <th>Solde</th>
              
                    </tr>
                  </thead>
                  <tbody>
              {caisses.map((caisse,i)=> (
                <tr key={i}>
            
    
                <td>{formatMontant(caisse.solde)}</td>
              </tr>
              ))}
            </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col md="12" >
            <Card className="card-plain" >
              <CardHeader>
                <CardTitle tag="h4">Mouvement Caisse</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                     
                      <th>DateMouvement</th>
                      <th>CaisseId</th>
                      <th>Montant</th>
                      <th>Type</th>
                      <th>description</th>
                      <th>paiementId</th>
                      <th>entreeArticleId</th>
                    </tr>
                  </thead>
                  <tbody>
                  {mouvement.map((mouvement,i)=> (
                    <tr key={i}>
                    
                      <td>{formatDate(mouvement.dateMouvement)}</td>
                      <td>{mouvement.caisseId}</td>
                      <td>{formatMontant(mouvement.montant)}</td>
                      <td>{mouvement.type}</td>
                      <td>{mouvement.description}</td>
                      <td>{mouvement.paiementId}</td>
                      <td>{mouvement.entreeArticleId}</td>
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
        caisse={selectedCaisse}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
      </div>
    </>
  );
}

export default Caisse;
