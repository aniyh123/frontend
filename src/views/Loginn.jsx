import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthController from '../controlleur/AuthController';
import { useNavigate } from "react-router-dom";

const Loginn = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await AuthController.handleLogin(nomUtilisateur, motdepasse);
    if (result.success) {
      setMessage('Connexion réussie');
      setVariant('success');
      navigate('/dashboard')

    } else {
      setMessage(result.message);
      setVariant('danger');
    }
  };

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Connexion</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={nomUtilisateur}
                onChange={(e) => setNomUtilisateur(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Se connecter
            </Button>
          </Form>
          {message && <Alert className="mt-3" variant={variant}>{message}  </Alert>}
          <div className="text-center mt-3">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
          <div className="text-center mt-3">
            Pas encore de compte ? <Link to="/registre">S'inscrire</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
export default Loginn;