import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Mensaje, MensajeSiNo } from "../mensajes";
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
} from "../../util/varios";

import axios from "axios";
import moment from "moment";
import { GestionarPastorIglesia } from "./modalRegistrarRepre";
import CatalogoPastor from "../../catalogos/catalogosiglesia/catalogoPastores";

export const GestionarRegistroIglesia = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
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



  const cmbEstado = useRef();
  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const [values, setValues] = useState({
    idiglesia: '',
    descripcion: '',
    codiglesia: '',
    codzona: '',
    repreiglesia: '',
    damas: '',
    caballeros: '',
    constituida: '',
    estado: '',
    municipio: '',
    codpostal: '',
    inicio_obra: '',
    constitucion_obra: '',
    baus_agua: '',
    baus_espiritu: '',
    promedio_ebd: '',
    ajec_f: '',
    ajec_m: '',
    juveniles_f: '',
    juveniles_m: '',
    jc_f: '',
    jc_m: '',
    condicion_templo: '',
    casa_pastoral: '',
    doc_templo: '',
    doc_casa: '',
    direccion: '',
  });

  const btnCancela = useRef();
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
  const [estado, setEstado] = useState()
  const [municipio, setMunicipio] = useState();
  const [tecla, setTecla] = useState();
  const [cedula, setCedula] = useState();
  const [idUsuario, setIdUsuario] = useState(localStorage.getItem("idusuario"));
  const [anioActu, setAnioActu] = useState(localStorage.getItem("anioactu"));
  const [pastor, setPastor] = useState({
    ced: '',
    nom: '',
    ape: '',
    cel: '',
    direc: ''
  })
  const styleTabs = {
    borderTop: "1px solid",
    borderColor: "rgba(0, 88, 129, 1)",
    borderLeft: "none",
    borderTopRightRadius: "16px",
  };

  /*********************************************** FUNCINES DE VALIDACION***********************************************************/

