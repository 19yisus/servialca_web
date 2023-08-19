import React, { useState, useEffect, useRef } from 'react';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import { Loader, Dimmer } from 'semantic-ui-react';
import axios from 'axios';
import {  Torta } from '../graficos/graficos';
/* import CartasAgentes from './cartasAgentes'; */
import { Mensaje, MensajeSiNo } from '../../components/mensajes';
/* import { GestionarExpendedor } from './modalExpendedor'; */
import useTable from "../../components/useTable";
import { formatMoneda } from '../../util/varios';
import { GestionarCuentasBancarias } from './modalCuentasBancarias';


const TablaCuentasBancarias = (props) => {

  var op = require('../../modulos/datos');
  let token = localStorage.getItem('jwtToken');
  const codigo = JSON.parse(localStorage.getItem('codigo'))
  const permiso = JSON.parse(localStorage.getItem('permiso'))
  const acccuentas ='1111';
  const opercuentas = JSON.parse(localStorage.getItem('opercuentas'))

  let municipios = [];

  const headCells = [
     { id: 'codigo', backgroundColor: 'rgba(5, 81, 130, 1)', color: '#ffffff', label: 'COD.', textAlign: 'center' }, 
    { id: 'descripcion', backgroundColor: 'rgba(5, 81, 130, 1)', color: '#ffffff', label: 'DESCRIPCIÓN', textAlign: 'center' },
    { id: 'estado', backgroundColor: 'rgba(5, 81, 130, 1)', color: '#ffffff', label: 'NUMERO DE CUENTA', textAlign: 'center' },
    { id: 'opciones', backgroundColor: 'rgba(5, 81, 130, 1)', color: '#ffffff', label: ' OPCIONES', textAlign: 'center' }
  ]

  const colores = [
    '#17a2b8',
    '#ffae00',
    '#dc3545',
    '#BDB76B',
    '#7B68EE',
    '#4B0082',
    '#00ffff',
    '#0080ff',
    '#0000ff',
    '#8000ff',
    '#ff00ff',
    '#ff0080',
  ];

  const [mensaje, setMensaje] = useState({ mostrar: false, titulo: '', texto: '', icono: '' });
  const [mensajesino, setMensajesino] = useState({ mostrar: false, titulo: '', texto: '', icono: '' });
  const txtBuscador = useRef();
  const [mostrar2, setMostrar2] = useState(false);
  const [activate, setActivate] = useState(false);
  const [records, setRecords] = useState([]);
  const [expendedor, setExpendedor] = useState([]);
  const [operacion, setOperacion] = useState(1);
  const [persona, setPersona] = useState()
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [ciudades, setCiudades] = useState()
  const [credito, setCredito] = useState();
  const [total, setTotal] = useState(0);
  const [activos, setActivos] = useState(0);
  const [inactivos, setInactivos] = useState(0);
  const [municipiosEx, setMunicipiosEx] = useState([]);
  const [municipiosData, setMunicipiosData] = useState([]);
  const [datos, setDatos] = useState([]);
  const [bancos,setBancos] = useState();
  const [toast, setToast] = useState({
    mostrar:false,
    mensaje:'',
    titulo:''
  })
  const [cuentaContable,setCuentaContable] = useState();
  let idorganzacion = JSON.parse(localStorage.getItem('idorganizacion'));
  let idefiscal = JSON.parse(localStorage.getItem('idefiscal'))

  const {
    TblContainer,
    TblHead,
    recordsAfterPagingAndSorting,
    TblPagination
  } = useTable(records, headCells, filterFn);

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value === "")
          return items;
        else
          return items.filter(x => {
            if ((x.idcuentabancaria !== null ? String(x.idcuentabancaria).includes(target.value) : 0)
              || (x.nombre !== null ? x.nombre.toLowerCase().includes(target.value.toLowerCase()) : '')
              || (x.cuentabancaria !== null ? x.cuentabancaria.includes(target.value) : '')
            ) {
              return x;
            }
          });
      }
    })

  }


    const seleccionarCuentaContable = (id) => {

      

        let campos = "*";
        let nomtab = 'cuentacontablenotaxcuentabancaria';
        let nomid = 'idcuentabancaria';
        let nomid2 = false;
        let id2 = idefiscal;

        let endpoint = `${op.conexion}/api/consulta/idsstring2rows?campos=${campos}&nomtab=${nomtab}&nomid=${nomid}&nomid2=${nomid2}&id=${id}&id2=${id2}`
        setActivate(true);
        axios.get(endpoint, {
            headers: {
                'x-access-token': `${token}`
            }
        }).then(function (response) {

            if (response.status == 200) {

                if (response.data.idcuentabancaria !== '') {

                  setBancos(response.data) 
                   setMostrar2(true)
    
                    setActivate(false);             }
            }



        }).catch(function (error) {

            setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message, icono: 'error' });
            setActivate(false);

        })

    }

  const seleccionarRegistros = () => {
   
    let campos = '*';
    let nomtab = 'cuentabancaria';
    let nomid = 'agente';
    let nomid2 = 'tipoagente'
    let orden = 'idcuentabancaria'


      let endpoint = `${op.conexion}/api/consulta/idsstring2rows?campos=${campos}&nomtab=${nomtab}&nomid=${nomid}&nomid2=${nomid2}&id=${codigo}&id2=${permiso.toString().trim()}&orden=${orden} `
      setActivate(true);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
         
          setRecords(response.data);


        }
    

        setActivate(false);
      })
      .catch(function (error) {
        setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message, icono: 'error' });
        setActivate(false);
      });
  };


