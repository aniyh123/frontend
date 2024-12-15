import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Alert, FormControl, InputGroup, Table } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { ClientFormModal, DeleteConfirmationModal } from "../components/Client";

const PersonneApp = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("card"); // "card" ou "list"
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:7000/personne/client");
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      showAlert("Erreur lors de la récupération des clients", "danger");
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = clients.filter(
      (client) =>
        client.nom.toLowerCase().includes(value.toLowerCase()) ||
        client.prenom.toLowerCase().includes(value.toLowerCase()) ||
        client.email.toLowerCase().includes(value.toLowerCase()) ||
        client.cin.includes(value)
    );
    setFilteredClients(filtered);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleCardClick = (client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedClient) {
        await axios.put(
          `http://127.0.0.1:7000/personne/updatePersonne/${selectedClient.id}`,
          formData
        );
        showAlert("Client mis à jour avec succès", "success");
      } else {
        await axios.post("http://127.0.0.1:7000/personne/ajoutPersonne", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("Client ajouté avec succès", "success");
      }
      fetchClients();
      setShowModal(false);
      setSelectedClient(null);
    } catch (error) {
      showAlert("Erreur lors de l'opération", "danger");
    }
  };

  const handleDelete = async (id) => {
    setClientToDelete(id);
    setShowDeleteModal(true);
    setShowDetailsModal(false); 
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/personne/deletePersonne/${clientToDelete}`);
      showAlert("Client supprimé avec succès", "success");
      fetchClients();
      setShowDeleteModal(false);
      setShowDetailsModal(false); // Ferme le modal de détails
    } catch (error) {
      showAlert("Erreur lors de la suppression", "danger");
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowModal(true);
    setShowDetailsModal(false); // Ferme le modal de détails pour passer à l'édition
    
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedClient(null);
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
                  Liste des Clients
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
                    Nouvel Client
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
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="card"
                      onClick={() => handleCardClick(client)}
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
                      <div
                        style={{
                          backgroundImage: `url(http://localhost:7000/sequelize${client.photo})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          height: "150px",
                          borderRadius: "10px 10px 0 0",
                        }}
                      ></div>
                      <CardBody className="text-center">
                        <h5>{client.nom} {client.prenom}</h5>
                        <p className="text-muted">{client.email}</p>
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
                    {filteredClients.map((client, index) => (
                      <tr key={client.id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={"http://localhost:7000/sequelize" + client.photo}
                            alt={client.nom}
                            style={{ width: "60px", height: "60px", cursor: "pointer", borderRadius: "8px", marginRight:"10px"}}
                          />
                          {client.nom} {client.prenom}
                        </td>
                        <td>{client.telephone}</td>
                        <td>{client.cin}</td>
                        <td>{client.adresse}</td>
                        <td>{client.email}</td>
                        <td>
                          <Button size="sm" variant="info" onClick={() => handleEdit(client)}>
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(client.id)}>
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

      {/* Modal pour formulaire */}
      <ClientFormModal
        show={showModal}
        handleClose={handleCloseModal}
        onSubmit={handleSubmit}
        personne={selectedClient}
      />

      {/* Modal pour détails */}
      {selectedClient && (
        <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Détails du Client</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <div
                  style={{
                    backgroundImage: `url(http://localhost:7000/sequelize${selectedClient.photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200px",
                    borderRadius: "10px",
                  }}
                ></div>
                <h6 className="text-center mt-3">Photo de profil</h6>
              </Col>
              <Col md={8}>
                <h5>{selectedClient.nom} {selectedClient.prenom}</h5>
                <p><strong>Email:</strong> {selectedClient.email}</p>
                <p><strong>Téléphone:</strong> {selectedClient.telephone}</p>
                <p><strong>CIN:</strong> {selectedClient.cin}</p>
                <p><strong>Adresse:</strong> {selectedClient.adresse}</p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={() => handleEdit(selectedClient)}>
              Modifier
            </Button>
            <Button variant="danger" onClick={() => handleDelete(selectedClient.id)}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PersonneApp;
