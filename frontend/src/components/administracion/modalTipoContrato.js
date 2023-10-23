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

export const ModalTipoContrato = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");

  const txtEdad = useRef();
  const txtNombre = useRef();
  const txtTipoSangre = useRef();
  const txtCedula = useRef();
  const cmbLentes = useRef();
  const cmbPago = useRef();
  const cmbNacionalidad = useRef();

  const txtDanoaCosa = useRef();
  const txtDanoPer = useRef();
  const txtFinanzaCuan = useRef();
  const txtAsistenciaLegal = useRef();
  const txtApov = useRef();
  const txtMuerte = useRef();
  const txtInvalidez = useRef();
  const txtGastosMed = useRef();
  const txtGrua = useRef();

  const txtDatosPastor = useRef();
  const txtReferencia = useRef();
  const txtBs = useRef();
  const txtDolar = useRef();

  const txtFechaNaci = useRef();
  const txtDescripcion = useRef();

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

  console.log(values.contrato_id);

  const actualizarCertificado = async () => {
    let endpoint;
    let bodyF = new FormData();

    if (operacion === 1) {
      endpoint = op.conexion + "/tipo_contrato/registrar";
    } else if (operacion === 2) {
      endpoint = op.conexion + "/tipo_contrato/actualizar";
      bodyF.append("ID", values.contrato_id);
    } else {
      endpoint = op.conexion + "/tipo_contrato/eliminar";
      bodyF.append("ID", values.contrato_id);
    }
    bodyF.append("token", token);
    console.log(endpoint);
    setActivate(true);

    bodyF.append("Nombre_contrato", txtDescripcion.current.value);
    bodyF.append(
      "dano_cosas",
      txtDanoaCosa.current.value.replace(/\./g, "").replace(",", ".")
    );
    bodyF.append(
      "dano_personas",
      txtDanoPer.current.value.replace(/\./g, "").replace(",", ".")
    );
    bodyF.append(
      "fianza_cuanti",
      txtFinanzaCuan.current.value.replace(/\./g, "").replace(",", ".")
    );
    bodyF.append(
      "asistencia_legal",
      txtAsistenciaLegal.current.value.replace(/\./g, "").replace(",", ".")
    );
    bodyF.append(
      "apov",
      txtApov.current.value.replace(/\./g, "").replace(",", ".")
    );
    bodyF.append(
      "muerte",
      txtMuerte.current.value.replace(/\./g, "").replace(",", ".")
    );
    bodyF.append(
      "invalidez",
      txtInvalidez.current.value.replace(/\./g, "").replace(",", ".")
    );
    bodyF.append(
      "gasto_metico",
      txtGastosMed.current.value.replace(/\./g, "").replace(",", ".")
    );
    bodyF.append(
      "grua",
      txtGrua.current.value.replace(/\./g, "").replace(",", ".")
    );

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);

        setMensaje({
          mostrar: true,
          titulo: "Exito.",
          texto: "Operacion Exitosa",
          icono: "exito",
        });
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
  const selecionarTipoContrato = async (id) => {
    let endpoint = op.conexion + "/tipo_contrato/ConsultarUno?ID=" + id;
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

        txtDescripcion.current.value = response.contrato_nombre;
        txtDanoaCosa.current.value = formatMoneda(
          response.dañoCosas.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
        txtDanoPer.current.value = formatMoneda(
          response.dañoPersonas.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
        txtFinanzaCuan.current.value = formatMoneda(
          response.fianzaCuanti.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
        txtAsistenciaLegal.current.value = formatMoneda(
          response.asistenciaLegal
            .toString()
            .replace(",", "")
            .replace(".", ","),
          ",",
          ".",
          2
        );
        txtApov.current.value = formatMoneda(
          response.apov.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
        txtMuerte.current.value = formatMoneda(
          response.muerte.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
        txtInvalidez.current.value = formatMoneda(
          response.invalidez.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
        txtGastosMed.current.value = formatMoneda(
          response.gastosMedicos.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
        txtGrua.current.value = formatMoneda(
          response.grua.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
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

        if (props.operacion !== 1) {
          selecionarTipoContrato(props.IdTipoContrato);
        }
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1
            ? "Registrar Tipo de Contrato"
            : operacion === 2
            ? "Editar Tipo de Contrato"
            : "Eliminar Tipo de Contrato"}
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
          onHideCancela={() => {
            setMostrar(false);
          }}
          onHideCatalogo={seleccionarCliente}
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

        <div className="col-md-12 row mx-auto">
          <div class="input-group input-group-sm mb-3 col-md-7">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Nombre Del Contrato:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onKeyDown={handleChange(25)}
              type="text"
              class="form-control"
              ref={txtDescripcion}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div className="col-md-5"></div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Daño A Cosa:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtDanoaCosa}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Daño Personas:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtDanoPer}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Fianza Cuantitativa:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtFinanzaCuan}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Asistencia Legal:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtAsistenciaLegal}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Apov:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtApov}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Muerte:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtMuerte}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Invalidez:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtInvalidez}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Gastos Medicos:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtGastosMed}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Grua Y Estacionamiento:
            </span>
            <input
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              type="text"
              class="form-control text-right"
              onChange={handleInputMontoChange}
              ref={txtGrua}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-sm btn-success rounded-pill "
          disabled={props.operacion === 4 ? true : false}
          onClick={onChangeValidar}
        >
          <i className="fas fa-check-circle"> Aceptar</i>
        </button>
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
