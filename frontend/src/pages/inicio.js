import React, { useState, useContext, useEffect } from "react";

import { Mensaje2 } from "../components/mensajes";

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

function Inicio(props) {
/*  let token = localStorage.getItem("jwtToken");
  let op = require("../modulos/datos");
  const { user, logout } = useContext(AuthContext);
  /* const permiso = JSON.parse(localStorage.getItem('permiso'));
  const codigo = JSON.parse(localStorage.getItem('codigo'));*/
  const pathname = window.location.pathname;
  const [allIglesias, setAllIglesias] = useState([]);
  
 
  const [mostrar2, setMostrar2] = useState(false);
  const [activate, setActivate] = useState(false);
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
  });
  const [titulo, setTitulo] = useState();

 console.log('hola')



  useEffect(() => {

   
   /* if (pathname === "/pdfiglesias") {
      seleccionaRegistrosIglesias()
 
    } */
    
    
    
   
  }, []);

  console.log(pathname.substring(0,4))
 
    
  
  return (<div>
     
    <div className="d-flex bg-dark" id="wrapper" >

     hola

     
    </div>
   

    


    <Mensaje2
      mensaje={mensaje}
      onHide={() => setMensaje({ mostrar: false, titulo: "", texto: "" })}
    />
  </div>);
}
export default Inicio;
