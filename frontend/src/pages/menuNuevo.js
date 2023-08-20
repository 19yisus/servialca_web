import React, { useState, useEffect, useContext } from 'react';

import moment from 'moment';

function MenuNuevo() {

  let op = require('../modulos/datos');



  const [usuario, setUsuario] = useState('');
  const [nomOrg, setNomOrg] = useState('');

  useEffect(() => {


   

  }, []);




  return (
    <div className="container-fluid text-center amanecerfooter" id='gg'>
      <img src='imagenes/logo.png' style={{height:'30px', width: '40px'}} />
      <strong>Copyright &copy;  <a className='bluez-text' href="http://www.opensiap.com.ve" target="_blank">SYGRECA.</a>Todos los Derechos Reservados.</strong>
    </div>
  );

}

export default MenuNuevo