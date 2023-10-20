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

export const ModalGastos = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  let ID = useRef();
  let ingresoEgreso = useRef();
  let Motivo = useRef();
  let Tipo = useRef();
  let Monto = useRef();
  let Referencia = useRef();
  let precioDolar = JSON.parse(localStorage.getItem("dolarbcv"));
  let bolivares = useRef();
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
    let bodyF = new FormData();
    if (operacion === 1) {
      endpoint = op.conexion + "/gastosPersonales/Registrar";
    } else if (operacion === 2) {
      endpoint = op.conexion + "/gastosPersonales/Editar";
    } else {
      endpoint = op.conexion + "/sucursal/eliminar";
    }
    bodyF.append("ID", ID.current.value);
    bodyF.append("ingresoEgreso", ingresoEgreso.current.value);
    bodyF.append("Motivo", Motivo.current.value);
    bodyF.append("Tipo", Tipo.current.value);
    bodyF.append("Referencia", Referencia.current.value);
    bodyF.append("Monto", Monto.current.value);
    bodyF.append("precioDolar", precioDolar);
    bodyF.append("token", token);
    console.log(endpoint);
    setActivate(true);

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);

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

  const selecionarSucursal = async (id) => {
    let endpoint = op.conexion + "/gastosPersonales/ConsultarUno";
    console.log(endpoint);
    setActivate(true);
    let bodyF = new FormData();
    bodyF.append("token", token);
    bodyF.append("ID", id);

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        ID.current.value = response[0].nota_id;
        ingresoEgreso.current.value = response[0].nota_IngresoEgreso;
        Motivo.current.value = response[0].nota_motivo;
        Tipo.current.value = response[0].nota_tipoPago;
        Referencia.current.value = response[0].nota_referencia;
        Monto.current.value = response[0].nota_monto;
        bolivares.current.value =
          response[0].dolar_monto * response[0].nota_monto;
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

  return (
    <Modal
      {...props}
      style={{ background: "rgb(28, 27, 23)" }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onShow={() => {
        setOperacion(props.operacion);
        if (props.operacion !== 1) {
          selecionarSucursal(props.idSucursal);
        }
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1
            ? "Registrar Gastos Personales"
            : operacion === 2
            ? "Editar Gastos Personales"
            : "Eliminar Gastos Personales"}
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
          <div className="input-group input-group-sm mb-3 col-md-12">
            <input hidden ref={ID}/>
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Tipo de movimiento:
            </span>
            <select
              onChange={handleChange(25)}
              className="form-select"
              style={{ height: 30 }}
              ref={ingresoEgreso}
              aria-label="Select Tipo de movimiento"
              aria-describedby="inputGroup-sizing-sm"
            >
              <option value="0">Egreso</option>
              <option value="1">Ingreso</option>
            </select>
          </div>
          <div className="input-group input-group-sm mb-3 col-md-12">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Motivo:
            </span>
            <input
              ref={Motivo}
              onKeyDown={handleChange(30)}
              type="text"
              style={{ height: 30 }}
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div className="input-group input-group-sm mb-3 col-md-12">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Metodo de pago:
            </span>
            <select
              onChange={handleChange(25)}
              className="form-select"
              style={{ height: 30 }}
              ref={Tipo}
              aria-label="Select Tipo de movimiento"
              aria-describedby="inputGroup-sizing-sm"
            >
              <option value="0">Pago movil</option>
              <option value="1">Efectivo</option>
              <option value="2">Transferencia</option>
              <option value="3">Punto</option>
            </select>
          </div>
          <div className="input-group input-group-sm mb-3 col-md-12">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Referencia:
            </span>
            <input
              ref={Referencia}
              onKeyDown={handleChange(30)}
              type="text"
              style={{ height: 30 }}
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div className="input-group input-group-sm mb-3 col-md-12">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Cantidad en $:
            </span>
            <input
              ref={Monto}
              onKeyDown={handleChange(30)}
              type="text"
              style={{ height: 30 }}
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div className="input-group input-group-sm mb-3 col-md-12">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Cantidad en Bs:
            </span>
            <input
              ref={bolivares}
              onKeyDown={handleChange(30)}
              type="text"
              style={{ height: 30 }}
              className="form-control"
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
