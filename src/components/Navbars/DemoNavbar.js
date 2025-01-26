import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../DarkModeContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Button,
  Container,
} from "reactstrap";
import "./Navbar.css";
import routes from "routes.js";
import AuthController from "../../controlleur/AuthController";

function Header({ toggleSidebar, isSidebarVisible }) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("transparent");
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };
  const toggleNavbar = () => {
    setColor(isOpen ? "transparent" : "dark");
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    AuthController.handleLogout();
    navigate("/login");
  };

  const getBrand = () => {
    let brandName = "Default Brand";
    routes.forEach((prop) => {
      if (window.location.href.includes(prop.layout + prop.path)) {
        brandName = prop.name;
      }
    });
    return brandName;
  };

  useEffect(() => {
    window.addEventListener("resize", updateColor);
    return () => window.removeEventListener("resize", updateColor);
  }, []);

  const updateColor = () => {
    setColor(window.innerWidth < 993 && isOpen ? "dark" : "transparent");
  };

  return (
    <Navbar
      color={location.pathname.includes("full-screen-maps") ? "dark" : color}
      expand="lg"
      className={`navbar-absolute fixed-top ${
        location.pathname.includes("full-screen-maps")
          ? ""
          : color === "transparent"
          ? "navbar-transparent"
          : ""
      }`}
    >
      <Container fluid>
      <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
        {/* Navbar Brand */}
        <NavbarBrand href="/">{getBrand()}</NavbarBrand>

        {/* Navbar Toggler */}
        <NavbarToggler onClick={toggleNavbar}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>

        {/* Navbar Collapse */}
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          {/* Search Bar 
          <InputGroup className="no-border w-10">
            <Input placeholder="Search..." />
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <i className="nc-icon nc-zoom-split" />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>*/}
          <p 
           style={{margin: '10px'}} 
          >Unité monétaire : MGA</p>

          {/* Dark Mode Toggle */}
          <Button
            color="secondary"
            onClick={toggleDarkMode}
            className="ms-2 me-2"
          >
            {darkMode ? (
              <i className="bi bi-moon-fill" />
            ) : (
              <i className="bi bi-sun-fill" />
            )}
          </Button>

          {/* Logout Button */}
          <Button color="danger" className="bouton" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </Button>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
