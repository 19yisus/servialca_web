import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { Link } from 'react-router-dom';
import moment from 'moment';

function Header2(props) {

    const { user, logout } = useContext(AuthContext);
    const [fechaSistema, setFechaSistema] = useState(JSON.parse(localStorage.getItem('fechasistema')));
    const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('login')));

    let el;
    function menuclick() {
        props.onCambiar('inicio')
        if (el = document.getElementById("wrapper")) {
            el.classList.toggle("toggled");
        }
    }

    const header = (user && (
        <nav className="col-md-12 navbar navbar-expand-lg navbar-light azulGradiant py-2 px-2 d-flex justify-content-between" id='one'>
            <div className="mx-2 d-none d-xl-block">
                <Link to="/inicio">
                    <button onClick={menuclick} className='btn btn-xs btn-danger p-2 rounded-pill' style={{ fontWeight: 'bold' }}><i className="far fa-arrow-alt-circle-left"> Volver</i></button>
                </Link>
            </div>

            <div className="col-1 d-block d-xl-none">
                <Link to="/inicio">
                    <button onClick={menuclick} className='btn btn-xs btn-danger p-2 rounded-pill' style={{ fontWeight: 'bold' }}><i className="far fa-arrow-alt-circle-left"> Volver</i></button>
                </Link>
            </div>

            <div className='col d-none d-xl-block '>
                <label className='titulo-header'>{props.titulo}</label>
            </div>
            <div className='col-4 d-flex justify-content-end '>
                <label className='text-light fw-bold d-none d-xl-block'><i className="fas fa-calendar-alt me-2" />{moment(fechaSistema).format('L')}</label >
                <label className='text-light fw-bold mx-4 d-none d-xl-block'>   <i className="fas fa-user me-2" />{usuario}</label >
            </div>

            <div className='d-flex justify-content-center d-block d-xl-none '>
                <label className='text-light fw-bold'><i className="fas fa-calendar-alt me-2" />{moment(fechaSistema).format('L')}</label >
                <label className='text-light fw-bold mx-4 '>   <i className="fas fa-user me-2" />{usuario}</label >
            </div>

        </nav>
    )

    )

    return header;

}

export default Header2;