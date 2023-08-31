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

export const ModalTransporte = (props) => {
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
    const txtDescripcion = useRef();



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
            
        });
    };



    const actualizarCertificado = async () => {
        let endpoint;
        let bodyF = new FormData()
    
        setActivate(true)

        console.log( values.claseVehiculo_id)

        if(operacion === 1){
            endpoint = op.conexion + "/claseVehiculo/registrar";
            bodyF.append("Nombre", txtDescripcion.current.value)
          } else if(operacion === 2){
            endpoint = op.conexion + "/claseVehiculo/actualizar";
            bodyF.append("Nombre", txtDescripcion.current.value)
            bodyF.append("ID", values.claseVehiculo_id)
          } else {
            endpoint = op.conexion + "/claseVehiculo/eliminar";
            bodyF.append("Nombre", txtDescripcion.current.value)
            bodyF.append("ID", values.claseVehiculo_id)
      
          }


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
                    texto: "Operacion Exitosa",
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
        txtDescripcion.current.value = apellido;
        txtNombre.current.value = nombre;
        setMostrar(false);

    }

    const cerrarModal = () => {
        setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
        props.render()
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


    const selecionarClase = async (id) => {
        let endpoint = op.conexion + "/claseVehiculo/ConsultarUno?ID="+id;
        console.log(endpoint)
        setActivate(true)
    
    
    
        //setLoading(false);
    
        let bodyF = new FormData()
    
       // bodyF.append("Nombre", txtDescripcion.current.value)
    
        await fetch(endpoint, {
          method: "POST",
          body: bodyF
        }).then(res => res.json())
          .then(response => {
    
    
            setActivate(false)
            console.log(response)
    
           txtDescripcion.current.value = response.clase_nombre;
           setValues(response);
    
    
    
          })
          .catch(error =>
            setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
          )
    
      };

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
                    selecionarClase(props.idClase)
                    
                  }
            }}
        >
            <Modal.Header className="bg-danger">
                <Modal.Title style={{ color: "#fff" }}>
                    {operacion === 1 ? 'Registrar clase de vehiculo' : operacion === 2 ? 'Editar clase de vehiculo' : 'Eliminar clase de vehiculo'}
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


                    <div class="input-group input-group-sm mb-3 col-md-12">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Nombre:</span>
                        <textarea type="textarea" disabled={operacion === 1 ? false : operacion === 2 ? false : true} style={{ height: 40 }} class="form-control" ref={txtDescripcion} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                    </div>



                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-sm btn-success rounded-pill "
                    disabled={props.operacion === 4 ? true : false}
                    onClick={onChangeValidar}
                >
                    <i className="fas fa-check-circle"> Aceptar</i>
                </button>
                <button
                    ref={btnCancela}
                    onClick={salir}
                    className="btn btn-sm btn-danger rounded-pill "
                >
                    <i className="fas fa-window-close"> Salir</i>
                </button>
            </Modal.Footer>
        </Modal>
    );
};
