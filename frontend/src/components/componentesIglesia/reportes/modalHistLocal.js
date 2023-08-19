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

export const ModalHist = (props) => {
  /*  variables de estados */

  let op = require("../../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  const txtBanco = useRef();
  const codigo = JSON.parse(localStorage.getItem('codigo'))
  const permiso = JSON.parse(localStorage.getItem('permiso'))
  const [cuentas, setCuentas] = useState();
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
  const cmbTipo = useRef();
  const [mensaje, setMensaje] = useState({ mostrar: false, titulo: '', texto: '', icono: '' });
  const [mensajesino, setMensajesino] = useState({ mostrar: false, titulo: '', texto: '', icono: '' });

  const [mostrar5, setMostrar5] = useState(false);
  const [idcuenta, setIdCuenta] = useState();
  const [banco, setBanco] = useState();
  const [tipo, setTipo] = useState('');
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

  const handleInputNumChange = (event) => {
    event.preventDefault();
    validaSoloNumero(event);
    var valido;
    if (event.which === 13 || typeof (event.which) === 'undefined') {

        setValues({ ...values, [event.target.name]: event.target.value });

    } else if (event.which === 46) {
        return false;
    } else if (event.which >= 48 && event.which <= 57) {
        return true;
    } else if (event.which === 8 || event.which === 0 || event.which === 44) {
        return true;
    } else return false;//alert(e.which);
};


/*   const handleCloseSi = () => {
    setMensajesino({mostrar: false, titulo: '', texto: '', icono: ''});
    procesarNotaCredito();
}; */

  const cerrarModal = () => {
    props.onHideRenderizar(parseInt(props.idcuenta));
    props.onHideCancela();
   /*  blanquear(); */
    setMensaje({ mostrar: false, titulo: '', texto: '', icono: '' });
}

const seleccionarCuentas = () => {
   
    let campos = '*';
    let nomtab = 'cuentabancaria';
    let nomid = 'agente';
    let nomid2 = 'tipoagente'
    let orden = 'idcuentabancaria'


      let endpoint = `${op.conexion}/api/consulta/idsstring2rows?campos=${campos}&nomtab=${nomtab}&nomid=${nomid}&nomid2=${nomid2}&id=${codigo}&id2=${permiso.toString().trim()}&orden=${orden} `
      setActivate(true);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
         
          console.log(response.data)
          setCuentas(response.data);
       
          


        }
    

        setActivate(false);
      })
      .catch(function (error) {
        setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message, icono: 'error' });
        setActivate(false);
      });
  };

  const onChange = (e) => {
      e.preventDefault()

      

      if(e.target.name === 'id'){

        setBanco('idcuentabancaria='+e.target.value);
        setIdCuenta(e.target.value)

      } else{
        console.log(e.target.value)
          if(e.target.value === '0'){
              setTipo('')
          } else if(e.target.value === '1'){
            setTipo("AND tiponota = 'CREDITO'")
        }  else if(e.target.value === '2'){
           
            setTipo("AND tiponota = 'DEBITO'")
           
           

        }
      }

      console.log(e.target.value)
  }



  useEffect(() => {

    seleccionarCuentas()
    
  }, []);

  const imprimir = () =>{
    let sigue = true;
    if(txtBanco.current.value === ''){
      setMensaje({
        mostrar: true,
        titulo: "Error",
        texto: 'Debe selecionar el banco',
        icono: "error",
      });
      txtBanco.current.focus()
      sigue = false;

    }
    if(sigue){
      console.log(tipo)
      localStorage.setItem("condi", JSON.stringify(banco+' '+tipo));
      localStorage.setItem("idcuenta", JSON.stringify(idcuenta));
     props.imprimirHistLocal()

    }
      
  }

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
        /*   setValues(props.iglesia); */
        
         /*  console.log(props.iglesia.doc_casa); */
        }
      }}
    >
      <Modal.Header style={{ backgroundColor: "#019cd5" }}>
        <Modal.Title style={{ color: "#fff" }}>
        Imprimir Historial de Balances de Cuentas
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
          
         
          <div class="input-group input-group-sm mb-2 col-md-12">
                <label class="input-group-text" id="inputGroup-sizing-sm">
                  Banco:
                </label>
                <select
                  class="form-select"
                  aria-label="Default select example"
                  name='id'
                  ref={txtBanco}
                  onChange={onChange}
               
                >
                  <option value="">Seleccione</option>
                  {cuentas && cuentas.map((item, index) => (
                    <option key={index} value={item.idcuentabancaria} > {item.nombre} </option>
                  ))}

                </select>
              </div>
              <div class="input-group input-group-sm mb-12 col-md-6">
                <label class="input-group-text" id="inputGroup-sizing-sm">
                  Tipo Movimiento:
                </label>
                <select
                ref={cmbTipo}
                  class="form-select"
                  aria-label="Default select example"
                  onChange={onChange}
                  name='tipo'
                 
                >
                  <option value="0">TODO</option>
                  <option value="1">CREDITO</option>
                  <option value="2">DEBITO</option>
               
                </select>
              </div>
        ¿

         
         
        


         

  

        </div>


        <Mensaje mensaje={mensaje}
                    onHide={() => {
                        mensaje.titulo === 'Exito.' ?
                            cerrarModal() :
                            setMensaje({ mostrar: false, titulo: '', texto: '', icono: '' })
                    }
                    } />
               {/*  <MensajeSiNo mensaje={mensajesino}
                    onHideNo={() => setMensajesino({ mostrar: false, titulo: '', texto: '', icono: ''})} onHideSi={handleCloseSi} />
      */}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-sm btn-success rounded-pill col-md-3"
          disabled={props.operacion === 4 ? true : false}
           onClick={imprimir} 
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
