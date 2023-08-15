import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Mensaje, MensajeSiNo } from "../../mensajes";
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
} from "../../../util/varios";

import axios from "axios";
import moment from "moment";
/* import { GestionarPastorIglesia } from "./modalRegistrarRepre";
import CatalogoPastor from "../../catalogos/catalogosiglesia/catalogoPastores"; */

export const ModalDebito = (props) => {
  /*  variables de estados */

  let op = require("../../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  const codigo = JSON.parse(localStorage.getItem('codigo'))
  const idusuario = JSON.parse(localStorage.getItem("idusuario"));
  const fechasistema = JSON.parse(localStorage.getItem('fechasistema'))
  const txtId = useRef();
  const txtConcepto = useRef();
  const txtMonto = useRef();
  const cmbTipo = useRef();
  const cmbTipo2 = useRef();
  const txtRefer = useRef();
  const txtCedula = useRef();
  const txtConceptoRever = useRef()
  const txtDatosPastor = useRef();

  const cmbEstado = useRef();

  const [tipo, setTipo] = useState();
  const [values, setValues] = useState({
    idiglesia: "",
    descripcion: "",
    codiglesia: "",
    codzona: "",
    repreiglesia: "",
    damas: "",
    caballeros: "",
    constituida: "",
    estado: "",
    municipio: "",
    codpostal: "",
    inicio_obra: "",
    constitucion_obra: "",
    baus_agua: "",
    baus_espiritu: "",
    promedio_ebd: "",
    ajec_f: "",
    ajec_m: "",
    juveniles_f: "",
    juveniles_m: "",
    jc_f: "",
    jc_m: "",
    condicion_templo: "",
    casa_pastoral: "",
    doc_templo: "",
    doc_casa: "",
    direccion: "",
  });

  const btnCancela = useRef();
  const btnAcepta = useRef();
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });
  const [mensajesino, setMensajesino] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

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
  const [anioActu, setAnioActu] = useState(localStorage.getItem("anioactu"));
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

  /*   const handleCloseSi = () => {
    setMostrar1(false);
  };

  const handleCloseNo = () => {
    setMostrar1(false);
  }; */

  const salir = () => {
    props.onHideCancela();
    setValues({
      idiglesia: "",
      descripcion: "",
      codiglesia: "",
      codzona: "",
      repreiglesia: "",
      damas: "",
      caballeros: "",
      constituida: "",
      estado: "",
      municipio: "",
      codpostal: "",
      inicio_obra: "",
      constitucion_obra: "",
      baus_agua: "",
      baus_espiritu: "",
      promedio_ebd: "",
      ajec_f: "",
      ajec_m: "",
      juveniles_f: "",
      juveniles_m: "",
      jc_f: "",
      jc_m: "",
      condicion_templo: "",
      casa_pastoral: "",
      doc_templo: "",
      doc_casa: "",
      direccion: "",
    });
  };

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

  const handleCloseSi = () => {
    setMensajesino({ mostrar: false, titulo: "", texto: "", icono: "" });
    procesarNotaCredito();
  };
  const cerrarModal = () => {
    props.onHideRenderizar(parseInt(props.idcuenta));
    props.onHideCancela();
    /*  blanquear(); */
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
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
  const actualizar_bitacora = (id) => {
    let endpoint = `${op.conexion}/api/comun/bitacora`;
    let des =
      operacion === 1
        ? "REGISTRO"
        : operacion === 2
        ? "MODIFICACIÓN"
        : "REVERSADA";
    let body = {
      descrip: des,
      idreg: id,
      tab: "nota_debito",
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

  const procesarNotaCredito = () => {
    setActivate(true);
    let endpoint = `${op.conexion}/api/banco/agregarnota`;

    let body = {
      operacion: operacion,
    
      idnota: operacion === 1 ? 0 : txtCedula.current.value,
      concpt: txtConcepto.current.value.trim(),
      montom: parseFloat(
        txtMonto.current.value.replace(/\./g, "").replace(",", ".")
      ),
      idusuar: idusuario,
      idcuentabanc: parseInt(props.idcuenta),
      tipomovi: parseInt(cmbTipo.current.value),
      refer: txtRefer.current.value.trim(),
      debitocredito: "debito",
      tipo2:cmbTipo2.current.value,
      reversa:operacion === 3 ? 1 : 0,
      reversa_concep:operacion === 3 ? txtConceptoRever.current.value : ''
    };

    console.log(body)

    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
         
          if (operacion === 1) {
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "registro creado correctamente",
              icono: "exito",
            });
          } else if (operacion === 2) {
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "registro modificado correctamente",
              icono: "exito",
            });
          } else if (operacion === 3) {
            setMensaje({
              mostrar: true,
              titulo: "Exito.",
              texto: "registro reversado correctamente",
              icono: "exito",
            });
          }

       actualizar_bitacora(response.data[0].agregar_nota2)
          
          setActivate(false);
        }
      })
      .catch(function (error) {
        let mensaje = "";
        if (error.response === undefined) {
          mensaje = "Error de Conexion";
        } else {
          if (
            error.response.data.message ===
            'duplicate key value violates unique constraint "agente_rif_key"'
          ) {
            mensaje = "Ya existe un Registro con este rif";
          } else if (
            error.response.data.message ===
            'duplicate key value violates unique constraint "agente_email_key"'
          ) {
            mensaje = "Ya existe un Registro con este correo";
          } else {
            mensaje = error.response.data.message;
          }
        }
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto: mensaje,
          icono: "error",
        });
        setActivate(false);
      });
  };

  const datisPersona = () => {
    let campos = "referencia";

    let nomtab = "nota_debito";
    let nomid = "referencia";
    let condic = "idcuentabancaria =" + props.idcuenta+" and reversado != 1" ;

    let endpoint = `${op.conexion}/api/consulta/modelicondi?campos=${campos}&id=${txtRefer.current.value}&nomtab=${nomtab}&nomid=${nomid}&condic=${condic}`;
   console.log(endpoint)

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
            console.log(response.data)
            if(response.data.legth > 0){
                setMensaje({
                    mostrar: true,
                    titulo: "Notificación",
                    texto: "Ya existe una nota de debito con esta refencia",
                    icono: "informacion",
                  });
            }else {
                
              procesarNotaCredito()
            }
            
             
        }

       
      })
      .catch(function (error) {
        setActivate(false);
      });
  };

  const onChangeValidar = () => {
    let sigue = true;
    if(txtRefer.current.value === ''){
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar el n° de referencia",
        icono: "informacion",
      });
      txtRefer.current.focus()
      sigue = false

    } else if(cmbTipo.current.value === ''){
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe seleccionar el tipo de Debito",
        icono: "informacion",
      });
      cmbTipo.current.focus()
      sigue = false

    } else if(cmbTipo2.current.value === ''){
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe seleccionar el tipo de concepto",
        icono: "informacion",
      });
      cmbTipo2.current.focus()
      sigue = false

    } else if(txtConcepto.current.value === ''){
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar la descripción del concepto",
        icono: "informacion",
      });
      txtConcepto.current.focus()
      sigue = false

    } else if(txtMonto.current.value === ''){
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar el Monto de la salida",
        icono: "informacion",
      });
      txtMonto.current.focus()
      sigue = false

    }
    
    if(operacion === 3 && txtConceptoRever.current.value === ''){
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: "Debe ingresar la descripción del concepto de reverso",
        icono: "informacion",
      });
      txtConceptoRever.current.focus()
      sigue = false

    }

    

     if(sigue){
      datisPersona()
   
      
    } 

  }

  const seleccionarTipo = () => {
    let campos = "*";
    let nomtab = "tipo_recaudos";
    let orden = "idtipo";
    let condi = "idtipo != 6";

    let endpoint =
      op.conexion +
      `/api/consulta/selecionarregistrocondi?campos=${campos}&nomtab=${nomtab}&condi=${condi}&orden=${orden}`;
    console.log(endpoint);
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          setTipo(response.data);
        }

        setActivate(false);
      })
      .catch(function (error) {
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto: error.response.data.message,
          icono: "error",
        });
        setActivate(false);
      });
  };

  useEffect(() => {
    seleccionarTipo();
  }, []);
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
          txtCedula.current.value = props.nota ? props.nota.idnotadebito : ''
          txtRefer.current.value = props.nota ? props.nota.referencia.trim() : ''
          cmbTipo.current.value  = props.nota ? props.nota.tipo_debito : '' 
          cmbTipo2.current.value = props.nota && props.nota.tipo_salidad ? props.nota.tipo_salidad : ''
          txtConcepto.current.value = props.nota ? props.nota.conceptodebito.trim() : ''
          txtMonto.current.value =  props.nota ? formatMoneda(props.nota.montodebito.toString().replace(',', '').replace('.', ','), ',', '.', 2) : '0,00'
       
        }
      }}
    >
      <Modal.Header style={{ backgroundColor: "#019cd5" }}>
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1
            ? "Registrar Nota de Debito."
            : operacion === 2
            ? "Editar Nota de Debito."
            : operacion === 3
            ? "Reversar Nota de Debito."
            : "Consultar Nota de Debito"}
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
        <div className="col-md-12 row  d-flex justify-content-between">
          <div class="input-group input-group-sm mb-2 col-md-3">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              codigo:
            </label>
            <input
              type="text"
              disabled
              ref={txtCedula}
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <div className="col-md-9"></div>

          <div class="input-group input-group-sm mb-2 col-md-4">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Referencia:
            </label>
            <input
              type="text"
              disabled={operacion === 3 ? true : false}
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtRefer}
            />
          </div>

          <div class="input-group input-group-sm mb-2 col-md-4">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Tipo de Debito:
            </label>
            <select
              ref={cmbTipo}
              disabled={operacion === 3 ? true : false}

              class="form-select"
              aria-label="Default select example"
              
            >
              <option value="">Seleccione</option>
              {tipo &&
                tipo.map((item, index) => (
                  <option key={index} value={item.idtipo}>
                    {" "}
                    {item.descripcion}{" "}
                  </option>
                ))}
            </select>
          </div>

          <div class="input-group input-group-sm mb-2 col-md-4">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Tipo de Concepto:
            </label>
            <select
              ref={cmbTipo2}
              disabled={operacion === 3 ? true : false}

              class="form-select"
              aria-label="Default select example"
              
            >
              <option value="">Seleccione</option>
              <option value="0">Ayudas Sociales</option>
              <option value="1">Reparaciones</option>
              <option value="2">Gastos Varios</option>


             
            </select>
          </div>

          <div class="input-group input-group-sm mb-2 col-md-12">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Descripción de Concepto:
            </label>
            <textarea
              type="textarea"
              style={{height:40}}
              disabled={operacion === 3 ? true : false}

              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtConcepto}
            />
          </div>
          {operacion === 3 ?
        <div class="input-group input-group-sm mb-2 col-md-12">
        <label class="input-group-text" id="inputGroup-sizing-sm">
          Concepto de Reverso:
        </label>
        <textarea
          type="textarea"
          style={{height:40}}
          class="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-sm"
          ref={txtConceptoRever}
        />
      </div>
      : ''  
        }

          <div className="col-md-8"></div>

          <div class="input-group input-group-sm mb-2 col-md-4">
            <label class="input-group-text" id="inputGroup-sizing-sm">
              Monto:
            </label>
            <input
              type="text"
              class="form-control text-right"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              ref={txtMonto}
              disabled={operacion === 1 ? false : true}
              onKeyUp={handleInputMontoChange}
              onBlur={handleInputMontoChange}
            />
              <label class="input-group-text" id="inputGroup-sizing-sm">
             Bs.
            </label>
          </div>
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
        <MensajeSiNo
          mensaje={mensajesino}
          onHideNo={() =>
            setMensajesino({ mostrar: false, titulo: "", texto: "", icono: "" })
          }
          onHideSi={handleCloseSi}
        />
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-sm btn-success rounded-pill col-md-3"
          disabled={props.operacion === 4 ? true : false}
          onClick={onChangeValidar}
        >
          <i className="fas fa-check-circle"> Aceptar</i>
        </button>
        <button
          ref={btnCancela}
          onClick={salir}
          className="btn btn-sm btn-danger rounded-pill col-md-3"
        >
          <i className="fas fa-window-close"> Salir</i>
        </button>
      </Modal.Footer>
    </Modal>
  );
};