const seleccionarBanco = (id) => {;

    let campos = "*";
    let nomtab = 'cuentabancaria';
    let nomid = 'idcuentabancaria';

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${id}&nomtab=${nomtab}&nomid=${nomid} `
    setActivate(true);
    axios.get(endpoint, {
        headers: {
            'x-access-token': `${token}`
        }
    }).then(function (response) {

        if (response.status == 200) {

            if (response.data.idcuentabancaria !== '') {
             
              console.log(response.data)   
               setBancos(response.data) 
                setMostrar2(true)
                setActivate(false)
          
                        }
        }



    }).catch(function (error) {

        setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message, icono: 'error' });
        setActivate(false);

    })

}



  const handleCancela2 = () => {
    setMostrar2(false);
    setExpendedor('')
    setCredito('')
  }

  const cerrarModal = () => {
    setMostrar2(false)
  }

  const gestionarBanco = (op,id) => (e) => {
    e.preventDefault();
if (op === 4) {
      if(acccuentas.substring(0,1) !== '0'){
                setOperacion(4);
        seleccionarBanco(id);
      }  else {
      setToast({... toast ,mostrar:true, titulo:'Notificación', mensaje:'No Posee los Permisos para Realizar esta Acción'})
    }
     
    } else if (op === 1) {
      if(acccuentas.substring(1,2) !== '0'){
      
        setOperacion(op);
      setMostrar2(true)
      } else {
        setToast({... toast ,mostrar:true, titulo:'Notificación', mensaje:'No Posee los Permisos para Realizar esta Acción'})
      }

    } else if (op === 2) {
      if(acccuentas.substring(2,3) !== '0'){
      
        setOperacion(op);
        seleccionarBanco(id);
      } else{
        setToast({... toast ,mostrar:true, titulo:'Notificación', mensaje:'No Posee los Permisos para Realizar esta Acción'})
      
      }
    
    } else if (op === 3) {
      if(acccuentas.substring(3,4) !== '0'){
                setOperacion(op);
        seleccionarBanco(id);
       
      } else{
         setToast({... toast ,mostrar:true, titulo:'Notificación', mensaje:'No Posee los Permisos para Realizar esta Acción'})
      }
    
    }
   
  }

  const cerrarToast = () =>{
    setToast({
      mostrar:false
    })
  }

  const handleCloseSi = () => {
    setActivate(false);
/*     getExpendedor(); */
    setMensajesino({ mostrar: false, titulo: '', texto: '', icono: '' })

  };

  useEffect(() => {
    seleccionarRegistros();

    setActivate(true);
  },[] );

  const data = {
    labels: municipiosEx,
    leyend: true,
    datasets: [
      {
        label: '#',
        data: municipiosData,
        backgroundColor: colores,
        borderColor: colores,
        borderWidth: 1,
        hoverBorderWidth: 15
      },
    ],
  };

  const options = {
    responsive: true,
    legend: {
      position: 'top',
      display: false
    },
    title: {
      display: true,
      text: `Municipios con Expendedores Activos: ${municipiosData.length}`,
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div className="row col-md-12" style={{ margin: 0 }}>
        <div className='row col-md-12' style={{ margin: 0 }}>
          <div className='col-md-10 card rounded py-3 mx-auto mt-5'>
           <div className='col-md-12 mx-auto'>
           <div className="col-12 p-2">
           <div className='col-12 row d-flex justify-content-between'>
                <h2 className='text-dark col-5'> Registro de Cuentas Bancarias</h2>

              </div>
              <div className="row col-12 d-flex justify-content-between">
                <input type="text" className=" col-3 form-control form-control-sm rounded-pill" ref={txtBuscador} onChange={handleSearch} placeholder="Buscar" />
         
                <div className='col-3 d-flex justify-content-end'>
                  <button onClick={gestionarBanco(1, '')}  style={{ pointerEvents: opercuentas.substring(3,41) === '0' ? 'none' : 'cursor' }} className={opercuentas.substring(3,4) === '0' ? "btn btn-sm btn-secondary rounded-circle" : "btn btn-sm btn-primary rounded-circle"}><i className="fas fa-plus"></i> </button>
                </div>
              </div>
            </div>
            <div className="col-md-12" style={{ margin: "auto" }} >
              <TblContainer>
                <TblHead />
                <TableBody >
                  {
                    records && recordsAfterPagingAndSorting().map((item, index) => (
                      <TableRow key={index} style={{ padding: "0" }}>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.idcuentabancaria}</TableCell> 
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center', width: '270px' }}>{item.nombre}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.cuentabancaria}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>
                          <button onClick={gestionarBanco(4, item.idcuentabancaria)} style={{ pointerEvents: opercuentas.substring(0,1) === '0' ? 'none' : 'cursor' }} className={opercuentas.substring(0,1) === '0' ? "btn btn-sm mx-1 btn-secondary rounded-circle" : "btn btn-sm mx-1 btn-info rounded-circle"} ><i className="fas fa-eye"></i> </button>
                          <button onClick={gestionarBanco(2, item.idcuentabancaria)} style={{ pointerEvents: opercuentas.substring(1,2) === '0' ? 'none' : 'cursor' }} className={opercuentas.substring(1,2) === '0' ? "btn btn-sm mx-1 btn-secondary rounded-circle" : "btn btn-sm mx-1 btn-warning rounded-circle"}><i className="fa fa-edit"></i> </button>
                          <button onClick={gestionarBanco(3, item.idcuentabancaria)} style={{ pointerEvents: opercuentas.substring(2,3) === '0' ? 'none' : 'cursor' }} className={opercuentas.substring(2,3) === '0' ? "btn btn-sm mx-1 btn-secondary rounded-circle" : "btn btn-sm mx-1 btn-danger rounded-circle"}><i className="fa fa-trash"></i> </button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </TblContainer>
              <TblPagination />
            </div>
           </div>
          </div>
       
        </div>
      </div >
      <GestionarCuentasBancarias 
      show={mostrar2}
      onHideCancela={cerrarModal}
      operacion={operacion}
      bancos={bancos}
      onHideRenderizar={seleccionarRegistros}
      />
      
      <Dimmer active={activate} inverted>
        <Loader inverted>cargando...</Loader>
      </Dimmer>
      <Mensaje mensaje={mensaje}
        onHide={() => setMensaje({ mostrar: false, titulo: '', texto: '', icono: '' })} />
      <MensajeSiNo mensaje={mensajesino}
        onHideNo={() => setMensajesino({ mostrar: false, titulo: '', texto: '', icono: '' })} onHideSi={handleCloseSi} />
    </div>
  );
}
export default TablaCuentasBancarias;