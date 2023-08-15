import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
/* import { Mensaje, MensajeSiNo } from "../mensajes"; */
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
} from "../../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../../mensajes";

const md5 = require("md5");

export const GestionarPreguntas = (props) => {
  /*  variables de estados */

  let op = require("../../../modulos/datos");

  const login = JSON.parse(localStorage.getItem("login"));
  const idusuario = JSON.parse(localStorage.getItem("idusuario"));
  /*   const nodemailer = require("nodemailer");               */
  let token = localStorage.getItem("jwtToken");

  const txtP1 = useRef();
  const txtP2 = useRef();
  const txtR1 = useRef();
  const txtR2 = useRef();

  const [activate, setActivate] = useState(false);

  const [boton, setBoton] = useState(true);

  const btnCancela = useRef();
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  const [operacion, setOperacion] = useState(1);

  /*********************************************** FUNCINES DE VALIDACION***********************************************************/

  const salir = () => {
    blanquear();
    props.onHideCancela();
  };

  const updatePreguntas = () => {
    let endpoint = `${op.conexion}/api/usuario/updateprenguntas`;
    setActivate(true);
    let body = {
      id: idusuario,
      p1: txtP1.current.value.trim(),
      r1: txtR1.current.value.trim(),
      p2: txtP2.current.value.trim(),
      r2: txtR1.current.value.trim(),
    };

    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(operacion);
          setMensaje({
            mostrar: true,
            titulo: "Exito.",
            texto: "Preguntas Actualizadas",
            icono: "exito",
          });
        }
        setActivate(false);
      })
      .catch(function (error) {
        setActivate(false);
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto:
            error.response.data.message ===
            "llave duplicada viola restricción de unicidad «persona_pkey»"
              ? "ya existe una persona con esa cedula"
              : error.response.data.message,
          icono: "error",
        });
      });
  };
  const insertPreguntas = () => {console.log('hola')
    let endpoint = `${op.conexion}/api/usuario/inserpreguntas`;
    setActivate(true);
    let body = {
      id: idusuario,
      p1: txtP1.current.value.trim(),
      r1: txtR1.current.value.trim(),
      p2: txtP2.current.value.trim(),
      r2: txtR1.current.value.trim(),
    };

    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(operacion);
          setMensaje({
            mostrar: true,
            titulo: "Exito.",
            texto: "Preguntas Actualizadas",
            icono: "exito",
          });
        }
        setActivate(false);
      })
      .catch(function (error) {
        setActivate(false);
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto:
            error.response.data.message ===
            "llave duplicada viola restricción de unicidad «persona_pkey»"
              ? "ya existe una persona con esa cedula"
              : error.response.data.message,
          icono: "error",
        });
      });
  };

  const seleccionarPreguntas = (cedula) => {
    let campos = "*";
    let nomtab = "preguntaseguridad";
    let nomid = "idusuario";

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${cedula}&nomtab=${nomtab}&nomid=${nomid}`;
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          if (response.data !== "") {
           txtP1.current.value = response.data.pregunta1;
           txtP2.current.value = response.data.pregunta2;
           txtR1.current.value = response.data.respuesta1;
           txtR2.current.value = response.data.respuesta2;



          }
        }

        setActivate(false);
      })
      .catch(function (error) {
        setActivate(false);
      });
  };

  const blanquear = () => {};

  const cerrarModal = () => {
    props.onHideCancela();

    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

  const onChangevalidar = () => {
    let sigue = true;

    if (txtP1.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresasr la pregunta 1",
        icono: "informacion",
      });
      txtP1.current.focus();
      sigue = false;
    } else if (txtR1.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresasr la respuesta 1",
        icono: "informacion",
      });
      txtR1.current.focus();
      sigue = false;
    } else if (txtP2.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresasr la pregunta 2",
        icono: "informacion",
      });
      txtP2.current.focus();
      sigue = false;
    } else if (txtR2.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresasr la respuesta 2",
        icono: "informacion",
      });
      txtR2.current.focus();
      sigue = false;
    }

    if (sigue) {
      console.log(props.llamado)
      if (props.llamado === 1) {
        updatePreguntas();
      } else {
        insertPreguntas();
      }
    }
  };

  return (
    <Modal
      {...props}
      style={{ background: "rgb(28, 27, 23)" }}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onShow={() => {
        /* setOperacion(props.operacion) */
        if (props.llamado !== 1) {
          
          setBoton(false);
        } else {
          const idusuario = JSON.parse(localStorage.getItem("idusuario"));
          seleccionarPreguntas(idusuario);

          setBoton(true);
        }
      }}
    >
      <Modal.Header style={{ backgroundColor: "#019cd5" }}>
        <Modal.Title style={{ color: "#fff" }}>
          Preguntas de Seguridad
        </Modal.Title>
        <button
          disabled={props.llamado === 1 ? false : true}
          ref={btnCancela}
          className="btn"
          style={{ border: 0, margin: 0, padding: 0, color: "#ffffff" }}
          onClick={salir}
        >
          <i className="far fa-window-close"></i>
        </button>
      </Modal.Header>
      <Modal.Body style={{ color: "rgb(106, 115, 123)" }}>
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
        <div>
          <h3 className="text-center">Bienvenido {login} </h3>

          <div class="mb-2">
            <label for="exampleInputEmail1" class="form-label">
              Pregunta N°1
            </label>
            <input
              type="text"
              disabled={boton}
              ref={txtP1}
              class="form-control form-control-sm"
            />
          </div>

          <div class="mb-2">
            <label for="exampleInputEmail1" class="form-label">
              Respuesta N°1
            </label>
            <input
              type="text"
              disabled={boton}
              ref={txtR1}
              class="form-control form-control-sm"
            />
            <div class="mb-2">
              <label for="exampleInputEmail1" class="form-label">
                Pregunta N°2
              </label>
              <input
                type="text"
                disabled={boton}
                ref={txtP2}
                class="form-control form-control-sm"
              />
            </div>

            <div class="mb-2">
              <label for="exampleInputEmail1" class="form-label">
                Respuesta N°2
              </label>
              <input
                type="text"
                disabled={boton}
                ref={txtR2}
                class="form-control form-control-sm"
              />
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        {props.llamado === 1 ? (
          <button
            disabled={!boton}
            onClick={() => {
              setBoton(false);
            }}
            className="btn btn-sm mx-auto btn-warning rounded-pill col-md-6"
          >
            <i className="fas fa-window-close"> Modificar</i>
          </button>
        ) : (
          ""
        )}

        <button
          disabled={boton}
          className="btn btn-sm mx-auto btn-success rounded-pill col-md-6"
          onClick={onChangevalidar}
        >
          <i className="fas fa-window-close"> Aceptar</i>
        </button>
      </Modal.Footer>
    </Modal>
  );
};
