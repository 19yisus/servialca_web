import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Captcha } from '../util/varios'



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
            onShow={() => { 
              
                icon(props.mensaje.icono); btnSi.current.focus(); 
            }}
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
