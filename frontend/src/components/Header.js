import React, { useState, useEffect, useContext } from "react";
import { ModalConfigurarUsuarios } from "./configuracion/configurarUsuario";

function Header(props) {
//  const { user, logout } = useContext(AuthContext);
  const [mostrar, setMostrar] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);


  //const [fechaSistema, setFechaSistema] = useState(
  //  JSON.parse(localStorage.getItem("fechasistema"))
 // );

 // const [usuario, setUsuario] = useState(
  //  JSON.parse(localStorage.getItem("login"))
  //);

  let el;
  function menuclick() {
    /*   props.onCambiar("inicio"); */
    if ((el = document.getElementById("wrapper"))) {
      el.classList.toggle("toggled");
    }
  }



  return (
    <nav
      className="col-md-12 navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between"
      style={{ height: "70px" }}
    >
      <div className="mx-2 ">
        <a
          onClick={menuclick}
          className="img-fluid logo-nav text-light"
          style={{ height: "50px", width: "180px" }}
          type="button"
        >
          <i className="fas fa-bars fa-2x" style={{ marginTop: "10px", marginLeft: "10px" }}></i>
        </a>
      </div>

      <div className="col-5 d-flex justify-content-end ">
       
        

        <div class=" dropstart">
  <button type="button" class="btn btn-secondary rounded-circle" data-bs-toggle="dropdown" aria-expanded="false">
  <i class="fas fa-hammer"></i>
  </button>
  <ul class="dropdown-menu">
  <li>
              <a class="dropdown-item" type="button">
               Preguntas de Seguridad
              </a>
            </li>
            <li>
              <a class="dropdown-item" type="button" onClick={()=>{setMostrar(true)}}>
              Configuracion de Ususario
              </a>
            </li>
  </ul>
</div>


        <div>
          <button class="btn bg-transparent fw-bold btn-sm shadow-0 ">
            <i className="fas fa-user me-2" />

            {/*usuario*/}
          </button>
        </div>
      </div>

<ModalConfigurarUsuarios
show={mostrar}
onHideCancela={()=>{setMostrar(false)}}
/>
     
    </nav>
  );
}

export default Header;
