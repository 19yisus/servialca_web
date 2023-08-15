import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth';
import moment from 'moment';

function Footers() {

  let op = require('../modulos/datos');

  const { user } = useContext(AuthContext);
  const [fechaSistema, setFechaSistema] = useState(localStorage.getItem('fechasistema'));
  const [usuario, setUsuario] = useState('');
  const [nomOrg, setNomOrg] = useState('');

  useEffect(() => {

    let obj = JSON.parse(localStorage.getItem('post'));
    setFechaSistema(obj.fechasistema);

    if (obj != null) {

      setUsuario(obj.login);
      setNomOrg(obj.nombreorg);

    } else {

      setUsuario('');
      setNomOrg('');

    }

  }, []);


  const footers = (user && (

    <footer className="container-fluid text-center amanecerfooter" id='gg'>
      <img src='imagenes/logo.png' style={{height:'30px', width: '40px'}} />
      <strong>Copyright &copy; {moment(fechaSistema).format('YYYY')} <a className='bluez-text' href="http://www.opensiap.com.ve" target="_blank">SYGRECA.</a>Todos los Derechos Reservados.</strong>
    </footer>
  )

  )

  return footers;

}

export default Footers