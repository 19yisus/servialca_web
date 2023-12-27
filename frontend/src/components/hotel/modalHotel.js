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
  const dolarbcv = JSON.parse(localStorage.getItem("dolarbcv"));
  const txtPrecioHora = useRef();
  const txtTotalDolar = useRef();
  const txtTotalBs = useRef();
  const txtCantidadHoras = useRef();
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

  const consultarHabitacio = async () => {
    let endpoint;
    setActivate(true);
    let bodyF = new FormData();
    endpoint = op.conexion + "/hotel/ConsultarHabitaciones";
    bodyF.append("Token", token);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: bodyF,
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();

      // Obtén la lista de habitaciones reservadas
      const habitacionesReservadas = data.map(
        (reserva) => reserva.num_habicacion_hospedaje
      );

      // Obtén todas las opciones del select
      const opcionesSelect = Array.from(cmbHabitacion.current.options);

      // Filtra las opciones del select para excluir las habitaciones reservadas
      const opcionesFiltradas = opcionesSelect.filter((opcion) => {
        const numHabitacion = parseInt(opcion.value, 10);
        return !habitacionesReservadas.includes(numHabitacion);
      });

      // Establece las opciones filtradas en el select
      cmbHabitacion.current.options.length = 0;
      opcionesFiltradas.forEach((opcion) => {
        cmbHabitacion.current.add(opcion);
      });

      setActivate(false);
    } catch (error) {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: error.message,
        icono: "informacion",
      });

      setActivate(false);
    }
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
      bodyF.append("Nombre", txtNombre.current.value);
      bodyF.append("Apellido", txtApellido.current.value);
      bodyF.append("Placa", txtPlaca.current.value);
      bodyF.append("Modelo", txtModelo.current.value);
      bodyF.append("Color", txtColor.current.value);
      bodyF.append("horaSalida", txtCantidadHoras.current.value);
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
  const consultarVehiculo = async ($placa) => {
    if ($placa == null || $placa == "") {
      setMensaje({
        mostrar: true,
        titulo: "Error.",
        texto: "Vehiculo no encontrado",
        icono: "error",
      });
    } else {
      let endpoint = op.conexion + "/vehiculo/ConsultarUno?Placa=" + $placa;
      let bodyF = new FormData();
      setActivate(true);
      await fetch(endpoint, {
        method: "POST",
        body: bodyF,
      })
        .then((res) => res.json())
        .then((response) => {
          setActivate(false);
          if (response == "" || response == null || response == []) {
            setMensaje({
              mostrar: true,
              titulo: "Error.",
              texto: "Vehiculo no encontrado",
              icono: "error",
            });
          } else {
            txtColor.current.value = response.color_nombre;
            txtModelo.current.value = response.modelo_nombre;
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
    }
  };
  const consultarCliente = async ($cedula) => {
    let endpoint = op.conexion + "/cliente/consultarCedulaCliente";
    let bodyF = new FormData();
    bodyF.append("cedula", $cedula);
    setActivate(true);
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        if (response.code == 400) {
          setMensaje({
            mostrar: true,
            titulo: "Error.",
            texto: response.res,
            icono: "error",
          });
        } else {
          txtNombre.current.value = response.cliente.cliente_nombre;
          txtApellido.current.value = response.cliente.cliente_apellido;
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
  const monto = () => {
    txtTotalDolar.current.value = (
      txtCantidadHoras.current.value * txtPrecioHora.current.value
    ).toFixed();

    txtTotalBs.current.value = (
      txtTotalDolar.current.value * dolarbcv
    ).toFixed();
  };

  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
    props.onHideCancela();
    props.render();
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
        <fieldset class="border rounded-3 p-3 row mx-auto">
          <div class="col-md-12 row mx-auto">
            <fieldset class="border rounded-3 p-3 row mx-auto">
              <legend
                class="float-none w-auto px-3 fw-bold"
                style={{ fontSize: 15 }}
              >
                Datos del Cliente
              </legend>
              <div class="col-md-4 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Cédula
                  </span>
                  <select
                    disabled={operacion === 3}
                    class="form-select col-md-4"
                    ref={cmbNacionalidad}
                    aria-label="Default select example"
                  >
                    <option value="V-">V-</option>
                    <option value="E-">E-</option>
                    <option value="J-">J-</option>
                    <option value="G-">G-</option>
                  </select>
                  <input
                    onChange={consultarHabitacio}
                    type="text"
                    ref={txtCedula}
                    maxLength={15}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() =>
                      consultarCliente(
                        cmbNacionalidad.current.value + txtCedula.current.value
                      )
                    }
                  >
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
                    
                    type="text"
                    ref={txtNombre}
                    maxLength={25}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>
              <div class="col-md-4 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Apellido
                  </span>
                  <input
                    type="text"
                    ref={txtApellido}
                    maxLength={25}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>
            </fieldset>
            <fieldset class="border rounded-3 p-3 row mx-auto">
              <legend
                class="float-none w-auto px-3 fw-bold"
                style={{ fontSize: 15 }}
              >
                Datos del vehiculo
              </legend>
              <div class="col-md-4 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Placa
                  </span>
                  <input
                    type="text"
                    ref={txtPlaca}
                    maxLength={15}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => consultarVehiculo(txtPlaca.current.value)}
                  >
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
                    type="text"
                    maxLength={50}
                    ref={txtModelo}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>
              <div class="col-md-4 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Color
                  </span>
                  <input
                    type="text"
                    ref={txtColor}
                    maxLength={25}
                    class="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>
            </fieldset>
            <fieldset class="border rounded-3 p-3 row mx-auto">
              <legend
                class="float-none w-auto px-3 fw-bold"
                style={{ fontSize: 15 }}
              >
                Monto
              </legend>
              <div class="col-md-4 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Cantidad de horas:
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    ref={txtCantidadHoras}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    maxLength={9}
                    onChange={monto}
                  />
                </div>
              </div>
              <div class="col-md-4 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Precio por hora $:
                  </span>
                  <input
                    value={1.6}
                    type="text"
                    class="form-control"
                    ref={txtPrecioHora}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    maxLength={9}
                    onChange={monto}
                  />
                </div>
              </div>

              <div class="col-md-2 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Total $:
                  </span>
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    ref={txtTotalDolar}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    maxLength={9}
                  />
                </div>
              </div>

              <div class="col-md-2 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Total BS:
                  </span>
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    ref={txtTotalBs}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    maxLength={9}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset class="border rounded-3 p-3 row mx-auto">
              <legend
                class="float-none w-auto px-3 fw-bold"
                style={{ fontSize: 15 }}
              >
                Extra
              </legend>
              <div class="col-md-4 my-auto">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    N° de habitación
                  </span>
                  <select
                    ref={cmbHabitacion}
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
            </fieldset>
          </div>
        </fieldset>
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
