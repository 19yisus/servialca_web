import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
/* import { Mensaje, MensajeSiNo } from "../mensajes"; */
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
} from "../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../mensajes";

const md5 = require("md5");

export const GestionarPreguntas = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  const id_user = JSON.parse(localStorage.getItem("user_id"));
  const username = JSON.parse(localStorage.getItem("username"));
  let token = localStorage.getItem("jwtToken");
  const id = useRef();
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

  const consultarPreguntas = async () => {
    let endpoint = op.conexion + "/Auth/ConsultarPreguntas";
    setActivate(true);
    let bodyF = new FormData();
    bodyF.append("Usuario", username);
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        txtP1.current.value = response[0].des_pregunta;
        txtP2.current.value = response[0].des_pregunta2;
        txtR1.current.value = response[0].des_respuesta;
        txtR2.current.value = response[0].des_respuesta2;
      });
  };

  const insertPreguntas = async () => {
    let endpoint = `${op.conexion}/Auth/savePreguntas`;
    setActivate(true);
    let bodyF = new FormData();
    bodyF.append("ID", id_user);
    bodyF.append("des_pregunta", txtP1.current.value);
    bodyF.append("des_pregunta2", txtP2.current.value);
    bodyF.append("des_respuesta", txtR1.current.value);
    bodyF.append("des_respuesta2", txtR2.current.value);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: bodyF,
      });

      const data = await response.json();

      setActivate(false);

      if (data.code === 200) {
        setMensaje({
          mostrar: true,
          titulo: "Exito.",
          texto: data.res,
          icono: "exito",
        });
      } else if (data.code === 400) {
        setMensaje({
          mostrar: true,
          titulo: "Error.",
          texto: data.res,
          icono: "error",
        });
      }
    } catch (error) {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: error.message,
        icono: "informacion",
      });
    }
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
      insertPreguntas();
    }
  };

  const datisPersona = async () => {
    let endpoint = op.conexion + "/Auth/get_preguntas_from_user";
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);
    let username = JSON.parse(localStorage.getItem("username"));
    console.log(username);

    let bodyF = new FormData();

    bodyF.append("Usuario", username.toUpperCase().toString());

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.res);

        setActivate(false);
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
        setOperacion(props.llamado);
        if (operacion === 1) {
          consultarPreguntas();
        }
      }}
    >
      <Modal.Header style={{ backgroundColor: "#019cd5" }}>
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1
            ? "Registrar Preguntas de Seguridad"
            : "Editar Preguntas de Seguridad"}
        </Modal.Title>
        {operacion !== 1 ? (
          <button
            ref={btnCancela}
            className="btn"
            style={{ border: 0, margin: 0, padding: 0, color: "#ffffff" }}
            onClick={salir}
          >
            <i className="far fa-window-close"></i>
          </button>
        ) : (
          ""
        )}
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
        <div className="col-md-12 row mx-auto">
          <h3 className="text-center">Bienvenido {username} </h3>
          <input type="hidden" ref={id} />
          <div class="mb-2 col-md-6">
            <label for="exampleInputEmail1" class="form-label">
              Pregunta N°1
            </label>
            <input
              type="text"
              ref={txtP1}
              class="form-control form-control-sm"
            />
          </div>

          <div class="mb-2 col-md-6">
            <label for="exampleInputEmail1" class="form-label">
              Respuesta N°1
            </label>
            <input
              type="text"
              ref={txtR1}
              class="form-control form-control-sm"
            />
          </div>
          <div class="mb-2 col-md-6">
            <label for="exampleInputEmail1" class="form-label">
              Pregunta N°2
            </label>
            <input
              type="text"
              ref={txtP2}
              class="form-control form-control-sm"
            />
          </div>

          <div class="mb-2 col-md-6">
            <label for="exampleInputEmail1" class="form-label">
              Respuesta N°2
            </label>
            <input
              type="text"
              ref={txtR2}
              class="form-control form-control-sm"
            />
          </div>

          {operacion === 1 ? (
            <span className="text-danger">
              Debe ingresas sus preguntas de seguridad para ser registradas en
              caso de desear una recuperacion de clave de usuario en caso de
              olvido o bloqueo{" "}
            </span>
          ) : (
            ""
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          className="btn btn-sm mx-auto btn-success rounded-pill col-md-2"
          onClick={onChangevalidar}
        >
          <i className="fas fa-window-close"> Aceptar</i>
        </button>
      </Modal.Footer>
    </Modal>
  );
};
