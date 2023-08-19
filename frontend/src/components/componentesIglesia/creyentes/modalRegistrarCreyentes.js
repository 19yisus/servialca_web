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
} from "../../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../../mensajes";

export const GestionarRegistroCreyente = (props) => {
  /*  variables de estados */

  let op = require("../../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  let anioactu = JSON.parse(localStorage.getItem("anioactu"));
  const [codigoIglesia, setCodigoIglesia] = useState(
    JSON.parse(localStorage.getItem("codigo"))
  );
  const txtId = useRef();
  const txtNombre = useRef();
  const txtRif = useRef();
  const txtCedula = useRef();
  const txtDamas = useRef();
  const txtCaballeros = useRef();

  const txtDatosPastor = useRef();
  const cmbCondTemp = useRef();
  const cmbDocTem = useRef();
  const cmbCondCasa = useRef();
  const cmbDocCasa = useRef();
  const txtPostal = useRef();

  const txtCodIgle = useRef();
  const cmbEstadoLocal = useRef();
  const cmbMunicipio = useRef();
  const txtInitObra = useRef();
  const txtFinObra = useRef();
  const txtFajec = useRef();
  const txtMajec = useRef();

  const txtFjuve = useRef();
  const txtMjuve = useRef();
  const txtFjc = useRef();
  const txtMjc = useRef();
  const txtAgua = useRef();
  const txtEspiritu = useRef();
  const txtPromedio = useRef();
  const txtDireccion = useRef();

  const cmbCedula = useRef();
  const cmbSexo = useRef();
  const txtFechaNaci = useRef();
  const txtApellido = useRef();
  const txtTlf = useRef();
  const txtCelular = useRef();
  const cmbEstadoCivil = useRef();
  const txtCorreo = useRef();
  const cmbTipoSangre = useRef();
  const cmbStatus = useRef();
  const cmbBautiAgua = useRef();
  const cmbBautiEspirit = useRef();
  const txtFechaBau = useRef();

  const cmbEstado = useRef();
  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const idusuario = JSON.parse(localStorage.getItem("idusuario"));
  const fechasistema = JSON.parse(localStorage.getItem("fechasistema"));
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
  const [mostrar5, setMostrar5] = useState(false);
  const [titulo, setTitulo] = useState();
  const [msg, setMsg] = useState();
  const [mostrar1, setMostrar1] = useState(false);
  const [titulo2, setTitulo2] = useState();
  const [msg2, setMsg2] = useState();
  const [contar1, setContar1] = useState(0);
  const [activate, setActivate] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [, setDeshabilitado] = useState(true);
  const [operacion, setOperacion] = useState(0);
  const [estado, setEstado] = useState();
  const [municipio, setMunicipio] = useState();
  const [tecla, setTecla] = useState();
  const [cedula, setCedula] = useState();
  const [idUsuario, setIdUsuario] = useState(localStorage.getItem("idusuario"));

  const [pastor, setPastor] = useState({
    ced: "",
    nom: "",
    ape: "",
    cel: "",
    direc: "",
  });
  const styleTabs = {
    borderTop: "1px solid",
    borderColor: "rgba(0, 88, 129, 1)",
    borderLeft: "none",
    borderTopRightRadius: "16px",
  };

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

  const onHideInfo = (ced, nom, ape, cel, direc) => {
    setPastor({
      ced: ced,
      nom: nom,
      ape: ape,
      cel: cel,
      direc: direc,
    });
    direc = direc;
    /*  setMostrar(false) */
    setMostrar1(false);
    txtCedula.current.value = ced;
    txtDatosPastor.current.value =
      "Nombre: " +
      nom.trim() +
      " " +
      ape.trim() +
      ", Celular: " +
      cel.trim() +
      ", Direccion: " +
      direc.trim();
  };

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
      tab: "persona",
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

  const actualizarCreyente = () => {
    let endpoint = `${op.conexion}/api/personas/personaact`;
    let body;
    /*  setActivate(true); */

    

    body = {
      operacion: operacion,
      cedu: values.ced,
      nom: values.nombre,
      ape: values.apellido,
      nac: values.fecha_nac,
      agua: values.bas_agua,
      estatus: values.status,
      espirit: values.bas_espirit,
      iglesia: operacion === 1 ? codigoIglesia : values.cod_iglesia,
      sex: values.sexo,
      fechabaus: values.fecha_baus,

      nacional: values.nacionalidad,
      statuspast: operacion === 1 ? 0 : values.statuspastor,
      celul: values.celular,
      estadocivi: values.estadocivil,
      direc: values.direccion,
      corre: values.correo,
      tiposangr: values.tiposangre.trim(),
      tlf: values.telefono,
    };

    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data.persona_actualizar);
          actualizar_bitacora(response.data.persona_actualizar);

          if (operacion === 1) {
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "Registro Guardado Exitosamente",
              icono: "exito",
            });
          } else if (operacion === 2) {
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "Registro Modificado Exitosamente",
              icono: "exito",
            });
          } else if (operacion === 3) {
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "Registro Elimibado Exitosamente",
              icono: "exito",
            });
          }
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

  const onChangeValidar = () => {
    let sigue = true;
    let minimo = 0;
    let calculo = 0;
    if (txtFechaNaci.current.value) {
      minimo = moment(txtFechaNaci.current.value).format("YYYY");
      calculo = parseInt(anioactu) - parseInt(minimo);
      console.log(calculo);
    }
    if (cmbCedula.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe seleccionar la nacionalidad",
        icono: "informacion",
      });
      cmbCedula.current.focus();
      sigue = false;
    } else if (txtCedula.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Igresar el n° de cedula",
        icono: "informacion",
      });
      txtCedula.current.focus();
      sigue = false;
    } else if (operacion === 1 && txtCedula.current.value.length < 8 || txtCedula.current.value.length > 8) {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe Igresar un n° de cedula valido",
        icono: "informacion",
      });
      txtCedula.current.focus();
      sigue = false;
    } else if (cmbSexo.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe seleccionar el sexo",
        icono: "informacion",
      });
      cmbSexo.current.focus();
      sigue = false;
    } else if (txtFechaNaci.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar la fecha de nacimiento",
        icono: "informacion",
      });
      txtFechaNaci.current.focus();
      sigue = false;
    } else if (parseInt(calculo) < 18) {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "El creyente debe ser mayor de edad",
        icono: "informacion",
      });
      txtFechaNaci.current.focus();
      sigue = false;
    } else if (txtNombre.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar el Nombre",
        icono: "informacion",
      });
      txtNombre.current.focus();
      sigue = false;
    } else if (txtApellido.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar el Apellido",
        icono: "informacion",
      });
      txtApellido.current.focus();
      sigue = false;
    } else if (txtDireccion.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar la Dirección",
        icono: "informacion",
      });
      txtDireccion.current.focus();
      sigue = false;
    } else if (txtTlf.current.value === "") {
        
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar el Telefono",
        icono: "informacion",
      });
      txtTlf.current.focus();
      sigue = false;
    }  else if (!validaNumeroTelefono(txtTlf.current.value)) {
        
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar correctamente el N° de Telefono",
        icono: "informacion",
      });
      txtTlf.current.focus();
      sigue = false;
    }
    else if (txtCelular.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar el Celular",
        icono: "informacion",
      });
      txtCelular.current.focus();
      sigue = false;
    }  else if (!validaNumeroTelefono(txtCelular.current.value)) {
        
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: "Debe ingresar correctamente el N° de Celular",
          icono: "informacion",
        });
        txtCelular.current.focus();
        sigue = false;
      }
      else if (cmbEstadoCivil.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe seleccionar el estado civil",
        icono: "informacion",
      });
      cmbEstadoCivil.current.focus();
      sigue = false;
    } else if (txtCorreo.current.value === "") {
        
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar el correo electronico",
        icono: "informacion",
      });
      txtCorreo.current.focus();
      sigue = false;
    } else if (!validaEmail(txtCorreo.current.value)) {
        
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar correctamente el correo electronico",
        icono: "informacion",
      });
      txtCorreo.current.focus();
      sigue = false;
    } else if (cmbTipoSangre.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar el tipo de sangre",
        icono: "informacion",
      });
      cmbTipoSangre.current.focus();
      sigue = false;
    } else if (txtFechaBau.current.value === "") {
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar la fecha de baustizo",
        icono: "informacion",
      });
      txtFechaBau.current.focus();
      sigue = false;
    }/*  else if( && operacion === 1){
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
        actualizarCreyente();
    }
  };

  const onchange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(e.target.name, e.target.value);
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

  const cerrarModal = () => {
    props.render();
    props.onHideCancela();
    blanquear();
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

  const datisPersona = () => {
    let campos = "ced";

    let nomtab = "persona";
    let nomid = "ced";
    let condic = "cod_iglesia =" + codigo;

    let endpoint = `${op.conexion}/api/consulta/modelicondi?campos=${campos}&id=${txtCedula.current.value}&nomtab=${nomtab}&nomid=${nomid}&condic=${condic}`;
   

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
            console.log(response.data)
            if(response.data){
                setMensaje({
                    mostrar: true,
                    titulo: "Notificación",
                    texto: "Ya existe un usuario con este n° de cedula",
                    icono: "informacion",
                  });
            }else {
                actualizarCreyente();

            }
            
             
        }

       
      })
      .catch(function (error) {
        setActivate(false);
      });
  };

  function soloLetras(e) {
   let  key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    let especiales = [8, 37, 39, 46];

    let tecla_especial = false
    for(var i in especiales) {
        if(key === especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if(letras.indexOf(tecla) == -1 && !tecla_especial)
        return false;
  }

  const check = (e) => {
    var textV = "which" in e ? e.which : e.keyCode,
        char = String.fromCharCode(textV),
        regex = /[a-z]/ig;
        if(!regex.test(char)) e.preventDefault(); return false;
    }
  

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
      <Modal.Header style={{ backgroundColor: "#019cd5" }}>
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1
            ? "Registrar Creyentes."
            : operacion === 2
            ? "Editar Creyentes."
            : operacion === 3
            ? "Eliminar Creyentes."
            : "Consultar Creyentes"}
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
        <div className="col-md-12 row py-3 py-4 d-flex justify-content-between">
          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Cedula:
            </label>
            <select
              ref={cmbCedula}
              value={values && values.nacionalidad}
              disabled={operacion === 1 ? false : true}
             
              name="nacionalidad"
              className="form-select col-md-3"
              aria-label="Default select example"
            
             

              onChange={onchange}
            >
              <option value="V">V</option>
              <option value="E">E</option>
            </select>
            <input
              value={values ? (values.ced !== "" ? values.ced : "") : ""}
              name="ced"
              type="text"
              disabled={operacion === 1 ? false : true}
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtCedula}
              maxLength={8}
            
              
              onKeyUp={onchange}
              onChange={handleInputNumChange}
             
            />
          </div>

          <div className="col-md-2"></div>
          <div className="input-group input-group-sm mb-2 col-md-2">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Sexo:
            </label>
            <select
              value={values && values.sexo}
              ref={cmbSexo}
              name="sexo"
              className="form-select"
              aria-label="Default select example"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            >
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>

          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Fecha Nacimineto:
            </label>
            <input
              type="date"
              ref={txtFechaNaci}
              value={
                values
                  ? values.fecha_nac !== ""
                    ? moment(values.fecha_nac).format("YYYY-MM-DD")
                    : ""
                  : ""
              }
              name="fecha_nac"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            />
          </div>

          <div className="input-group input-group-sm mb-2 col-md-6">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Nombre:
            </label>
            <input
              ref={txtNombre}
              value={values ? (values.nombre !== "" ? values.nombre : "") : ""}
              name="nombre"
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
              onKeyPress={check}
              id='letras'
          
            />
          </div>

          <div className="input-group input-group-sm mb-2 col-md-6">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Apellido:
            </label>
            <input
              ref={txtApellido}
              value={
                values ? (values.apellido !== "" ? values.apellido : "") : ""
              }
              name="apellido"
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
              onKeyPress={check}
              id='letras'
             
            />
          </div>

          <div className="input-group input-group-sm mb-2 col-md-12">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Direccion:
            </label>
            <textarea
              ref={txtDireccion}
              value={
                values ? (values.direccion !== "" ? values.direccion : "") : ""
              }
              name="direccion"
              type="textarea"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              style={{ height: 40 }}
              
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            />
          </div>

          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Telefono:
            </label>
            <input
              ref={txtTlf}
              value={
                values ? (values.telefono !== "" ? values.telefono : "") : ""
              }
              name="telefono"
              maxLength={11}
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              onKeyUp={handleInputNumChange}
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            />
          </div>
          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Celular:
            </label>
            <input
              ref={txtCelular}
              value={
                values ? (values.celular !== "" ? values.celular : "") : ""
              }
              maxLength={11}
              name="celular"
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              onKeyUp={onchange}
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={ handleInputNumChange}
            />
          </div>
          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Estado Civil:
            </label>
            <select
              ref={cmbEstadoCivil}
              value={values && values.estadocivil}
              name="estadocivil"
              className="form-select"
              aria-label="Default select example"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            >
              <option value="0">Soltero</option>
              <option value="1">Casado</option>
              <option value="2">Viudo</option>
              
            </select>
          </div>

          <div className="input-group input-group-sm mb-2 col-md-8">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Correo Electronico:
            </label>
            <input
              ref={txtCorreo}
              value={values ? (values.correo !== "" ? values.correo : "") : ""}
              name="correo"
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            />
          </div>

          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Tipo de Sangre:
            </label>
            <select
              ref={cmbTipoSangre}
              value={values && values.tiposangre .trim()}
              name="tiposangre"
              className="form-select"
              aria-label="Default select example"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            >
              <option value=" ">Seleccionar</option>

              <option value="A positivo (A +)">A positivo (A +)</option>
              <option value="A negativo (A-)">A negativo (A-)</option>
              <option value="B positivo (B +)">B positivo (B +)</option>
              <option value="B negativo (B-)">B negativo (B-)</option>
              <option value="AB positivo (AB+)">AB positivo (AB+)</option>
              <option value="AB negativo (AB-)">AB negativo (AB-)</option>
              <option value="O positivo (O+)">O positivo (O+)</option>
              <option value="O negativo (O-)">O negativo (O-)</option>


            </select>


            
          </div>

          <div className="input-group input-group-sm mb-2 col-md-3">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Status:
            </label>
            <select
              ref={cmbStatus}
              value={values && values.status}
              name="status"
              className="form-select"
              aria-label="Default select example"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            >
              <option value="1">ACTIVO</option>
              <option value="0">INACTIVO</option>
            </select>
          </div>
          <div className="col-md-1"></div>
          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Bautizado (Agua):
            </label>
            <select
              ref={cmbBautiAgua}
              value={values && values.bas_agua}
              name="bas_agua"
              className="form-select"
              aria-label="Default select example"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            >
              <option value="1">SI</option>
              <option value="0">NO</option>
            </select>
          </div>

          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Bautizado (Espiritu):
            </label>
            <select
              ref={cmbBautiEspirit}
              value={values && values.bas_espirit}
              name="bas_espirit"
              className="form-select"
              aria-label="Default select example"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            >
              <option value="1">SI</option>
              <option value="0">NO</option>
            </select>
          </div>

          <div className="col-md-8"></div>

          <div className="input-group input-group-sm mb-2 col-md-4">
            <label className="input-group-text" id="inputGroup-sizing-sm">
              Fecha de Bautizo:
            </label>
            <input
              ref={txtFechaBau}
              value={
                values
                  ? values.fecha_baus !== ""
                    ? moment(values.fecha_baus).format("YYYY-MM-DD")
                    : ""
                  : ""
              }
              name="fecha_baus"
              type="date"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              onChange={onchange}
            />
          </div>

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
