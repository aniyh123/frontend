import React, { useState, useEffect } from "react";
import axios from "axios";
import {  Button,  FormControl, InputGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

const RapportVente = () => {
  const [rapports, setRapports] = useState([]); // Stocker les données récupérées
  const [filteredRapports, setFilteredRapports] = useState([]); // Données filtrées
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les filtres
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

     // Récupérer les données depuis l'API
     const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:7000/rapport/rapport");
        setRapports(response.data);
        setFilteredRapports(response.data); // Par défaut, on affiche tout
      } catch (err) {
        setError("Erreur lors du chargement des rapports.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
 
    fetchData();
  }, []);

  const filterByDate = (type) => {
    const now = new Date();
    let filtered = [];

    switch (type) {
      case "jour":
        filtered = rapports.filter((paiement) =>
          new Date(paiement.createdAt).toDateString() === now.toDateString()
        );
        break;

      case "semaine":
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = rapports.filter(
          (paiement) => new Date(paiement.createdAt) >= startOfWeek
        );
        break;

      case "mois":
        filtered = rapports.filter(
          (paiement) => new Date(paiement.createdAt).getMonth() === now.getMonth()
        );
        break;

      case "intervalle":
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          filtered = rapports.filter((paiement) => {
            const date = new Date(paiement.createdAt);
            return date >= start && date <= end;
          });
        }
        break;

      default:
        filtered = rapports;
    }

    setFilteredRapports(filtered);
  };

    // Fonction pour générer le PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
    
        // Titre du document
        doc.text("Rapport de Vente", 14, 15);
    
        // Préparer les colonnes et les données
        const columns = [
          "Date paiement",
          "Client",
          "Article",
          "Quantité",
          "Prix Unitaire (MGA)",
          "Total HT (MGA)",
        ];
    
        const data = filteredRapports.flatMap((paiement) =>
          paiement.Commande.DetailCommande.map((detail) => [
            new Date(paiement.createdAt).toLocaleDateString("fr-FR"),
            `${paiement.Personne.nom} ${paiement.Personne.prenom}`,
            detail.Article?.marque || "Article non défini",
            detail.Quantite,
            detail.Article?.prixArticle || "N/A",
            detail.Montant ? detail.Montant.toFixed(2) : "Non défini",
          ])
        );
    
        // Ajouter les données dans le tableau PDF
        doc.autoTable({
          head: [columns],
          body: data,
          startY: 20, // Position de départ après le titre
          theme: "striped",
        });
    
        // Sauvegarder le PDF
        doc.save("rapport_vente.pdf");
      };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="content">
      <br></br> <br></br>
      <Row>
        <Col md="12">
          <Card className="card-plain shadow" style={{ borderRadius: "0.75rem" }}>
            <CardHeader
              className="mt-n4 mx-3"
              style={{ backgroundColor: "#EC407A", borderRadius: "0.75rem" }}
            >
              <CardTitle tag="h4" className="text-white mb-0">
                Rapport de Vente
              </CardTitle>
            </CardHeader>

            <CardBody>
              {/* Filtres */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button variant="primary" onClick={() => filterByDate("jour")}>
                  Aujourd'hui
                </Button>
                <Button variant="success" onClick={() => filterByDate("semaine")}>
                  Cette semaine
                </Button>
                <Button variant="warning" onClick={() => filterByDate("mois")}>
                  Ce mois
                </Button>
                <Button variant="danger" onClick={exportToPDF}>
                  Télécharger en PDF
                </Button>
                <Button variant="info" onClick={fetchData}>
                  Actualiser
                </Button>

                <InputGroup>
                  <FormControl
                    type="date"
                    placeholder="Date de début"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <FormControl
                    type="date"
                    placeholder="Date de fin"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <Button
                    variant="info"
                    onClick={() => filterByDate("intervalle")}
                  >
                    Filtrer
                  </Button>
                </InputGroup>
              </div>

              {/* Tableau des rapports */}
              <Table responsive hover>
                <thead>
                  <tr style={{ backgroundColor: "#333", color: "#fff" }}>
                    <th>Date paiement</th>
                    <th>Client</th>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix Unitaire</th>
                    <th>Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRapports.map((paiement) =>
                    paiement.Commande.DetailCommande.map((detail, index) => (
                      <tr key={index}>
                        <td>
                          {new Date(paiement.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td>
                          {paiement.Personne.nom} {paiement.Personne.prenom}
                        </td>
                        <td>
                          {detail.Article?.marque || "Article non défini"}
                        </td>
                        <td>{detail.Quantite}</td>
                        <td>{detail.Article?.prixArticle || "N/A"} MGA</td>
                        <td>
                          {detail.Montant
                            ? detail.Montant.toFixed(2)
                            : "Montant non défini"}{" "}
                          MGA
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RapportVente;
