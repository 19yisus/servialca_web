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

export const ModalRcv = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  const fechasistema = JSON.parse(localStorage.getItem('fechasistema'))


  //Contrato
  const cmbTipoContrato = useRef();
  const txtDesde = useRef();
  const txtHasta = useRef();
  const cmbEstado = useRef();
  const cmbAcesor = useRef();
  const cmbSucursal = useRef();
  const cmbLinea = useRef();
  //Contratante
  const cmbNacionalidad = useRef();
  const txtCedula = useRef();
  const txtNombre = useRef();
  const txtApellido = useRef();
  const txtFechaNaci = useRef();
  const cmbTelefono = useRef();
  const txtTelefono = useRef();
  const txtCorreo = useRef();
  const txtDirec = useRef();
  //Titular
  const cmbNacionalidadTitular = useRef();
  const txtCedulatTitular = useRef();
  const txtNombreTitular = useRef();
  const txtApellidoTitular = useRef();
  //Vehiculo
  const txtPlaca = useRef();
  const txtPuesto = useRef();
  const txtUso = useRef();
  const txtAño = useRef();
  const txtSerMotor = useRef();
  const cmbClase = useRef();
  const txtColor = useRef();
  const txtSerCarroceria = useRef();
  const cmbTipo = useRef();
  const txtModelo = useRef();
  const txtMarca = useRef();
  const txtPeso = useRef();
  const txtCapTon = useRef();

  //Pago
  const cmbFormaPago = useRef();
  const txtReferencia = useRef()
  const txtBs = useRef();
  const txtDolar = useRef();

  const [tipoContrato, setTipoContrato] = useState()
  const [estados, setEstados] = useState();
  const [acesor, setAcesor] = useState();
  const [sucursal, setSucursal] = useState();
  const [transporte, setTransporte] = useState();
  const [uso, setUso] = useState();
  const [clase, setClase] = useState();
  const [tipo, setTipo] = useState();




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
  const[idContrato,setIdContrato] = useState()
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
    let endpoint = op.conexion + "/poliza/registrar";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()
    //Contrato
    bodyF.append("fechaInicio", txtDesde.current.value)
    bodyF.append("fechaVencimiento", txtHasta.current.value)
    bodyF.append("tipoContrato", cmbTipoContrato.current.value)
    bodyF.append("Estado", cmbEstado.current.value)

    //Contratante
    bodyF.append("Cedula", cmbNacionalidad.current.value + txtCedula.current.value)
    bodyF.append("Nombre", txtNombre.current.value)
    bodyF.append("Apellido", txtApellido.current.value)
    bodyF.append("fechaNacimiento", txtFechaNaci.current.value)
    bodyF.append("Telefono", cmbTelefono.current.value + txtTelefono.current.value)
    bodyF.append("Correo", txtCorreo.current.value)
    bodyF.append("Direccion", txtDirec.current.value)
    //titular
    bodyF.append("cedulaTitular", cmbNacionalidadTitular.current.value + txtCedulatTitular.current.value)
    bodyF.append("nombreTitular", txtNombreTitular.current.value)
    bodyF.append("apellidoTitular", txtApellidoTitular.current.value)

    //Vehiculo
    bodyF.append("Placa", txtPlaca.current.value)
    bodyF.append("Puesto", txtPuesto.current.value)
    bodyF.append("Ano", txtAño.current.value)
    bodyF.append("serialMotor", txtSerMotor.current.value)
    bodyF.append("serialCarroceria", txtSerCarroceria.current.value)
    bodyF.append("Color", txtColor.current.value)
    bodyF.append("Uso", txtUso.current.value)
    bodyF.append("Clase", cmbClase.current.value)
    bodyF.append("Tipo", cmbTipo.current.value)
    bodyF.append("Modelo", txtModelo.current.value)
    bodyF.append("Marca", txtMarca.current.value)
    bodyF.append("Peso", txtPeso.current.value)
    bodyF.append("Capacidad", txtCapTon.current.value)

    //Cobertura
    var monto = txtDolar.current.value.replace(',', '.');
    bodyF.append("danoCosas", monto * 0.40)
    bodyF.append("danoPersonas", monto * 0.20)
    bodyF.append("fianza", monto * 0.10)
    bodyF.append("asistencia", monto * 0.10)
    bodyF.append("apov", monto * 1)
    bodyF.append("muerte", monto * 0.10)
    bodyF.append("invalidez", monto * 0)
    bodyF.append("medico", monto * 0)
    bodyF.append("grua", monto * 0.10)
    bodyF.append("monto", monto)

    //Pago
    bodyF.append("metodoPago", cmbFormaPago.current.value)
    bodyF.append("Referencia", txtReferencia.current.value)
    bodyF.append("cantidadDolar", monto)

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
        setIdContrato(response)




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const selecionarTipoContrato = async () => {
    let endpoint = op.conexion + "/tipo_contrato/ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    // bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log('tipo contrato')
        setTipoContrato(response)
        console.log(response)




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const selecionarEstado = async () => {
    let endpoint = op.conexion + "/estado/ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    // bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log('esyado')

        setEstados(response)
        console.log(response)




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const selecionarAcesor = async () => {
    let endpoint = op.conexion + "/Auth/ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    // bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log('acesor')
        setAcesor(response)
        console.log(response)




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const selecionarSucursal = async () => {
    let endpoint = op.conexion + "/sucursal/ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    // bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log('sucursal')
        setSucursal(response)
        console.log(response)





      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const selecionarTransporte = async () => {
    let endpoint = op.conexion + "/transporte/ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    // bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log('transporte')
        setTransporte(response)
        console.log(response)




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const selecionarUso = async () => {
    let endpoint = op.conexion + "/usoVehiculo/ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    // bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log('uso')
        setUso(response)
        console.log(response)




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const selecionarClase = async () => {
    let endpoint = op.conexion + "/claseVehiculo/ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    // bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log('clase')
        setClase(response)
        console.log(response)




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };

  const selecionarTipo = async () => {
    let endpoint = op.conexion + "/tipo_vehiculo /ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    // bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log('tipo')
        setTipo(response)
        console.log(response)




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
    txtApellido.current.value = apellido;
    txtNombre.current.value = nombre;
    setMostrar(false);

  }

  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
    props.onHideCancela2(idContrato)

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

  return (
    <Modal
      {...props}
      style={{ background: "rgb(28, 27, 23)" }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onShow={() => {
        setOperacion(props.operacion);
        selecionarClase();

        selecionarTipoContrato();
        selecionarEstado();
        selecionarAcesor();
        selecionarSucursal();
        selecionarTransporte();
        selecionarUso();
        selecionarTipo();

        if (props.operacion !== 1) {
          setValues(props.persona);
          console.log(props.persona);
        }
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          Registro de RCV

        </Modal.Title>
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
        <CatalogoClientes

          show={mostrar}
          onHideCancela={() => { setMostrar(false) }}
          onHideCatalogo={seleccionarCliente}

        />

        <Mensaje
          mensaje={mensaje}
          onHide={() => {
            mensaje.titulo === 'Exito.' ? cerrarModal() :
              setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
          }} />

        <ul class="nav nav-tabs mb-2" id="ex1" role="tablist">
          <li class="nav-item" role="presentation">
            <a
              class="nav-link active"
              id="ex1-tab-1"
              data-mdb-toggle="tab"
              href="#ex1-tabs-1"
              role="tab"
              aria-controls="ex1-tabs-1"
              aria-selected="true">Datos del Cliente</a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              id="ex1-tab-2"
              data-mdb-toggle="tab"
              href="#ex1-tabs-2"
              role="tab"
              aria-controls="ex1-tabs-2"
              aria-selected="false">Datos del Vehiculo</a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              id="ex1-tab-3"
              data-mdb-toggle="tab"
              href="#ex1-tabs-3"
              role="tab"
              aria-controls="ex1-tabs-3"
              aria-selected="false">Forma de Pago</a>
          </li>
        </ul>

        <div class="tab-content" id="ex1-content">
          <div
            class="tab-pane fade show active"
            id="ex1-tabs-1"
            role="tabpanel"
            aria-labelledby="ex1-tab-1">
            <div class="col-md-12 row mx-auto">
              <div class="col-md-5">
                <div class="input-group input-group-sm mb-2 ">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Tipo de contrato: </span>
                  <select class="form-select" ref={cmbTipoContrato} aria-label="Default select example">

                    {tipoContrato && tipoContrato.map((item, index) => (
                      <option key={index} value={item.contrato_id} > {item.contrato_nombre} </option>
                    ))}
                  </select>
                </div>
              </div>
              <div class="col-md-1"></div>
              <div class="col-md-3">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Desde</span>
                  <input type="date" class="form-control" ref={txtDesde} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={moment(fechasistema).format('YYYY/MM/DD')} max={moment(fechasistema).format('YYYY/MM/DD')} />
                </div>
              </div>
              <div class="col-md-3">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Hasta</span>
                  <input type="date" class="form-control" ref={txtHasta} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={moment(fechasistema).format('YYYY/MM/DD')} max={moment(fechasistema).format('YYYY/MM/DD')} />
                </div>
              </div>

              <fieldset class="border rounded-3 p-3 row mx-auto">
                <legend class="float-none w-auto px-3 fw-bold" style={{ fontSize: 15 }} >Datos del contratante</legend>
                <div class="input-group input-group-sm mb-3 col-md-5">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Cedula:</span>
                  <select class="form-select" ref={cmbNacionalidad} aria-label="Default select example">

                    <option value="V-">V-</option>
                    <option value="E-">E-</option>
                    <option value="J-">J-</option>
                    <option value="G-">G-</option>

                  </select>
                  <input type="text" class="form-control" ref={txtCedula} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  <button type="button" class="btn btn-success" onClick={() => { setMostrar(true) }}><i class="fa fa-search"></i></button>
                </div>
                <div class="col-md-5"></div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Fecha Nacimiento</span>
                    <input type="date" ref={txtFechaNaci} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Nombre</span>
                    <input type="text" ref={txtNombre} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Apellido</span>
                    <input type="text" ref={txtApellido} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  </div>
                </div>


                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Telefono</span>
                    <select class="form-select col-md-1" ref={cmbTelefono} aria-label="Default select example">

                      <option value="0414-">0414</option>
                      <option value="0424-">0424</option>
                      <option value="0416-">0416</option>
                      <option value="0426-">0426</option>
                      <option value="0412-">0412</option>



                    </select>
                    <input type="text" class="form-control" ref={txtTelefono} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={handleInputNumChange} />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Correo</span>
                    <input type="text" class="form-control" ref={txtCorreo} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Direción</span>
                    <input type="text" class="form-control" ref={txtDirec} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2 ">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Estado: </span>
                    <select class="form-select" ref={cmbEstado} aria-label="Default select example">

                      {estados && estados.map((item, index) => (
                        <option key={index} value={item.estado_id} > {item.estado_nombre} </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2 ">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Acesor: </span>
                    <select class="form-select" ref={cmbAcesor} aria-label="Default select example">

                      {acesor && acesor.map((item, index) => (
                        <option key={index} value={item.usuario_id} > {item.usuario_nombre} </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2 ">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Sucursal: </span>
                    <select class="form-select" ref={cmbSucursal} aria-label="Default select example">
                      {sucursal && sucursal.map((item, index) => (
                        <option key={index} value={item.sucursal_id} > {item.sucursal_nombre} </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2 ">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Linea de Transporte: </span>
                    <select class="form-select" ref={cmbLinea} aria-label="Default select example">

                      {transporte && transporte.map((item, index) => (
                        <option key={index} value={item.transporte_id} > {item.transporte_nombre} </option>
                      ))}
                    </select>
                  </div>
                </div>


              </fieldset>
              <fieldset class="border rounded-3 p-3 row mx-auto">
                <legend class="float-none w-auto px-3 fw-bold" style={{ fontSize: 15 }} >Titular</legend>
                <div class="input-group input-group-sm mb-3 col-md-5">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Cedula:</span>
                  <select class="form-select" ref={cmbNacionalidadTitular} aria-label="Default select example">

                    <option value="V-">V-</option>
                    <option value="E-">E-</option>
                    <option value="J-">J-</option>
                    <option value="G-">G-</option>

                  </select>
                  <input type="text" class="form-control" ref={txtCedulatTitular} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  <button type="button" class="btn btn-success" onClick={() => { setMostrar(true) }}><i class="fa fa-search"></i></button>
                </div>
                <div class="col-md-9"></div>


                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Nombre</span>
                    <input type="text" ref={txtNombreTitular} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Apellido</span>
                    <input type="text" ref={txtApellidoTitular} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  </div>
                </div>

              </fieldset>



            </div>
          </div>
          <div class="tab-pane fade" id="ex1-tabs-2"
            role="tabpanel" aria-labelledby="ex1-tab-2">
            <div class="col-md-12 row mx-auto">

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Placa</span>
                  <input type="text" ref={txtPlaca} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
              </div>



              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Puesto</span>
                  <input type="text" ref={txtPuesto} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={handleInputNumChange} />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Uso</span>

                  <select class="form-select" ref={txtUso} aria-label="Default select example">
                    {uso && uso.map((item, index) => (
                      <option key={index} value={item.usoVehiculo_id} > {item.usoVehiculo_nombre} </option>
                    ))}
                  </select>

                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Año</span>
                  <input type="text" class="form-control" ref={txtAño} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={handleInputNumChange} />
                </div>
              </div>



              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Ser. Motor</span>
                  <input type="text" class="form-control" ref={txtSerMotor} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Clase</span>

                  <select class="form-select" ref={cmbClase} aria-label="Default select example">
                    {clase && clase.map((item, index) => (
                      <option key={index} value={item.claseVehiculo_id} > {item.clase_nombre} </option>
                    ))}
                  </select>

                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Color</span>
                  <input type="text" class="form-control" ref={txtColor} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
              </div>



              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Ser. Carroceria</span>
                  <input type="text" class="form-control" ref={txtSerCarroceria} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Tipo </span>

                  <select class="form-select" ref={cmbTipo} aria-label="Default select example">

                    {tipo && tipo.map((item, index) => (
                      <option key={index} value={item.tipoVehiculo_id} > {item.tipoVehiculo_nombre} </option>
                    ))}
                  </select>

                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Modelo</span>
                  <input type="text" class="form-control" ref={txtModelo} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Marca</span>
                  <input type="text" class="form-control" ref={txtMarca} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Peso</span>
                  <input type="text" class="form-control" ref={txtPeso} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={handleInputMontoChange} />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Cap. Ton.</span>
                  <input type="text" class="form-control" ref={txtCapTon} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={handleInputMontoChange} />
                </div>
              </div>





            </div>
          </div>
          <div class="tab-pane fade" id="ex1-tabs-3"
            role="tabpanel" aria-labelledby="ex1-tab-3">
            <div class="col-md-12 row mx-auto">
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Forma de Pago </span>

                  <select class="form-select" ref={cmbFormaPago} aria-label="Default select example">
                    <option value="0">Pago Movil</option>
                    <option value="1">Efectivo</option>
                    <option value="2">Transferencia</option>
                    <option value="3">Punto</option>

                  </select>

                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Referencia</span>
                  <input type="text" class="form-control" ref={txtReferencia} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Cantidad a pagar en $</span>
                  <input type="text" class="form-control" ref={txtDolar} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={handleInputMontoChange} />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Cantidad a pagar en bs</span>
                  <input type="text" class="form-control" ref={txtBs} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={handleInputMontoChange} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-sm btn-success rounded-pill col-md-2"
          disabled={props.operacion === 4 ? true : false}
          onClick={onChangeValidar}
        >
          <i className="fas fa-check-circle"> Aceptar</i>
        </button>
        <button
          ref={btnCancela}
          onClick={salir}
          className="btn btn-sm btn-danger rounded-pill col-md-2"
        >
          <i className="fas fa-window-close"> Salir</i>
        </button>
      </Modal.Footer>
    </Modal>
  );
};
