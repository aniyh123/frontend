
class AuthModel {
    static async login(nomUtilisateur, motdepasse) {
      const response = await fetch('http://localhost:7000/authentification/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomUtilisateur, motdepasse })
      });
      return response.json();
    }
  
    static async register(userData) {
      const response = await fetch('http://127.0.0.1:7000/authentification/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return response.json();
    }
  }
  export default AuthModel;