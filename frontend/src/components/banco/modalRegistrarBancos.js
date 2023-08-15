import React, { useRef, useState } from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import axios from 'axios';
import {
    validaSoloNumero, formatMoneda, validaMonto, formatoMonto, validaNumeroTelefono, validaEmail
} from '../../util/varios';
import { Mensaje, MensajeSiNo } from '../mensajes';

export const GestionarBancos = (props) => {

    let token = localStorage.getItem('jwtToken');
    let op = require('../../modulos/datos');
    let anio = JSON.parse(localStorage.getItem('anioactu'))
    const codigo = JSON.parse(localStorage.getItem('codigo'))
    const idusuario = JSON.parse(localStorage.getItem('idusuario'))
    const fechaTope = moment(JSON.parse(localStorage.getItem('fechasistema'))).format('YYYY-MM-DD').replace(anio.toString(), (anio-18).toString());
    const fechasistema = JSON.parse(localStorage.getItem('fechasistema'))
    const deshabilitado = false;

    /*  variables de referencias */
    const btnCancela = useRef();
    const btnAcepta = useRef();
    const txtId = useRef();
    const txtDescripcion = useRef();
 

    /*  variables de estados */
    const [mensaje, setMensaje] = useState({ mostrar: false, titulo: '', texto: '', icono: '' });
    const [mensajesino, setMensajesino] = useState({mostrar: false, titulo: '', texto: '', icono: ''});
    const [activate, setActivate] = useState(false);
    const [operacion, setOperacion] = useState(0);
    const [values, setValues] = useState({
        idbanco:'',
        nombre:''
    });

    const styleInput = {
        backgroundColor: '#ffff',
        color: '#444242'
    }

    const styleInputDirec = {
        backgroundColor: '#ffff',
        color: '#444242',
        height: 50,

    }

    const onChange = (event) => {
        if (event.target.name === 'rif' || event.target.name === 'nombre' || event.target.name === 'direccionage' || event.target.name === 'email' || event.target.name === 'nombrerespo' || event.target.name === 'aperespo' || event.target.name === 'propiEmail' || event.target.name === 'licencia' || event.target.name === 'resolucion') {
            event.target.value = event.target.value.toUpperCase();
            setValues({ ...values, [event.target.name]: event.target.value.toUpperCase() });
        }
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

    const handleInputMontoChange = (event) => {
        validaMonto(event);
        if (event.which === 13 || typeof (event.which) === 'undefined') {
            if (event.target.value === '' || parseFloat(event.target.value.trim().replace(".", "").replace(",", ".")) === 0.00) {
                event.target.value = '0,00'
            }
            event.target.value = (formatoMonto(event.target.value));
            let char1 = event.target.value.substring(0, 1);
            let char2 = event.target.value.substring(1, 2);
            if (char1 === '0' && char2 !== ',') {
                event.target.value = event.target.value.substring(1, event.target.value.legth);
            }
        } else if (event.which === 46) {
            return false;
        } else if (event.which >= 48 && event.which <= 57) {
            return true;
        } else if (event.which === 8 || event.which === 0 || event.which === 44) {
            return true;
        } else return false;
    };

    const onChangeValidar = () => {
        
        let sigue = true;
    

     
            if(txtDescripcion.current.value === ''){

                setMensaje({ mostrar: true, titulo: 'Notificación', texto: 'Debe Ingresar la Descripcion del Banco.', icono: 'informacion' });
    
                sigue = false;
    
                txtDescripcion.current.focus();
    
            } 
     
            else if(sigue){

                let msg = '';
                
                if (operacion === 1) {
                    msg = 'Esta Seguro de Registrar estos Datos.';
                } else if (operacion === 2) {
                    msg = 'Esta Seguro de Modificar estos Datos.';
                } else if (operacion === 3) {
                    msg = 'Esta Seguro de Eliminar estos Datos.';
                }
                setMensajesino({ mostrar: true, titulo: 'Confirmación.', texto: msg, icono: 'confirmacion' });

 
            }

        
    }



const actualizar_bitacora = (id) => {
    let endpoint = `${op.conexion}/api/comun/bitacora`;
    let des =
      operacion === 1
        ? "REGISTRO"
        : operacion === 2
        ? "MODIFICACIÓN"
        : "ELIMINAR";
    let body = {
      descrip: des,
      idreg: id,
      tab: "bancos",
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

     const procesarRegistro = () => {

            setActivate(true);
        let endpoint = `${op.conexion}/api/banco/actualizarbanco`;
        let body;

        body = {
            operacion:operacion,
            nid:values.idbanco !== '' ? values.idbanco : 0,
            nom: values.nombre !== '' ?  values.nombre.trim() : ''
        }
      
        axios.post(endpoint, body, {
            headers: {
                'x-access-token': `${token}`
            }
        }).then(function (response) {
            if (response.status === 200) {
                actualizar_bitacora(response.data[0].bancos_act)
                if (props.operacion === 1) {
                    setMensaje({ mostrar: true, titulo: 'Exito.', texto: 'registro creado correctamente', icono: 'exito' });
                } else if (props.operacion === 2) {
                    setMensaje({ mostrar: true, titulo: 'Exito.', texto: 'registro modificado correctamente', icono: 'exito' });
                } else if (props.operacion === 3) {
                    setMensaje({ mostrar: true, titulo: 'Exito.', texto: 'registro eliminado correctamente', icono: 'exito' });
                }
                setActivate(false);
            }
        }).catch(function (error) {
            let mensaje = '';
            if (error.response === undefined) {
                mensaje = 'Error de Conexion'
            } else {
                if (error.response.data.message === 'duplicate key value violates unique constraint "agente_rif_key"') {
                    mensaje = 'Ya existe un Registro con este rif'

                } else if (error.response.data.message === 'duplicate key value violates unique constraint "agente_email_key"') {
                    mensaje = 'Ya existe un Registro con este correo'
                }
                else {
                    mensaje = error.response.data.message
                }
            }
            setMensaje({ mostrar: true, titulo: 'Error', texto: mensaje, icono: 'error' });
            setActivate(false);
        })

    } 

    const blanquear = () => {
       setValues({
        idbanco:'',
        nombre:''
       })
    }

    const handleCloseSi = () => {
        setMensajesino({mostrar: false, titulo: '', texto: '', icono: ''});
        procesarRegistro();
    };

    const cancelar = (e) => {
        e.preventDefault();
         blanquear();
        props.onHideCancela();

    }

    const cerrarModal = () => {
        props.onHideRenderizar();
        props.onHideCancela();
        blanquear();
        setMensaje({ mostrar: false, titulo: '', texto: '', icono: '' });
    }

   

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            onShow={() => {
                setOperacion(props.operacion)
                if(props.operacion !== 1){
                    setValues(props.bancos)
                }          
            }}

        >
            <Modal.Header /* className='azulGradiant2 header-modal' */ className='bg-primary'>
                <Modal.Title style={{ color: "#fff" }}>{props.operacion === 1 ? 'Agregar Banco.' : props.operacion === 2 ? 'Editar Banco.' : props.operacion === 3 ? 'Eliminar Banco.' : 'Consultar Banco.'}</Modal.Title>
                <button ref={btnCancela} className="btn" style={{ border: 0, margin: 0, padding: 0, color: "#ffffff" }} onClick={cancelar}>
                    <i className="far fa-window-close"></i>
                </button>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#FFF" }}>
               
                <Mensaje mensaje={mensaje}
                    onHide={() => {
                        mensaje.titulo === 'Exito.' ?
                            cerrarModal() :
                            setMensaje({ mostrar: false, titulo: '', texto: '', icono: '' })
                    }
                    } />
                <MensajeSiNo mensaje={mensajesino}
                    onHideNo={() => setMensajesino({ mostrar: false, titulo: '', texto: '', icono: ''})} onHideSi={handleCloseSi} />
                <Dimmer active={activate} inverted>
                    <Loader inverted>cargando...</Loader>
                </Dimmer>
                <div className='row mx-auto'>

                <div className="input-group input-group-sm mb-2 col-md-4">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Codigo:</label>
                    <input type="text"  className="form-control bg-light" ref={txtId} style={styleInput} defaultValue={values.idbanco} disabled aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>

                <div className="input-group input-group-sm mb-2 col-md-12">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Descripción:</label>
                    <textarea type="area" className="form-control rounded bg-light" ref={txtDescripcion} disabled={operacion === 1 || operacion === 2 ? false : true} style={styleInputDirec} defaultValue={values.nombre !== null ? values.nombre.trim() : ''} aria-label="With textarea" name='nombre' onChange={onChange}></textarea>
                </div>
                    
                </div>
            </Modal.Body >
            <Modal.Footer>
                <button ref={btnAcepta} disabled={operacion === 4 ? true : false} onClick={onChangeValidar} className="btn btn-sm rounded-pill btn-success"><i className="fas fa-check-circle">  Aceptar</i></button>
                <button ref={btnCancela} onClick={cancelar} className="btn btn-danger btn-sm rounded-pill"><i className="fas fa-window-close"> Cancelar</i></button>
            </Modal.Footer>
        </Modal >
    );
}

