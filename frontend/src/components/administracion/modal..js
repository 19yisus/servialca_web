import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
/* import { Mensaje, MensajeSiNo } from "../mensajes"; */
import { Loader, Dimmer, Label } from "semantic-ui-react";
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
  validaNumeroTelefono,
  validaEmail,
  validaSoloLetras,
} from "../../util/varios";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import axios from "axios";
import moment from "moment";
import { Mensaje } from "../mensajes";
import CatalogoClientes from "../../catalogos/catalogoClientes";
import CatalogoTipoContrato from "../../catalogos/catalagoTipoContrato";
import CatalogoAcesor from "../../catalogos/catalogoAcesor";
import CatalogoSucursal from "../../catalogos/catalagoSucursal";
import CatalogoTransporte from "../../catalogos/catalagoTransporte";
import CatalogoUso from "../../catalogos/catalogoUso";
import CatalogoClase from "../../catalogos/catalogoClase";
import CatalogoTipo from "../../catalogos/catalagoTipoVehiculo";
import CatalogoTitular from "../../catalogos/catalogoTitular";
import CatalogoVehiculo from "../../catalogos/catalogoVehiculo";


export const ModalRcv = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  const fechasistema = JSON.parse(localStorage.getItem("fechasistema"));
  const dolarbcv = JSON.parse(localStorage.getItem("dolarbcv"));
  const user = JSON.parse(localStorage.getItem("username"));
  const idUser = JSON.parse(localStorage.getItem("user_id"));
  const suc = JSON.parse(localStorage.getItem("sucursal"));
  const idsucursal = JSON.parse(localStorage.getItem("idsucursal"));
  const [value, setValue] = useState("");
  //ID
  const idPoliza = useRef();
  const idCliente = useRef();
  const idTitular = useRef();
  const idVehiculo = useRef();
  // const idColor = useRef();
  // const idMarca = useRef();
  // const idModelo = useRef();
  const idCobertura = useRef();
  //Contrato
  const TxtTipoContrato = useRef(null);
  const txtDesde = useRef();
  const txtHasta = useRef();
  const cmbEstado = useRef();
  const txtAcesor = useRef();
  const cmbSucursal = useRef();
  const txtLinea = useRef();
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
  const txtClase = useRef();
  const txtColor = useRef();
  const txtSerCarroceria = useRef();
  const cmbTipo = useRef();
  const txtModelo = useRef();
  const txtMarca = useRef();
  const txtPeso = useRef();
  const txtCapTon = useRef();

  //Pago
  const cmbFormaPago = useRef();
  const txtReferencia = useRef();
  const txtBs = useRef();
  const txtDolar = useRef();

  //otros
  const txtNContrato = useRef();
  const txtTipoContrato = useRef();
  const txtFechaEmision = useRef();
  const txtFechaVencimiento = useRef();
  const txtDireccion = useRef();
  const txtPuestos = useRef();
  const txtAnio = useRef();
  const txtTipoVehiculo = useRef();
  const txtCapTone = useRef();
  const [vehiculo, setVehiculo] = useState();
  const [tipoContrato, setTipoContrato] = useState([]);
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
  const [mostrar1, setMostrar1] = useState(false);
  const [mostrar2, setMostrar2] = useState(false);
  const [mostrar3, setMostrar3] = useState(false);

  const [mostrar4, setMostrar4] = useState(false);

  const [mostrar5, setMostrar5] = useState(false);

  const [mostrar6, setMostrar6] = useState(false);

  const [mostrar7, setMostrar7] = useState(false);
  const [mostrar8, setMostrar8] = useState(false);
  const [mostrar9, setMostrar9] = useState(false);

  const [idContrato, setIdContrato] = useState();
  const [operacion, setOperacion] = useState(0);

  /*********************************************** FUNCINES DE VALIDACION***********************************************************/

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
    let endpoint = "";
    if (operacion === 2) {
      endpoint = op.conexion + "/poliza/editar";
    } else if (operacion === 3) {
      endpoint = op.conexion + "/poliza/renovar";
    } else {
      endpoint = op.conexion + "/poliza/registrar";
    }

    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();
    //ID
    bodyF.append("ID", idPoliza.current.value);
    bodyF.append("idCliente", idCliente.current.value);
    bodyF.append("idTitular", idTitular.current.value);
    bodyF.append("idVehiculo", idVehiculo.current.value);
    bodyF.append("idCobertura", idCobertura.current.value);
    //Contrato
    bodyF.append("fechaInicio", txtDesde.current.value);
    bodyF.append("fechaVencimiento", txtHasta.current.value);
    bodyF.append("tipoContrato", TxtTipoContrato.current.value);
    bodyF.append("Estado", cmbEstado.current.value);
    bodyF.append("Usuario", txtAcesor.current.value);
    bodyF.append("Sucursal", cmbSucursal.current.value);
    //Contratante
    bodyF.append(
      "Cedula",
      cmbNacionalidad.current.value + txtCedula.current.value
    );
    bodyF.append("Nombre", txtNombre.current.value);
    bodyF.append("Apellido", txtApellido.current.value);
    bodyF.append("fechaNacimiento", txtFechaNaci.current.value);
    bodyF.append(
      "Telefono",
      cmbTelefono.current.value + txtTelefono.current.value
    );
    bodyF.append("Correo", txtCorreo.current.value);
    bodyF.append("Direccion", txtDirec.current.value);
    //titular
    bodyF.append(
      "cedulaTitular",
      cmbNacionalidadTitular.current.value + txtCedulatTitular.current.value
    );
    bodyF.append("nombreTitular", txtNombreTitular.current.value);
    bodyF.append("apellidoTitular", txtApellidoTitular.current.value);

    //Vehiculo
    bodyF.append("Placa", txtPlaca.current.value);
    bodyF.append("Puesto", txtPuesto.current.value);
    bodyF.append("Ano", txtAño.current.value);
    bodyF.append("serialMotor", txtSerMotor.current.value);
    bodyF.append("serialCarroceria", txtSerCarroceria.current.value);
    bodyF.append("Color", txtColor.current.value);
    bodyF.append("Uso", txtUso.current.value);
    bodyF.append("Clase", txtClase.current.value);
    bodyF.append("Tipo", cmbTipo.current.value);
    bodyF.append("Modelo", txtModelo.current.value);
    bodyF.append("Marca", txtMarca.current.value);
    bodyF.append("Peso", txtPeso.current.value);
    bodyF.append("Capacidad", txtCapTon.current.value);

    //Cobertura
    var monto = txtDolar.current.value.replace(",", ".");
    bodyF.append("danoCosas", monto * 0.4);
    bodyF.append("danoPersonas", monto * 0.2);
    bodyF.append("fianza", monto * 0.1);
    bodyF.append("asistencia", monto * 0.1);
    bodyF.append("apov", monto * 1);
    bodyF.append("muerte", monto * 0.1);
    bodyF.append("invalidez", monto * 0);
    bodyF.append("medico", monto * 0);
    bodyF.append("grua", monto * 0.1);
    bodyF.append("monto", monto);

    //Pago
    bodyF.append("metodoPago", cmbFormaPago.current.value);
    bodyF.append("Referencia", txtReferencia.current.value);
    bodyF.append("cantidadDolar", monto);
    bodyF.append("precioDolar", dolarbcv.toFixed(2));
    bodyF.append("token", token);
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        if (response.code == 200) {
          setMensaje({
            mostrar: true,
            titulo: "Exito.",
            texto: response.res,
            icono: "exito",
          });
        }
        if (response.code == 400) {
          setMensaje({
            mostrar: true,
            titulo: "Error.",
            texto: response.res,
            icono: "error",
          });
        }
        setIdContrato(response.id);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const selecionarPrecio = async () => {
    if (TxtTipoContrato.current.value === "") alert("No se puede consultar sin el contrato seleccionado"); return false;
    if (cmbTipo.current.value === "") alert("No se puede consultar sin el tipo de contrato seleccionado"); return false;
    let endpoint = op.conexion + "/tipo_vehiculo/ConsultarPrecio";
    setActivate(true);
    let bodyF = new FormData();
    bodyF.append("Contrato", TxtTipoContrato.current.value);
    bodyF.append("Tipo", cmbTipo.current.value);
    bodyF.append("Sucursal", suc);
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        txtDolar.current.value = response[0]["precio_monto"];
        txtBs.current.value = response[0]["precio_monto"] * dolarbcv;
        console.log("tipo contrato");
        setTipoContrato(response);
        console.log(response);
        txtDolar.current.value(response.precio_monto);
      })
      .catch((error) => console.log("Precio: Falta uno de los parametros"));
  };

  const selecionarTipoContrato = async () => {
    let endpoint = op.conexion + "/tipo_contrato/ConsultarTodos";
    setActivate(true);
    let bodyF = new FormData();
    // bodyF.append("ID", user_id)
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        setTipoContrato(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const selecionarEstado = async () => {
    let endpoint = op.conexion + "/estado/ConsultarTodos";
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("ID", user_id)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);

        setEstados(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const selecionarAcesor = async () => {
    let endpoint = op.conexion + "/Auth/ConsultarTodos";
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("ID", user_id)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response)
        setAcesor(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const selecionarSucursal = async () => {
    let endpoint = op.conexion + "/sucursal/ConsultarTodos";
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("ID", user_id)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        setSucursal(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const selecionarTransporte = async () => {
    let endpoint = op.conexion + "/transporte/ConsultarTodos";
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("ID", user_id)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        setTransporte(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const selecionarUso = async () => {
    let endpoint = op.conexion + "/usoVehiculo/ConsultarTodos";
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("ID", user_id)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        setUso(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const selecionarClase = async () => {
    let endpoint = op.conexion + "/claseVehiculo/ConsultarTodos";
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("ID", user_id)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        setClase(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const selecionarTipo = async () => {
    let endpoint = op.conexion + "/tipo_vehiculo/ConsultarTodos?Sucursal=" + idsucursal;
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("Sucursal",);

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        setTipo(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const onChangeValidar = () => {
    let sigue = true;
    let minimo = 0;
    let calculo = 0;
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
  // Para poder la fecha en rcv
  const fechaSistema = moment();
  const fechaHasta = fechaSistema.clone().add(1, "year");

  const check = (e) => {
    var textV = "which" in e ? e.which : e.keyCode,
      char = String.fromCharCode(textV),
      regex = /[a-z]/gi;
    if (!regex.test(char)) e.preventDefault();
    return false;
  };
  const seleccionarCliente = (
    nombre,
    apellido,
    cedula,
    nacionalidad,
    correo,
    codigo,
    telefono,
    dir
  ) => {
    console.log(nombre, apellido, cedula);
    cmbNacionalidad.current.value = nacionalidad + "-";
    txtCedula.current.value = cedula;
    txtApellido.current.value = apellido;
    txtNombre.current.value = nombre;
    cmbTelefono.current.value = codigo + "-";
    txtTelefono.current.value = telefono;
    txtCorreo.current.value = correo;
    txtDirec.current.value = dir;
    let item = document.getElementById("ced");
    item.className -= " form-text fw-bold visible ";
    item.className += " form-text fw-bold hidden ";
    setMostrar(false);
  };
  const seleccionarVehiculo = (
    placa,
    puesto,
    uso,
    ano,
    serMotor,
    clase,
    color,
    serCarroceria,
    tipo,
    modelo,
    marca,
    peso,
    capTotal
  ) => {
    setMostrar8(false);

    txtPlaca.current.value = placa;
    txtPuesto.current.value = puesto;
    txtUso.current.value = uso;
    txtAño.current.value = ano;
    txtSerMotor.current.value = serMotor;
    txtClase.current.value = clase;
    txtColor.current.value = color;
    txtSerCarroceria.current.value = serCarroceria;
    cmbTipo.current.value = tipo;
    txtModelo.current.value = modelo;
    txtMarca.current.value = marca;
    txtPeso.current.value = peso;
    txtCapTon.current.value = capTotal;
    setMostrar(false);
    selecionarPrecio();
  };
  const seleccionarTitular = (nombre, apellido, cedula, nacionalidad) => {
    setMostrar9(false);
    cmbNacionalidadTitular.current.value = nacionalidad + "-";
    txtCedulatTitular.current.value = cedula;
    txtNombreTitular.current.value = nombre;
    txtApellidoTitular.current.value = apellido;
    setMostrar(false);
  };

  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
    props.onHideCancela2(idContrato);
  };

  const validarTitular = (e) => {
    if (e.target.value === txtCedula.current.value) {
      txtNombreTitular.current.value = txtNombre.current.value;
      txtApellidoTitular.current.value = txtApellido.current.value;
    } else {
      txtNombreTitular.current.value = "";
      txtApellidoTitular.current.value = "";
    }
  };

  function soloLetras(event) {
    if (
      (event.keyCode != 32 && event.keyCode < 65) ||
      (event.keyCode > 90 && event.keyCode < 97) ||
      event.keyCode > 122
    )
      event.returnValue = false;
  }
  const handleFormaPagoChange = () => {
    const selectedOption = cmbFormaPago.current.value;

    // Si la opción seleccionada es "Efectivo" o "Punto", deshabilita el input de referencia; de lo contrario, habilítalo.
    if (selectedOption === "1" || selectedOption === "3") {
      txtReferencia.current.disabled = true;
    } else {
      txtReferencia.current.disabled = false;
    }
  };
  const handleInputMontoChange = (event) => {
    validaMonto(event);
    if (event.which === 13 || typeof event.which === "undefined") {
      if (event.target.name === "dolar") {
        let bs = parseFloat(dolarbcv);
        let total = parseFloat(event.target.value) * bs;
        txtBs.current.value = formatMoneda(
          total.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
      }
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

  const handleChange = (maxValue) => (e) => {
    const inputValue = e.target.value;
    // Verificar si la longitud del valor ingresado supera el valor máximo
    if (isNaN(inputValue)) {
      if (inputValue.length > maxValue && e.key !== "Backspace") {
        e.preventDefault(); // Evitar que se escriba el valor excedente
      }
    } else {
      if (
        inputValue.length >= maxValue &&
        e.key !== "Backspace" &&
        e.key !== " "
      ) {
        e.preventDefault(); // Evitar que se escriba el valor excedente
      }
    }
  };

  const selectTipoContrato = (nombre) => {
    setMostrar1(false);
    TxtTipoContrato.current.value = nombre;
  };

  const selectAcesor = (nombre) => {
    setMostrar2(false);
    txtAcesor.current.value = nombre;
  };

  const selectSucursal = (nombre) => {
    setMostrar3(false);
    cmbSucursal.current.value = nombre;
  };

  const selectTransporte = (nombre) => {
    setMostrar4(false);
    txtLinea.current.value = nombre;
  };

  const selectUso = (nombre) => {
    setMostrar5(false);
    txtUso.current.value = nombre;
  };

  const selectClase = (nombre) => {
    setMostrar6(false);
    txtClase.current.value = nombre;
  };

  const selectTipo = (nombre, precio) => {
    setMostrar7(false);
    cmbTipo.current.value = nombre;
    txtDolar.current.value = precio;
    let bs = parseFloat(dolarbcv);
    let total = parseFloat(precio) * bs;
    txtBs.current.value = formatMoneda(
      total.toString().replace(",", "").replace(".", ","),
      ",",
      ".",
      2
    );
  };

  const selecionarRegistros = async (id) => {
    let endpoint = op.conexion + "/poliza/ConsultarUno?ID=" + id;
    setActivate(true);
    let bodyF = new FormData();
    //    bodyF.append("ID", id)
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        idPoliza.current.value = response[0].poliza_id;
        idCliente.current.value = response[0].cliente_id;
        idTitular.current.value = response[0].titular_id;
        idVehiculo.current.value = response[0].vehiculo_id;
        idCobertura.current.value = response[0].nota_id;
        TxtTipoContrato.current.value = response[0].contrato_nombre;
        txtDesde.current.value = response[0].poliza_fechaInicio;
        txtHasta.current.value = response[0].poliza_fechaVencimiento;
        var cedula = response[0].cliente_cedula.split("-");
        cmbNacionalidad.current.value = cedula[0] + "-";
        txtCedula.current.value = cedula[1];
        txtNombre.current.value = response[0].cliente_nombre;
        txtApellido.current.value = response[0].cliente_apellido;
        txtFechaNaci.current.value = response[0].cliente_fechaNacimiento;
        var telefono = response[0].cliente_telefono.split("-");
        cmbTelefono.current.value = telefono[0] + "-";
        txtTelefono.current.value = telefono[1];
        txtCorreo.current.value = response[0].cliente_correo;
        txtDirec.current.value = response[0].cliente_direccion;
        if (!response[0].estado_nombre) {
          cmbEstado.current.value = "Portuguesa";
        } else {
          cmbEstado.current.value = response[0].estado_nombre;
        }
        txtAcesor.current.value = response[0].usuario_nombre;
        cmbSucursal.current.value = response[0].sucursal_nombre;
        if (!response[0].linea_nombre) {
          txtLinea.current.value = "";
        } else {
          txtLinea.current.value = response[0].linea_nombre;
        }
        var cedulaTitular = response[0].titular_cedula.split("-");
        cmbNacionalidadTitular.current.value = cedulaTitular[0] + "-";
        txtCedulatTitular.current.value = cedulaTitular[1];
        txtNombreTitular.current.value = response[0].titular_nombre;
        txtApellidoTitular.current.value = response[0].titular_apellido;
        txtPlaca.current.value = response[0].vehiculo_placa;
        txtPuesto.current.value = response[0].vehiculo_puesto;
        txtUso.current.value = response[0].usoVehiculo_nombre;
        txtAño.current.value = response[0].vehiculo_año;
        txtSerMotor.current.value = response[0].vehiculo_serialMotor;
        txtClase.current.value = response[0].clase_nombre;
        txtColor.current.value = response[0].color_nombre;
        txtSerCarroceria.current.value = response[0].vehiculo_serialCarroceria;
        cmbTipo.current.value = response[0].tipoVehiculo_nombre;
        txtModelo.current.value = response[0].modelo_nombre;
        txtMarca.current.value = response[0].marca_nombre;
        txtPeso.current.value = response[0].vehiculo_peso;
        txtCapTon.current.value = response[0].vehiculo_capTon;
        cmbFormaPago.current.value = response[0].nota_tipoPago;
        txtReferencia.current.value = response[0].nota_referencia;
        txtDolar.current.value = response[0].nota_monto;
        txtBs.current.value = (response[0].nota_monto * dolarbcv).toFixed(2);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };
  const options = [
    'Option 1',
    'Option 2',
    'Option 3',
    // Agrega más opciones según sea necesario
  ];

  const [valorSeleccionado, setValorSeleccionado] = useState();

  const handleChange1 = (selected) => {
   
    if (selected && selected.length > 0 && selected[0].contrato_id) {
     
      if(selected[0].contrato_id && selected[0].contrato_nombre){
       // console.log('Valor seleccionado:', selected[0]);

      }
     
    } else {
      // Manejar el caso en el que selected no tiene la estructura esperada
      console.log('No se pudo obtener el valor seleccionado o la estructura es incorrecta.');
    }
    console.log('Valor seleccionado:', selected[0]);
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
        if (props.operacion === 2 || props.operacion === 3) {
          selecionarRegistros(props.idCliente);
        }
        setOperacion(props.operacion);
        selecionarClase();
        selecionarTipoContrato();
        selecionarEstado();
        selecionarAcesor();
        selecionarSucursal();
        selecionarTransporte();
        selecionarUso();
        selecionarTipo();
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          <Modal.Title style={{ color: "#fff" }}>
            {operacion === 1
              ? "Registro de RCV"
              : operacion === 2
                ? "Editar de RCV"
                : operacion === 3
                  ? "Renovar de RCV"
                  : "Registro de RCV"}
          </Modal.Title>{" "}
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
        <CatalogoVehiculo
          show={mostrar8}
          onHideCancela={() => {
            setMostrar8(false);
          }}
          onHideCatalogo={seleccionarVehiculo}
        />

        <CatalogoClientes
          show={mostrar}
          onHideCancela={() => {
            setMostrar(false);
          }}
          onHideCatalogo={seleccionarCliente}
        />

        <CatalogoTitular
          show={mostrar9}
          onHideCancela={() => {
            setMostrar9(false);
          }}
          onHideCatalogo={seleccionarTitular}
        />

        <CatalogoTipoContrato
          records={tipoContrato}
          show={mostrar1}
          onHideCancela={() => {
            setMostrar1(false);
          }}
          onHideCatalogo={selectTipoContrato}
        />

        <CatalogoAcesor
          records={acesor}
          show={mostrar2}
          onHideCancela={() => {
            setMostrar2(false);
          }}
          onHideCatalogo={selectAcesor}
        />

        <CatalogoSucursal
          records={sucursal}
          show={mostrar3}
          onHideCancela={() => {
            setMostrar3(false);
          }}
          onHideCatalogo={selectSucursal}
        />

        <CatalogoTransporte
          records={transporte}
          show={mostrar4}
          onHideCancela={() => {
            setMostrar4(false);
          }}
          onHideCatalogo={selectTransporte}
        />

        <CatalogoUso
          records={uso}
          show={mostrar5}
          onHideCancela={() => {
            setMostrar5(false);
          }}
          onHideCatalogo={selectUso}
        />

        <CatalogoClase
          records={clase}
          show={mostrar6}
          onHideCancela={() => {
            setMostrar6(false);
          }}
          onHideCatalogo={selectClase}
        />
        <CatalogoTipo
          records={tipo}
          show={mostrar7}
          onHideCancela={() => {
            setMostrar7(false);
          }}
          onHideCatalogo={selectTipo}
        />
        <Mensaje
          mensaje={mensaje}
          onHide={() => {
            mensaje.titulo === "Exito."
              ? cerrarModal()
              : setMensaje({
                mostrar: false,
                titulo: "",
                texto: "",
                icono: "",
              });
          }}
        />

        <ul class="nav nav-tabs mb-2" id="ex1" role="tablist">
          <li class="nav-item" role="presentation">
            <a
              class="nav-link active"
              id="ex1-tab-1"
              data-mdb-toggle="tab"
              href="#ex1-tabs-1"
              role="tab"
              aria-controls="ex1-tabs-1"
              aria-selected="true"
            >
              Datos del Cliente
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              id="ex1-tab-2"
              data-mdb-toggle="tab"
              href="#ex1-tabs-2"
              role="tab"
              aria-controls="ex1-tabs-2"
              aria-selected="false"
            >
              Datos del Vehiculo
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              onClick={(e) => selecionarPrecio(e)}
              class="nav-link"
              id="ex1-tab-3"
              data-mdb-toggle="tab"
              href="#ex1-tabs-3"
              role="tab"
              aria-controls="ex1-tabs-3"
              aria-selected="false"
            >
              Forma de Pago
            </a>
          </li>
        </ul>

        <div class="tab-content" id="ex1-content">
          <div
            class="tab-pane fade show active"
            id="ex1-tabs-1"
            role="tabpanel"
            aria-labelledby="ex1-tab-1"
          >
            <div class="col-md-12 row mx-auto">
              <div class="col-md-5">
                <div class="input-group input-group-sm mb-2 ">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Tipo de contrato:{" "}
                  </span>
                  {/*
                  <select class="form-select" ref={} aria-label="Default select example">

                    {tipoContrato && tipoContrato.map((item, index) => (
                      <option key={index} value={item.contrato_id} > {item.contrato_nombre} </option>
                    ))}
                  </select>
                  <input type="hidden" ref={idPoliza} />
                  <input type="hidden" ref={idCliente} />
                  <input type="hidden" ref={idTitular} />
                  <input type="hidden" ref={idVehiculo} />
                  <input type="hidden" ref={idCobertura} />
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    ref={TxtTipoContrato}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => {
                      if (operacion === 3) {
                        setMostrar1(false);
                      } else {
                        setMostrar1(true);
                      }
                    }}
                  >
                    <i class="fa fa-search"></i>
                  </button>*/}


                  <Typeahead
                    id="myTypeahead"
                    onChange={handleChange1}
                    labelKey="contrato_nombre"
                    options={tipoContrato}
                    placeholder="Select an option"
                    ref={TxtTipoContrato}
                    bsSize="small"
                    defaultSelected={valorSeleccionado ? [valorSeleccionado] : []}
                  />


                </div>
              </div>
              <div class="col-md-1"></div>
              <div class="col-md-3">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Desde
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    ref={txtDesde}
                    disabled
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={fechaSistema.format("YYYY-MM-DD")}
                    max={fechaSistema.format("YYYY-MM-DD")}
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Hasta
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    ref={txtHasta}
                    disabled
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={fechaHasta.format("YYYY-MM-DD")}
                    max={fechaHasta.format("YYYY-MM-DD")}
                  />
                </div>
              </div>
              <fieldset class="border rounded-3 p-3 row mx-auto">
                <legend
                  class="float-none w-auto px-3 fw-bold"
                  style={{ fontSize: 15 }}
                >
                  Datos del contratante
                </legend>
                <div class="input-group input-group-sm mb-1 co-md-5">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Cedula:
                  </span>
                  <select
                    disabled={operacion === 3}
                    class="form-select col-md-3"
                    ref={cmbNacionalidad}
                    aria-label="Default select example"
                  >
                    <option value="V-">V-</option>
                    <option value="E-">E-</option>
                    <option value="J-">J-</option>
                    <option value="G-">G-</option>
                  </select>
                  <input
                    type="text"
                    class="form-control"
                    disabled={operacion === 3}
                    ref={txtCedula}
                    onKeyDown={handleChange(9)}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    maxLength={9}
                    name="ced"
                    onChange={validaSoloNumero}
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => {
                      setMostrar(true);
                    }}
                  >
                    <i class="fa fa-search"></i>
                  </button>
                  <div id="ced" class="form-text hidden">
                    Debe ingresar un cedula valida longitud(8-9).
                  </div>
                </div>
                <div class="col-md-3"></div>
                <div class="col-md-4 mb-1">
                  <div class="input-group input-group-sm">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Fecha Nacimiento
                    </span>
                    <input
                      disabled={operacion === 3}
                      type="date"
                      ref={txtFechaNaci}
                      class="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      name="fecha"
                    />
                  </div>
                  <div id="fecha" class="form-text hidden">
                    Debe ingresar fecha valida
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Nombre
                    </span>
                    <input
                      type="text"
                      disabled={operacion === 3}
                      onKeyDown={handleChange(25)}
                      ref={txtNombre}
                      class="form-control "
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      onChange={validaSoloLetras}
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Apellido
                    </span>
                    <input
                      disabled={operacion === 3}
                      type="text"
                      onKeyDown={handleChange(25)}
                      ref={txtApellido}
                      class="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      onChange={validaSoloLetras}
                    />
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Telefono
                    </span>
                    <select
                      class="form-select col-md-4"
                      ref={cmbTelefono}
                      aria-label="Default select example"
                    >
                      <option value="0414-">0414</option>
                      <option value="0424-">0424</option>
                      <option value="0416-">0416</option>
                      <option value="0426-">0426</option>
                      <option value="0412-">0412</option>
                    </select>
                    <input
                      type="text"
                      class="form-control"
                      onKeyDown={handleChange(7)}
                      ref={txtTelefono}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      onChange={validaSoloNumero}
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Correo
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      onKeyDown={handleChange(25)}
                      ref={txtCorreo}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Direción
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      onKeyDown={handleChange(30)}
                      ref={txtDirec}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2 ">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Estado:{" "}
                    </span>
                    { /* <select
                      disabled={operacion === 3}
                      class="form-select"
                      ref={cmbEstado}
                      aria-label="Default select example"
                    >
                      {estados &&
                        estados.map((item, index) => (
                          <option key={index} value={item.estado_id}>
                            {" "}
                            {item.estado_nombre}{" "}
                          </option>
                        ))}
                    </select>*/}

                    <Typeahead
                      id="myTypeahead"
                      onChange={handleChange1}
                      labelKey="estado_nombre"
                      options={estados}
                      placeholder="Select an option"
                      ref={cmbEstado}
                      bsSize="small"
                      defaultSelected={valorSeleccionado ? [valorSeleccionado] : []}
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div className="input-group input-group-sm mb-2">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      Acesor:{" "}
                    </span>
                    { /*  <input
                      disabled
                      type="text"
                      className="form-control"
                      ref={txtAcesor}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      defaultValue={operacion === 1 ? user : ""}
                    />
                   idUser === 57 ? (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          setMostrar2(true);
                        }}
                      >
                        <i className="fa fa-search"></i>
                      </button>
                    ) : null*/}
                    <Typeahead
                      id="myTypeahead"
                      onChange={handleChange1}
                      labelKey="usuario_nombre"
                      options={acesor}
                      placeholder="Select an option"
                      ref={txtAcesor}
                      bsSize="small"
                      defaultSelected={valorSeleccionado ? [valorSeleccionado] : []}
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group input-group-sm mb-2 ">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Sucursal:{" "}
                    </span>

                  { /* <input
                      disabled
                      defaultValue={operacion === 1 ? suc : ""}
                      type="text"
                      class="form-control"
                      ref={sucursal}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                    idUser === 57 ? (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          setMostrar3(true);
                        }}
                      >
                        <i className="fa fa-search"></i>
                      </button>
                    ) : null*/}

                    <Typeahead
                      id="myTypeahead"
                      onChange={handleChange1}
                      labelKey="sucursal_nombre"
                      options={sucursal}
                      placeholder="Select an option"
                      ref={cmbSucursal}
                      bsSize="small"
                      defaultSelected={valorSeleccionado ? [valorSeleccionado] : []}
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2 ">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Linea de Transporte:{" "}
                    </span>
                    {/*<select class="form-select" ref={txtLinea} aria-label="Default select example">

                      {transporte && transporte.map((item, index) => (
                        <option key={index} value={item.transporte_id} > {item.transporte_nombre} </option>
                      ))}
                    </select

                    <input
                      disabled
                      type="text"
                      class="form-control"
                      ref={txtLinea}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                    <button
                      type="button"
                      class="btn btn-success"
                      onClick={() => {
                        setMostrar4(true);
                      }}
                    >
                      <i class="fa fa-search"></i>
                    </button>>*/}

                    <Typeahead
                      id="myTypeahead"
                      onChange={handleChange1}
                      labelKey="transporte_nombre"
                      options={transporte}
                      placeholder="Select an option"
                      ref={txtLinea}
                      bsSize="small"
                      defaultSelected={valorSeleccionado ? [valorSeleccionado] : []}
                    />
                  </div>
                </div>
              </fieldset>
              <fieldset class="border rounded-3 p-3 row mx-auto">
                <legend
                  class="float-none w-auto px-3 fw-bold"
                  style={{ fontSize: 15 }}
                >
                  Titular
                </legend>
                <div class="input-group input-group-sm mb-3 col-md-5">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Cedula:
                  </span>
                  <select
                    class="form-select col-md-3"
                    ref={cmbNacionalidadTitular}
                    aria-label="Default select example"
                  >
                    <option value="V-">V-</option>
                    <option value="E-">E-</option>
                    <option value="J-">J-</option>
                    <option value="G-">G-</option>
                  </select>
                  <input
                    type="text"
                    class="form-control"
                    onKeyDown={handleChange(9)}
                    onKeyPress={validarTitular}
                    ref={txtCedulatTitular}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={validaSoloNumero}
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => {
                      setMostrar9(true);
                    }}
                  >
                    <i class="fa fa-search"></i>
                  </button>
                </div>
                <div class="col-md-9"></div>

                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Nombre
                    </span>
                    <input
                      onKeyDown={handleChange(25)}
                      type="text"
                      ref={txtNombreTitular}
                      class="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      onChange={validaSoloLetras}
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Apellido
                    </span>
                    <input
                      onKeyDown={handleChange(25)}
                      type="text"
                      ref={txtApellidoTitular}
                      class="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      onChange={validaSoloLetras}
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="ex1-tabs-2"
            role="tabpanel"
            aria-labelledby="ex1-tab-2"
          >
            <div class="col-md-12 row mx-auto">
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Placa
                  </span>
                  <input
                    disabled={operacion === 3}
                    type="text"
                    ref={txtPlaca}
                    onKeyDown={handleChange(8)}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => {
                      setMostrar8(true);
                    }}
                  >
                    <i class="fa fa-search"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Puesto
                  </span>
                  <input
                    disabled={operacion === 3}
                    type="text"
                    onKeyDown={handleChange(2)}
                    ref={txtPuesto}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={validaSoloNumero}
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Uso
                  </span>

                  {/*<select class="form-select" ref={txtUso} aria-label="Default select example">
                    {uso && uso.map((item, index) => (
                      <option key={index} value={item.usoVehiculo_id} > {item.usoVehiculo_nombre} </option>
                    ))}
                  </select>
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    ref={txtUso}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => {
                      setMostrar5(true);
                    }}
                  >
                    <i class="fa fa-search"></i>
                  </button>*/}
                  
                  <Typeahead
                      id="myTypeahead"
                      onChange={handleChange1}
                      labelKey="usoVehiculo_nombre"
                      options={uso}
                      placeholder="Select an option"
                      ref={txtUso}
                      bsSize="small"
                      defaultSelected={valorSeleccionado ? [valorSeleccionado] : []}
                    />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Año
                  </span>
                  <input
                    disabled={operacion === 3}
                    type="text"
                    class="form-control"
                    onKeyDown={handleChange(4)}
                    ref={txtAño}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={validaSoloNumero}
                  />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Ser. Motor
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    onKeyDown={handleChange(18)}
                    ref={txtSerMotor}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Clase
                  </span>

                  {/*<select class="form-select" ref={txtClase} aria-label="Default select example">
                    {clase && clase.map((item, index) => (
                      <option key={index} value={item.claseVehiculo_id} > {item.clase_nombre} </option>
                    ))}
                  </select>
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    ref={txtClase}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => {
                      setMostrar6(true);
                    }}
                  >
                    <i class="fa fa-search"></i>
                  </button>*/}
                   <Typeahead
                      id="myTypeahead"
                      onChange={handleChange1}
                      labelKey="clase_nombre"
                      options={clase}
                      placeholder="Select an option"
                      ref={txtClase}
                      bsSize="small"
                      defaultSelected={valorSeleccionado ? [valorSeleccionado] : []}
                    />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Color
                  </span>
                  <input
                    onKeyDown={handleChange(20)}
                    type="text"
                    class="form-control"
                    ref={txtColor}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={validaSoloLetras}
                  />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Ser. Carroceria
                  </span>
                  <input
                    disabled={operacion === 3}
                    type="text"
                    class="form-control"
                    onKeyDown={handleChange(18)}
                    ref={txtSerCarroceria}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Tipo
                  </span>
                  {/* <select
                    class="form-select"
                    ref={cmbTipo}
                    aria-label="Default select example"
                  >
                    {tipo &&
                      tipo.map((item, index) => (
                        <option key={index} value={item.tipoVehiculo_id}>
                          {" "}
                          {item.tipoVehiculo_nombre}{" "}
                        </option>
                      ))}
                  </select>
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    ref={cmbTipo}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => {
                      setMostrar7(true);
                    }}
                  >
                    <i class="fa fa-search"></i>
                  </button> */}
                    <Typeahead
                      id="myTypeahead"
                      onChange={handleChange1}
                      labelKey="tipoVehiculo_nombre"
                      options={tipo}
                      placeholder="Select an option"
                      ref={cmbTipo}
                      bsSize="small"
                      defaultSelected={valorSeleccionado ? [valorSeleccionado] : []}
                    />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Modelo
                  </span>
                  <input
                    disabled={operacion === 3}
                    onKeyDown={handleChange(15)}
                    type="text"
                    class="form-control"
                    ref={txtModelo}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Marca
                  </span>
                  <input
                    disabled={operacion === 3}
                    onKeyDown={handleChange(15)}
                    type="text"
                    class="form-control"
                    ref={txtMarca}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Peso
                  </span>
                  <input
                    disabled={operacion === 3}
                    onKeyDown={handleChange(10)}
                    type="text"
                    class="form-control"
                    ref={txtPeso}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={handleInputMontoChange}
                  />
                </div>
              </div>

              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Cap. Ton.
                  </span>
                  <input
                    disabled={operacion === 3}
                    onKeyDown={handleChange(10)}
                    type="text"
                    class="form-control"
                    ref={txtCapTon}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={handleInputMontoChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="ex1-tabs-3"
            role="tabpanel"
            aria-labelledby="ex1-tab-3"
          >
            <div class="col-md-12 row mx-auto">
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Forma de Pago{" "}
                  </span>

                  <select
                    class="form-select"
                    ref={cmbFormaPago}
                    aria-label="Default select example"
                    onChange={handleFormaPagoChange}
                  >
                    <option value="0">Pago Movil</option>
                    <option value="1">Efectivo</option>
                    <option value="2">Transferencia</option>
                    <option value="3">Punto</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Referencia
                  </span>
                  <input
                    onKeyDown={handleChange(4)}
                    type="text"
                    class="form-control"
                    ref={txtReferencia}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={validaSoloNumero}
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Cantidad a pagar en $
                  </span>
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    name="dolar"
                    ref={txtDolar}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={handleInputMontoChange}
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Cantidad a pagar en bs
                  </span>
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    ref={txtBs}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={handleInputMontoChange}
                  />
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
