import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav, Collapse } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";
import scoot from "../../assets/img/scoot.jpg"
import './sidebar.css'

var ps;

function Sidebar(props) {
  const location = useLocation();
  const sidebar = React.useRef();
  const [isPersonneOpen, setIsPersonneOpen] = useState(false);

  // Vérifie si le chemin actuel correspond à la route ou une sous-route
  const activeRoute = (routePath) => {
    return location.pathname === routePath || 
           (routePath === "/admin/user-page" && location.pathname.startsWith("/admin/user-page"));
  };

  // Vérifie si une sous-route est active
  const activeSubRoute = (routePath) => {
    return location.pathname === routePath ? "active" : "";
  };

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  }, []);

  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
   
      <a href="#" className="simple-text logo-normal">
      <img 
            src={scoot} 
          
            style={{ maxWidth: '40px', marginRight: '6px', }} // Ajustez les styles selon vos besoins
          />
          SCOOT Master
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            if (prop.name === "Personne") {
              return (
                <li 
                  key={key} 
                  className={`${activeRoute(prop.layout + prop.path) ? "active" : ""}`}
                >
                  <a
                    href="#personneMenu"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPersonneOpen(!isPersonneOpen);
                    }}
                    className="nav-link"
                  >
                    <i className={prop.icon} />
                    <p>
                      {prop.name} <b className="caret"></b>
                    </p>
                  </a>
                  <Collapse isOpen={isPersonneOpen}>
                    <ul className="nav">
                      {prop.subRoutes.map((subProp, subKey) => (
                        <li 
                          key={subKey} 
                          className={activeSubRoute(prop.layout + "/user-page" + subProp.path)}
                        >
                          <NavLink
                            to={prop.layout + "/user-page" + subProp.path}
                            className="nav-link"
                          >
                            <i className={subProp.icon} />
                            <p>{subProp.name}</p>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </Collapse>
                </li>
              );
            }
            return (
              <li
                className={`
                  ${activeRoute(prop.layout + prop.path) /*+
                  prop.pro*/ ? " active" : ""}
                `}
                key={key}
              >
                <NavLink to={prop.layout + prop.path} className="nav-link">
                  <i className={prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;