import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Alert, FormControl, InputGroup, Table } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { VendeurFormModal, DeleteConfirmationModal } from "../components/Vendeur";

const VendeurApp = () => {
  const [vendeurs, setVendeurs] = useState([]);
  const [filteredVendeurs, setFilteredVendeurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVendeur, setSelectedVendeur] = useState(null);
  const [vendeurToDelete, setVendeurToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchVendeurs();
  }, []);

  const fetchVendeurs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:7000/personne/vendeur");
      setVendeurs(response.data);
      setFilteredVendeurs(response.data);
    } catch (error) {
      showAlert("Erreur lors de la récupération des vendeurs", "danger");
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = vendeurs.filter(
      (vendeur) =>
        vendeur.nom.toLowerCase().includes(value.toLowerCase()) ||
        vendeur.prenom.toLowerCase().includes(value.toLowerCase()) ||
        vendeur.email.toLowerCase().includes(value.toLowerCase()) ||
        vendeur.cin.includes(value)
    );
    setFilteredVendeurs(filtered);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleCardClick = (vendeur) => {
    setSelectedVendeur(vendeur);
    setShowDetailsModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedVendeur) {
        await axios.put(
          `http://127.0.0.1:7000/personne/updatePersonne/${selectedVendeur.id}`,
          formData
        );
        showAlert("Vendeur mis à jour avec succès", "success");
      } else {
        await axios.post("http://127.0.0.1:7000/personne/ajoutPersonne", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("Vendeur ajouté avec succès", "success");
      }
      fetchVendeurs();
      setShowModal(false);
      setSelectedVendeur(null);
    } catch (error) {
      showAlert("Erreur lors de l'opération", "danger");
    }
  };

  const handleDelete = async (id) => {
    setVendeurToDelete(id);
    setShowDeleteModal(true);
    setShowDetailsModal(false);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/personne/deletePersonne/${vendeurToDelete}`);
      showAlert("Vendeur supprimé avec succès", "success");
      fetchVendeurs();
      setShowDeleteModal(false);
    } catch (error) {
      showAlert("Erreur lors de la suppression", "danger");
    }
  };

  const handleEdit = (vendeur) => {
    setSelectedVendeur(vendeur);
    setShowModal(true);
    setShowDetailsModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVendeur(null);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedVendeur(null);
  };

  return (
    <div className="content">
      <br></br>  <br></br>
      <Row>
        <Col md="12">
          <Card className="card-plain shadow" style={{ borderRadius: "0.75rem", backgroundColor: "white" }}>
            <CardHeader
              className="position-relative mt-n4 mx-3 z-index-2 text-white"
              style={{ borderRadius: "0.75rem", backgroundColor: "#EC407A" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4" className="mb-0">
                  Liste des Vendeurs
                </CardTitle>
                <div className="d-flex gap-3">
                  <InputGroup className="no-border" style={{ width: "300px" }}>
                    <FormControl
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        color: "white",
                      }}
                    />
                  </InputGroup>
                  <Button
                    variant="light"
                    onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
                  >
                    <i className={`bi bi-${viewMode === "card" ? "list" : "grid"}`}></i>{" "}
                    {viewMode === "card" ? "Affichage Liste" : "Affichage Carte"}
                  </Button>
                  <Button
                    variant="light"
                    className="d-flex align-items-center gap-2"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="bi bi-plus-circle"></i>
                    Nouvel Vendeur
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
              {viewMode === "card" ? (
                <Row className="d-flex flex-wrap gap-4">
                  {filteredVendeurs.map((vendeur) => (
                    <div
                      key={vendeur.id}
                      className="card"
                      onClick={() => handleCardClick(vendeur)}
                      style={{
                        width: "14rem",
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "10px",
                        padding: "1rem",
                        margin: "1rem",
                      }}
                    >
                      <div
                        style={{
                          backgroundImage: `url(http://localhost:7000/sequelize${vendeur.photo})`,
                          backgroundSize: "cover",
                          height: "150px",
                        }}
                      ></div>
                      <CardBody className="text-center">
                        <h5>{vendeur.nom} {vendeur.prenom}</h5>
                        <p className="text-muted">{vendeur.email}</p>
                      </CardBody>
                    </div>
                  ))}
                </Row>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nom et prénom</th>
                      <th>Téléphone</th>
                      <th>CIN</th>
                      <th>Adresse</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendeurs.map((vendeur, index) => (
                      <tr key={vendeur.id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={"http://localhost:7000/sequelize" + vendeur.photo}
                            alt={vendeur.nom}
                            style={{ width: "60px", height: "60px", cursor: "pointer", borderRadius: "8px", marginRight:"10px"}}
                          />
                          {vendeur.nom} {vendeur.prenom}
                        </td>
                        <td>{vendeur.telephone}</td>
                        <td>{vendeur.cin}</td>
                        <td>{vendeur.adresse}</td>
                        <td>{vendeur.email}</td>
                        <td>
                          <Button size="sm" variant="info" onClick={() => handleEdit(vendeur)}>
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(vendeur.id)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <VendeurFormModal
        show={showModal}
        handleClose={handleCloseModal}
        onSubmit={handleSubmit}
        personne={selectedVendeur}
      />
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
            {/* Modal pour détails */}
            {selectedVendeur && (
        <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Détails du Vendeur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <div
                  style={{
                    backgroundImage: `url(http://localhost:7000/sequelize${selectedVendeur.photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200px",
                    borderRadius: "10px",
                  }}
                ></div>
                <h6 className="text-center mt-3">Photo de profil</h6>
              </Col>
              <Col md={8}>
                <h5>{selectedVendeur.nom} {selectedVendeur.prenom}</h5>
                <p><strong>Email:</strong> {selectedVendeur.email}</p>
                <p><strong>Téléphone:</strong> {selectedVendeur.telephone}</p>
                <p><strong>CIN:</strong> {selectedVendeur.cin}</p>
                <p><strong>Adresse:</strong> {selectedVendeur.adresse}</p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={() => handleEdit(selectedVendeur)}>
              Modifier
            </Button>
            <Button variant="danger" onClick={() => handleDelete(selectedVendeur.id)}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default VendeurApp;