/*   const handleCloseSi = () => {
    setMostrar1(false);
  };

  const handleCloseNo = () => {
    setMostrar1(false);
  }; */

  const salir = () => {
    props.onHideCancela();
    setValues({
      idiglesia: '',
      descripcion: '',
      codiglesia: '',
      codzona: '',
      repreiglesia: '',
      damas: '',
      caballeros: '',
      constituida: '',
      estado: '',
      municipio: '',
      codpostal: '',
      inicio_obra: '',
      constitucion_obra: '',
      baus_agua: '',
      baus_espiritu: '',
      promedio_ebd: '',
      ajec_f: '',
      ajec_m: '',
      juveniles_f: '',
      juveniles_m: '',
      jc_f: '',
      jc_m: '',
      condicion_templo: '',
      casa_pastoral: '',
      doc_templo: '',
      doc_casa: '',
      direccion: '',

    });
  };

  const onHideInfo = (ced, nom, ape, cel, direc) => {
    setPastor({
      ced: ced,
      nom: nom,
      ape: ape,
      cel: cel,
      direc: direc
    })
    direc = direc;
   /*  setMostrar(false) */
    setMostrar1(false)
    txtCedula.current.value = ced
    txtDatosPastor.current.value = 'Nombre: ' + nom.trim() + ' ' + ape.trim() + ', Celular: ' + cel.trim() + ', Direccion: ' + direc.trim();
  }

  const actualizarPastor = () => {
    let endpoint = `${op.conexion}/api/iglesia/pastorxiglesia/${1}`;
    let body;
    /*  setActivate(true); */

    body = {

      ced: pastor.ced,
      nomb: pastor.nom,
      ape: pastor.ape,
      sex: null,
      tipo: null,
      cel: pastor.cel,
      tlf: null,
      etdcvil: null,
      direc: pastor.direc,
      email: null,
      ingreso: null,
      ordenacion: null,
      estudio: null,
      descestudio: null,
      profesi: null,
      ocupaci: null,
      gradocrede: null,
      nrocrede: null,
      iglesiamembre: null
    };

    console.log(body);



    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status == 200) {


          if (props.operacion === 1) {

            alert("registro creado correctamente.");
            props.render();
            props.onHideCancela();
          }
        }
        setActivate(false);
      })
      .catch(function (error) {
        setTitulo("ERROR");
        setMsg(error.response.data.message)
        setActivate(false);
      });
  };

  const selectMunicipio1 = (id) => {

    if (id !== 0) {
      let campos = '*';
      let nomtab = 'municipio';
      let nomid = 'idestado';
      let endpoint = `${op.conexion}/api/consulta/modelirows?campos=${campos}&id=${id}&nomtab=${nomtab}&nomid=${nomid}`;
      setActivate(true);

      axios.get(endpoint, {
        headers: {
          'x-access-token': `${token}`
        }
      }).then(function (response) {

        if (response.status == 200) {
          if (response.data.idiglesia !== '') {
            setMunicipio(response.data)


          }

        }

      }).catch(function (error) {


        console.log(error.response.data.message)

      })
    } else {
      setMunicipio('')
    }

  }

  const datosPastor = (cedula) => {


    let campos = '*';
    let nomtab = 'pastor';
    let nomid = 'cedula';

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${cedula}&nomtab=${nomtab}&nomid=${nomid}`;
    setActivate(true);

    axios.get(endpoint, {
      headers: {
        'x-access-token': `${token}`
      }
    }).then(function (response) {

      if (response.status == 200) {

        if (response.data !== '') {

          console.log(response.data);
          txtDatosPastor.current.value = 'Nombre: ' + response.data.nombre.trim() + ' ' + response.data.apellido.trim() + ', Celular: ' + response.data.celular.trim() + ', Direccion: ' + response.data.direccion.trim();
        } else {
          if (operacion === 1) {
            setMostrar(true)
          }
        }

      }

      setActivate(false);

    }).catch(function (error) {

      setActivate(false);


    })


  };

  const validarPastor = (event) => {
    event.preventDefault();
    validaSoloNumero(event);
    setCedula(event.target.value)
    if (event.which === 13 || typeof (event.which) === 'undefined') {
      if (event.target.value !== '') {
        setTecla(event.which);
        datosPastor(event.target.value);


      } else {
        txtCedula.current.value = '';
      }
    }
  };

  const actualizarIglesia = () => {
    let endpoint = `${op.conexion}/api/iglesia/creariglesia/${operacion}`;
    let body;
    setActivate(true);

    body = {

      idr: txtId.current.value === '' ? 0 : parseInt(txtId.current.value),
      descrip: txtNombre.current.value.trim(),
      codigle: txtCodIgle.current.value.trim(),
      zona: codigo.toString(),
      pastor: parseInt(txtCedula.current.value),
      adama: parseInt(txtDamas.current.value),
      acaballeros: parseInt(txtCaballeros.current.value),
      estdigle: parseInt(cmbEstado.current.value),
      edo: parseInt(cmbEstadoLocal.current.value),
      mun: parseInt(cmbMunicipio.current.value),
      postal: txtPostal.current.value,
      inito: txtInitObra.current.value,
      fino: txtFinObra.current.value,
      agua: parseInt(txtAgua.current.value),
      espirit: parseInt(txtEspiritu.current.value),
      ed: parseInt(txtPromedio.current.value),
      fajec: parseInt(txtFajec.current.value),
      majec: parseInt(txtMajec.current.value),
      fju: parseInt(txtFjuve.current.value),
      mju: parseInt(txtMjuve.current.value),
      fjc: parseInt(txtFjc.current.value),
      mjc: parseInt(txtMjc.current.value),
      contemplo: parseInt(cmbCondTemp.current.value),
      concasa: parseInt(cmbCondCasa.current.value),
      doctem: parseInt(cmbDocTem.current.value),
      doccasa: parseInt(cmbDocCasa.current.value),
      direc: txtDireccion.current.value
    };

    /* actualizarPastor() */

    console.log(body);

    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status == 200) {


          if (props.operacion === 1) {

            alert("registro creado correctamente.");
            props.render();
            props.onHideCancela();
          } else if (props.operacion === 2) {

            alert("registro modificado correctamente.");
            props.render();
            props.onHideCancela();
          } else if (props.operacion === 3) {

            alert("registro eliminado correctamente.");
            props.render();
            props.onHideCancela();
          }
          props.render()
        }
        setActivate(false);
      })
      .catch(function (error) {
        setTitulo("ERROR");
        setMsg(error.response.data.message);
        /* setMostrar(true); */
        setActivate(false);
      });
  };

/*   const cerrarCalogo = () => {
    setMostrar1(false)
  } */
  const abrirCalogo = () => {
  setMostrar1(true)
  }



  const regPastor = () => {
    setMostrar(false)
  }
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
        setEstado(props.estado)
        setOperacion(props.operacion);
        selectMunicipio1(props.iglesia ? props.iglesia.municipio !== null ? props.iglesia.municipio : 0 : 0)

        if (props.operacion !== 1) {
          setValues(props.iglesia);
          datosPastor(props.iglesia.repreiglesia)
          console.log(props.iglesia.doc_casa);
        }
      }}
    >
      <Modal.Header style={{ backgroundColor: "#019cd5" }}>
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1
            ? "Registrar Iglesia."
            : operacion === 2
              ? "Editar Iglesia."
              : operacion === 3
                ? "Eliminar Iglesia."
                : "Consultar Iglesia"}
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
        <div className="col-md-12 row py-3 py-4 d-flex justify-content-between">
          <div class="input-group input-group-sm mb-3 col-md-2">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              codigo:
            </label>
            <input
              type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtId}
              disabled
              defaultValue={values.idiglesia}
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-2">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Cod. Iglesia
            </label>
            <input
              type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtCodIgle}
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
              defaultValue={values.codiglesia}
            />
          </div>

          <div class="input-group input-group-sm mb-3 col-md-2">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Cod. Postal
            </label>
            <input
              type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtPostal}
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
              defaultValue={values.codpostal}
            />
          </div>

          <div className="col-md-3"></div>

          <div class="input-group input-group-sm mb-3 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Estado Iglesia:
            </label>
            <select
              ref={cmbEstado}
              defaultValue={props.iglesia && props.iglesia.constituida}
              class="form-select"
              aria-label="Default select example"
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
            >
              <option selected>seleccionar</option>
              <option value="1">Constituida</option>
              <option value="0">No Constituida</option>
            </select>
          </div>

          <div class="input-group input-group-sm mb-3 col-md-7">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Nombre Congregacion:
            </label>
            <input
              type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtNombre}
              defaultValue={values.descripcion}
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
            />
          </div>

          <div class="input-group input-group-sm mb-3 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Cedula del Pastor(a):
            </label>
            <input
              type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtCedula}
              onKeyUp={validarPastor}
              onBlur={validarPastor}
              defaultValue={values.repreiglesia}
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
            />
            <button type="button" class="btn btn-success" onClick={abrirCalogo} disabled={operacion === 1 ? false : operacion === 2 ? false : true}>
              <i class="fas fa-search"></i>
            </button>
          </div>

          <div class="input-group input-group-sm mb-3 col-md-12">
            <input
              type="text"
              class="form-control"
              ref={txtDatosPastor}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              disabled
            />
          </div>

          <div class="input-group input-group-sm mb-3 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Cond. Legal Templo:
            </label>
            <select
              ref={cmbCondTemp}
              defaultValue={props.iglesia && props.iglesia.condicion_templo}
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
              class="form-select"
              aria-label="Default select example"
            >
              <option selected>seleccionar</option>
              <option value="0">Propio</option>
              <option value="1">Alquilado</option>
              <option value="2">Del Pastor</option>
              <option value="3">En Construccion</option>
              <option value="4">Prestado</option>
              <option value="5">Solo Terreno</option>
            </select>
          </div>

          <div class="input-group input-group-sm mb-3 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Document. Templo:
            </label>
            <select
              ref={cmbDocTem}
              defaultValue={props.iglesia && props.iglesia.doc_templo}
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
              class="form-select"
              aria-label="Default select example"
            >
              <option selected>seleccionar</option>
              <option value="0">Ninguna</option>
              <option value="1">Compra Amistosa</option>
              <option value="2">Contrato de Alq.</option>
              <option value="3">Titulo Notariado</option>

            </select>
          </div>
          <div class="input-group input-group-sm mb-3 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Cond. Casa Pastoral:
            </label>
            <select
              ref={cmbCondCasa}
              defaultValue={props.iglesia && props.iglesia.casa_pastoral}
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
              class="form-select"
              aria-label="Default select example"
            >
              <option selected>seleccionar</option>
              <option value="0">Propio</option>
              <option value="1">Alquilado</option>
              <option value="2">Del Pastor</option>
              <option value="3">En Construccion</option>
              <option value="4">Prestado</option>
              <option value="5">Solo Terreno</option>
            </select>
          </div>

          <div class="input-group input-group-sm mb-3 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Document. Casa:
            </label>
            <select
              ref={cmbDocCasa}
              defaultValue={props.iglesia && props.iglesia.doc_casa}
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
              class="form-select"
              aria-label="Default select example"
            >
              <option selected>seleccionar</option>
              <option value="0">Ninguna</option>
              <option value="1">Compra Amistosa</option>
              <option value="2">Contrato de Alq.</option>
              <option value="3">Titulo Notariado</option>

            </select>
          </div>

          <div class="input-group input-group-sm mb-3 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Estado:
            </label>
            <select
              ref={cmbEstadoLocal}
              defaultValue={values.estado}
              class="form-select"
              aria-label="Default select example"
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
            >
              <option value="">Seleccione</option>
              {estado && estado.map((item, index) => (
                <option key={index} value={item.idestado}> {item.nombre} </option>
              ))}

            </select>
          </div>

          <div class="input-group input-group-sm mb-3 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Municipio:
            </label>
            <select
              ref={cmbMunicipio}
              defaultValue={props.iglesia && props.iglesia.municipio}
              class="form-select"
              aria-label="Default select example"
              disabled={operacion === 1 ? false : operacion === 2 ? false : true}
            >
              <option value="">Seleccione</option>
              {estado && estado.map((item, index) => (
                <option key={index} value={item.idestado}> {item.nombre} </option>
              ))}

            </select>
          </div>

          <div className="input-group input-group-sm mb-3 col-md-3">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Inicio de la Obra:</Label>
            <input type="date" disabled={operacion === 1 ? false : operacion === 2 ? false : true} ref={txtInitObra} defaultValue={props.iglesia ? props.iglesia.inicio_obra !== null ? moment(props.iglesia.inicio_obra).format('YYYY-MM-DD') : '' : ''} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>

          <div className="input-group input-group-sm mb-3 col-md-3">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Constitución de la Obra:</Label>
            <input type="date" disabled={operacion === 1 ? false : operacion === 2 ? false : true} ref={txtFinObra} defaultValue={props.iglesia ? props.iglesia.inicio_obra !== null ? moment(props.iglesia.constitucion_obra).format('YYYY-MM-DD') : '' : ''} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>



          <div className="input-group input-group-sm mb-3 col-md-2">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Damas:</Label>
            <input ref={txtDamas} disabled={operacion === 1 ? false : operacion === 2 ? false : true} type="text" defaultValue={values.damas} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>

          <div className="input-group input-group-sm mb-3 col-md-2">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Caballeros:</Label>
            <input ref={txtCaballeros} disabled={operacion === 1 ? false : operacion === 2 ? false : true} type="text" defaultValue={values.caballeros} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>

          <div className="input-group input-group-sm mb-3 col-md-2">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Jóvenes:</Label>
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} ref={txtFajec} defaultValue={values.ajec_f} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="F" />
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} ref={txtMajec} defaultValue={values.ajec_m} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="M" />
          </div>

          <div className="input-group input-group-sm mb-3 col-md-2">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Juveniles:</Label>
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} ref={txtFjuve} defaultValue={values.juveniles_f} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="F" />
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} ref={txtMjuve} defaultValue={values.juveniles_m} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="M" />
          </div>

          <div className="input-group input-group-sm mb-3 col-md-2">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Niños:</Label>
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} ref={txtFjc} defaultValue={values.jc_f} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="F" />
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} ref={txtMjc} defaultValue={values.jc_m} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="M" />
          </div>
          <div className="input-group input-group-sm mb-3 col-md-2">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Total:</Label>
            <input type="text" disabled className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>

          <div className="input-group input-group-sm mb-3 col-md-3">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Baustizados en Agua:</Label>
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} className="form-control" ref={txtAgua} defaultValue={values.baus_agua} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div className="input-group input-group-sm mb-3 col-md-3">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Baustizados en Espiritu:</Label>
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} className="form-control" ref={txtEspiritu} defaultValue={values.baus_espiritu} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div className="input-group input-group-sm mb-3 col-md-3">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Promedio E.B.D:</Label>
            <input type="text" disabled={operacion === 1 ? false : operacion === 2 ? false : true} className="form-control" ref={txtPromedio} defaultValue={values.promedio_ebd} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div className="input-group input-group-sm mb-3 col-md-3">

          </div>

          <div className="input-group input-group-sm mb-3 col-md-6">
            <Label className="input-group-text" id="inputGroup-sizing-sm">Dirección:</Label>
            <input type="texarea" disabled={operacion === 1 ? false : operacion === 2 ? false : true} className="form-control" ref={txtDireccion} defaultValue={values.direccion} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>


        </div>
        <CatalogoPastor
        show={mostrar1}
        onHideCatalogo={onHideInfo}
        />
        <GestionarPastorIglesia
          show={mostrar}
          onHideCancela={regPastor}
          infopastor={onHideInfo}
          cedula={cedula}
        />
      
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-sm btn-success rounded-pill col-md-2"
          disabled={props.operacion === 4 ? true : false}
          onClick={actualizarIglesia}
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
