import AuthModel from '../models/AuthModel';

class AuthController {
  static async handleLogin(nomUtilisateur, motdepasse) {
    try {
      const result = await AuthModel.login(nomUtilisateur, motdepasse);
      if (result.token) {
        localStorage.setItem('token', result.token);
        console.log(result.token);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Une erreur est survenue' };
    }
  }

  static async handleRegister(userData) {
    try {
      const result = await AuthModel.register(userData);
      return { success: true, message: result.message };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Une erreur est survenue lors de l\'inscription' };
    }
  }

    // Déconnexion de l'utilisateur
    static handleLogout() {
      // Supprimez le token du localStorage
      localStorage.removeItem('token');
      console.log("Déconnexion réussie");
    }
  
    // Méthode utilitaire pour définir le token dans le localStorage
    static setToken(token) {
      localStorage.setItem('token', token);
    }
  
    // Méthode utilitaire pour récupérer le token du localStorage
    static getToken() {
      return localStorage.getItem('token');
    }
}


export default AuthController;