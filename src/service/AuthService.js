import AuthController from '../controlleur/AuthController';
import { jwtDecode } from 'jwt-decode';

class AuthService {
  static getUserRole() {
    const token = AuthController.getToken();
    if (!token) return null;
    
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.role; // Assurez-vous que votre token contient un champ 'role'
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  static isAuthenticated() {
    const token = AuthController.getToken();
    return token && !AuthService.isTokenExpired(token);
  }

  static isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      // Vérifie si le token a expiré en comparant son champ d'expiration (exp) avec l'heure actuelle
      return decoded.exp * 1000 < Date.now(); // `exp` est souvent en secondes
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Considérer le token comme expiré en cas d'erreur
    }
  }

  // Définir les permissions par rôle
  static rolePermissions = {
    admin: [
      '/dashboard',
      '/icons',
      '/maps',
      '/notifications',
      '/user-page',
      '/user-page/admin',
      '/user-page/client',
      '/user-page/vendeur',
      '/user-page/gerant',
      '/user-page/fournisseur',
      '/tables',
      '/typography'
    ],
    vendeur: [
      '/dashboard',
      '/maps', // Commande
      '/notifications', // Paiement
      '/typography' // Caisse
    ],
    gerant: [
      '/dashboard',
      '/icons', // Entrée Article
      '/tables', // Articles
      '/user-page/fournisseur' // Gestion des fournisseurs
    ]
  };

  static hasPermission(path) {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    
    const permissions = this.rolePermissions[userRole];
    if (!permissions) return false;

    // Vérifie si le chemin est autorisé pour ce rôle
    return permissions.some(permittedPath => 
      path.startsWith(permittedPath) || path === permittedPath
    );
  }
}

export default AuthService;
