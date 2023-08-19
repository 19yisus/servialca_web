import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
/* import { Mensaje, MensajeSiNo } from "../mensajes"; */
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
    validaSoloNumero,
    formatMoneda,
    validaMonto,
    formatoMonto,
} from "../../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../../mensajes";


export const GestionarRegistroPastor = (props) => {
    /*  variables de estados */

    let op = require("../../../modulos/datos");
    let token = localStorage.getItem("jwtToken");
    const [codigoIglesia, setCodigoIglesia] = useState(JSON.parse(localStorage.getItem('codigo')))
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
        ced: '',
        nombre: '',
        apellido: '',
        fecha_nac: '',
        bas_agua: 1,

        status: 1,
        bas_espirit: 1,
        cod_iglesia: '',
        sexo: 'M',
        fecha_baus: '',
        nacionalidad: 'V',
        direccion: '',
        telefono: '',
        celular: '',
        estadocivil: 0,
        correo: '',
        tiposangre:'',
        fechingresopastor:'',
        fechordenacion:'',
        estudios:'',
        descripnestudio:'',
        profesion:'',
        ocupacion:'',
        gradocredencial:'',
        numcredencial:''
    });

    const btnCancela = useRef();
    const [mensaje, setMensaje] = useState({ mostrar: false, titulo: '', texto: '', icono: '' });

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
    const [desabilitar, setDeshabilitar] = useState(true)
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



    const salir = () => {
        props.onHideCancela();
        setValues({
            ced: '',
            nombre: '',
            apellido: '',
            fecha_nac: '',
            bas_agua: 1,
    
            status: 1,
            bas_espirit: 1,
            cod_iglesia: '',
            sexo: 'M',
            fecha_baus: '',
            nacionalidad: 'V',
            direccion: '',
            telefono: '',
            celular: '',
            estadocivil: 0,
            correo: '',
            tiposangre:'',
            fechingresopastor:'',
            fechordenacion:'',
            estudios:'',
            descripnestudio:'',
            profesion:'',
            ocupacion:'',
            gradocredencial:'',
            numcredencial:''

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

const actualizarCreyente = () => {
    let endpoint = `${op.conexion}/api/personas/personaact`;
    let body;
    /*  setActivate(true); */

    let persona = []


    body = {

        operacion:operacion,
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
       
        nacional:values.nacionalidad,
        statuspast: operacion === 1 ? 1 : values.statuspastor ,
        celul:values.celular,
        estadocivi:values.estadocivil,
        direc:values.direccion,
        corre:values.correo,
        tiposangr:values.tiposangre,
        tlf:values.telefono
       
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

                if (operacion === 1) {

                    setMensaje({ mostrar: true, titulo: 'Exito.', texto: 'Registro Guardado Exitosamente', icono: 'exito' });

                } else if (operacion === 2) {

                    setMensaje({ mostrar: true, titulo: 'Exito.', texto: 'Registro Modificado Exitosamente', icono: 'exito' });

                } else if (operacion === 3) {

                    setMensaje({ mostrar: true, titulo: 'Exito.', texto: 'Registro Elimibado Exitosamente', icono: 'exito' });

                }
            }
            setActivate(false);
        })
        .catch(function (error) {
            setActivate(false);
            setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message === 'llave duplicada viola restricción de unicidad «persona_pkey»' ? 'ya existe una persona con esa cedula' : error.response.data.message, icono: 'error' });
        })
};


const onchange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(e.target.name,e.target.value)

}

const blanquear = () => {
    setValues({
        ced: '',
        nombre: '',
        apellido: '',
        fecha_nac: '',
        bas_agua: 1,

        status: 1,
        bas_espirit: 1,
        cod_iglesia: '',
        sexo: 'M',
        fecha_baus: '',
        nacionalidad: 'V',
        direccion: '',
        telefono: '',
        celular: '',
        estadocivil: 0,
        correo: '',
        tiposangre:'',
        fechingresopastor:'',
        fechordenacion:'',
        estudios:'',
        descripnestudio:'',
        profesion:'',
        ocupacion:'',
        gradocredencial:'',
        numcredencial:''
        });
    }

