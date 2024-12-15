import React, { useState, useEffect } from 'react';
import { Line, Pie } from "react-chartjs-2";
import { format, parseISO } from 'date-fns';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import './ArticleCard.css'; // Fichier CSS pour les styles d'animation.
const DashboardVentes = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      chiffreAffaires: 0,
      stockValue: 0,
      totalClients: 0,
    },
    ventesParMois: [],
    ventesParMarque: [],
    stock: [],
    caisse:[]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:7000/dashboard/dashboard');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const ventesParMoisData = dashboardData.ventesParMois.map(item => item.montant);
  const ventesParMoisLabels = dashboardData.ventesParMois.map(item => format(parseISO(item.mois), 'MMM yyyy'));
  const stockLabels = dashboardData.stock.map(item => item.marque);
  const stockData = dashboardData.stock.map(item => item.quantiteStock)
  const stockPhoto = dashboardData.stock.map(item => item.photoArticle)
  const labels = dashboardData.caisse.map(item => item.type);
  const data = dashboardData.caisse.map(item => item.montant);

  const dashboard24HoursPerformanceChart = {
    data: {
      labels:ventesParMoisLabels,
      datasets: [
        {
          borderColor: "#6bd098",
          backgroundColor: "#6bd098",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          
          data: ventesParMoisData,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        y: {
          ticks: {
            color: "#9f9f9f",
            beginAtZero: false,
            maxTicksLimit: 5,
          },
          grid: {
            drawBorder: false,
            display: false,
          },
        },
        x: {
          barPercentage: 1.6,
          grid: {
            drawBorder: false,
            display: false,
          },
          ticks: {
            padding: 20,
            color: "#9f9f9f",
          },
        },
      },
    },
  };

  const dashboardEmailStatisticsChart = {
    data: {
      labels: labels,
      datasets: [
        {
          label: "Mouvement caisse",
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ["#e3e3e3", "#4acccd"],
          borderWidth: 0,
          data: data,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: true },
        tooltip: { enabled: false },
      },
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            display: false,
          },
          grid: {
            drawBorder: false,
            display: false,
          },
        },
        x: {
          barPercentage: 1.6,
          grid: {
            drawBorder: false,
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    },
  };

  const dashboardNASDAQChart = {
    data: (canvas) => {
      return {
        labels: stockLabels,
        datasets: [
          {
            data: stockData,
            fill: false,
            borderColor: "#fbc658",
            backgroundColor: "transparent",
            pointBorderColor: "#fbc658",
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
            tension: 0.4,
          },
        
        ],
      };
    },
    options: {
      plugins: {
        legend: { display: false },
      },
    },
  };

  return (
    <div className="content">
      <br></br>
      <Row>
      <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-globe text-warning" />
                  </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Valeur de stock</p>
                      <CardTitle tag="p">{dashboardData.stats.stockValue}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" /> nombre
                </div>
              </CardFooter>
            </Card>
          </Col>
        <Col >
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                 
                </Col>
                <Col md="8" xs="8">
                  <div className="numbers">
                    <p className="card-category">Chiffre d'affaire</p>
                    <CardTitle tag="p">{dashboardData.stats.chiffreAffaires}</CardTitle>
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <hr />
              <div className="stats">
                <i className="fas fa-sync-alt" /> Ariary
              </div>
            </CardFooter>
          </Card>
        </Col>
      
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Clients</p>
                      <CardTitle tag="p">{dashboardData.stats.totalClients}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> Total
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col  md="5" S>
          <Card className="article-card">
        <div className="image-slider">
          { dashboardData.stock.map((photo, index) => (
            <div
              key={index}
              className="slider-image"
              style={{
                backgroundImage: `url(http://localhost:7000/sequelize${photo.photoArticle})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color:"white"
              }}
          
            > <strong>{photo.marque}</strong></div>
          ))}
        </div>
        <CardBody>
          <CardTitle tag="h5">Article en tendance</CardTitle>
          <p>Photos de l'article</p>
        </CardBody>
      </Card>
          </Col>
          <Col md="7">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">État du stock</CardTitle>
                <p className="card-category">en fonction de marque</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboardNASDAQChart.data}
                  options={dashboardNASDAQChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                
              </CardFooter>
            </Card>
          </Col>
        <Col md="8">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Evolution des ventes</CardTitle>
              <p className="card-category">le 12 dernier mois</p>
            </CardHeader>
            <CardBody>
              {dashboard24HoursPerformanceChart.data && (
                <Line
                  data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              )}
            </CardBody>
            <CardFooter>
              <hr />
              <div className="stats">
                <i className="fa fa-history" /> Updated 3 minutes ago
              </div>
            </CardFooter>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardHeader>
              <CardTitle tag="h5"> Mouvement de caisse</CardTitle>
              <p className="card-category">en fonction son type</p>
            </CardHeader>
            <CardBody style={{ height: "266px" }}>
              {dashboardEmailStatisticsChart.data && (
                <Pie
                  data={dashboardEmailStatisticsChart.data}
                  options={dashboardEmailStatisticsChart.options}
                />
              )}
            </CardBody>
            <CardFooter>
              <div className="legend">
                <i className="fa fa-circle text-primary" />Achat des articles {" "}
                <i className="fa fa-circle text-warning" />Paiement des commandes {" "}
              </div>
              <hr />
              <div className="stats">
                <i className="fa fa-calendar" /> Number of emails sent
              </div>
            </CardFooter>
          </Card>
        </Col>
      
      </Row>
    </div>
  );
};

export default DashboardVentes;
