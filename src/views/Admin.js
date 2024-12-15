import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Alert, FormControl, InputGroup, Table } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { AdminFormModal, DeleteConfirmationModal } from "../components/PersonneModal";
import "./view.css";

const PersonneApp = () => {
  const [personnes, setPersonnes] = useState([]);
  const [filteredPersonnes, setFilteredPersonnes] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPersonne, setSelectedPersonne] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [personneToDelete, setPersonneToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" ou "list"
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPersonnes();
  }, []);

  const fetchPersonnes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:7000/personne/admin");
      setPersonnes(response.data);
      setFilteredPersonnes(response.data);
    } catch (error) {
      showAlert("Erreur lors de la récupération des administrateurs", "danger");
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = personnes.filter(
      (personne) =>
        personne.nom.toLowerCase().includes(value.toLowerCase()) ||
        personne.prenom.toLowerCase().includes(value.toLowerCase()) ||
        personne.email.toLowerCase().includes(value.toLowerCase()) ||
        personne.cin.includes(value)
    );
    setFilteredPersonnes(filtered);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleCardClick = (personne) => {
    setSelectedPersonne(personne);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedPersonne) {
        console.log("Mise à jour de la personne :", selectedPersonne.id);
        const response = await axios.put(
          `http://127.0.0.1:7000/personne/updatePersonne/${selectedPersonne.id}`,
          formData
        );
        console.log("Réponse du serveur :", response.data);
        showAlert("Administrateur mis à jour avec succès", "success");
      } else {
        await axios.post("http://127.0.0.1:7000/personne/ajoutPersonne", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("Administrateur ajouté avec succès", "success");
      }
      fetchPersonnes();
      setShowModal(false);
      setSelectedPersonne(null);
    } catch (error) {
      showAlert("Erreur lors de l'opération", "danger");
    }
  };

  const handleDelete = async (id) => {
    setPersonneToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/personne/deletePersonne/${personneToDelete}`);
      showAlert("Administrateur supprimé avec succès", "success");
      fetchPersonnes();
      setShowDeleteModal(false);
    } catch (error) {
      showAlert("Erreur lors de la suppression", "danger");
    }
  };

  const handleEdit = (personne) => {
    setSelectedPersonne(personne);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPersonne(null);
  };
  const handleShowDetails = (personne) => {
    setSelectedPersonne(personne);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedPersonne(null);
  };

  return (
    <div className="content">
      <br /> <br /> <br />
      <Row>
        <Col md="12">
          <Card className="card-plain shadow" style={{ borderRadius: "0.75rem", backgroundColor: "white" }}>
            <CardHeader
              className="position-relative mt-n4 mx-3 z-index-2 text-white"
              style={{ borderRadius: "0.75rem", backgroundColor: "#EC407A" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4" className="mb-0">
                  Administrateurs
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
                    Nouvel Administrateur
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
                  {filteredPersonnes.map((personne) => (
                    <div
                      key={personne.id}
                      className="card"
                      onClick={() => handleShowDetails(personne)}
                      style={{
                        width: "14rem",
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "10px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        padding: "1rem",
                        margin: "1rem",
                      }}
                     
                    >
                        {/* Photo de couverture */}
            <div
              style={{
                backgroundImage: `url(http://localhost:7000/sequelize${personne.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "150px",
                borderRadius: "10px 10px 0 0",
              }}
            ></div>
            {/* Photo de profil */}
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "-50px auto 10px auto",
                borderRadius: "50%",
                backgroundImage: `url(http://localhost:7000/sequelize${personne.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "4px solid white",
              }}
            ></div>
                      <CardBody className="text-center">
                        <h5>{personne.nom} {personne.prenom}</h5>
                        <p className="text-muted">{personne.email}</p>
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
                      <th >Téléphone</th>
                    <th >CIN</th>
                    <th >Adresse</th>
                    <th >Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPersonnes.map((personne, index) => (
                      <tr key={personne.id}>
                        <td>{index + 1}</td>
                        <td>
                        <img
                          src={"http://localhost:7000/sequelize" + personne.photo}
                          alt={personne.nom}
                          style={{ width: "60px", height: "60px", cursor: "pointer", borderRadius: "8px", marginRight:"10px"}}
                          onClick={() => handleImageClick("http://localhost:7000/sequelize" + personne.photo)}
                        />
                                 {personne.nom} {personne.prenom}</td>
                        <td>{personne.telephone}</td>
                      <td>{personne.cin}</td>
                      <td>{personne.adresse}</td>
                      <td>{personne.email}</td>
                        <td>
                          <Button size="sm" variant="info" onClick={() => handleEdit(personne)}>
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(personne.id)}>
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

      <AdminFormModal
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
           {showDetailsModal && selectedPersonne && (
        <Modal show={true} onHide={handleCloseDetails} centered>
          <Modal.Header closeButton>
            <Modal.Title>Actions pour {selectedPersonne.nom}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Nom:</strong> {selectedPersonne.nom}</p>
            <p><strong>Prénom:</strong> {selectedPersonne.prenom}</p>
            <p><strong>Email:</strong> {selectedPersonne.email}</p>
            <p><strong>Téléphone:</strong> {selectedPersonne.telephone}</p>
            <p><strong>CIN:</strong> {selectedPersonne.cin}</p>
            <div className="d-flex gap-2">
               <Button
                            size="sm"
                            variant="info"
                            className="d-flex align-items-center"
                            onClick={() => handleEdit(selectedPersonne)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="d-flex align-items-center"
                            onClick={() => handleDelete(selectedPersonne.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
            </div>
          </Modal.Body>
        </Modal> )}
    </div>
  
  );
};

export default PersonneApp;
