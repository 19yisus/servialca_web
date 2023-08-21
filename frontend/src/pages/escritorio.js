import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import axios from "axios";
import Footers from "../pages/foothers";
import AuthRoute from "../util/AuthRoute";
import Inicio2 from "./inicio2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar"; 
import { Mensaje2 } from "../components/mensajes";
import Inicio from "./inicio";
import MenuNuevo from "./menuNuevo";

import logo from '../imagenes/logo1.png'
import moment from "moment";
import TablaContratosRealizados from "../components/administracion/tablaContratosRealizados";
import TablaSursales from "../components/administracion/tablaSucursales";
import TablaTipoContratos from "../components/administracion/tablaTipoContrato";
import TablaUsoVehiculo from "../components/DatosVehiculo/tablaUsoVehiculo";
import TablaClaseVehiculo from "../components/DatosVehiculo/tablaClaseVehiculo";
import TablaTransporte from "../components/DatosVehiculo/tablaTransporte";
import TablaUsuarios from "../components/datosUsuario/tablaUsuarios";
import TablaRoles from "../components/datosUsuario/tablaRoles";
import TablaCertificado from "../components/medico/tablaCertificado";
import TablaClumpeañeros from "../components/cumpleañeros/tablaCumpleañeros";
import GraficosIngresos from "../components/graficas/graficaIngresoEgreso";


function MenuImpuestoPP(props) {
  //let token = localStorage.getItem("jwtToken");
  //let op = require("../modulos/datos");
  //const { user, logout } = useContext(AuthContext);
 
  const pathname = window.location.pathname;
  const [allIglesias, setAllIglesias] = useState([]);
  const sucursal = JSON.parse(localStorage.getItem('sucursal'));
  const username = JSON.parse(localStorage.getItem('username'));
  
  const [path, setPath] = useState(pathname.substr(1));
  const [mostrar2, setMostrar2] = useState(false);
  const [activate, setActivate] = useState(false);
  const [hamburguesa,setHamburguesa] = useState('hamburger animated fadeInLeft is-closed');
  const [wrapper,setWrapper] = useState('');
  const [overlay,setOverlay] = useState('overlay')
  const [sidebarM, setSidebarM] = useState('oculto')

  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
  });
  const [titulo, setTitulo] = useState();

  const cambiar = (c) => {
    setPath(c);
    setTitulo(c);
  };


const hola = [
  {
    nombre: 'pepe',
    apellido: 'gonzales'
  },
  {
    nombre: 'pepe',
    apellido: 'gonzales'
  },
  {
    nombre: 'pepe',
    apellido: 'gonzales'
  }
]
  

