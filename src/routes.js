import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import ArticleApp from "views/Tables.js";
import Maps from "views/Map.js";
import UserPage from "views/User.js";
import Client from "views/Client.js"
import Vendeur from "views/Vendeur.js"
import Gerant from "views/Gerant.js"
import Admin from "views/Admin.js"
import Categorie from "views/Categorie";
import Fournisseur from "views/Fournisseur";
import RapportVente from "views/Rapport";
import 'bootstrap-icons/font/bootstrap-icons.css';

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "bi bi-house-door",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Entrée Article",
    icon: "bi bi-box",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Commande",
    icon: "bi bi-cart",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Paiement",
    icon: "bi bi-credit-card",
    component: <Notifications />,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "Personne",
    icon: "bi bi-person",
    component: <UserPage />,
    layout: "/admin",
    subRoutes: [
      { 
        path: "/admin", 
        name: "Admin", 
        component: <Admin />, 
        icon: "bi bi-shield-lock",
        layout: "/admin"
      },
      { 
        path: "/client", 
        name: "Client", 
        component: <Client />, 
        icon: "bi bi-person-lines-fill",
        layout: "/admin"
      },
      { 
        path: "/vendeur", 
        name: "Vendeur", 
        component: <Vendeur />, 
        icon: "bi bi-shop",
        layout: "/admin"
      },
      { 
        path: "/gerant", 
        name: "Gérant", 
        component: <Gerant />, 
        icon: "bi bi-briefcase",
        layout: "/admin"
      },
      { 
        path: "/fournisseur", 
        name: "Fournisseur", 
        component: <Fournisseur />, 
        icon: "bi bi-truck",
        layout: "/admin"
      },
      { 
        path: "/categorie", 
        name: "Categorie", 
        component: <Categorie />, 
        icon: "bi bi-truck",
        layout: "/admin"
      },
    ],
  },
  {
    path: "/tables",
    name: "Articles",
    icon: "bi bi-gift",
    component: <ArticleApp />,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Caisse",
    icon: "bi bi-cash-stack",
    component: <Typography />,
    layout: "/admin",
  },
  {
    path: "/rapport",
    name: "Rapport",
    icon: "bi bi-cash-stack",
    component: <RapportVente />,
    layout: "/admin",
  },
];

export default routes;