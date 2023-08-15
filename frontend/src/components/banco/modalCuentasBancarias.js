import React, { useRef, useState,useEffect } from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import axios from 'axios';
import {
    validaSoloNumero, formatMoneda, validaMonto, formatoMonto, validaNumeroTelefono, validaEmail
} from '../../util/varios';
import { Mensaje, MensajeSiNo } from '../mensajes';

export const GestionarCuentasBancarias = (props) => {

    let token = localStorage.getItem('jwtToken');
    let op = require('../../modulos/datos');
    const codigo = JSON.parse(localStorage.getItem('codigo'))
    const permiso = JSON.parse(localStorage.getItem('permiso'))
    let anio = JSON.parse(localStorage.getItem('anioactu'))
    let idorganizacion = JSON.parse(localStorage.getItem('idorganizacion'));
    const idusuario = JSON.parse(localStorage.getItem('idusuario'));
    const fechasistema = JSON.parse(localStorage.getItem('fechasistema'))
    let idefiscal = 1
    const fechaTope = moment(JSON.parse(localStorage.getItem('fechasistema'))).format('YYYY-MM-DD').replace(anio.toString(), (anio-18).toString());
    const deshabilitado = false;

    /*  variables de referencias */
    const btnCancela = useRef();
    const btnAcepta = useRef();
    const txtId = useRef();
    const txtDescripcion = useRef();
    const chkSi = useRef();
    const chkNo = useRef();
    const chkDepositos = useRef();
    const txtNombre = useRef();
    const txtNCuenta = useRef();
    const txtSucursal = useRef();
    const txtPersona = useRef();
    const txtTelefono = useRef();
    const txtPrepuesto = useRef();
    const txtDireccion = useRef();
    const txtSaldoCon = useRef(); 
    const txtSaldoLib = useRef();
    const txtConcepto = useRef();
    const txtPorcenDeb = useRef();
    const txtEmision = useRef();
 

    /*  variables de estados */
    const [mensaje, setMensaje] = useState({ mostrar: false, titulo: '', texto: '', icono: '' });
    const [mensajesino, setMensajesino] = useState({mostrar: false, titulo: '', texto: '', icono: ''});
    const [activate, setActivate] = useState(false);
    const [ bancos,setBancos] = useState()
    const [operacion, setOperacion] = useState(0);
    const [idBanco, setIdBanco] = useState()
    const [values, setValues] = useState({
        idcuentabancaria:'',
        nombre:'',
        cuentabancaria:'',
        sucursal:'',
        direccion:'',
        contacto:'',
        telefono:'',
        presupuesto:'',
        saldoconcil:'',
        saldolib:'',
        codctacont:'',
        tipo:'',
        concepto:'',
        debitobanc:'',
        porcentdebito:'',
        codctadebitobanc:'',
        idorganizacion:'',
        idefiscal:'',
        idbanco:'',
        caduca:'',
        idcuentacontable:'',
        depositoweb:'',
        activo:''
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

    console.log(idBanco)

    const onChange = (event) => {
        if (event.target.name === 'direccion' || event.target.name === 'sucursal' || event.target.name === 'contacto' || event.target.name === 'concepto') {
            event.target.value = event.target.value.toUpperCase();
            setValues({ ...values, [event.target.name]: event.target.value.toUpperCase() });
        }else{
            setValues({ ...values, [event.target.name]: event.target.value});
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


    /* idcuentabancaria:'',
    nombre:'',
    :'',
    sucursal:'',
    :'',
    :'',
    :'',
    presupuesto:'',
    saldoconcil:'',
    :'',
    codctacont:'',
    tipo:'',
    :'',
    debitobanc:'',
    :'',
    codctadebitobanc:'',
    idorganizacion:'',
    idefiscal:'',
    idbanco:'',
    caduca:'',
    idcuentacontable:'',
    depositoweb:'',
    activo:''
 */

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
          tab: "cuentas bancarias",
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
        let endpoint = `${op.conexion}/api/banco/actualizarcuentabancaria`;

        let body;

        body = {
            operacion:operacion,
            nid:values.idcuentabancaria !== '' ? parseInt(values.idcuentabancaria) : 0 ,
            nombanc:values.nombre,
            nrocuent:values.cuentabancaria.trim(),
            sucur:null,
            dir:null,
            cont:null,
            telf:null,
            presu:null,
            salconc:txtSaldoCon.current.value !== '' ? parseFloat(txtSaldoCon.current.value.replace(/\./g, '').replace(',', '.')) : '0.00' ,
            sallib:txtSaldoLib.current.value !== '' ? parseFloat(txtSaldoLib.current.value.replace(/\./g, '').replace(',', '.')) : '0.00' ,
            ctacont:null,
            tip:null,
            concep:null,
            impdeb:null,
            porc:null ,
            ctacontdeb:null,
            org:null,
            efis:null,
            idban:parseInt(idBanco),
            cadu:null,
            idcta:null,
            depweb:true,
            idctanota:null,
            idctatransfe:null,
            idigle:codigo,
            tipoagente:permiso.toString().trim()

        }
     
        axios.post(endpoint, body, {
            headers: {
                'x-access-token': `${token}`
            }
        }).then(function (response) {
            if (response.status === 200) {
                actualizar_bitacora(response.data[0].actualizar_cuentabancaria)
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
        idcuentabancaria:'',
        nombre:'',
        cuentabancaria:'',
        sucursal:'',
        direccion:'',
        contacto:'',
        telefono:'',
        presupuesto:'',
        saldoconcil:'',
        saldolib:'',
        codctacont:'',
        tipo:'',
        concepto:'',
        debitobanc:'',
        porcentdebito:'',
        codctadebitobanc:'',
        idorganizacion:'',
        idefiscal:'',
        idbanco:'',
        caduca:'',
        idcuentacontable:'',
        depositoweb:'',
        activo:''
       })
    }

    const seleccionarBancos = () => {
        let campos = "*";
        let nomtab = "bancos";
        let orden = "idbanco";
      
    
        let endpoint =
          op.conexion +
          `/api/comun/seleccionaregistros?campos=${campos}&nomtab=${nomtab}&orden=${orden}`;
    
        setActivate(true);
    
        axios
          .get(endpoint, {
            headers: {
              "x-access-token": `${token}`,
            },
          })
          .then(function (response) {
            if (response.status === 200) {
             
                setBancos(response.data);
    
            }
          
    
            setActivate(false);
          })
          .catch(function (error) {
            setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message, icono: 'error' });
            setActivate(false);
          });
      };

    const handleCloseSi = () => {
        setMensajesino({mostrar: false, titulo: '', texto: '', icono: ''});
         procesarRegistro();
    };

    const idbancio = (id) => (e) => {
        e.preventDefault()
        setIdBanco(id)
    }

    console.log(values)

    const cancelar = (e) => {
        e.preventDefault();
         blanquear();
        props.onHideCancela();

    }

    const onChangeValidar = () => {
        
        let sigue = true;
        

        if(txtNombre.current.value === '' || txtNCuenta.current.value === '' || txtNCuenta.current.value.length < 20  || txtSaldoCon.current.value === '' || txtSaldoLib.current.value === '' ){

            let mensaje = '';

           /*  {txtNombre.current.value === '' ? mensaje = 'el Nombre' : txtNCuenta.current.value === '' ? mensaje = 'la Cuenta' : txtSaldoCon.current.value === '' ? mensaje = 'el Saldo Conciliado' : txtSaldoLib.current.value === '' ? mensaje = 'Saldo en Libros' : ''}
 */
            setMensaje({ mostrar: true, titulo: 'Notificación', texto: txtNombre.current.value === '' ? 'Debe ingresar el Nombre de la Cuenta' : txtNCuenta.current.value === '' ? 'Debe ingresar el número de cuenta' : txtSaldoCon.current.value === '' ? 'Debe ingresar el Saldo Conciliado de la Cuenta' : txtSaldoLib.current.value === '' ? 'Debe ingresar Saldo en Libros de la Cuenta' : txtNCuenta.current.value.length < 20 ? 'Debe ingresar el número correctamente' :'' , icono: 'informacion' });

            {txtNombre.current.value === '' ? txtNombre.current.focus() : txtNCuenta.current.value === '' ? txtNCuenta.current.focus() :  txtNCuenta.current.value.length < 20 ? txtNCuenta.current.focus()  : txtSaldoCon.current.value === '' ? txtSaldoCon.current.focus() : txtSaldoLib.current.value === '' ? txtSaldoLib.current.focus() :  btnAcepta.current.focus()}
               
            sigue = false;

        } else if(sigue){

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

    const cerrarModal = () => {
        props.onHideRenderizar();
        props.onHideCancela();
        blanquear();
        setMensaje({ mostrar: false, titulo: '', texto: '', icono: '' });
    }

    useEffect(() => {
        seleccionarBancos()
      }, []);
   

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
                    setIdBanco(props.bancos.idbanco)
                

                  
                    setValues(props.bancos)
                }        
            }}

        >
            <Modal.Header className='azulGradiant2 header-modal'>
                <Modal.Title style={{ color: "#fff" }}>{props.operacion === 1 ? 'Agregar Cuenta Bancaria.' : props.operacion === 2 ? 'Editar Cuenta Bancaria.' : props.operacion === 3 ? 'Eliminar Cuenta Bancaria.' : 'Consultar Cuenta Bancaria.'}</Modal.Title>
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
                    <input type="text" name='idcuentabancaria' className="form-control bg-light" ref={txtId} style={styleInput} defaultValue={values.idcuentabancaria} disabled aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                </div>


                <div className="input-group input-group-sm mb-2 col-sm-8">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Nombre del Banco:</label>
                    <select disabled={operacion === 1 || operacion === 2 ? false : true}  ref={txtNombre} className="form-select form-select-sm" name='nombre' id="inputStatus" onChange={onChange} value={values && values.nombre.trim()} style={styleInput}>
                        <option value="">Seleccione</option>
                        {bancos && bancos.map((item, index) => (
                            <option key={index} value={item.nombre.trim()} onClick={idbancio(item.idbanco)}> {item.nombre} </option>
                        ))}
                    </select>
                </div>

                <div className="input-group input-group-sm mb-2 col-md-12">
                    <label className="input-group-text" id="inputGroup-sizing-sm">N° de Cuenta:</label>
                    <input maxLength={20} type="text" name='cuentabancaria' className="form-control bg-light" style={styleInput} ref={txtNCuenta}  defaultValue={values.cuentabancaria !== null || values.cuentabancaria !== '' ? values.cuentabancaria.trim() : ''} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange} onKeyUp={handleInputNumChange}  onBlur={handleInputNumChange}/>
                </div>

              {/*   <div className="input-group input-group-sm mb-2 col-md-3">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Sucursal:</label>
                    <input type="text" name='sucursal' ref={txtSucursal} className="form-control bg-light" style={styleInput}  defaultValue={values.sucursal !== null || values.sucursal !== '' ? values.sucursal.trim() : ''}  disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange} />
                </div> */}

                

              {/*   <div className="input-group input-group-sm mb-2 col-md-6">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Persona de Contacto:</label>
                    <input type="text" name='contacto' className="form-control bg-light" style={styleInput} ref={txtPersona} defaultValue={values.contacto !== null || values.contacto !== '' ? values.contacto.trim() : ''}  disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange}/>
                </div> */}

              {/*   <div className="input-group input-group-sm mb-2 col-md-3">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Telefono:</label>
                    <input type="text" name='telefono' className="form-control bg-light" style={styleInput} ref={txtTelefono} defaultValue={values.telefono !== null || values.telefono !== '' ?  values.telefono.trim() : ''} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange} onKeyUp={handleInputNumChange} onBlur={handleInputNumChange}/>
                </div> */}

              {/*   <div className="input-group input-group-sm mb-2 col-sm-3">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Presupuesto:</label>
                    <select disabled={operacion === 1 || operacion === 2 ? false : true} ref={txtPrepuesto} className="form-select form-select-sm" id="inputStatus" name='presupuesto' onChange={onChange}  value={values && values.presupuesto.trim()}  style={styleInput}>
                        <option value="">Seleccione</option>
                        <option value="Si">Si</option>
                        <option value="No">No</option>
                    </select>
                </div> */}

                
               {/*  <div className="input-group input-group-sm col-md-12 mt-2 mb-2">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Direccion:</label>
                    <textarea type="area" className="form-control rounded bg-light" ref={txtDireccion} disabled={operacion === 1 || operacion === 2 ? false : true} style={styleInputDirec} defaultValue={values.direccion !== null || values.direccion !== '' ? values.direccion.trim() : ''} aria-label="With textarea" name='direccion' onChange={onChange}></textarea>
                </div> */}

           {/* 
                <div className='col-md-6' style={{visibi}}>
                    <fieldset className=' row col-sm-12 mx-auto border-azul rounded'>
                        <legend className="float-none w-auto" style={{ fontSize: '12px' }}>Codigo Cuenta Contable</legend>
                        <div className="input-group input-group-sm">
                            <input type="text"  className="form-control bg-light col-md-2 mx-1 rounded" style={styleInput} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                            <button type="button" className="btn btn-sm btn-success rounded"><i className="fas fa-search"></i></button>
                            <input type="text"  className="form-control bg-light mx-1 rounded" style={styleInput} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                        </div>     
                    </fieldset>
                </div> */}

                <div className="input-group input-group-sm mb-2 col-md-6">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Saldo Conciliado:</label>
                    <input type="text"  className="form-control bg-light text-right" name='saldoconcil' ref={txtSaldoCon} style={styleInput}  defaultValue={values.saldoconcil !== null || values.saldoconcil !== '' ? formatMoneda(values.saldoconcil.replace(',', '').replace('.', ','), ',', '.', 2) : "0,00"} disabled={operacion === 1 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange} onKeyUp={handleInputMontoChange} onBlur={handleInputMontoChange} />
                 <label className="input-group-text" id="inputGroup-sizing-sm">Bs.</label>
                </div>

                <div className="input-group input-group-sm mb-2 col-md-6">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Saldo en Libros:</label>
                    <input type="text"  className="form-control bg-light text-right" name='saldolib' ref={txtSaldoLib} style={styleInput}  defaultValue={values.saldolib !== null || values.saldolib !== '' ? formatMoneda(values.saldolib.replace(',', '').replace('.', ','), ',', '.', 2) : "0,00"} disabled={operacion === 1 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange} onKeyUp={handleInputMontoChange}  onBlur={handleInputMontoChange} />
                 <label className="input-group-text" id="inputGroup-sizing-sm">Bs.</label>
                </div>

               {/*  <div className="input-group input-group-sm mb-2 col-md-6">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Concepto:</label>
                    <input type="text"  className="form-control bg-light" name='concepto' ref={txtConcepto} style={styleInput} defaultValue={values.concepto !== null || values.concepto !== '' ? values.concepto.trim() : ''} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange} />
                </div>
                <div className="input-group input-group-sm mb-2 col-md-5">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Porcentaje Débito Bancario:</label>
                    <input type="text"  className="form-control bg-light text-right" style={styleInput} name='porcentdebito' ref={txtPorcenDeb} defaultValue={values.porcentdebito !== null || values.porcentdebito !== '' ?   formatMoneda(values.porcentdebito.replace(',', '').replace('.', ','), ',', '.', 2) : "0,00"}  disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange} onKeyUp={handleInputMontoChange} onBlur={handleInputMontoChange}/>
                    <label className="input-group-text">%</label> 
                </div> */}
                <div className='col-md-2'></div>
              {/*   <div className=" col-md-5 row rounded">
                    <label className="col-md-9 mt-2" >Impuesto del Débito Bancario:</label>
                    
                    <div className="form-check form-check-inline col">
                        <input className="form-check-input" type="radio" name="debitobanc" disabled={operacion === 1 || operacion === 2 ? false : true} id="flexRadioDefault1" value="true" ref={chkSi} onChange={onChange}/>
                        <label className="form-check-label" for="flexRadioDefault1">
                            Si
                        </label>
                    </div>

                    <div className="form-check form-check-inline col">
                        <input className="form-check-input" type="radio" name="debitobanc" disabled={operacion === 1 || operacion === 2 ? false : true} id="flexRadioDefault1" value="false" ref={chkNo} onChange={onChange}/>
                        <label className="form-check-label" for="flexRadioDefault1">
                            No
                        </label>
                    </div>

                </div>
               

                <div className="input-group input-group-sm mb-2 col-md-5">
                    <label className="input-group-text" id="inputGroup-sizing-sm">Emisión de Cheque Caduca a los:</label>
                    <input type="text"  className="form-control bg-light text-right" name='caduca'   style={styleInput}  defaultValue={values.caduca !== null || values.caduca !== '' ? values.caduca : ''} ref={txtEmision} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" onChange={onChange} onKeyUp={handleInputNumChange}  onBlur={handleInputNumChange}/>
                    <label className="input-group-text">Dias</label>
                </div> */}
              {/*   <div className='col-md-4'></div>
                <div className="form-check col-md-3">
                    <input className="form-check-input" ref={chkDepositos} type="checkbox" id="flexCheckDefault" disabled={operacion === 1 || operacion === 2 ? false : true} onChange={onChange} defaultChecked={values.depositoweb !== null || values.depositoweb !== '' ? values.depositoweb : ''} />
                    <label className="form-check-label" for="flexCheckDefault">Cuenta de Ingreso</label>
                </div> */}
{/* 
                <div className='col-md-6 mb-2'>
                    <fieldset className=' row col-sm-12 mx-auto border-azul rounded mb-2'>
                        <legend className="float-none w-auto" style={{ fontSize: '12px' }}>Cuenta Contable Nota de Credito</legend>
                        <div className="input-group input-group-sm">
                            <input type="text"  className="form-control bg-light col-md-2 mx-1 rounded" ref={txtId} style={styleInput} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                            <button type="button" className="btn btn-sm btn-success rounded"><i className="fas fa-search"></i></button>
                            <input type="text"  className="form-control bg-light mx-1 rounded" ref={txtId} style={styleInput}disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                        </div>     
                    </fieldset>
                </div>

                <div className='col-md-6 mb-2'>
                    <fieldset className=' row col-sm-12 mx-auto border-azul rounded mb-2'>
                        <legend className="float-none w-auto" style={{ fontSize: '12px' }}>Cuenta Contable Transferencias Bancarias</legend>
                        <div className="input-group input-group-sm">
                            <input type="text"  className="form-control bg-light col-md-2 mx-1 rounded" ref={txtId} style={styleInput} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                            <button type="button" className="btn btn-sm btn-success rounded"><i className="fas fa-search"></i></button>
                            <input type="text"  className="form-control bg-light mx-1 rounded" ref={txtId} style={styleInput} disabled={operacion === 1 || operacion === 2 ? false : true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                        </div>     
                    </fieldset>
                </div> */}



           
                
                    
                </div>
            </Modal.Body >
            <Modal.Footer>
                <button ref={btnAcepta} disabled={operacion === 4 ? true : false} onClick={onChangeValidar} className="btn btn-sm rounded-pill btn-success"><i className="fas fa-check-circle">  Aceptar</i></button>
                <button ref={btnCancela} onClick={cancelar} className="btn btn-danger btn-sm rounded-pill"><i className="fas fa-window-close"> Cancelar</i></button>
            </Modal.Footer>
        </Modal >
    );
}