const cerrarModal = () => {
    props.render();
    props.onHideCancela();
    blanquear()
    setMensaje({ mostrar: false, titulo: '', texto: '', icono: '' });
}

const datosPastor = (cedula) => {


    let campos = '*';
    let nomtab = 'persona';
    let nomid = 'ced';

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${cedula}&nomtab=${nomtab}&nomid=${nomid}`;
    setActivate(true);

    axios.get(endpoint, {
      headers: {
        'x-access-token': `${token}`
      }
    }).then(function (response) {

      if (response.status == 200) {

        if(response.data !== ''){
            setValues(response.data)
        } else{
            setDeshabilitar(false)
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
    if (event.which === 13 || typeof (event.which) === 'undefined') {
      if (event.target.value !== '') {
        setTecla(event.which);
        datosPastor(event.target.value);


      } else {
       /*  txtCedula.current.value = ''; */
      }
    }
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
                setValues(props.pastor);
                console.log(props.pastor)
                setDeshabilitar(false)

            } else if(props.operacion === 1){
                setDeshabilitar(true)
            }
           
        }}
    >
        <Modal.Header style={{ backgroundColor: "#019cd5" }}>
            <Modal.Title style={{ color: "#fff" }}>
                {operacion === 1
                    ? "Registrar Ministro."
                    : operacion === 2
                        ? "Editar Ministro."
                        : operacion === 3
                            ? "Eliminar Ministro."
                            : "Consultar Ministro"}
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

                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Cedula:
                    </label>
                    <select
                        value={values && values.nacionalidad}
                        name='nacionalidad'
                        className="form-select col-md-3"
                        aria-label="Default select example"
                        disabled={desabilitar}
                        onChange={onchange}
                    >
                        <option value="V">V</option>
                        <option value="E">E</option>
                    </select>
                    <input

                        value={values ? values.ced !== '' ? values.ced : '' : ''}
                        name='ced'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        onKeyUp={validarPastor}
                        onBlur={validarPastor}
                     
                        disabled={operacion === 1 ? false : operacion === 2 ? false : true}
                        onChange={onchange}

                    />
                </div>

                <div className="col-md-2"></div>
                <div className="input-group input-group-sm mb-2 col-md-2">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Sexo:
                    </label>
                    <select
                        value={values && values.sexo}
                        name='sexo'
                        className="form-select"
                        aria-label="Default select example"
                        disabled={desabilitar}
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
                        value={values ? values.fecha_nac !== '' ? moment(values.fecha_nac).format('YYYY-MM-DD') : '' : ''}
                        name='fecha_nac'
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        disabled={desabilitar}
                        onChange={onchange}
                    />
                </div>


                <div className="input-group input-group-sm mb-2 col-md-6">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Nombre:
                    </label>
                    <input

                        value={values ? values.nombre !== '' ? values.nombre : '' : ''}
                        name='nombre'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"

                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-6">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Apellido:
                    </label>
                    <input
                        value={values ? values.apellido !== '' ? values.apellido : '' : ''}
                        name='apellido'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"

                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-12">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Direccion:
                    </label>
                    <textarea

                        value={values ? values.direccion !== '' ? values.direccion : '' : ''}
                        name='direccion'
                        type="textarea"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        style={{ height: 40 }}
                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Telefono:
                    </label>
                    <input

                        value={values ? values.telefono !== '' ? values.telefono : '' : ''}
                        name='telefono'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"

                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>
                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Celular:
                    </label>
                    <input

                        value={values ? values.celular !== '' ? values.celular : '' : ''}
                        name='celular'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"

                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>
                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Estado Civil:
                    </label>
                    <select
                        value={values && values.estadocivil}
                        name='estadocivil'
                        className="form-select"
                        aria-label="Default select example"
                        disabled={desabilitar}
                        onChange={onchange}
                    >

                        <option value="0">Soltero</option>
                        <option value="1">Casado</option>
                        <option value="2">Viudo</option>
                        <option value="3">Casado</option>
                    </select>
                </div>

                <div className="input-group input-group-sm mb-2 col-md-8">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Correo Electronico:
                    </label>
                    <input

                        value={values ? values.correo !== '' ? values.correo : '' : ''}
                        name='correo'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"

                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Fecha de Baustizo:
                    </label>
                    <input
                        value={values ? values.fecha_baus !== '' ? moment(values.fecha_baus).format('YYYY-MM-DD') : '' : ''}
                        name='fecha_baus'
                        type="date"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        disabled={desabilitar}
                        onChange={onchange}
                    />
                </div>
                <div className="input-group input-group-sm mb-2 col-md-5">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Fecha Ingreso al Ministerio:
                    </label>
                    <input
                        value={values ? values.fechingresopastor !== '' ? moment(values.fechingresopastor).format('YYYY-MM-DD') : '' : ''}
                        name='fechingresopastor'
                        type="date"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        disabled={operacion === 1 ? false : operacion === 2 ? false : true}
                        onChange={onchange}
                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Tipo de Sangre:
                    </label>
                    <input

                        value={values ? values.tiposangre !== '' ? values.tiposangre : '' : ''}
                        name='tiposangre'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"

                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-3">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Status:
                    </label>
                    <select
                        value={values && values.status}
                        name='status'
                        className="form-select"
                        aria-label="Default select example"
                        disabled={desabilitar}
                        onChange={onchange}
                    >

                        <option value="1">ACTIVO</option>
                        <option value="0">INACTIVO</option>
                    </select>
                </div>
                <div className="input-group input-group-sm mb-2 col-md-5">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Fecha de Ordenamiento:
                    </label>
                    <input
                        value={values ? values.fechordenacion !== '' ? moment(values.fechordenacion).format('YYYY-MM-DD') : '' : ''}
                        name='fechordenacion'
                        type="date"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        disabled={operacion === 1 ? false : operacion === 2 ? false : true}
                        onChange={onchange}
                    />
                </div>
                <div className="input-group input-group-sm mb-2 col-md-7">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Nivel de Estudios:
                    </label>
                    <select
                        value={values && values.estudios}
                        name='estudios'
                        className="form-select col-md-3"
                        aria-label="Default select example"
                        disabled={operacion === 1 ? false : operacion === 2 ? false : true}
                        onChange={onchange}
                    >

                        <option value="0">Primaria</option>
                        <option value="1">Bachillerato</option>
                        <option value="2">Universitaria</option>
                        <option value="3">Teologicos</option>
                        <option value="4">Otro</option>
                    </select>
                    <input
                        value={values ? values.descripnestudio !== '' ? values.descripnestudio : '' : ''}
                        name='descripnestudio'
                        type="test"
                        className="form-control"
                        placeholder="Especifique"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        disabled={operacion === 1 ? false : operacion === 2 ? false : true}
                        onChange={onchange}
                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-6">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Profesion:
                    </label>
                    <textarea

                        value={values ? values.profesion !== '' ? values.profesion : '' : ''}
                        name='profesion'
                        type="textarea"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        style={{ height: 40 }}
                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-6">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Ocupación:
                    </label>
                    <textarea

                        value={values ? values.ocupacion !== '' ? values.ocupacion : '' : ''}
                        name='ocupacion'
                        type="textarea"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        style={{ height: 40 }}
                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Grado de Credencial:
                    </label>
                    <input

                        value={values ? values.gradocredencial !== '' ? values.gradocredencial : '' : ''}
                        name='gradocredencial'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"

                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">
                        Numero de Credencial:
                    </label>
                    <input

                        value={values ? values.numcredencial !== '' ? values.numcredencial : '' : ''}
                        name='numcredencial'
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"

                        disabled={desabilitar}
                        onChange={onchange}

                    />
                </div>

               





                <Mensaje mensaje={mensaje}
                    onHide={() => {
                        mensaje.titulo === 'Exito.' ?
                            cerrarModal() :
                            setMensaje({ mostrar: false, titulo: '', texto: '', icono: '' })
                    }
                    } />
            </div>

        </Modal.Body>
        <Modal.Footer>
            <button
                className="btn btn-sm btn-success rounded-pill col-md-2"
                disabled={props.operacion === 4 ? true : false}
                onClick={actualizarCreyente}
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
