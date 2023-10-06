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

export const GestionarClave = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");

  const login = JSON.parse(localStorage.getItem("login"));
  const idusuario = JSON.parse(localStorage.getItem("idusuario"));
  const [mostrarBoton, setMostrarBoton] = useState();
  /*   const nodemailer = require("nodemailer");               */
  let token = localStorage.getItem("jwtToken");

  const txtP1 = useRef();
  const txtP2 = useRef();
  const txtR1 = useRef();
  const txtR2 = useRef();
  const txtCodVeri = useRef();
  const btnEnviar = useRef();

  const [activate, setActivate] = useState(false);
  const [validarClave, setValidarClave] = useState(0);
  const [correo, setCorreo] = useState();
  const [boton, setBoton] = useState(true);
  const [values, setValues] = useState({
    idusuario: "",
    pregunta1: "Pregunta",
    respuesta1: "",
    pregunta2: "Pregunta",
    respuesta2: "",
  });

  const [preguntas, setPreguntas] = useState(true);
  const [recuperar, setRecuperar] = useState(3);
  const [codigoVerifi, setCodigoVerifi] = useState();
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

  const updatepass = () => {
    let endpoint = `${op.conexion}/api/usuario/updateclave`;
    setActivate(true);
    let body = {
      pass: md5(txtR1.current.value.trim()),
      id: values.idusuario,
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
            texto: "Clave Actualizadas",
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
            setValues(response.data);
            console.log(response.data)
          } else {
            setMensaje({
              mostrar: true,
              titulo: "Notificación",
              texto: "Este Usuario No posee preguntas de seguridad",
              icono: "informacion",
            });
          }
        }

        setActivate(false);
      })
      .catch(function (error) {
        setActivate(false);
      });
  };

  const datisPersona  = async (login) => {
    let endpoint = op.conexion + "/Auth/get_preguntas_from_user";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    console.log(login)
    let bodyF = new FormData()

    bodyF.append("Usuario", login.toUpperCase())


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {
        console.log(response.lista_preguntas)

setRecuperar('0')
        setActivate(false)
        setValues(response.lista_preguntas)




       
      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };





  const validarPastor = (event) => {
    event.preventDefault();

    if (event.which === 13 || typeof event.which === "undefined") {
      if (event.target.value !== "") {
        datisPersona(event.target.value);
      } else {
        setPreguntas(false);
      }
    }
  };

  const blanquear = () => {
    setValidarClave(0);
    setCorreo("");
    setMostrarBoton("visible");
    setRecuperar(3);
    setValues({
      idusuario: "",
      pregunta1: "Pregunta",
      respuesta1: "",
      pregunta2: "Pregunta",
      respuesta2: "",
    });
    setPreguntas();
  };

  const cerrarModal = () => {
    blanquear();
    props.onHideCancela();
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

  const onChangevalidar = () => {
    let sigue = true;
    setValidarClave(0);
   
    if(recuperar === '1'){
      if (txtP1.current.value === "") {
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: "Debe Ingresasr la respuesta de la primera pregunta",
          icono: "informacion",
        });
        txtP1.current.focus();
        sigue = false;
      } else if (txtP2.current.value === "") {
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: "Debe Ingresasr la respuesta de la segunda pregunta",
  
          icono: "informacion",
        });
        txtP2.current.focus();
        sigue = false;
      }
  
      if (sigue) {
        setActivate(true);
  
        if (
          txtP1.current.value.trim() === values.respuesta1.trim() &&
          txtP1.current.value.trim() === values.respuesta1.trim()
        ) {
          setValidarClave(1);
        } else if (txtP1.current.value === "" || txtP2.current.value === "") {
          setValidarClave(0);
        } else {
          setValidarClave(0);
          setMensaje({
            mostrar: true,
            titulo: "Notificación",
            texto: "Las respuestas ingresadas son incorectas",
            icono: "error",
          });
        }
        setActivate(false);
      }
  
      if (validarClave === 1) {
        let sigue2 = true;
        if (txtR1.current.value === "") {
          setMensaje({
            mostrar: true,
            titulo: "Notificación",
            texto: "Debe Ingresasr la nueva contraseña",
            icono: "informacion",
          });
          txtR1.current.focus();
          sigue2 = false;
        }
  
        if (sigue2) {
          updatepass();
        }
      }
    } else if(recuperar === '2') {
      

      if (mostrarBoton === 'visible') {
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: "Debe hacer click en el boton de enviar código",
          icono: "informacion",
        });
        btnEnviar.current.focus();
        sigue = false;
      }else if (txtCodVeri.current.value === "") {
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: "Debe Ingresar el código de verificación enviado a su correo "+ correo.correo,
          icono: "informacion",
        });
        txtCodVeri.current.focus();
        sigue = false;
      } else if (txtCodVeri.current.value.trim() !== codigoVerifi) {
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: "El código ingresado no coincide con el código enviado a su correo",
          icono: "informacion",
        });
        txtCodVeri.current.focus();
        sigue = false;

      } else if(txtR1.current.value === ''){
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: "Debe ingresar una contraseña nueva",
          icono: "informacion",
        });
        txtR1.current.focus();
        sigue = false;
      }
      if (txtCodVeri.current.value.trim() === codigoVerifi) {
        setValidarClave(1)
       }

      if(sigue){
        updatepass();
      }

    } else {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Seleccionar un metodo de recuperarción",
        icono: "informacion",
      });
    }
  };

  const validar = (e) => {
    console.log(e.target.value);
    setRecuperar(e.target.value);
    if(e.target.value === '2'){
      setMostrarBoton('visible')
    }

  };

  const enviarCorreo = () => {
    setMostrarBoton("collapse");
  

    var pass = "";
    var str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 8; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    setCodigoVerifi(pass);

    let body = {
      receptor: correo.correo,
      asunto: "Código de Recuperacion",
      mensaje:
        "EStimado " +
        correo.login.trim() +
        " Su código de verificación es:  " +
        pass,
    };

    let endpoint = `${op.conexion}/api/comun/enviarcorreo`;
    console.log(endpoint);

    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
        
        }
      })
      .catch(function (error) {
        setMostrarBoton('visible')
        setMensaje({
          mostrar: true,
          titulo: "Error de Conexion",
          texto: 'No se pudo mandar el código de verificación',
          icono: "error",
        });
      });
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
          setPreguntas(false);
        } else {
          const idusuario = JSON.parse(localStorage.getItem("idusuario"));
        //  seleccionarPreguntas(idusuario);
          setBoton(false);
        }
      }}
    >
      <Modal.Header style={{ backgroundColor: "#019cd5" }}>
        <Modal.Title style={{ color: "#fff" }}>Cambiar Clave</Modal.Title>
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
        <div>
         
            <div className="mb-2">
              <label for="exampleInputEmail1" className="form-label">
                Ingrese usuario
              </label>
              <input
                type="text"
                disabled={boton}
                className="form-control form-control-sm"
                onKeyUp={validarPastor}
                onBlur={validarPastor}
              />
            </div>
          
          {values[0] ? (
            <div style={{visibility:recuperar === '1' || recuperar === '2' ? 'collapse' : 'visible'}} className="col-md-12 row mx-auto border rounded p-2 py-2">
              <div className="form-check mx-auto col-md-10 mb-2 px-2">
                <input
                  className="form-check-input my-auto"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  value={2}
                  onChange={validar}
                  checked={recuperar === "2" ? true : false}
                />
                <label
                  className="form-check-label my-auto"
                  for="flexRadioDefault1"
                >
                  Correo
                </label>
              </div>
              <div className="form-check mx-auto col-md-10 px-2">
                <input
                  className="form-check-input my-auto"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  onChange={validar}
                  value={1}
                  checked={recuperar === "1" ? true : false}
                />
                <label
                  className="form-check-label my-auto"
                  for="flexRadioDefault2"
                >
                  Pregunta de Seguridad
                </label>
              </div>
            </div>
          ) : (
            ""
          )}

          {recuperar === "1" ? (
            <div>
              <div className="mb-2">
                <label for="exampleInputEmail1" className="form-label">
                  {values[0].des_pregunta}
                </label>
                <input
                  type="text"
                  disabled={boton}
                  ref={txtP1}
                  className="form-control form-control-sm"
                />
              </div>

              <div className="mb-2">
                <label for="exampleInputEmail1" className="form-label">
                  {values[1].des_pregunta}
                </label>
                <input
                  type="text"
                  disabled={boton}
                  ref={txtP2}
                  className="form-control form-control-sm"
                />
              </div>
            </div>
          ) : (
            ""
          )}

          {recuperar === "2" ? (
            <div className="col-md-12 mx-auto row">
              <button
                style={{ visibility: mostrarBoton }}
                type="button"
               // onClick={enviarCorreo}
                ref={btnEnviar}
                className="btn btn-primary btn-sm rounded-pill my-2 mx-auto col-md-11"
              >
                enviar código de validación
              </button>
          
            </div>
          ) : (
            ""
          )}

          {validarClave === 1 ? (
            <div className="mb-2 px-2">
              <label for="exampleInputEmail1" className="form-label">
                Nueva Clave
              </label>
              <input
              maxLength={10}
                type="text"
                ref={txtR1}
                className="form-control form-control-sm"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
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
