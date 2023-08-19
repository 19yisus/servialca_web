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
import { GestionarBancos } from './modalRegistrarBancos';
import CartasBancos from './cartasBancos';
/* import {Toasts} from '../toasts'; */

const TablaBancos = (props) => {

  var op = require('../../modulos/datos');
  let token = localStorage.getItem('jwtToken');
  const accbancos = '1111'
  let municipios = [];
  const operbancos = JSON.parse(localStorage.getItem('operbancos'))


  const headCells = [
    { id: 'codigo', backgroundColor: 'rgba(5, 81, 130, 1)', color: '#ffffff', label: 'COD.', textAlign: 'center' },
    { id: 'descripcion', backgroundColor: 'rgba(5, 81, 130, 1)', color: '#ffffff', label: 'DESCRIPCIÓN', textAlign: 'center' },
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
  const [bancos,setBancos] = useState()
  const [toast, setToast] = useState({
    mostrar:false,
    mensaje:'',
    titulo:''
  })
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
            if ((x.idbanco !== null ? String(x.idbanco).includes(target.value) : 0)
              ||  (x.nombre !== null ? x.nombre.toLowerCase().includes(target.value.toLowerCase()) : '')
            ) {
              return x;
            }
          });
      }
    })

  }

  const seleccionarRegistros = () => {
    let campos =
      "*";
    let nomtab = "bancos";
    let orden = "idbanco";
    const municipioss = [];
    const idmunicipioss = [];
    const results = [];
    const element = [];

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
         
          setRecords(response.data);

          for (let i = 0; i < response.data.length; i++) {
            element.push({ nombre: response.data[i].nombre, valor: results[i], color: colores[i] });
          }
        }
        setMunicipiosEx(municipioss);
        setMunicipiosData(results);
        setDatos(element);

        setActivate(false);
      })
      .catch(function (error) {
        setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message, icono: 'error' });
        setActivate(false);
      });
  };


  const seleccionarBanco = (id) => {

    let campos = "*"
    let nomtab = "bancos";
    let nomid = "idbanco";

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${id}&nomtab=${nomtab}&nomid=${nomid}`
    setActivate(true);
    axios.get(endpoint, {
        headers: {
            'x-access-token': `${token}`
        }
    }).then(function (response) {

        if (response.status == 200) {

            if (response.data.idbanco !== '') {
               
                setBancos(response.data)
                setMostrar2(true)
                setActivate(false);
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
      if(accbancos.substring(0,1) !== '0'){
                setOperacion(4);
        seleccionarBanco(id);
      }  else {
      setToast({... toast ,mostrar:true, titulo:'Notificación', mensaje:'No Posee los Permisos para Realizar esta Acción'})
    }
     
    } else if (op === 1) {
      if(accbancos.substring(1,2) !== '0'){
      
        setOperacion(op);
      setMostrar2(true)
      } else {
        setToast({... toast ,mostrar:true, titulo:'Notificación', mensaje:'No Posee los Permisos para Realizar esta Acción'})
      }

    } else if (op === 2) {
      if(accbancos.substring(2,3) !== '0'){
      
        setOperacion(op);
        seleccionarBanco(id);
      } else{
        setToast({... toast ,mostrar:true, titulo:'Notificación', mensaje:'No Posee los Permisos para Realizar esta Acción'})
      
      }
    
    } else if (op === 3) {
      if(accbancos.substring(3,4) !== '0'){
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
/*     seleccionarBanco(); */
    setMensajesino({ mostrar: false, titulo: '', texto: '', icono: '' })

  };

  useEffect(() => {
    seleccionarRegistros();
    // seleccionarBancoes();
    setActivate(true);
  }, []);

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
          <div className='col-md-8 py-3 mx-auto mt-5 card'>
            <div className='col-md-12 mx-auto'>
            <div className="col-12 p-2">
            <div className='col-12 row d-flex justify-content-between'>
                <h2 className='text-dark col-5'> Registro de Bancos</h2>

              </div>
              <div className="row col-12 d-flex justify-content-between">
                <input type="text" className=" col-3 form-control form-control-sm rounded-pill" ref={txtBuscador} onChange={handleSearch} placeholder="Buscar" />
                
                <div className='col-3 d-flex justify-content-end'>
                  <button onClick={gestionarBanco(1,'')} style={{ marginBottom: "5px" }} disabled={operbancos.substring(3,4) === '0' ? true : false} className={operbancos.substring(3,4) === '0' ? "btn btn-sm mx-1 btn-secondary rounded-circle" : "btn btn-sm btn-primary rounded-circle"}><i className="fas fa-plus"></i> </button>
                
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
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.idbanco}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center', width: '270px' }}>{item.nombre}</TableCell>
                       
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>
                          <button onClick={gestionarBanco(4, item.idbanco)} style={{pointerEvents: accbancos.substring(0,1) === '0' ? 'none' : 'cursor' }} className={operbancos.substring(0,1) === '0' ? "btn btn-sm mx-1 btn-secondary rounded-circle" : "btn btn-sm mx-1 btn-info rounded-circle"} ><i className="fas fa-eye"></i> </button>
                          <button onClick={gestionarBanco(2, item.idbanco)} style={{pointerEvents: operbancos.substring(1,2) === '0' ? 'none' : 'cursor' }} className={operbancos.substring(2,3) === '0' ? "btn btn-sm mx-1 btn-secondary rounded-circle" : "btn btn-sm mx-1 btn-warning rounded-circle"}><i className="fa fa-edit"></i> </button>
                          <button onClick={gestionarBanco(3, item.idbanco)} style={{ pointerEvents: operbancos.substring(2,3) === '0' ? 'none' : 'cursor' }} className={operbancos.substring(3,4) === '0' ? "btn btn-sm mx-1 btn-secondary rounded-circle" : "btn btn-sm mx-1 btn-danger rounded-circle"}><i className="fa fa-trash"></i> </button>
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
      <GestionarBancos 
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
export default TablaBancos;