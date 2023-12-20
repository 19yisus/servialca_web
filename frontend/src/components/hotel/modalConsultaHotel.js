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

export const ModalConsultaHotel = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");

  const txtCedula = useRef();
  const txtNombre = useRef();
  const txtApellido = useRef();
  const txtPlaca = useRef();
  const txtModelo = useRef();
  const txtColor = useRef();
  const txtFecha = useRef();
  const txtHoraLlegada = useRef();
  const txtHoraSalida = useRef();
  const txtObs = useRef();
  const img = useRef();
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

  const salir = () => {
    props.onHideCancela();
    blanquear();
  };

  const blanquear = () => {
    txtNombre.current.value = "";
  };

  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
    props.onHideCancela();
  };

  const selecionarRegistros = async (id) => {
    let endpoint = op.conexion + "/hotel/ConsultarUno";
    console.log(endpoint);
    setActivate(true);

    let bodyF = new FormData();

    bodyF.append("ID", id);

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);
        txtCedula.current.value = response[0].cliente_cedula;
        txtNombre.current.value = response[0].cliente_nombre;
        txtApellido.current.value = response[0].cliente_apellido;
        txtPlaca.current.value = response[0].vehiculo_placa;
        txtColor.current.value = response[0].color_nombre;
        txtModelo.current.value = response[0].modelo_nombre;
        txtFecha.current.value = response[0].fecha_llegada_hospedaje;
        txtHoraLlegada.current.value = response[0].hora_llegada_hospedaje;
        txtHoraSalida.current.value = response[0].hora_salida_hospedaje;
        txtObs.current.value = response[0].observacion_hospedaje;
        img.current.value = response[0].foto_hospedaje;
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
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onShow={() => {
        setOperacion(props.operacion);

        selecionarRegistros(props.idLicencia);
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>Consultar Datos </Modal.Title>
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
          <legend
            class="float-none w-auto px-3 fw-bold"
            style={{ fontSize: 15 }}
          >
            Datos Del Cliente
          </legend>
          <div class="input-group input-group-sm mb-2">
            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Cédula:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtCedula}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />

            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Nombre:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtNombre}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />

            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Apellido:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtApellido}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />
          </div>
          <div className="col-md-1"></div>
        </fieldset>
        <fieldset class="border rounded-3 p-3 row mx-auto border rounded mb-2">
          <legend
            class="float-none w-auto px-3 fw-bold"
            style={{ fontSize: 15 }}
          >
            Datos Del Vehiculo
          </legend>
          <div class="input-group input-group-sm mb-2">
            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Placa:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtPlaca}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />

            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Modelo:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtModelo}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />

            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Color:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtColor}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />
          </div>
          <div className="col-md-1"></div>
        </fieldset>
        <fieldset class="border rounded-3 p-3 row mx-auto border rounded mb-2">
          <legend
            class="float-none w-auto px-3 fw-bold"
            style={{ fontSize: 15 }}
          >
            Datos Del Hospedaje
          </legend>
          <div class="input-group input-group-sm mb-2">
            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Fecha:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtFecha}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />

            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Hora de llegada:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtHoraLlegada}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />

            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Hora de Salida:
            </span>
            <input
              type="text"
              class="form-control bg-transparent border-0 "
              ref={txtHoraSalida}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />
          </div>
          <div className="col-md-1"></div>
        </fieldset>
        <fieldset class="border rounded-3 p-3 row mx-auto border rounded mb-2">
          <legend
            class="float-none w-auto px-3 fw-bold"
            style={{ fontSize: 15 }}
          >
            Observación
          </legend>
          <div class="input-group input-group-sm mb-2">
            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Observación:
            </span>
            <textarea
              class="form-control bg-transparent border-0 "
              ref={txtObs}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />
            <span
              class="input-group-text bg-transparent border-0"
              id="inputGroup-sizing-sm"
            >
              Evidencia:
            </span>
            <textarea
              class="form-control bg-transparent border-0 "
              ref={img}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />
          </div>
        </fieldset>
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
      </Modal.Body>
      <Dimmer active={activate} inverted>
        <Loader inverted>cargando...</Loader>
      </Dimmer>

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