/*const seleccionaRegistrosIglesias = () => {


  let campos = '*, trim(codzona) as codzona ';
  let nomtab = "iglesia";
  let orden = "idiglesia";
  let id = codigo ;
  let condi = "codzona = '" + id + "'";


  let endpoint =
    op.conexion +
    `/api/consulta/selecionarregistrocondi?campos=${campos}&nomtab=${nomtab}&condi=${condi}&orden=${orden}`;
  console.log(endpoint)


 
  axios.get(endpoint, {
    headers: {
      'x-access-token': `${token}`
    }
  }).then(function (response) {
    if (response.status === 200) {
      setAllIglesias(response.data)
      console.log(response.data)
     setActivate(false);
    }
  }).catch(function (error) {
    setMensaje({mostrar: true, titulo:'Error', texto: error.response.data.message, icono: 'error'});
  })
};*/

  useEffect(() => {

   
   /* if (pathname === "/pdfiglesias") {
      seleccionaRegistrosIglesias()
 
    } */
    
    
    
   
  }, []);

  console.log(pathname.substring(0,4))
  {/* const menu = user ? (*/}

  let el;

  const bloquear2 = () => (e) => {
    console.log('hola')
   
    /*  setTituloNav(titulo); */
    /*     props.onCambiar(titulo); */
    if ((el = document.getElementById("wrapper"))) {
      el.classList.toggle("");
      /* if ((ele = document.getElementById("menu-toggle"))) {
        ele.classList.toggle("bloquear");
      } */
    }
  };
  const bloquear = (e) => {
    e.preventDefault()

    e.preventDefault();
    if(sidebarM === 'oculto'){
      setWrapper('toggled');
setHamburguesa('hamburger animated fadeInLeft is-open');
setSidebarM('visto')

    } else{
      setWrapper('');
      setHamburguesa('hamburger animated fadeInLeft is-closed');
setSidebarM('oculto')

    }
    
       
  
    console.log('hola')
  }
  return (
    <div>
    
    <div className="d-flex bg-dark" id="wrapper" >
      <div id="page-content-wrapper">
    

        <div className="d-flex justify-content-between">
         {/* <Sidebar onCambiar={cambiar} />*/}
         <div id="sidebar-wrapper">
            <div className="sidebar-heading text-center  bluez-text fs-4 fw-bold text-uppercase border-bottom">
            <div className="row mx-auto" > 
              <img className="mx-auto" style={{width:190}} src={logo} />
            </div> 
              <h5 className="m-0 second-text text-light mt-3">
              {sucursal}
              </h5>
              <h5 className="m-0 second-text text-light">
              {username}
              </h5>
              <h5 className="m-0 second-text text-light">
                {moment().format("DD-MM-YYYY")}
              </h5>
           
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
                      className="accordion-button text-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      <i className="fas fa-fw me-3 fa-cash-register" />
                      <span>Administración</span>
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse list-group-item-action"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body py-0 list-group px-0">
                    
                        <a href="/contratosrealizados" className="list-group-item list-group-item-action py-2 ripple">
                          
                          <span>Contratos Realizados</span>
                        </a>
                    

                    
                        <a href="/sucursales" className="list-group-item list-group-item-action py-2 ripple">
                         
                          <span>Lista de Sucursales</span>
                        </a>
                    
                        <a href="/tipocontratos" className="list-group-item list-group-item-action py-2 ripple">
                         
                         <span>Tipos de Contratos</span>
                       </a>
                   
                    
                        
                    </div>
                  </div>
                </div>
                <div className="accordion-item  px-0">
                  <h2 className="accordion-header" id="heading2">
                    <button
                      className="accordion-button text-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse2"
                      aria-expanded="false"
                      aria-controls="collapse2"
                    >
                      <i className="fas fa-fw me-3 fa-cash-register" />
                      <span>Datos del Vehiculo</span>
                    </button>
                  </h2>
                  <div
                    id="collapse2"
                    className="accordion-collapse collapse list-group-item-action"
                    aria-labelledby="heading2"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body py-0 list-group px-0">
                    
                        <a href="/usovehiculo" className="list-group-item list-group-item-action py-2 ripple">
                          
                          <span>Uso del Vehiculo</span>
                        </a>
                    

                    
                        <a href="/clasevehiculo" className="list-group-item list-group-item-action py-2 ripple">
                         
                          <span>Clases de Vehiculos</span>
                        </a>
                    
                        <a href="/tipovehiculo" className="list-group-item list-group-item-action py-2 ripple">
                         
                         <span>Tipos de Vehiculos</span>
                       </a>
                       <a href="/transporte" className="list-group-item list-group-item-action py-2 ripple">
                         
                         <span>Lineas de Transporte</span>
                       </a>
                   
                    
                        
                    </div>
                  </div>
                </div>

                <div className="accordion-item  px-0">
                  <h2 className="accordion-header" id="heading3">
                    <button
                      className="accordion-button text-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse3"
                      aria-expanded="false"
                      aria-controls="collapse3"
                    >
                      <i className="fas fa-fw me-3 fa-cash-register" />
                      <span>Datos de Usuario</span>
                    </button>
                  </h2>
                  <div
                    id="collapse3"
                    className="accordion-collapse collapse list-group-item-action"
                    aria-labelledby="heading3"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body py-0 list-group px-0">
                    
                        <a href="/usarios" className="list-group-item list-group-item-action py-2 ripple">
                          
                          <span>Usuarios</span>
                        </a>
                  
                        <a href="/roles" className="list-group-item list-group-item-action py-2 ripple">
                         
                          <span>Roles</span>
                        </a>            
                    
                        
                    </div>
                  </div>
                </div>
                <div className="accordion-item  px-0">
                  <h2 className="accordion-header" id="heading4">
                    <button
                      className="accordion-button text-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse4"
                      aria-expanded="false"
                      aria-controls="collapse4"
                    >
                      <i className="fas fa-fw me-3 fa-cash-register" />
                      <span>Graficas</span>
                    </button>
                  </h2>
                  <div
                    id="collapse4"
                    className="accordion-collapse collapse list-group-item-action"
                    aria-labelledby="heading4"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body py-0 list-group px-0">
                    
                        <a href="/graficasingegre" className="list-group-item list-group-item-action py-2 ripple">
                          
                          <span>Ingresos y Egresos</span>
                        </a>
                  
                               
                    
                        
                    </div>
                  </div>
                </div>
              </div>

            
            
              <a
                href="/certificadomedico"
              
                className=" list-group-item list-group-item-action py-2 ripple"
              >
                 <i className="fas fa-fw me-3 fa-cash-register" />
                <span>Certificado Medico</span>
              </a>
              <a
                href="/cumpleañeros"
              
                className=" list-group-item list-group-item-action py-2 ripple"
              >
             <i className="fas fa-fw me-3 fa-cash-register" />
                <span>Cumpleañeros</span>
              </a>  <a
                href="/"
              
                className="text-danger fw-bold list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-power-off fa-fw me-3" />
                <span>Salir</span>
              </a>
            </div>

            
          </div>

          <div className="w-100 h-100" id="scrol">
          <section>
          <Header onCambiar={cambiar} />
    </section> 
            <AuthRoute exact path="/inicio" component={Inicio2} />
            <AuthRoute exact path="/contratosrealizados" component={TablaContratosRealizados} />
            <AuthRoute exact path="/sucursales" component={TablaSursales} />
            <AuthRoute exact path="/tipocontratos" component={TablaTipoContratos} />
            <AuthRoute exact path="/usovehiculo" component={TablaUsoVehiculo} />
            <AuthRoute exact path="/clasevehiculo" component={TablaClaseVehiculo} />
            <AuthRoute exact path="/transporte" component={TablaTransporte} />
            <AuthRoute exact path="/usarios" component={TablaUsuarios} />
            <AuthRoute exact path="/roles" component={TablaRoles} />
            <AuthRoute exact path="/certificadomedico" component={TablaCertificado} />
            <AuthRoute exact path="/cumpleañeros" component={TablaClumpeañeros} />
            <AuthRoute exact path="/graficasingegre" component={GraficosIngresos} />




           
          </div>

        </div>
      </div>
    </div>
  </div>
 
  );
}
export default MenuImpuestoPP;
