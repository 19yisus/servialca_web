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

/*

import RegistroPorZona from "./registroIglesia";
import TablaPastores from '../components/componentesIglesia/pastores/tablaPastores'
import TablaCreyentes from "../components/componentesIglesia/creyentes/tablaCreyentes";
import NotasdeCredito from "../components/componentesIglesia/notasCreditoDebito/gestionCredito";
import TablaBancos from "../components/banco/tablaBancos";
import TablaCuentasBancarias from '../components/banco/tabalCuentasBancarias'
import NotasdeDebito  from "../components/componentesIglesia/notasCreditoDebito/gestionDebito";
import PlanillaIglesia from "../components/componentesIglesia/reportes/planillaIglesia";
import { PDFViewer } from "@react-pdf/renderer";
import TablaUsuariosLocal from '../components/usuarios/tablaUsuarioLocal'
import MyDocument from "../components/componentesIglesia/reportes/reporteiglesia";
import ReporteCreyentes from "../components/componentesIglesia/reportes/reporteCreyentes";
import ReporteMovixIglesias from '../components/componentesIglesia/reportes/reporteMoviMientosxIglesia'
import BitacoraTabla from "../components/usuarios/tablaBItacora";*/

function MenuImpuestoPP(props) {
  let token = localStorage.getItem("jwtToken");
  let op = require("../modulos/datos");
  const { user, logout } = useContext(AuthContext);
  const permiso = JSON.parse(localStorage.getItem('permiso'));
  const codigo = JSON.parse(localStorage.getItem('codigo'));
  const pathname = window.location.pathname;
  const [allIglesias, setAllIglesias] = useState([]);
  
  const [path, setPath] = useState(pathname.substr(1));
  const [mostrar2, setMostrar2] = useState(false);
  const [activate, setActivate] = useState(false);
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
  const menu = user ? (
    <div>
     
      <div className="d-flex bg-dark" id="wrapper" >

       
          <div id="page-content-wrapper">
          <section>
            <Header onCambiar={cambiar} />
          </section>

          <div className="d-flex justify-content-between">
            <Sidebar onCambiar={cambiar} />

            <div className="w-100 h-100" id="scrol">
              <AuthRoute exact path="/inicio" component={Inicio} />
             {/* <AuthRoute exact path="/registropastores" component={TablaPastores} />           
              <AuthRoute exact path="/registrocreyentes" component={TablaCreyentes} />

              <AuthRoute exact path="/registroZona" component={RegistroPorZona} />
              <AuthRoute exact path="/notacredito" component={NotasdeCredito} />
              <AuthRoute exact path="/bancos" component={TablaBancos} />
              <AuthRoute exact path="/cuentasbancarias" component={TablaCuentasBancarias} />
              <AuthRoute exact path="/notadebito" component={NotasdeDebito} />
              <AuthRoute exact path="/planillaxiglesia" component={PlanillaIglesia} />
              <AuthRoute exact path="/usuarioslocales" component={TablaUsuariosLocal} />
  <AuthRoute exact path="/bitacora" component={BitacoraTabla} />*/}

            </div>

          </div>
          <Footers />
        </div> 

       
      </div>
     

      


      <Mensaje2
        mensaje={mensaje}
        onHide={() => setMensaje({ mostrar: false, titulo: "", texto: "" })}
      />
    </div>
  ) : (
    ""
  );
  return menu;
}
export default MenuImpuestoPP;
