import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import moment from "moment";
import {GestionarPreguntas} from './componentesIglesia/configuracion/preguntasSeguridad'
import { GestionarClave } from "./componentesIglesia/configuracion/cambiarClavePersonal";

function Header(props) {
  const { user, logout } = useContext(AuthContext);
  const [mostrar, setMostrar] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);


  const [fechaSistema, setFechaSistema] = useState(
    JSON.parse(localStorage.getItem("fechasistema"))
  );

  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("login"))
  );

  let el;
  function menuclick() {
    /*   props.onCambiar("inicio"); */
    if ((el = document.getElementById("wrapper"))) {
      el.classList.toggle("toggled");
    }
  }

  const header = user && (
    <nav
      className="col-md-12 navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between"
      style={{ height: "70px" }}
    >
      <div className="mx-2 ">
        <a
          onClick={menuclick}
          className="img-fluid logo-nav"
          style={{ height: "50px", width: "180px" }}
          type="button"
        >
          <i class="fas fa-bars fa-2x"></i>
        </a>
      </div>

      <div className="col-5 d-flex justify-content-end ">
        {/* <label className="text-dark fw-bold mx-4 ">
          {" "}
          <i className="fas fa-user me-2" />
        
          {usuario}
        </label> */}

        {/* <div class="btn-group dropstart">
          <button
            type="button"
            class="btn bg-transparent fw-bold shadow-0 dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-ellipsis"></i>
          </button>
          <ul class="dropdown-menu">
            <li>
              <a
                type="button"
                onClick={() => {
                  setMostrar(true);
                }}
                className="text-dark fw-bold mx-4 "
              >
                Preguntas de Seguridad
              </a>
            </li>
            <li>
              <a
                type="button"
                onClick={() => {
                  setMostrar(true);
                }}
                className="text-dark fw-bold mx-4 "
              >
                Cambiar Clave
              </a>
            </li>
          </ul>
        </div> */}

        

        <div class=" dropstart">
  <button type="button" class="btn btn-secondary rounded-circle" data-bs-toggle="dropdown" aria-expanded="false">
  <i class="fas fa-hammer"></i>
  </button>
  <ul class="dropdown-menu">
  <li>
              <a class="dropdown-item" type="button" onClick={()=>{setMostrar(true)}}>
               Preguntas de Seguridad
              </a>
            </li>
            <li>
              <a class="dropdown-item" type="button" onClick={()=>{setMostrarClave(true)}}>
                Cambio de Clave
              </a>
            </li>
  </ul>
</div>


        <div>
          <button class="btn bg-transparent fw-bold btn-sm shadow-0 ">
            <i className="fas fa-user me-2" />

            {usuario}
          </button>
        </div>
      </div>

      <GestionarPreguntas
        show={mostrar}
        llamado={1}
        onHideCancela={() => {
          setMostrar(false);
        }}
      />

      <GestionarClave 
      show={mostrarClave}
      llamado={1}
        onHideCancela={() => {
          setMostrarClave(false);
        }}
      />
    </nav>
  );

  return header;
}

export default Header;
