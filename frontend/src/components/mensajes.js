import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Captcha } from '../util/varios'

export function Mensaje2(props) {
    const btnAceptar = useRef();

    return (

        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            onShow={() => { btnAceptar.current.focus(); }}
        >
            <Modal.Header style={{ backgroundColor: "#007bff", color: "#fff" }}>
                <Modal.Title><i>{props.titulo}</i></Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <p style={{ textAlign: 'center', fontFamily: 'initial' }}>{props.mensaje}</p>
            </Modal.Body>
            <Modal.Footer >
                <Button ref={btnAceptar} style={{ width: 80 }} onClick={props.onHide}><i className="fa">Aceptar</i></Button>
            </Modal.Footer>
        </Modal>
    );
}

export function Mensaje(props) {
    const btnAceptar = useRef();
    const [icono, setIcono] = useState('');

    function icon(icono) {
        
        switch (icono) {
            case 'exito':
                setIcono(<i className='fas fa-check-double fa-5x text-center text-success'></i>);
                break;
            case 'error':
                setIcono(<i className='fas fa-exclamation-triangle fa-5x text-center text-danger'></i>);
                break;
            case 'informacion':
                setIcono(<i className='fas fa-exclamation fa-5x text-center text-info'></i>);
                break;
            default:
                break;
        }

    }
    return (

        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            animation={false}
            keyboard={false}
            show={props.mensaje.mostrar}
            onShow={() => { icon(props.mensaje.icono); btnAceptar.current.focus(); }}
        >
            <Modal.Body style={{ backgroundColor: "#ffffff" }} >
                <div className='row col-12'>
                    <div className='col-12 p-2'>
                        <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: "#595959", fontFamily: 'Lato,Arial,Helvetica,sans-serif' }}>{props.mensaje.titulo}</h2>
                    </div>
                    <div className='col-12 p-2 text-center'>
                        {icono}
                    </div>
                    <div className='col-12 p-2'>
                        <p style={{ textAlign: 'center', fontFamily: 'Lato,Arial,Helvetica,sans-serif' }}>{props.mensaje.texto}</p>
                    </div>
                    <div className='col-12 p-2'>
                        <button className='btn btn-sm rounded-pill btn-primary col-3' style={{ marginLeft: '38%' }} ref={btnAceptar} onClick={props.onHide}>Aceptar</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export const MensajeSiNo = (props) => {
    const btnSi = useRef();
    const btnNo = useRef();
    const [icono, setIcono] = useState('');

    function icon(icono) {
        
        switch (icono) {
            case 'exito':
                setIcono(<i className='fas fa-check-double fa-5x text-center text-success'></i>);
                break;
            case 'error':
                setIcono(<i className='fas fa-exclamation-triangle fa-5x text-center text-danger'></i>);
                break;
            case 'informacion':
                setIcono(<i className='fas fa-exclamation fa-5x text-center text-info'></i>);
                break;
                case 'confirmacion':
                    setIcono(<i className='fas fa-question fa-5x text-center text-warning'></i>);
                    break;
            default:
                break;
        }

    }
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            animation={false}
            keyboard={false}
            show={props.mensaje.mostrar}
            onShow={() => { icon(props.mensaje.icono); btnSi.current.focus(); }}
        >
            <Modal.Body style={{ backgroundColor: "#ffffff" }} >
                <div className='row col-12 mx-auto'>
                    <div className='col-12 p-2'>
                        <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: "#595959", fontFamily: 'Lato,Arial,Helvetica,sans-serif' }}>{props.mensaje.titulo}</h2>
                    </div>
                    <div className='col-12 p-2 text-center'>
                        {icono}
                    </div>
                    <div className='col-12 p-2'>
                        <p style={{ textAlign: 'center', fontFamily: 'Lato,Arial,Helvetica,sans-serif' }}>{props.mensaje.texto}</p>
                    </div>
                    <div className='row col-12 p-2 d-flex justify-content-center mx-auto'>
                        <button className='btn btn-sm rounded-pill btn-success col-5 mx-2' ref={btnSi} onClick={props.onHideSi}>Si</button>
                        <button className='btn btn-sm rounded-pill btn-danger col-5 mx-2' ref={btnNo} onClick={props.onHideNo}>No</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export const MensajeSiNo2 = (props) => {
    const btnSi = useRef();
    const btnNo = useRef();
    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            onShow={() => { btnSi.current.focus() }}
        >
            <Modal.Header style={{ backgroundColor: "#007bff", color: "#fff" }}>
                <Modal.Title><i>{props.titulo}</i></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ textAlign: 'center', fontFamily: 'initial' }}>{props.mensaje}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button ref={btnSi} style={{ width: 80 }} onClick={props.onHideSi} variant="primary" ><i className="fa">Si</i></Button>
                <Button ref={btnNo} style={{ width: 80 }} onClick={props.onHideNo} variant="secondary"><i className="fa">No</i></Button>
            </Modal.Footer>
        </Modal>
    );
}

export const MensajeCapcha = (props) => {
    const btnCancela = useRef();
    const btnAcepta = useRef();
    const txtValor = useRef();

    const handleInputChange = (event) => {

        if (event.which === 13) {
            if (event.target.value.trim() === '') {
                txtValor.current.focus();
            } else {
                btnAcepta.current.focus();
            }


        } else if (event.which === 46) {
            return false;
        } else if (event.which >= 48 && event.which <= 57) {
            return true;
        } else if (event.which === 8 || event.which === 0 || event.which === 44) {
            return true;
        } else return false;//alert(e.which);
    }
    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            onShow={() => { Captcha(); txtValor.current.focus() }}
        >
            <Modal.Header>
                <Modal.Title><i>Confirmación</i></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h4>Imagen de Seguridad:</h4>
                    <h4>Introduzca el Código de la Imagen:</h4>
                    <table>
                        <tbody><tr>
                            <td>
                                <canvas id="captcha">
                                </canvas></td>
                        </tr>
                            <tr>
                                <td>
                                    <input ref={txtValor} autoFocus type="text" className="input-group" id="txtInput" onKeyUp={handleInputChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="button" id="refresh" className="btn btn-success" defaultValue="actualizar" onClick={Captcha} />
                                </td>
                            </tr>
                        </tbody></table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button ref={btnAcepta} onClick={props.onHideAcepta} className="btn btn-primary col-md-2"><i className="fa">  Aceptar</i></button>
                <button ref={btnCancela} onClick={props.onHideCancela} className="btn btn-danger col-md-2"><i className="fa"> Cancelar</i></button>
            </Modal.Footer>
        </Modal>
    );
}