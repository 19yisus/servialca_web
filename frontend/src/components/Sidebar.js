import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { ModalHist } from '../components/componentesIglesia/reportes/modalHistLocal'

function Sidebar(props) {
  //let token = localStorage.getItem("jwtToken");
  let op = require("../modulos/datos");
  /*   const idzona = JSON.parse(localStorage.getItem("idzona")); */
  //let nombreagente = JSON.parse(localStorage.getItem("nombreagente"));
 // const permiso = JSON.parse(localStorage.getItem("permiso"));

  //const accreglocal = JSON.parse(localStorage.getItem('accreglocal'));
 // const accmovilocal = JSON.parse(localStorage.getItem('accmovilocal'));
 // const accfinalocal = JSON.parse(localStorage.getItem('accfinalocal'));
 // const accpdflocal = JSON.parse(localStorage.getItem('accpdflocal'));

  const [histCuentasLocal, setHistCuentasLocal] = useState(false)
  const { user, logout } = useContext(AuthContext);
 // const [fechaSistema, setFechaSistema] = useState(
  //  JSON.parse(localStorage.getItem("fechasistema"))
 // );
  //const [usuario, setUsuario] = useState(
 //   JSON.parse(localStorage.getItem("login"))
 // );
  const [tituloNav, setTituloNav] = useState("Panel de Control");
  const [verConfiguracion, setVerConfiguracion] = useState(false);
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });
  const [mensajesino, setMensajesino] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  let el;
  let ele;
  const bloquear = () => (e) => {
    e.preventDefault();
    /*  setTituloNav(titulo); */
    /*     props.onCambiar(titulo); */
    if ((el = document.getElementById("wrapper"))) {
      el.classList.toggle("toggled");
      /* if ((ele = document.getElementById("menu-toggle"))) {
        ele.classList.toggle("bloquear");
      } */
    }
  };

  const verConfig = () => {
    if (!verConfiguracion) {
      setVerConfiguracion(true);
    } else {
      setVerConfiguracion(false);
    }
  };


  const imprimirHistLocal = () => {

    setHistCuentasLocal(false)
    window.open('http://localhost:3000/pdfbalancelocal', '_blank');


  }

  /*  const seleccionarZona = (id)  => {
     //  e.preventDefault()
     let campos = "descripcion";
     let nomtab = "zona";
     let nomid = "idzona";
 
     let endpoint2 = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${id}&nomtab=${nomtab}&nomid=${nomid}`;
     console.log(endpoint2);
     axios
       .get(endpoint2, {
         headers: {
           "x-access-token": `${token}`,
         },
       })
       .then(function (response) {
         if (response.status === 200) {
           console.log(response.data);
           localStorage.setItem(
             "nombrezona",
             JSON.stringify(response.data.descripcion.trim())
           );
         }
       })
       .catch(function (error) {
         setMensaje({
           mostrar: true,
           titulo: "Error",
           texto: error.response.data.message,
           icono: "error",
         });
       });
   };
 
   useEffect(() => {
     seleccionarZona(idzona)
   });
  */


  const sidebar = (
    <div className="bg-light" id="sidebar-wrapper">
      <div className="sidebar-heading text-center  bluez-text fs-4 fw-bold text-uppercase border-bottom">
        <div
          className="img-fluid logo-sidebar "
          style={{ width: "100px", height: "100px", margin: "auto" }}
        ></div>
        <h5 className="m-0 second-text">
          {/*moment(fechaSistema).format("DD-MM-YYYY")*/}
        </h5>
        <h5 className="m-0 second-text">{}</h5>
      </div>

      <div className="list-group list-group-flush mx-3 mt-4 px-0">
        <a
          href="/inicio"
          className="list-group-item list-group-item-action py-2 ripple active rounded"
          aria-current="true"
        >
          <i className="fas fa-tachometer-alt fa-fw me-3" />
          <span>Panel de Control</span>
        </a>

        <div className="accordion  px-0 border-0" id="accordionExample">
          <div className="accordion-item  px-0">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                <i className="fas fa-fw me-3 fa-cash-register" />
                <span>Registros</span>
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse list-group-item-action"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body py-0 list-group px-0">
               
                  <a href="/registropastores" className="list-group-item list-group-item-action py-2 ripple">
                    {/*  <i className="fas fa-fw me-3 fa-cash-register" /> */}
                    <span>Pastores</span>
                  </a>
               

              
                  <a href="/registroZona" className="list-group-item list-group-item-action py-2 ripple">
                    {/*  <i className="fas fa-fw me-3 fa-cash-register" /> */}
                    <span>Iglesia</span>
                  </a>
               

              
                    <a href="/registrocreyentes" className="list-group-item list-group-item-action py-2 ripple"  >

                      <span>Creyentes</span>
                    </a>
               
                    <a
                      href="/usuarioslocales"
                      className="list-group-item list-group-item-action py-2 ripple "
                      
                    >

                      <span>Gestion de Usuarios</span>
                    </a>
              </div>
            </div>
          </div>

          <div className="accordion-item  px-0">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <i className="fas fa-fw me-3 fa-cash-register" />
                <span>Movimientos</span>
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse list-group-item-action"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body list-group  py-0 px-0">
              
                  <a href="/registropastores" className="list-group-item list-group-item-action py-2 ripple"  >

                    <span>Solicitud de Credencial</span>
                  </a>
                )

               
                    <a
                      href="/bitacora"
                      className="list-group-item list-group-item-action py-2 ripple "
                     
                    >

                      <span>Bitacora</span>
                    </a> 
              </div>
            </div>
          </div>

          <div className="accordion-item  px-0">
            <h2 className="accordion-header" id="acordionFinanzas">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#finanzas"
                aria-expanded="false"
                aria-controls="finanzas"
              >
                <i className="fas fa-fw me-3 fa-cash-register" />
                <span>Finanzas</span>
              </button>
            </h2>
            <div
              id="finanzas"
              className="accordion-collapse collapse list-group-item-action"
              aria-labelledby="acordionFinanzas"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body list-group py-0 px-0">
              
                    <a
                      href="/notadebito"
                      className="list-group-item list-group-item-action py-2 ripple "
                     
                    >

                      <span>Notas de Debitos</span>
                    </a>

                
                    <a
                      href="/notacredito"
                      className="list-group-item list-group-item-action py-2 ripple "
                     
                    >

                      <span>Notas de Creditos</span>
                      </a>

              
                  <a
                    href="/bancos"
                    className="list-group-item list-group-item-action py-2 ripple "
                   
                  >

                    <span>Bancos</span>
                  </a>

               
                  <a
                    href="/cuentasbancarias"
                    className="list-group-item list-group-item-action py-2 ripple "
                   
                  >

                    <span>Cuentas Bancarias</span>
                  </a>
              </div>
            </div>
          </div>

          <div className="accordion-item  px-0">
            <h2 className="accordion-header" id="reportes">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#reporte"
                aria-expanded="false"
                aria-controls="reporte"
              >
                <i className="fas fa-fw me-3 fa-print" />
                <span>Reportes</span>
              </button>
            </h2>
            <div
              id="reporte"
              className="accordion-collapse collapse list-group-item-action"
              aria-labelledby="reportes"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body list-group  py-0 px-0">
               
                  <a
                    href="/pdfiglesias"
                    className="list-group-item list-group-item-action py-2 ripple"
                    target="_blank"

                  >

                    <span>Registro de Iglesias</span>
                  </a>
                )
              
                  <a
                    href="/pdfcreyentes"
                    className="list-group-item list-group-item-action py-2 ripple"
                    target="_blank"
                    

                  >

                    <span>List. de Creyentes</span>
                  </a> 
                
                  <a
                    href="#"
                    onClick={() => { setHistCuentasLocal(true) }}
                    className="list-group-item list-group-item-action py-2 ripple"
                    

                  >

                    <span>Hist. de Cuentas</span>
                  </a>
              </div>
            </div>
          </div>
        </div>

        <a
          className="d-block d-xl-none list-group-item list-group-item-action py-2 ripple"
          data-mdb-toggle="modal"
          data-mdb-target="#exampleModal"
        >
          <i className="fas fa-cog fa-fw me-3" />
          <span>Configuracion</span>
        </a>
        <a
          href="/"
          onClick={logout}
          className=" list-group-item list-group-item-action py-2 ripple"
        >
          <i className="fas fa-power-off fa-fw me-3" />
          <span>Salir</span>
        </a>
      </div>

      <ModalHist
        show={histCuentasLocal}
        onHideCancela={() => { setHistCuentasLocal(false) }}
        imprimirHistLocal={imprimirHistLocal}
      />
    </div>
  );

  return sidebar;
}

export default Sidebar;
