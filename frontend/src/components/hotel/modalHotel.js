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
  validaSoloLetras,
} from "../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../mensajes";
import CatalogoClientes from "../../catalogos/catalogoClientes";

export const ModalHotel = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");

  const txtNombre = useRef();
  const txtApellido = useRef();
  const txtFechaNacimiento = useRef();
  const txtCedula = useRef();
  const cmbNacionalidad = useRef();
  const cmbCodigo = useRef();
  const txtNumber = useRef();
  const txtPlaca = useRef();
  const txtDireccion = useRef();
  const cmbHabitacion = useRef();
  const txtModelo = useRef();
  const txtColor = useRef();
  const txtDescripcion = useRef();
  const txtComision = useRef();
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
    let endpoint;
    console.log(endpoint);
    setActivate(true);
    let bodyF = new FormData();

    if (operacion === 1) {
      endpoint = op.conexion + "/hotel/registrar";
      bodyF.append(
        "Cedula",
        cmbNacionalidad.current.value + txtCedula.current.value
      );
      bodyF.append("Placa", txtPlaca.current.value);
      bodyF.append("Habitacion", cmbHabitacion.current.value);
    } else if (operacion === 2) {
      endpoint = op.conexion + "/hotel/actualizar";
    } else {
      endpoint = op.conexion + "/hotel/eliminar";
    }

    bodyF.append("Token", token);
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);

        if (response.code == 400) {
          setMensaje({
            mostrar: true,
            titulo: "Error.",
            texto: response.res,
            icono: "error",
          });
        } else {
          setMensaje({
            mostrar: true,
            titulo: "Exito.",
            texto: response.res,
            icono: "exito",
          });
        }
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
    });
  };

  const check = (e) => {
    var textV = "which" in e ? e.which : e.keyCode,
      char = String.fromCharCode(textV),
      regex = /[a-z]/gi;
    if (!regex.test(char)) e.preventDefault();
    return false;
  };
  const seleccionarCliente = (nombre, apellido, cedula) => {
    console.log(nombre, apellido, cedula);
    txtCedula.current.value = cedula;
    txtDescripcion.current.value = apellido;
    txtNombre.current.value = nombre;
    setMostrar(false);
  };

  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
    props.render();
    props.onHideCancela();
  };

  function soloLetras(event) {
    if (
      (event.keyCode != 32 && event.keyCode < 65) ||
      (event.keyCode > 90 && event.keyCode < 97) ||
      event.keyCode > 122
    )
      event.returnValue = false;
  }

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

  const selecionarRol = async (id) => {
    let endpoint = op.conexion + "/roles/ConsultarUno?ID=" + id;
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("Nombre", txtDescripcion.current.value)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);

        txtDescripcion.current.value = response.roles_nombre;
        txtComision.current.value = response.roles_comision;
        setValues(response);
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

  const validarInput = (e) => {
    console.log(e.target.name);
    let item = document.getElementById(e.target.name);
    if (
      !e.target.value ||
      (e.target.name === "ced" && e.target.value.length < 8)
    ) {
      console.log("1");
      item.className -= " form-text fw-bold hidden ";
      item.className += " form-text fw-bold visible ";
    } else {
      console.log("2");

      item.className -= " form-text fw-bold visible ";
      item.className += " form-text fw-bold hidden ";
    }
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
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          Registro de hospedaje
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
        {/* <CatalogoClientes
          show={mostrar}
          onHideCancela={() => {
            setMostrar(false);
          }}
          onHideCatalogo={seleccionarCliente}
        /> */}

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

        <div class="col-md-12 row mx-auto">
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
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
                ref={txtCedula}
                disabled={operacion === 3}
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                maxLength={9}
                name="cedcon"
              />
              <button type="button" class="btn btn-success">
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Nombre
              </span>
              <input
                disabled={operacion === 3}
                type="text"
                ref={txtNombre}
                maxLength={25}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                name="placa"
              />
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Apellido
              </span>
              <input
                disabled={operacion === 3}
                type="text"
                ref={txtApellido}
                maxLength={25}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                name="placa"
              />
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Fecha de nacimiento:
              </span>
              <input
                type="date"
                class="form-control"
                ref={txtFechaNacimiento}
                disabled={operacion === 3}
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                maxLength={9}
                name="cedcon"
              />
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Telefono:
              </span>
              <select
                ref={cmbCodigo}
                disabled={operacion === 3}
                class="form-select col-md-4"
                aria-label="Default select example"
              >
                <option value="0412-">0412-</option>
                <option value="0414-">0414-</option>
                <option value="0416-">0416-</option>
                <option value="0424-">0424-</option>
                <option value="0426-">0426-</option>
              </select>
              <input
                type="text"
                ref={txtNumber}
                class="form-control"
                disabled={operacion === 3}
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                maxLength={9}
                name="cedcon"
              />
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Dirección
              </span>
              <input
                disabled={operacion === 3}
                type="text"
                ref={txtDireccion}
                maxLength={100}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                name="placa"
              />
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Placa
              </span>
              <input
                disabled={operacion === 3}
                type="text"
                ref={txtPlaca}
                maxLength={15}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                name="placa"
              />
              <button type="button" class="btn btn-success">
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Modelo
              </span>
              <input
                disabled={operacion === 3}
                type="text"
                maxLength={50}
                ref={txtModelo}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                name="placa"
              />
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Color
              </span>
              <input
                disabled={operacion === 3}
                type="text"
                ref={txtColor}
                maxLength={25}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                name="placa"
              />
            </div>
          </div>
          <div class="col-md-4 my-auto">
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                N° de habitación
              </span>
              <select
                ref={cmbHabitacion}
                disabled={operacion === 3}
                class="form-select col-md-7"
                aria-label="Default select example"
              >
                <option value="1">Habitación N° 1</option>
                <option value="2">Habitación N° 2</option>
                <option value="3">Habitación N° 3</option>
                <option value="4">Habitación N° 4</option>
                <option value="5">Habitación N° 5</option>
                <option value="6">Habitación N° 6</option>
                <option value="7">Habitación N° 7</option>
                <option value="8">Habitación N° 8</option>
                <option value="9">Habitación N° 9</option>
                <option value="10">Habitación N° 10</option>
              </select>
            </div>
          </div>
          <div class="col-md-6 my-auto">
            <div class="input-group input-group-sm mb-2">
              <span class="input-group-text" id="inputGroup-sizing-sm">
                Foto del cliente
              </span>
              <input
                disabled={operacion === 3}
                type="file"
                maxLength={10}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                name="placa"
              />
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
