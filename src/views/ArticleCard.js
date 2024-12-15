import React from 'react';
import { Card, CardBody, CardFooter, CardTitle } from "reactstrap";
import './ArticleCard.css'; // Fichier CSS pour les styles d'animation.

const ArticleCard = ({ marque, photos = [] }) => {
    if (!Array.isArray(photos)) {
      console.error("photos should be an array but received:", photos);
      return null;
    }
  
    return (
      <Card className="article-card">
        <div className="image-slider">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="slider-image"
              style={{
                backgroundImage: `url(${photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          ))}
        </div>
        <CardBody>
          <CardTitle tag="h5">{marque}</CardTitle>
          <p>Photos de l'article</p>
        </CardBody>
      </Card>
    );
  };
  

export default ArticleCard;
