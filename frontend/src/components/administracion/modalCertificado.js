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

export const ModalCertificadoMedico = (props) => {
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

  const txtDatosPastor = useRef();
  const txtReferencia = useRef()
  const txtBs = useRef();
  const txtDolar = useRef();

  const txtFechaNaci = useRef();
  const txtApellido = useRef();



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
    let endpoint = op.conexion + "/poliza/registrarCertificado";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    bodyF.append("Nombre", cmbNacionalidad.current.value+txtNombre.current.value)
    bodyF.append("Apellido", txtApellido.current.value)
    bodyF.append("Cedula", txtCedula.current.value)
    bodyF.append("fechaNacimiento", txtFechaNaci.current.value)
    bodyF.append("Edad", txtEdad.current.value)
    bodyF.append("tipoSangre", txtTipoSangre.current.value)
    bodyF.append("Lente", cmbLentes.current.value)
    bodyF.append("metodoPago", cmbPago.current.value)
    bodyF.append("Referencia", txtReferencia.current.value)
    bodyF.append("cantidadDolar", txtDolar.current.value)
    bodyF.append("Telefono", null)
    bodyF.append("Direccion", null)



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
    txtApellido.current.value = apellido;
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
          setValues(props.persona);
          console.log(props.persona);
        }
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          Registrar Certificado Medico
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

        <div className="col-md-12 row mx-auto">
          <div class="input-group input-group-sm mb-3 col-md-4">
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
          <div class=" col-md-7"></div>
          <div class="input-group input-group-sm mb-3 col-md-6">
            <span class="input-group-text" id="inputGroup-sizing-sm">Nombres:</span>
            <input type="text" class="form-control" onChange={soloLetras} ref={txtNombre} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-6">
            <span class="input-group-text" id="inputGroup-sizing-sm">Apellidos:</span>
            <input type="text" class="form-control" ref={txtApellido} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Fecha de Nacimiento:</span>
            <input type="date" class="form-control" ref={txtFechaNaci} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-2">
            <span class="input-group-text" id="inputGroup-sizing-sm">Edad:</span>
            <input type="text" class="form-control text-right" maxLength={2} ref={txtEdad} onChange={handleInputNumChange} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Tipo de Sangre:</span>
            <input type="text" class="form-control" ref={txtTipoSangre} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Usa lentes:</span>
            <select class="form-select" ref={cmbLentes} aria-label="Default select example">

              <option value="1">Si</option>
              <option value="0">No</option>

            </select>
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Forma de Pago:</span>
            <select class="form-select" ref={cmbPago} aria-label="Default select example">

              <option value="0">Pago Movil</option>
              <option value="1">Efectivo</option>
              <option value="2">Transferencia</option>
              <option value="3">Punto</option>


            </select>
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Referencia:</span>
            <input type="text" class="form-control" ref={txtReferencia} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-5">
            <span class="input-group-text" id="inputGroup-sizing-sm">Cantidad:</span>
            <input type="text" class="form-control text-right" ref={txtBs} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="Bolivares" onChange={handleInputMontoChange} />
            <input type="text" class="form-control text-right" ref={txtDolar} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="Dolares" onChange={handleInputMontoChange} />
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
