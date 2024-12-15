import React, { useEffect,useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthController from '../controlleur/AuthController';
import axios from 'axios';

const Registre = () => {
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    cin: '',
    email: '',
    adresse: '',
    motdepasse: '',
    categorieId: '',
    nomUtilisateur: ''
  });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');

  const [categorie,setCategorie]= useState([]);
  useEffect(()=>{
   const  fetchCategorie= async() =>{
    try {
       const reponse = await axios.get('http://127.0.0.1:7000/categorie');
       setCategorie(reponse.data);
    } catch (error) {
      console.error(error)
    }
   };
   fetchCategorie();
  },[]);
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await AuthController.handleRegister(userData);
    setMessage(result.message);
    setVariant(result.success ? 'success' : 'danger');
  };

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '800px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Inscription</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formNom">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control name="nom" value={userData.nom} onChange={handleChange} placeholder="Nom" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPrenom">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control name="prenom" value={userData.prenom} onChange={handleChange} placeholder="Prénom" required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formTelephone">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control name="telephone" value={userData.telephone} onChange={handleChange} placeholder="Téléphone" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formCIN">
                  <Form.Label>CIN</Form.Label>
                  <Form.Control name="cin" value={userData.cin} onChange={handleChange} placeholder="CIN" required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={userData.email} onChange={handleChange} placeholder="Email" required type="email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAdresse">
              <Form.Label>Adresse</Form.Label>
              <Form.Control name="adresse" value={userData.adresse} onChange={handleChange} placeholder="Adresse" required />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formMotdepasse">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control name="motdepasse" value={userData.motdepasse} onChange={handleChange} placeholder="Mot de passe" required type="password" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formCategorieId">
                  <Form.Label>Catégorie</Form.Label>
                
                  <Form.Control as="select" name="categorieId"   value={userData.categorieId} onChange={handleChange} required>
                    <option   value="">Sélectionnez une catégorie</option>
                    {categorie.map((d,i)=>(
                    <option key={i} value={d.id} > {d.id}</option>
                  ))}
                  </Form.Control>
                 
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formNomUtilisateur">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control name="nomUtilisateur" value={userData.nomUtilisateur} onChange={handleChange} placeholder="Nom d'utilisateur" required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              S'inscrire
            </Button>
          </Form>
          {message && <Alert className="mt-3" variant={variant}>{message}</Alert>}
          <div className="text-center mt-3">
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
export default Registre;