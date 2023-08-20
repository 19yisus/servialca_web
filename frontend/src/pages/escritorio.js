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
     {/* <div  className={wrapper} id='wrapper'>
        <div class={overlay}></div>
          
            
            <nav class="navbar navbar-inverse fixed-top" id="sidebar-wrapper" role="navigation">
              <ul class="nav sidebar-nav col">
                <div class="sidebar-header row">
                <div class="sidebar-brand mx-auto row">
                  
                  <a className="mx-auto" href="#">
                    <img src={logo} style={{width:170}} />
                  </a>
                  </div>
                  </div>

                  <div className="col-md-12 mx-auto mt-5 text-center pt-3">

                    <h4 className="fw-bold m-0">
                   
                    </h4>
                    <h3 className="fw-bold py-0 m-0">
                   
                    </h3>
                    <h3 className="fw-bold py-0 m-0">
                    {moment().format("DD/MM/YYYY")}
                    </h3>
                    

                  </div>
                
                  <div class="accordion accordion-flush col mt-5" id="accordionFlushExample">
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Accordion Item #1
                          </button>
                        </h2>
                        <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                          <div class="accordion-body">
                          <ul class="list-group mx-auto">
                      <a class="list-group-item py-2 bg-transparent " type='button'>An item</a>
                      <a class="list-group-item py-2 bg-transparent " type='button'>A second item</a>
                      <a class="list-group-item py-2 bg-transparent " type='button'>A third item</a>
                      <a class="list-group-item py-2 bg-transparent " type='button'>A fourth item</a>
                      <a class="list-group-item py-2 bg-transparent " type='button'>And a fifth one</a>
                    </ul>
                            </div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            Accordion Item #2
                          </button>
                        </h2>
                        <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                          <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                            Accordion Item #3
                          </button>
                        </h2>
                        <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                          <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
                        </div>
                      </div>
                    </div>
                
                </ul>
                
            </nav>
            
              <div id="page-content-wrapper">
                  
                  <div class="container">
                  <button type="button" onClick={bloquear} class={hamburguesa} >
                      <span class="hamb-top"></span>
                <span class="hamb-middle"></span>
              <span class="hamb-bottom"></span>
                  </button>
                      <div class="row col-md-12 mx-auto pyr2x-0">
                      <div className="w-100 h-100" >
                    <AuthRoute exact path="/inicio" component={Inicio2} />
              
                  </div>
                      </div>
                  </div>
        </div>
       

      </div>*/}
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

              </div>

            
              <a
                href="/"
              
                className=" list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-power-off fa-fw me-3" />
                <span>Salir</span>
              </a>
              <a
                href="/certificadomedico"
              
                className=" list-group-item list-group-item-action py-2 ripple"
              >
                 <i className="fas fa-fw me-3 fa-cash-register" />
                <span>Certificado Medico</span>
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



           
          </div>

        </div>
      </div>
    </div>
  </div>
 
  );
}
export default MenuImpuestoPP;
