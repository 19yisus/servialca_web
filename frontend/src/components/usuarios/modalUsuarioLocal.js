import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
/* import { Mensaje, MensajeSiNo } from "../mensajes"; */
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
  validaEmail,
} from "../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../mensajes";
import CatalogoPersona from "../../catalogos/catalogosiglesia/catalogoPersonas";
import { reportes } from "../../modulos/datos";
const md5 = require("md5");

export const GestionarUsuarioLocal = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  /*   const nodemailer = require("nodemailer");               */
  let token = localStorage.getItem("jwtToken");
  const fechasistema = JSON.parse(localStorage.getItem('fechasistema'));
  const idusuario = JSON.parse(localStorage.getItem('idusuario'))

  const md5 = require("md5");

  const txtCed = useRef();
  const txtDescrip = useRef();
  const txtLogin = useRef();
  const cmbStatus = useRef();
  const txtCorreo = useRef();

  const [activate, setActivate] = useState(false);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const [body, setBody] = useState();
  const [registro, setRegistro] = useState({
    reg1: "0",
    reg2: "0",
    reg3: "0",
  });

  const [reportes, setReportes] = useState({
    pdf1: "0",
    pdf2: "0",
  });

  const [operar, setOPerar] = useState({
    crey1: "0",
    crey2: "0",
    crey3: "0",
    crey4: "0",
    user1: "0",
    user2: "0",
    user3: "0",
    user4: "0",
    bank1: "0",
    bank2: "0",
    bank3: "0",
    bank4: "0",
    cuent1: "0",
    cuent2: "0",
    cuent3: "0",
    cuent4: "0",
  });
  const [movimientos, setMovimientos] = useState({
    mov1: "0",
    mov2: "0",
    mov3: "0",
  });

  const [finanzas, setFinanzas] = useState({
    fin1: "0",
    fin2: "0",
    fin3: "0",
    fin4: "0",
    fin5: "0",
  });
  const nombreagente = JSON.parse(localStorage.getItem("nombreagente"));
  const [values, setValues] = useState({
    idusuario: "",
    login: "",
    password: "",
    estatus: "",
    codlocal: "",
    codzonal: "",
    codnacional: "",
    tipopermiso: "",
    accreglocal: "",
    accmovilocal: "",
    accfinalocal: "",
    accpdflocal: "",
  });

  const btnCancela = useRef();
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  const btnAcepta = useRef();

  const [operacion, setOperacion] = useState(1);

  /*********************************************** FUNCINES DE VALIDACION***********************************************************/

  const salir = () => {
    blanquear();
    props.onHideCancela();
  };

  /* var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jesuscalles2001@gmail.com',
    pass: 'vzoizqvbbdwqqodp'
  }
}); */

  /* var mailOptions = {
  from: 'jesuscalles2001@gmail.com',
  to: 'galletafria2@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
}; */

  /* const sendEmail = () => {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
} */

  const actualizar_bitacora = (id) => {
    let endpoint = `${op.conexion}/api/comun/bitacora`;
    let des =
      operacion === 1
        ? "REGISTRO"
        : operacion === 2
          ? "MODIFICACIÓN"
          : "ELIMINACION";
    let body = {
      descrip: des,
      idreg: id,
      tab: "usuarios",
      idigle: codigo,
      iduser: idusuario,
      fech: fechasistema,
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

  const seleccionarPermisos = () => {
    let campos =
      " accreglocal, accmovilocal, accfinalocal, accpdflocal, opercreyente, operusuariolocal,operbancos, opercuentas,operusuariolocal";
    let nomtab = "usuarios";
    let nomid = "idusuario";

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${idusuario}&nomtab=${nomtab}&nomid=${nomid}`;

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          if (response.data !== "") {
            console.log(response.data);
            localStorage.setItem(
              "accreglocal",
              JSON.stringify(response.data.accreglocal)
            );
            localStorage.setItem(
              "operusuariolocal",
              JSON.stringify(response.data.operusuariolocal)
            );
            localStorage.setItem(
              "accmovilocal",
              JSON.stringify(response.data.accmovilocal)
            );
            localStorage.setItem(
              "accfinalocal",
              JSON.stringify(response.data.accfinalocal)
            );
            localStorage.setItem(
              "accpdflocal",
              JSON.stringify(response.data.accpdflocal)
            );
            localStorage.setItem(
              "opercreyente",
              JSON.stringify(response.data.opercreyente)
            );
            localStorage.setItem(
              "operusuariolocal",
              JSON.stringify(response.data.operusuariolocal)
            );
            localStorage.setItem(
              "operbancos",
              JSON.stringify(response.data.operbancos)
            );
            localStorage.setItem(
              "opercuentas",
              JSON.stringify(response.data.operbancos)
            );


          }
        }
      })
      .catch(function (error) {
        /* setTitulo("ERROR");
       
        setMostrar(true)
        setActivate(false); */
        console.log(error.response.data.message);
      });
  };

  const procesarUsuario = () => {
    let endpoint = `${op.conexion}/api/usuario/useractualizar`;
    setActivate(true);
    let body = {
      operacion: operacion,
      iduser: operacion === 1 ? 0 : values.idusuario,
      logi: txtLogin.current.value,
      pass: md5(txtCed.current.value.toLowerCase()),
      codloca: codigo,
      codzona: 0,
      tipoper: "LOCAL",
      accregloca: registro.reg1 + registro.reg2 + registro.reg3,
      accmoviloca: movimientos.mov1 + movimientos.mov2 + movimientos.mov3,
      accfinaloca:
        finanzas.fin1 +
        finanzas.fin2 +
        finanzas.fin3 +
        finanzas.fin4 +
        finanzas.fin5,
      accpdfloca: reportes.pdf1 + reportes.pdf2,
      estatu: cmbStatus.current.value,
      corre: txtCorreo.current.value,
      opercreyent: operar.crey1 + operar.crey2 + operar.crey3 + operar.crey4,
      operusuarioloca:
        operar.user1 + operar.user2 + operar.user3 + operar.user4,
      operbanco: operar.bank1 + operar.bank2 + operar.bank3 + operar.bank4,
      opercuenta: operar.cuent1 + operar.cuent2 + operar.cuent3 + operar.cuent4,
      responsabl: txtCed.current.value,
    };

    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data)
          if (operacion === 1) {
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "Datos Registrados Correctamente",
              icono: "exito",
            });
          } else if (operacion === 2) {
            if (values.idusuario === idusuario) {
              seleccionarPermisos()

            }
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "Datos Modificados Correctamente",
              icono: "exito",
            });
          } else if (operacion === 3) {
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "Datos Eliminados Correctamente",
              icono: "exito",
            });
          }

          actualizar_bitacora(response.data.usuario_actualizar)
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

  const onchange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(e.target.name, e.target.value);
  };

  const blanquear = () => {
    setValues({
      idusuario: "",
      login: "",
      password: "",
      estatus: "",
      codlocal: "",
      codzonal: "",
      codnacional: "",
      tipopermiso: "",
      accreglocal: "",
      accmovilocal: "",
      accfinalocal: "",
      accpdflocal: "",
    });
  };

  const cerrarModal = () => {
    props.onHideCancela();
    blanquear();
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };



  const onChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const datisPersona = (cedula) => {
    let campos = "ced,nombre,apellido";

    let nomtab = "persona";
    let nomid = "ced";
    let condic = "cod_iglesia =" + codigo;

    let endpoint = `${op.conexion}/api/consulta/modelicondi?campos=${campos}&id=${cedula}&nomtab=${nomtab}&nomid=${nomid}&condic=${condic}`;
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.length > 0) {

            txtCed.current.value = response.data[0].ced;
            txtDescrip.current.value =
              response.data[0].ced +
              " / " +
              response.data[0].nombre +
              " " +
              response.data[0].apellido;
          } else {
            setMensaje({
              mostrar: true,
              titulo: "Notificación",
              texto: "El Usuario no existe",
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

  const validarPastor = (event) => {
    event.preventDefault();
    validaSoloNumero(event);

    if (event.which === 13 || typeof event.which === "undefined") {
      if (event.target.value !== "") {

        datisPersona(event.target.value);
      } else {
        txtCed.current.value = ''
        txtDescrip.current.value = ''
      }
    }
  };

  const onChangevalidar = () => {
    let sigue = true;

    if (txtLogin.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresasr el login",
        icono: "informacion",
      });
      txtLogin.current.focus();
      sigue = false;
    } else if (cmbStatus.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Seleccionar el Estatus",
        icono: "informacion",
      });
      cmbStatus.current.focus();
      sigue = false;
    } else if (cmbStatus.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresar el Correo",
        icono: "informacion",
      });
      cmbStatus.current.focus();
      sigue = false;
    } else if (txtCorreo.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresar el Correo",
        icono: "informacion",
      });
      txtCorreo.current.focus();
      sigue = false;
    } else if (!validaEmail(txtCorreo.current.value)) {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresar un Correo valido",
        icono: "informacion",
      });
      txtCorreo.current.focus();
      sigue = false;
    } else if (txtCed.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Ingresar el Responsable",
        icono: "informacion",
      });
      txtCed.current.focus();
      sigue = false;
    } else if (txtDescrip.current.value === '') {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe seleccionar un responsable registrado",
        icono: "informacion",
      });
      txtCed.current.focus();
      sigue = false;
    }

    if (sigue) {
      procesarUsuario();
    }
  };

  const checked = (e) => {
    if (e.target.id === "registro") {
      setRegistro({ ...registro, [e.target.name]: e.target.value });
    } else if (e.target.id === "movi") {
      setMovimientos({ ...movimientos, [e.target.name]: e.target.value });
    } else if (e.target.id === "finanza") {
      setFinanzas({ ...finanzas, [e.target.name]: e.target.value });
    } else if (e.target.id === "reporte") {
      setReportes({ ...reportes, [e.target.name]: e.target.value });
    }
  };
  const operaciones = (e) => {
    if (operar[e.target.name] === "1") {
      setOPerar({ ...operar, [e.target.name]: "0" });
    } else {
      setOPerar({ ...operar, [e.target.name]: "1" });
    }
  };

  const datisPersona2 = (id) => {
    setMostrarCatalogo(false);
    datisPersona(id);
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
          datisPersona(
            props.usuario.responsable ? props.usuario.responsable : ""
          );
          console.log(props.usuario.accreglocal);
          setValues(props.usuario);

          setRegistro({
            reg1: props.usuario
              ? props.usuario.accreglocal
                ? props.usuario.accreglocal.substring(0, 1)
                : "0"
              : "0",
            reg2: props.usuario
              ? props.usuario.accreglocal
                ? props.usuario.accreglocal.substring(1, 2)
                : "0"
              : "0",
            reg3: props.usuario
              ? props.usuario.accreglocal
                ? props.usuario.accreglocal.substring(2, 3)
                : "0"
              : "0",
          });

          setReportes({
            pdf1: props.usuario
              ? props.usuario.accpdflocal
                ? props.usuario.accpdflocal.substring(0, 1)
                : "0"
              : "0",

            pdf2: props.usuario
              ? props.usuario.accpdflocal
                ? props.usuario.accpdflocal.substring(1, 2)
                : "0"
              : "0",
          });

          setMovimientos({
            mov1: props.usuario
              ? props.usuario.accmovilocal
                ? props.usuario.accmovilocal.substring(0, 1)
                : "0"
              : "0",
            mov2: props.usuario
              ? props.usuario.accmovilocal
                ? props.usuario.accmovilocal.substring(1, 2)
                : "0"
              : "0",
            mov3: props.usuario
              ? props.usuario.accmovilocal
                ? props.usuario.accmovilocal.substring(2, 3)
                : "0"
              : "0",
          });

          setFinanzas({
            fin1: props.usuario
              ? props.usuario.accfinalocal
                ? props.usuario.accfinalocal.substring(0, 1)
                : "0"
              : "0",
            fin2: props.usuario
              ? props.usuario.accfinalocal
                ? props.usuario.accfinalocal.substring(1, 2)
                : "0"
              : "0",
            fin3: props.usuario
              ? props.usuario.accfinalocal
                ? props.usuario.accfinalocal.substring(2, 3)
                : "0"
              : "0",
            fin4: props.usuario
              ? props.usuario.accfinalocal
                ? props.usuario.accfinalocal.substring(3, 4)
                : "0"
              : "0",
            fin5: props.usuario
              ? props.usuario.accfinalocal
                ? props.usuario.accfinalocal.substring(4, 5)
                : "0"
              : "0",
          });

          setOPerar({
            crey1: props.usuario
              ? props.usuario.opercreyente
                ? props.usuario.opercreyente.substring(0, 1)
                : "0"
              : "0",
            crey2: props.usuario
              ? props.usuario.opercreyente
                ? props.usuario.opercreyente.substring(1, 2)
                : "0"
              : "0",
            crey3: props.usuario
              ? props.usuario.opercreyente
                ? props.usuario.opercreyente.substring(2, 3)
                : "0"
              : "0",
            crey4: props.usuario
              ? props.usuario.opercreyente
                ? props.usuario.opercreyente.substring(3, 4)
                : "0"
              : "0",
            user1: props.usuario
              ? props.usuario.operusuariolocal
                ? props.usuario.operusuariolocal.substring(0, 1)
                : "0"
              : "0",
            user2: props.usuario
              ? props.usuario.operusuariolocal
                ? props.usuario.operusuariolocal.substring(1, 2)
                : "0"
              : "0",
            user3: props.usuario
              ? props.usuario.operusuariolocal
                ? props.usuario.operusuariolocal.substring(2, 3)
                : "0"
              : "0",
            user4: props.usuario
              ? props.usuario.operusuariolocal
                ? props.usuario.operusuariolocal.substring(3, 4)
                : "0"
              : "0",
            bank1: props.usuario
              ? props.usuario.operbancos
                ? props.usuario.operbancos.substring(0, 1)
                : "0"
              : "0",
            bank2: props.usuario
              ? props.usuario.operbancos
                ? props.usuario.operbancos.substring(0, 1)
                : "0"
              : "0",
            bank3: props.usuario
              ? props.usuario.operbancos
                ? props.usuario.operbancos.substring(0, 1)
                : "0"
              : "0",
            bank4: props.usuario
              ? props.usuario.operbancos
                ? props.usuario.operbancos.substring(0, 1)
                : "0"
              : "0",
            cuent1: props.usuario
              ? props.usuario.opercuentas
                ? props.usuario.opercuentas.substring(0, 1)
                : "0"
              : "0",
            cuent2: props.usuario
              ? props.usuario.opercuentas
                ? props.usuario.opercuentas.substring(0, 1)
                : "0"
              : "0",
            cuent3: props.usuario
              ? props.usuario.opercuentas
                ? props.usuario.opercuentas.substring(0, 1)
                : "0"
              : "0",
            cuent4: props.usuario
              ? props.usuario.opercuentas
                ? props.usuario.opercuentas.substring(0, 1)
                : "0"
              : "0",
          });
        } else if (props.operacion === 1) {
        }
      }}
    >
      <Modal.Header style={{ backgroundColor: "#019cd5" }}>
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1
            ? "Registrar Usuario."
            : operacion === 2
              ? "Editar Usuario."
              : operacion === 3
                ? "Eliminar Usuario."
                : "Consultar Usuario"}
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
        <Mensaje
          mensaje={mensaje}
          onHide={() =>
            mensaje.titulo === "Exito."
              ? cerrarModal()
              : setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" })
          }
        />
        <CatalogoPersona
          show={mostrarCatalogo}
          onHideCancela={() => {
            setMostrarCatalogo(false);
          }}
          onHideCatalogo={datisPersona2}
        />
        <ul className="nav  mb-3" id="ex-with-icons" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className="nav-link active bg-blue-100"
              id="ex-with-icons-tab-1"
              data-mdb-toggle="tab"
              href="#ex-with-icons-tabs-1"
              role="tab"
              aria-controls="ex-with-icons-tabs-1"
              aria-selected="true"
            >
              Datos
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link"
              id="ex-with-icons-tab-2"
              data-mdb-toggle="tab"
              href="#ex-with-icons-tabs-2"
              role="tab"
              aria-controls="ex-with-icons-tabs-2"
              aria-selected="false"
            >
              Permisos
            </a>
          </li>
        </ul>

        <div className="tab-content" id="ex-with-icons-content">
          <div
            className="tab-pane fade show active"
            id="ex-with-icons-tabs-1"
            role="tabpanel"
            aria-labelledby="ex-with-icons-tab-1"
          >
            <div className="col-md-12 px-0 mx-auto row">
              <div className="input-group input-group-sm mb-2 col-md-4">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Login:
                </span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  defaultValue={values ? values.login : ""}
                  onChange={onChange}
                  maxLength={15}
                  ref={txtLogin}
                  name="login"
                  disabled={operacion === 1 ? false : true}
                />
              </div>

              <div className="col-md-5"></div>

              <div className="input-group input-group-sm mb-2 col-md-3">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Status:
                </span>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  ref={cmbStatus}
                  value={values ? values.estatus : ""}
                  onChange={onChange}
                  name="estatus"
                  disabled={operacion === 2 || operacion === 1 ? false : true}
                >
                  <option value="">---</option>
                  <option value="1">ACTIVO</option>
                  <option value="0">INACTIVO</option>
                </select>
              </div>

              <div className="input-group input-group-sm mb-2 col-md-6">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Correo Electronico:
                </span>
                <input
                  type="text"
                  className="form-control"
                  ref={txtCorreo}
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  defaultValue={values ? values.correo : ""}
                  onChange={onChange}
                  onBlur={(e) => {
                    if (!validaEmail(e.target.value)) {
                      setMensaje({
                        mostrar: true,
                        titulo: "Notificación",
                        texto: "Debe Ingresar un Correo valido",
                        icono: "informacion",
                      });
                    }
                  }}
                  name="correo"
                  disabled={operacion === 2 || operacion === 1 ? false : true}
                />
              </div>
              <div className="col-md-2"></div>

              <div className="input-group input-group-sm mb-2 col-md-4">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Cedula Responsable:
                </span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  disabled={operacion === 1 ? false : true}
                  onKeyUp={validarPastor}
                  onBlur={validarPastor}
                  ref={txtCed}
                />
                <button
                  type="button"
                  onClick={() => {
                    setMostrarCatalogo(true);
                  }}
                  disabled={operacion === 1 ? false : true}
                  class="btn btn-success"
                >
                  <i class="far fa-user"></i>
                </button>
              </div>

              <div className="input-group input-group-sm mb-2 col-md-12">
                <textarea
                  type="textarea"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  style={{ height: 40 }}
                  ref={txtDescrip}
                  disabled
                />
              </div>
            </div>

            <fieldset className="border border-secondary mx-auto rounded">
              <legend
                className="float-none text-dark w-auto fw-bold"
                style={{ fontSize: 15 }}
              >
                Datos de la Congregación
              </legend>
              <div className="input-group input-group-sm mb-2 col-md-12">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Nombre Congregación:
                </span>
                <input
                  type="text"
                  disabled
                  value={nombreagente.trim()}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                />
              </div>
            </fieldset>
          </div>
          <div
            className="tab-pane fade"
            id="ex-with-icons-tabs-2"
            role="tabpanel"
            aria-labelledby="ex-with-icons-tab-2"
          >
            <ul className="nav  mb-3" id="ex1" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  id="ex1-tab-1"
                  data-mdb-toggle="tab"
                  href="#ex1-tabs-1"
                  role="tab"
                  aria-controls="ex1-tabs-1"
                  aria-selected="true"
                >
                  Registros
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="ex1-tab-2"
                  data-mdb-toggle="tab"
                  href="#ex1-tabs-2"
                  role="tab"
                  aria-controls="ex1-tabs-2"
                  aria-selected="false"
                >
                  Movimientos
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="ex1-tab-3"
                  data-mdb-toggle="tab"
                  href="#ex1-tabs-3"
                  role="tab"
                  aria-controls="ex1-tabs-3"
                  aria-selected="false"
                >
                  Finanzas
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="ex1-tab-4"
                  data-mdb-toggle="tab"
                  href="#ex1-tabs-4"
                  role="tab"
                  aria-controls="ex1-tabs-4"
                  aria-selected="false"
                >
                  Reportes
                </a>
              </li>
            </ul>

            <div className="tab-content" id="ex1-content">
              <div
                className="tab-pane fade show active"
                id="ex1-tabs-1"
                role="tabpanel"
                aria-labelledby="ex1-tab-1"
              >
                <div className="col-md-12 mx-auto px-0 row">
                  <div className="col-md-12 border border-secondary rounded row py-2 mx-auto">
                    <div className="col-md-4 row">
                      <label className="col-md-12">Registro de Creyentes</label>

                      <div className="form-check col my-auto ml-2">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="reg1"
                          value="1"
                          id="registro"
                          onChange={checked}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                          checked={registro.reg1 === "1" ? true : false}
                        />
                        <label
                          className="form-check-label my-auto"
                          for="flexRadioDefault1"
                        >
                          Disponible
                        </label>
                      </div>

                      <div className="form-check col my-auto mx-auto">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="reg1"
                          value="0"
                          id="registro"
                          onChange={checked}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                          checked={registro.reg1 === "0" ? true : false}
                        />
                        <label
                          className="form-check-label my-auto"
                          for="flexRadioDefault1"
                        >
                          No Disponible
                        </label>
                      </div>
                    </div>

                    {registro.reg1 === "1" ? (
                      <div className="col-md-8 row mx-auto pl-3 pr-0">
                        <div className="form-check col my-auto">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="creyente"
                            checked={operar.crey1 === "1" ? true : false}
                            onChange={operaciones}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                            name="crey1"
                          />
                          <label className="form-check-label">Consultar</label>
                        </div>

                        <div className="form-check col my-auto">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="creyente"
                            checked={operar.crey2 === "1" ? true : false}
                            onChange={operaciones}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                            name="crey2"
                          />
                          <label className="form-check-label">Modificar</label>
                        </div>

                        <div className="form-check col my-auto">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="creyente"
                            checked={operar.crey3 === "1" ? true : false}
                            onChange={operaciones}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                            name="crey3"
                          />
                          <label className="form-check-label">Eliminar</label>
                        </div>

                        <div className="form-check col my-auto">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="creyente"
                            checked={operar.crey4 === "1" ? true : false}
                            onChange={operaciones}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                            name="crey4"
                          />
                          <label className="form-check-label">Registrar</label>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="ex1-tabs-2"
                role="tabpanel"
                aria-labelledby="ex1-tab-2"
              >
                <div className="col-md-12 mx-auto px-0 row">
                  <div className="col-md-12 mb-2 border border-secondary rounded row py-2 mx-auto">
                    <div className="col-md-4 row">
                      <label className="col-md-12">Registro de Usuarios</label>

                      <div className="form-check col my-auto ml-2">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="mov1"
                          value="1"
                          id="movi"
                          onChange={checked}
                          checked={movimientos.mov1 === "1" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label
                          className="form-check-label my-auto"
                          for="flexRadioDefault1"
                        >
                          Disponible
                        </label>
                      </div>

                      <div className="form-check col my-auto mx-auto">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="mov1"
                          value="0"
                          id="movi"
                          onChange={checked}
                          checked={movimientos.mov1 === "0" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label
                          className="form-check-label my-auto"
                          for="flexRadioDefault1"
                        >
                          No Disponible
                        </label>
                      </div>
                    </div>

                    {movimientos.mov1 === "1" ? (
                      <div className="col-md-8 row mx-auto pl-3 pr-0">
                        <div className="form-check col my-auto">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={operar.user1 === "1" ? true : false}
                            onChange={operaciones}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                            name="user1"
                          />
                          <label className="form-check-label">Consultar</label>
                        </div>

                        <div className="form-check col my-auto">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={operar.user2 === "1" ? true : false}
                            onChange={operaciones}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                            name="user2"
                          />
                          <label className="form-check-label">Modificar</label>
                        </div>

                        <div className="form-check col my-auto">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={operar.user3 === "1" ? true : false}
                            onChange={operaciones}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                            name="user3"
                          />
                          <label className="form-check-label">Eliminar</label>
                        </div>

                        <div className="form-check col my-auto">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={operar.user4 === "1" ? true : false}
                            onChange={operaciones}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                            name="user4"
                          />
                          <label className="form-check-label">Registrar</label>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-md-6 mb-2 px-0">
                    <div className="col-md-12 py-1 border border-secondary rounded row mx-auto">
                      <label className="col-md-12">Bitacora</label>

                      <div className="form-check col my-auto ml-3">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="mov2"
                          value="1"
                          id="movi"
                          onChange={checked}
                          checked={movimientos.mov2 === "1" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          Disponible
                        </label>
                      </div>

                      <div className="form-check col my-auto mx-auto">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="mov2"
                          value="0"
                          id="movi"
                          onChange={checked}
                          checked={movimientos.mov2 === "0" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          No Disponible
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6"></div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="ex1-tabs-3"
                role="tabpanel"
                aria-labelledby="ex1-tab-3"
              >
                <div className="col-md-12 mx-auto px-0 row">
                  <div className="col-md-6 mb-2">
                    <div className="col-md-12 py-1 border border-secondary rounded row mx-auto">
                      <label className="col-md-12">Notas de Debito</label>

                      <div className="form-check col my-auto ml-3">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="fin1"
                          value="1"
                          id="finanza"
                          onChange={checked}
                          checked={finanzas.fin1 === "1" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          Disponible
                        </label>
                      </div>

                      <div className="form-check col my-auto mx-auto">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="fin1"
                          value="0"
                          id="finanza"
                          onChange={checked}
                          checked={finanzas.fin1 === "0" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          No Disponible
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 ">
                    <div className="col-md-12 border border-secondary rounded row py-1 mx-auto">
                      <label className="col-md-12">Notas de Creditos</label>

                      <div className="form-check col my-auto ml-3">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="fin2"
                          value="1"
                          id="finanza"
                          onChange={checked}
                          checked={finanzas.fin2 === "1" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          Disponible
                        </label>
                      </div>

                      <div className="form-check col my-auto mx-auto">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="fin2"
                          value="0"
                          id="finanza"
                          onChange={checked}
                          checked={finanzas.fin2 === "0" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          No Disponible
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2">
                    <div className="col-md-12 py-1 border border-secondary rounded row mx-auto">
                      <label className="col-md-12">Envio de Aportes</label>

                      <div className="form-check col my-auto ml-3">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="fin3"
                          value="1"
                          id="finanza"
                          onChange={checked}
                          checked={finanzas.fin3 === "1" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          Disponible
                        </label>
                      </div>

                      <div className="form-check col my-auto mx-auto">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="fin3"
                          value="0"
                          id="finanza"
                          onChange={checked}
                          checked={finanzas.fin3 === "0" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          No Disponible
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2"></div>
                  <div className="col-md-12 mb-2">
                    <div className="col-md-12 border border-secondary rounded row py-2 mx-auto">
                      <div className="col-md-4 row">
                        <label className="col-md-12">Bancos</label>

                        <div className="form-check col my-auto ml-2">
                          <input
                            className="form-check-input my-auto"
                            type="radio"
                            name="fin4"
                            value="1"
                            id="finanza"
                            onChange={checked}
                            checked={finanzas.fin4 === "1" ? true : false}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                          />
                          <label className="form-check-label my-auto">
                            Disponible
                          </label>
                        </div>

                        <div className="form-check col my-auto mx-auto">
                          <input
                            className="form-check-input my-auto"
                            type="radio"
                            name="fin4"
                            value="0"
                            id="finanza"
                            onChange={checked}
                            checked={finanzas.fin4 === "0" ? true : false}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                          />
                          <label className="form-check-label my-auto">
                            No Disponible
                          </label>
                        </div>
                      </div>

                      {finanzas.fin4 === "1" ? (
                        <div className="col-md-8 row mx-auto pl-3 pr-0">
                          <div className="form-check col my-auto">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              checked={operar.bank1 === "1" ? true : false}
                              disabled={
                                operacion === 2 || operacion === 1
                                  ? false
                                  : true
                              }
                              onChange={operaciones}
                              name="bank1"
                            />
                            <label className="form-check-label">
                              Consultar
                            </label>
                          </div>

                          <div className="form-check col my-auto">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              checked={operar.bank2 === "1" ? true : false}
                              disabled={
                                operacion === 2 || operacion === 1
                                  ? false
                                  : true
                              }
                              onChange={operaciones}
                              name="bank2"
                            />
                            <label className="form-check-label">
                              Modificar
                            </label>
                          </div>

                          <div className="form-check col my-auto">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              checked={operar.bank3 === "1" ? true : false}
                              disabled={
                                operacion === 2 || operacion === 1
                                  ? false
                                  : true
                              }
                              onChange={operaciones}
                              name="bank3"
                            />
                            <label className="form-check-label">Eliminar</label>
                          </div>

                          <div className="form-check col my-auto">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              checked={operar.bank4 === "1" ? true : false}
                              disabled={
                                operacion === 2 || operacion === 1
                                  ? false
                                  : true
                              }
                              onChange={operaciones}
                              name="bank4"
                            />
                            <label className="form-check-label">
                              Registrar
                            </label>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="col-md-12 border border-secondary rounded row py-2 mx-auto">
                      <div className="col-md-4 row">
                        <label className="col-md-12">Cuentas Bancarias</label>

                        <div className="form-check col my-auto ml-2">
                          <input
                            className="form-check-input my-auto"
                            type="radio"
                            name="fin5"
                            value="1"
                            id="finanza"
                            onChange={checked}
                            checked={finanzas.fin5 === "1" ? true : false}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                          />
                          <label className="form-check-label my-auto">
                            Disponible
                          </label>
                        </div>

                        <div className="form-check col my-auto mx-auto">
                          <input
                            className="form-check-input my-auto"
                            type="radio"
                            name="fin5"
                            value="0"
                            id="finanza"
                            onChange={checked}
                            checked={finanzas.fin5 === "0" ? true : false}
                            disabled={
                              operacion === 2 || operacion === 1 ? false : true
                            }
                          />
                          <label className="form-check-label my-auto">
                            No Disponible
                          </label>
                        </div>
                      </div>

                      {finanzas.fin5 === "1" ? (
                        <div className="col-md-8 row mx-auto pl-3 pr-0">
                          <div className="form-check col my-auto">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              checked={operar.cuent1 === "1" ? true : false}
                              disabled={
                                operacion === 2 || operacion === 1
                                  ? false
                                  : true
                              }
                              onChange={operaciones}
                              name="cuent1"
                            />
                            <label className="form-check-label">
                              Consultar
                            </label>
                          </div>

                          <div className="form-check col my-auto">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              checked={operar.cuent2 === "1" ? true : false}
                              disabled={
                                operacion === 2 || operacion === 1
                                  ? false
                                  : true
                              }
                              onChange={operaciones}
                              name="cuent2"
                            />
                            <label className="form-check-label">
                              Modificar
                            </label>
                          </div>

                          <div className="form-check col my-auto">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              checked={operar.cuent3 === "1" ? true : false}
                              disabled={
                                operacion === 2 || operacion === 1
                                  ? false
                                  : true
                              }
                              onChange={operaciones}
                              name="cuent3"
                            />
                            <label className="form-check-label">Eliminar</label>
                          </div>

                          <div className="form-check col my-auto">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              checked={operar.cuent4 === "1" ? true : false}
                              disabled={
                                operacion === 2 || operacion === 1
                                  ? false
                                  : true
                              }
                              onChange={operaciones}
                              name="cuent4"
                            />
                            <label className="form-check-label">
                              Registrar
                            </label>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="ex1-tabs-4"
                role="tabpanel"
                aria-labelledby="ex1-tab-4"
              >
                <div className="col-md-12 mx-auto px-0 row">
                  <div className="col-md-6 mb-2">
                    <div className="col-md-12 py-1 border border-secondary rounded row mx-auto">
                      <label className="col-md-12">Listado de Creyentes</label>

                      <div className="form-check col my-auto ml-3">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="pdf1"
                          value="1"
                          id="reporte"
                          onChange={checked}
                          checked={reportes.pdf1 === "1" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          Disponible
                        </label>
                      </div>

                      <div className="form-check col my-auto mx-auto">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="pdf1"
                          value="0"
                          id="reporte"
                          onChange={checked}
                          checked={reportes.pdf1 === "0" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          No Disponible
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 ">
                    <div className="col-md-12 border border-secondary rounded row py-1 mx-auto">
                      <label className="col-md-12">Historic o de Cuentas</label>

                      <div className="form-check col my-auto ml-3">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="pdf2"
                          value="1"
                          id="reporte"
                          onChange={checked}
                          checked={reportes.pdf2 === "1" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          Disponible
                        </label>
                      </div>

                      <div className="form-check col my-auto mx-auto">
                        <input
                          className="form-check-input my-auto"
                          type="radio"
                          name="pdf2"
                          value="0"
                          id="reporte"
                          onChange={checked}
                          checked={reportes.pdf2 === "0" ? true : false}
                          disabled={
                            operacion === 2 || operacion === 1 ? false : true
                          }
                        />
                        <label className="form-check-label my-auto">
                          No Disponible
                        </label>
                      </div>
                    </div>
                  </div>
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
          onClick={onChangevalidar}
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
