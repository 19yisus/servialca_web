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

export const GestionarPastorIglesia = (props) => {
    /*  variables de estados */

    let op = require("../../modulos/datos");
    let token = localStorage.getItem("jwtToken");

    const txtCedula = useRef();
    const txtNombre = useRef();
    const txtApellido = useRef();
    const txtDireccion = useRef();
    const txtCelular = useRef();


    /*********************************************** FUNCINES DE VALIDACION***********************************************************/
    /* 
      const handleCloseSi = () => {
        setMostrar1(false);
      };
    
      const handleCloseNo = () => {
        setMostrar1(false);
      }; */

    const salir = () => {
        props.onHideCancela();

    };


    const actualizarPastor = () =>{
        props.infopastor(txtCedula.current.value.trim(),txtNombre.current.value.trim(),txtApellido.current.value.trim(),txtCelular.current.value.trim(),txtDireccion.current.value.trim())
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
                txtCedula.current.value = props.cedula

            }}
        >
            <Modal.Header className="bg-primary">
                <Modal.Title style={{ color: "#fff" }}>
                    Registro de Pastor
                </Modal.Title>
                <button
                    /*  ref={btnCancela} */
                    className="btn"
                    style={{ border: 0, margin: 0, padding: 0, color: "#ffffff" }}
                    onClick={salir}
                >
                    <i className="far fa-window-close"></i>
                </button>
            </Modal.Header>
            <Modal.Body style={{ color: "rgb(106, 115, 123)" }}>
                <div className="container">
                    <div className="col-md-12 row mx-auto d-flex justify-content-between">
                        <div class="input-group input-group-sm mb-3 col-md-3">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Cedula</span>
                            <input type="text" ref={txtCedula} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                        </div>
                        <div className="col-md-6"></div><div class="input-group input-group-sm mb-3 col-md-3">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Celular:</span>
                            <input type="text" ref={txtCelular} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                        </div>
                        <div class="input-group input-group-sm mb-3 col-md-6">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Nombres:</span>
                            <input type="text" ref={txtNombre} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                        </div>
                        <div class="input-group input-group-sm mb-3 col-md-6">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Apellidos:</span>
                            <input type="text" ref={txtApellido} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                        </div>
                        <div class="input-group input-group-sm mb-3  col-md-12">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Direccion:</span>
                            <textarea ref={txtDireccion} class="form-control"  id="floatingTextarea"></textarea>
                        </div>
                      
                        
                       
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-sm btn-success rounded-pill col-md-2"
                    disabled={props.operacion === 4 ? true : false}
                onClick={actualizarPastor}
                >
                    <i className="fas fa-check-circle"> Aceptar</i>
                </button>
                <button
                    /* ref={btnCancela} */
                    onClick={salir}
                    className="btn btn-sm btn-danger rounded-pill col-md-2"
                >
                    <i className="fas fa-window-close"> Salir</i>
                </button>
            </Modal.Footer>
        </Modal>
    );
};
