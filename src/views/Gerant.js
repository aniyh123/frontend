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


// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col,
  } from "reactstrap";
  import React , { useState, useEffect } from "react";
  import axios from "axios";
  import { Alert } from 'react-bootstrap';
  import { DeleteConfirmationModal } from '../components/Gerant';
  import { GerantFormModal } from '../components/Gerant';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  
  const Personne = () => {
    const [personne, setPersonne] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPersonne, setSelectedPersonne] = useState(null);
    const [personneToDelete, setPersonneToDelete] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
    useEffect(() => {
      fetchPersonne();
      
    }, []);
  
    const fetchPersonne = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:7000/personne/gerant');
        setPersonne(response.data);
        console.log(response.data);
      } catch (error) {
        showAlert('Erreur lors de la récupération des personnes', 'danger');
        console.error(error)
      }
    };
  
  
    const handleSubmit = async (formData) => {
      try {
        if (selectedPersonne) {
          await axios.put(`http://127.0.0.1:7000/personne/updatePersonne/${selectedPersonne.id}`, formData);
          showAlert('Personne mis à jour avec succès', 'success');
        } else {
          await axios.post("http://127.0.0.1:7000/personne/ajoutPersonne", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          showAlert('Personne ajouté avec succès', 'success');
        }
        fetchPersonne();
        setSelectedPersonne(null);
      } catch (error) {
        showAlert('Erreur lors de l\'opération', 'danger');
      }
    };
  
    const handleDelete = async (id) => {
      setPersonneToDelete(id);
      setShowDeleteModal(true);
    };
  
    const confirmDelete = async () => {
      try {
        await axios.delete(`http://127.0.0.1:7000/personne/deletePersonne/${personneToDelete}`);
        showAlert('Personne supprimé avec succès', 'success');
        fetchPersonne();
        setShowDeleteModal(false);
      } catch (error) {
        showAlert('Erreur lors de la suppression', 'danger');
      }
    };
  
    const handleEdit = (personne) => {
      setSelectedPersonne(personne);
      setShowModal(true);
    };
  
    const showAlert = (message, type) => {
      setAlert({ show: true, message, type });
      setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedPersonne(null);
    };
    return (
      <>
        <div className="content">
        <br></br>
        <Row>
            <Col md="12">
              <Card>
              {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}
                <CardHeader>
                  <CardTitle tag="h4">Liste des Gérants </CardTitle>
                  <Button variant="success" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle"></i> Nouvel Gérant
                  </Button>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                   
                  <th>nom</th>
                  <th>prenom</th>
                  <th>telephone</th>
                  <th>cin </th>
                  <th>adresse</th>
                  <th>email</th>
                  <th>photo</th>
                  <th>Categorie</th>
                  <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                {personne.map((personne,i)=> (
                  <tr key={i}>
                 
                  <td>{personne.nom}</td>
                  <td>{personne.prenom}</td>
                  <td>{personne.telephone}</td>
                  <td>{personne.cin}</td>
                  <td>{personne.adresse}</td>
                  <td>{personne.email}</td>
                  <td>
                          <img
                            src={"http://localhost:7000/sequelize" + personne.photo}
                            alt={personne.nom}
                            style={{ width: "60px", height: "60px", cursor: "pointer", borderRadius: "8px", marginRight:"10px"}}
                          />
                         
                        </td>
                  <td>{personne.categorieUtilisateur ? personne.categorieUtilisateur.nomCategorie : 'N/A'}</td>
                  
                 
                  <td>
                    <Button variant="primary" className="me-2" onClick={e=>handleEdit(personne)}>
                      <i className="bi bi-pencil"></i> 
                    </Button>
                    <Button variant="danger" onClick={e=>handleDelete(personne.id)}>
                      <i className="bi bi-trash"></i> 
                    </Button>
                    
                  </td>
                </tr>
                ))}
              </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
          <GerantFormModal
        show={showModal}
        handleClose={handleCloseModal}
        personne={selectedPersonne}
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
  
  export default Personne;
  