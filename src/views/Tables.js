import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Alert, FormControl, InputGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import {Card,CardHeader, CardBody,CardTitle,Table,Row,Col,
} from "reactstrap";
import { ArticleFormModal } from "../components/ArticleModal";
import { DeleteConfirmationModal } from "../components/ArticleModal";
import './view.css';
const ArticleApp = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("card"); // "card" ou "table"
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "moto", ou "pieces"
  useEffect(() => {
    fetchArticles();
  }, []);
 
  useEffect(() => {
    applyFilters();
  }, [articles, searchTerm, filterType]);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:7000/article/articles");
      setArticles(response.data);
      setFilteredArticles(response.data);
    } catch (error) {
      showAlert("Erreur lors de la récupération des articles", "danger");
      console.error(error);
    }
  };

  const applyFilters = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((article) => article.type.toLowerCase() === filterType);
    }

    setFilteredArticles(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };
  const handleSubmit = async (formData) => {
    try {
      if (selectedArticle) {
        await axios.put(
          `http://127.0.0.1:7000/article/updatearticles/${selectedArticle.id}`,
          formData
        );
        showAlert("Article mis à jour avec succès", "success");
      } else {
        await axios.post("http://127.0.0.1:7000/article/ajoutarticles", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("Article ajouté avec succès", "success");
      }
      fetchArticles();
      setShowModal(false);
      setSelectedArticle(null);
    } catch (error) {
      showAlert("Erreur lors de l'opération", "danger");
    }
  };
  const handleDelete = async (id) => {
    setArticleToDelete(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:7000/article/deletearticles/${articleToDelete}`);
      showAlert("Article supprimé avec succès", "success");
      fetchArticles();
      setShowDeleteModal(false);
    } catch (error) {
      showAlert("Erreur lors de la suppression", "danger");
    }
  };
  const handleShowDetails = (article) => {
    setSelectedArticle(article);
    setShowDetailsModal(true);
  };
  const handleEdit = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedArticle(null);
  };
  const formatMontant = (montant) => {
    const montantNumber = parseFloat(montant);
    return !isNaN(montantNumber) ? montantNumber.toLocaleString("fr-FR") : montant;
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
                  Articles en stock
                </CardTitle>
                <div className="d-flex gap-3">
                  <InputGroup className="no-border" style={{ width: "250px", height:"10px",marginTop:"10px" }}>
                    <FormControl
                      placeholder="Rechercher marque ou modèle..."
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{
                        backgroundColor: "White",
                        color: "black",
                      }}
                    />
                    

                  </InputGroup>
                  <FormControl
                    as="select"
                    value={filterType}
                    onChange={handleFilterTypeChange}
                    style={{ width: "150px", backgroundColor: "White", color: "black",marginTop:"10px"  }}
                  >
                    <option value="all">Tous les types</option>
                    <option value="moto">Motos</option>
                    <option value="pieces">Pièces</option>
                  </FormControl>
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
                    Nouvel Article
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
                <div className="d-flex flex-wrap gap-3">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="card"
                      onClick={() => handleShowDetails(article)}
                      style={{
                        width: "14rem",
                        cursor: "pointer",
                        backgroundImage: `url(http://localhost:7000/sequelize${article.photoArticle})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "white",
                        borderRadius: "10px",
                        padding: "1rem",
                        margin: "1rem",
                      }}
                    >
                      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "0.5rem", borderRadius: "5px" }}>
                        <h5 className="card-title">{article.marque}</h5>
                        <p className="card-text">{article.modele}</p>
                        <p className="card-text">
                          <strong>Prix:</strong> {formatMontant(article.prixArticle)}Ariary
                        </p>
                        <p className="card-text">
                          <strong
                            className={`
                              ${article.quantiteStock <= 5 ? "text-danger" : ""} 
                              ${article.quantiteStock > 5 && article.quantiteStock < 10 ? "text-warning" : ""} 
                              ${article.quantiteStock >= 10 && article.quantiteStock <= 50 ? "text-success" : ""} 
                              ${article.quantiteStock > 50 ? "text-muted" : ""}`}
                          >
                            Stock:
                          </strong>{" "}
                          {article.quantiteStock}
                          {article.quantiteStock <= 5 && (
                            <Alert variant="danger" className="mt-1 p-1">
                              Rupture de stock!
                            </Alert>
                          )}
                          {article.quantiteStock > 5 && article.quantiteStock < 10 && (
                            <Alert variant="warning" className="mt-1 p-1">
                              Stock bas!
                            </Alert>
                          )}
                          {article.quantiteStock >= 10 && article.quantiteStock <= 50 && (
                            <Alert variant="success" className="mt-1 p-1">
                              Stock normal.
                            </Alert>
                          )}
                          {article.quantiteStock > 50 && (
                            <Alert variant="info" className="mt-1 p-1">
                              Stock abondant.
                            </Alert>
                          )}
                        </p>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Marque</th>
                      <th>Modèle</th>
                      <th>Type</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Photo</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article, i) => (
                      <tr key={i}>
                        <td>{article.marque}</td>
                        <td>{article.modele}</td>
                        <td>{article.type}</td>
                        <td>{formatMontant(article.prixArticle)}</td>
                        <td
                          className={`
                            ${article.quantiteStock <= 5 ? "text-danger" : ""} 
                            ${article.quantiteStock > 5 && article.quantiteStock < 10 ? "text-warning" : ""} 
                            ${article.quantiteStock >= 10 && article.quantiteStock <= 50 ? "text-success" : ""} 
                            ${article.quantiteStock > 50 ? "text-muted" : ""}`}
                        >
                          {article.quantiteStock}
                          {article.quantiteStock <= 5 && (
                            <Alert variant="danger" className="mt-1 p-1">
                              Rupture de stock!
                            </Alert>
                          )}
                          {article.quantiteStock > 5 && article.quantiteStock < 10 && (
                            <Alert variant="warning" className="mt-1 p-1">
                              Stock bas!
                            </Alert>
                          )}
                          {article.quantiteStock >= 10 && article.quantiteStock <= 50 && (
                            <Alert variant="success" className="mt-1 p-1">
                              Stock normal.
                            </Alert>
                          )}
                          {article.quantiteStock > 50 && (
                            <Alert variant="info" className="mt-1 p-1">
                              Stock abondant.
                            </Alert>
                          )}
                        </td>

                        <td>
                          <img
                            src={"http://localhost:7000/sequelize" + article.photoArticle}
                            alt={article.modele}
                            style={{ width: "60px", height: "60px", borderRadius: "8px", cursor: "pointer" }}
                            onClick={() => {
                              setSelectedImage(`http://localhost:7000/sequelize${article.photoArticle}`);
                              setShowImageModal(true);
                            }}
                          />
                        </td>
                        <td>
                          <Button size="sm" variant="info" onClick={() => handleEdit(article)}>
                          <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(article.id)}
                          >
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

      {/* Modal Ajout/Modification */}
      <ArticleFormModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedArticle(null);
        }}
        onSubmit={handleSubmit}
        article={selectedArticle}
      />

      {/* Modal Suppression */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      {/* Modal Informations */}
      {showDetailsModal && selectedArticle && (
        <Modal show={true} onHide={handleCloseDetails} centered>
          <Modal.Header closeButton>
            <Modal.Title>Informations sur {selectedArticle.marque}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Modèle:</strong> {selectedArticle.modele}
            </p>
            <p>
              <strong>Type:</strong> {selectedArticle.type}
            </p>
            <p>
              <strong>Prix:</strong> {formatMontant(selectedArticle.prixArticle)} €
            </p>
            <p>
              <strong>Stock:</strong> {selectedArticle.quantiteStock}
            </p>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="info"
                onClick={() => handleEdit(selectedArticle)}
              >
               <i className="bi bi-pencil"></i>
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(selectedArticle.id)}
                style={{ }}
              >
                  <i className="bi bi-trash"></i>
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {/* Modal Affichage Image */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered >
        <Modal.Header closeButton>
          <Modal.Title>Image de l'article </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <img src={selectedImage} alt="Aperçu" style={{ width: "100%", height:"50%"}} />
         
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ArticleApp;
