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
  import { Container, Alert } from 'react-bootstrap';
  import { DeleteConfirmationModal } from '../components/Categorie';
  import { CategorieFormModal } from '../components/Categorie';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  
  const Categorie = () => {
    const [categorie, setCategorie] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategorie, setSelectedCategorie] = useState(null);
    const [categorieToDelete, setCategorieToDelete] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
    useEffect(() => {
      fetchCategorie();
      
    }, []);
  
    const fetchCategorie = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:7000/categorie');
        setCategorie(response.data);
        console.log(response.data);
      } catch (error) {
        showAlert('Erreur lors de la récupération des categories', 'danger');
        console.error(error)
      }
    };
  
  
    const handleSubmit = async (formData) => {
      try {
        if (selectedCategorie) {
          await axios.put(`http://127.0.0.1:7000/categorie/${selectedCategorie.id}`, formData);
          showAlert('Categorie mis à jour avec succès', 'success');
        } else {
          await axios.post('http://127.0.0.1:7000/categorie', formData);
          showAlert('Categorie ajouté avec succès', 'success');
        }
        fetchCategorie();
        setSelectedCategorie(null);
      } catch (error) {
        showAlert('Erreur lors de l\'opération', 'danger');
      }
    };
  
    const handleDelete = async (id) => {
      setCategorieToDelete(id);
      setShowDeleteModal(true);
    };
  
    const confirmDelete = async () => {
      try {
        await axios.delete(`http://127.0.0.1:7000/categorie/${categorieToDelete}`);
        showAlert('Categorie supprimé avec succès', 'success');
        fetchCategorie();
        setShowDeleteModal(false);
      } catch (error) {
        showAlert('Erreur lors de la suppression', 'danger');
      }
    };
  
    const handleEdit = (categorie) => {
      setSelectedCategorie(categorie);
      setShowModal(true);
    };
  
    const showAlert = (message, type) => {
      setAlert({ show: true, message, type });
      setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedCategorie(null);
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
                  <CardTitle tag="h4">Catégorie des personnes </CardTitle>
                  <Button variant="success" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle"></i> Nouvel categorie
                  </Button>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                   
                  <th>nom catégorie</th>
                
                  <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                {categorie.map((categorie,i)=> (
                  <tr key={i}>
                 
                  <td>{categorie.nomCategorie}</td>
                  <td>
                    <Button variant="primary" className="me-2" onClick={e=>handleEdit(categorie)}>
                      <i className="bi bi-pencil"></i> 
                    </Button>
                    <Button variant="danger" onClick={e=>handleDelete(categorie.id)}>
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
          <CategorieFormModal
        show={showModal}
        handleClose={handleCloseModal}
        categorie={selectedCategorie}
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
  
  export default Categorie;
  