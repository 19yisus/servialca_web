import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
/* import { Mensaje, MensajeSiNo } from "../mensajes"; */
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
  validaNumeroTelefono,
  validaEmail,
  validaSoloLetras
} from "../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../mensajes";
import CatalogoClientes from "../../catalogos/catalogoClientes";

export const ModalConsultarPoliza = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");


  const txtNContrato = useRef();
  const txtNombre = useRef();
  const txtTipoContrato = useRef();
  const txtCedula = useRef();
  const txtFechaEmision = useRef();
  const txtFechaVencimiento = useRef();
  const cmbNacionalidad = useRef();

  const cmbTelefono = useRef();
  const txtTelefono = useRef()
  const txtDireccion = useRef();
  const txtCorreo = useRef();

  const txtFechaNaci = useRef();
  const txtDescripcion = useRef();

  const txtPlaca  = useRef();
  const txtPuestos  = useRef();
  const txtUso  = useRef();
  const txtAnio  = useRef();
  const txtSerMotor  = useRef();
  const txtClase  = useRef();
  const txtColor  = useRef();
  const txtSerCarroceria  = useRef();
  const txtTipoVehiculo  = useRef();
  const txtModelo  = useRef();
  const txtMarca  = useRef();
  const txtPeso  = useRef();
  const txtCapTone  = useRef();

  const [values, setValues] = useState({
    ced: "",
    nombre: "",
    apellido: "",
    fecha_nac: "",
    bas_agua: 1,

    status: 1,
    bas_espirit: 1,
    cod_iglesia: "",
    sexo: "M",
    fecha_baus: "",
    nacionalidad: "V",
    direccion: "",
    telefono: "",
    celular: "",
    estadocivil: 0,
    correo: "",
    tiposangre: "",
  });

  const btnCancela = useRef();
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  const btnAcepta = useRef();


  const [activate, setActivate] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  const [operacion, setOperacion] = useState(0);




  /*********************************************** FUNCINES DE VALIDACION***********************************************************/

  const handleInputNumChange = (event) => {
    event.preventDefault();
    validaSoloNumero(event);
    var valido;
    if (event.which === 13 || typeof event.which === "undefined") {
      setValues({ ...values, [event.target.name]: event.target.value });
    } else if (event.which === 46) {
      return false;
    } else if (event.which >= 48 && event.which <= 57) {
      return true;
    } else if (event.which === 8 || event.which === 0 || event.which === 44) {
      return true;
    } else return false; //alert(e.which);
  };


  const salir = () => {
    props.onHideCancela();
    setValues({
      ced: "",
      nombre: "",
      apellido: "",
      fecha_nac: "",
      bas_agua: 1,

      status: 1,
      bas_espirit: 1,
      cod_iglesia: "",
      sexo: "M",
      fecha_baus: "",
      nacionalidad: "V",
      direccion: "",
      telefono: "",
      celular: "",
      estadocivil: 0,
      correo: "",
      tiposangre: "",
    });
  };



  const actualizarCertificado = async () => {
    let endpoint = op.conexion + "/sucursal/registrar";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    bodyF.append("Nombre", txtDescripcion.current.value)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log(response)

        setMensaje({
          mostrar: true,
          titulo: "Exito.",
          texto: "Registro Guardado Exitosamente",
          icono: "exito",
        });




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };



  const onChangeValidar = () => {
    let sigue = true;
    let minimo = 0;
    let calculo = 0;

    /*  else if( && operacion === 1){
          setMensaje({
              mostrar: true,
              titulo: "Notificación",
              texto: "Ya existe un usuario con este n° de cedula",
              icono: "informacion",
            });
            sigue = false;
            txtCedula.current.focus()
  
      } */

    if (sigue) {
      actualizarCertificado();
    }
  };



  const blanquear = () => {
    setValues({
      ced: "",
      nombre: "",
      apellido: "",
      fecha_nac: "",
      bas_agua: 1,

      status: 1,
      bas_espirit: 1,
      cod_iglesia: "",
      sexo: "M",
      fecha_baus: "",
      nacionalidad: "V",
      direccion: "",
      telefono: "",
      celular: "",
      estadocivil: 0,
      correo: "",
      tiposangre: "",
    });
  };




  const check = (e) => {
    var textV = "which" in e ? e.which : e.keyCode,
      char = String.fromCharCode(textV),
      regex = /[a-z]/ig;
    if (!regex.test(char)) e.preventDefault(); return false;
  }
  const seleccionarCliente = (nombre, apellido, cedula) => {

    console.log(nombre, apellido, cedula)
    txtCedula.current.value = cedula;
    txtDescripcion.current.value = apellido;
    txtNombre.current.value = nombre;
    setMostrar(false);

  }

  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
    props.onHideCancela()

  }

  function soloLetras(event) {
    if ((event.keyCode != 32) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
      event.returnValue = false;
  }

  const handleInputMontoChange = (event) => {
    validaMonto(event);
    if (event.which === 13 || typeof event.which === "undefined") {
      if (
        event.target.value === "" ||
        parseFloat(
          event.target.value.trim().replace(".", "").replace(",", ".")
        ) === 0.0
      ) {
        event.target.value = "0,00";
      }
      event.target.value = formatoMonto(event.target.value);
      let char1 = event.target.value.substring(0, 1);
      let char2 = event.target.value.substring(1, 2);
      if (char1 === "0" && char2 !== ",") {
        event.target.value = event.target.value.substring(
          1,
          event.target.value.legth
        );
      }
    } else if (event.which === 46) {
      return false;
    } else if (event.which >= 48 && event.which <= 57) {
      return true;
    } else if (event.which === 8 || event.which === 0 || event.which === 44) {
      return true;
    } else return false;
  };

  const selecionarRegistros = async (id) => {
    let endpoint = op.conexion + "/poliza/ConsultarUno?ID="+id;
    console.log(endpoint)
    setActivate(true)



   

    let bodyF = new FormData()

//    bodyF.append("ID", id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log(response)
    




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const imprimir = (tipo) => (e) => {
    e.preventDefault();

    if(tipo === 1 ){
      window.open(`${op.conexion}/reporte/reporteRCV?ID=${props.idCliente}`)
    } if(tipo === 2 ){
      window.open(`${op.conexion}/reporte/reporteWeb?ID=${props.idCliente}`)
    } if(tipo === 3 ){
      window.open(`${op.conexion}/reporte/reporteCarnet?ID=${props.idCliente}`)
    }
  }

  return (
    <Modal
      {...props}
      style={{ background: "rgb(28, 27, 23)" }}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onShow={() => {
        setOperacion(props.operacion);

        
         // selecionarRegistros(props.idCliente)
          
      
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
       Consultar Datos     </Modal.Title>
        <button
          ref={btnCancela}
          className="btn"
          style={{ border: 0, margin: 0, padding: 0, color: "#ffffff" }}
          onClick={salir}
        >
          <i className="far fa-window-close"></i>
        </button>
      </Modal.Header>
      <Modal.Body style={{ color: "rgb(106, 115, 123)" }}>
        <Dimmer active={activate} inverted>
          <Loader inverted>cargando...</Loader>
        </Dimmer>
       
        <fieldset class="border rounded-3 p-3 row mx-auto border rounded mb-2">
                <legend class="float-none w-auto px-3 fw-bold" style={{ fontSize: 15 }} >Datos Del Contrato</legend>
                <div class="input-group input-group-sm mb-2 col-md-2">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">N° De Contrato:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtNContrato} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div className="col-md-1"></div>

                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Tipo De Contrato:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtTipoContrato} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Fecha De Emisión:</span>
                    <input type="date" class="form-control bg-transparent border-0" ref={txtFechaEmision} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Fecha De Vencimiento:</span>
                    <input type="date" class="form-control bg-transparent border-0" ref={txtFechaVencimiento} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                </div>
        </fieldset>
        <fieldset class="border rounded-3 p-3 row mx-auto border rounded mb-2">
                <legend class="float-none w-auto px-3 fw-bold" style={{ fontSize: 15 }} >Datos Del Cliente</legend>
                <div class="input-group input-group-sm mb-2 col-md-5">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Nombre:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtNombre} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div className="col-md-1"></div>

                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Cédula:</span>
                    <select disabled class="form-select  bg-transparent border-0" ref={cmbNacionalidad} aria-label="Default select example">

                        <option value="V-">V-</option>
                        <option value="E-">E-</option>
                        <option value="J-">J-</option>
                        <option value="G-">G-</option>

                    </select>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtCedula} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Telefono:</span>
                    <select disabled class="form-select bg-transparent border-0 col-md-1" ref={cmbTelefono}  aria-label="Default select example">

                      <option value="0414-">0414</option>
                      <option value="0424-">0424</option>
                      <option value="0416-">0416</option>
                      <option value="0426-">0426</option>
                      <option value="0412-">0412</option>



                    </select>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtTelefono} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-6">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Dirección:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtDireccion} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
              
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Correo:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtCorreo} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Fecha De Nacimiento:</span>
                    <input type="date" class="form-control bg-transparent border-0" ref={txtFechaNaci} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                </div>
              
        </fieldset>
        <fieldset class="border rounded-3 p-3 row mx-auto border rounded mb-2">
                <legend class="float-none w-auto px-3 fw-bold" style={{ fontSize: 15 }} >Datos Del Vehiculo</legend>
                <div class="input-group input-group-sm mb-2 col-md-2">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Placa:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtPlaca} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-2">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Puestos:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtPuestos} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Uso Del Vehiculo:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtUso} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
               
                <div class="input-group input-group-sm mb-2 col-md-2">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Año:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtAnio} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
               
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Ser. Motor:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtSerMotor} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Clase Del Vehiculo:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtClase} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-2">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Color:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtColor} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Ser. Carroceria:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtSerCarroceria} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Tipo De Vehiculo:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtTipoVehiculo} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Modelo:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtModelo} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Marca:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtMarca} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-2">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Peso:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtPeso} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                <div class="input-group input-group-sm mb-2 col-md-2">
                    <span class="input-group-text bg-transparent border-0" id="inputGroup-sizing-sm">Cap. Ton:</span>
                    <input type="text" class="form-control bg-transparent border-0 " ref={txtCapTone} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" disabled/>
                </div>
                
              
        </fieldset>

        <Mensaje
          mensaje={mensaje}
          onHide={() => {
            mensaje.titulo === 'Exito.' ? cerrarModal() :
              setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
          }} />

       
      </Modal.Body>
      <Modal.Footer>
        
        <button
          ref={btnCancela}
          onClick={salir}
          className="btn btn-sm btn-danger rounded-pill "
        >
          <i className="fas fa-window-close"> Salir</i>
        </button>
      </Modal.Footer>
    </Modal>
  );
};
