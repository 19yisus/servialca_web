import React, { useState, useEffect, useRef } from 'react';
import { TableBody, TableRow, TableCell, InputAdornment } from '@material-ui/core';
import { Loader, Dimmer } from 'semantic-ui-react';
import { Search } from "@material-ui/icons";
import axios from 'axios';
import { Dona, Torta } from '../graficos/graficos';
/* import CartasAgentes from './cartasAgentes'; */
import { Mensaje, MensajeSiNo } from '../../components/mensajes';
/* import { GestionarExpendedor } from './modalExpendedor'; */
import useTable from "../../components/useTable";
import { GestionarRegistroIglesia } from './modalRegistrarIglesia';
import { formatMoneda } from '../../util/varios';
/* const fs = require('fs'); */
const qrcode = require('qrcode');

const TablaRegistroZonal = (props) => {

  var op = require('../../modulos/datos');
  let token = localStorage.getItem('jwtToken');
  let el;
  let municipios = [];
  const codigo = JSON.parse(localStorage.getItem('codigo'));
  const nombreagente = JSON.parse(localStorage.getItem('nombreagente'));
  let nombrezona = JSON.parse(localStorage.getItem('nombrezona'))

  console.log(op.conexion)
  const headCells = [
    { id: 'codigo', color: 'rgba(5, 81, 130, 1)', label: 'Codigo', textAlign: 'center' },
    { id: 'nombre', color: 'rgba(5, 81, 130, 1)', label: 'Iglesia', textAlign: 'center' },
    { id: 'rif', color: 'rgba(5, 81, 130, 1)', label: 'Estado', textAlign: 'center' },
    { id: 'rif', color: 'rgba(5, 81, 130, 1)', label: 'Opciones', textAlign: 'center' },
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

  const [mensaje, setMensaje] = useState({mostrar: false, titulo: '', texto: '', icono: ''});
  const [mensajesino, setMensajesino] = useState({mostrar: false, titulo: '', texto: '', icono: ''});
  const txtBuscador = useRef();
  const [mostrar, setMostrar] = useState(false);
  const [mostrar4, setMostrar4] = useState(false);
  const [titulo1, setTitulo1] = useState();
  const [msg1, setMsg1] = useState();
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
  const [iglesia, setIglesia] = useState()
  const [estado,setEstado] = useState()

  const [datos, setDatos] = useState([]);

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
            if (x.idagente.includes(target.value)
              || x.nombre.toLowerCase().includes(target.value.toLowerCase())
              || x.rif.toLowerCase().includes(target.value.toLowerCase())
              || x.nrolicencia.toLowerCase().includes(target.value.toLowerCase())
              || x.status.toLowerCase().includes(target.value.toLowerCase()==='activo' ? '51' : '52')
            ) {
              return x;
            }
          });
      }
    })

  }

  function menuclick() {
    if (el = document.getElementById("wrapper")) {
      el.classList.add("toggled");
    }
  }


  const seleccionarIglesia = (id) => {

    let campos = '*';
    let nomtab = 'iglesia';
    let nomid = 'idiglesia';

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${parseInt(id)}&nomtab=${nomtab}&nomid=${nomid}`;
    setActivate(true);

    axios.get(endpoint, {
        headers: {
            'x-access-token': `${token}`
        }
    }).then(function (response) {

        if (response.status == 200) {
          if(response.data.idiglesia !== ''){
            setIglesia(response.data)
            setMostrar(true)
            setActivate(false);
    
          }
        
        }
      
    }).catch(function (error) {

        /* setTitulo("ERROR");
       
        setMostrar(true)
        setActivate(false); */
        console.log(error.response.data.message)

    })

}




  const seleccionaOperacion = (id,op) => (e) => {
    e.preventDefault()
    setOperacion(op)
    if(op === 1){

      setMostrar(true)

    } else{
      seleccionarIglesia(id)
    }

  }
 


  const handleCancela2 = () => {
  
    setExpendedor('')
    setCredito('')
  }

  const handleCloseSi = () => {
    setActivate(false);
  
    setMostrar4(false);
    setMensajesino({mostrar: false, titulo: '', texto: '', icono: ''})

  };

  const handleCloseNo = () => {
    setMostrar4(false);
  };

 

  const seleccionaRegistros = () => {


    let campos = '*, trim(codzona) as codzona ';
    let nomtab = "iglesia";
    let orden = "idiglesia";
    let id = codigo ;
    let condi = "codzona = '" + id + "'";

  


    let endpoint =
      op.conexion +
      `/api/consulta/selecionarregistrocondi?campos=${campos}&nomtab=${nomtab}&condi=${condi}&orden=${orden}`;
    console.log(endpoint)


   
    axios.get(endpoint, {
      headers: {
        'x-access-token': `${token}`
      }
    }).then(function (response) {
      if (response.status === 200) {
       setRecords(response.data)
       setActivate(false);
      }
    }).catch(function (error) {
      setMensaje({mostrar: true, titulo:'Error', texto: error.response.data.message, icono: 'error'});
    })
  };

  const cerrarModal = () =>{
    setMostrar(false)
    setIglesia('')
  }
  useEffect(() => {
    seleccionaRegistros()
 
    setActivate(true);
  }, []);


  const imprimirQr = () => {

    

  }



  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div className="row col-md-12 py-4 px-2" style={{margin:0}}>
        <div className='row col-md-12 card py-4' style={{margin:0}}>
          <div className='card-body col-md-12 py-3'>
        
            <div className="col-12 p-2">
             
                <div className='col-12 row d-flex justify-content-between'>
                    <h2 className='text-dark col-5'> Registro de Iglesia</h2>
                    <h2 className='text-dark text-right col-7'> {nombreagente}</h2>
                </div>
              <div className="row col-12 d-flex justify-content-between">
                <input type="text" className=" col-3 form-control form-control-sm rounded-pill" ref={txtBuscador} onChange={handleSearch} placeholder="Buscar" />
                <div className='col-3 d-flex justify-content-end'>
                  <button onClick={seleccionaOperacion('',1)}  style={{ marginBottom: "5px" }} className="btn btn-sm btn-primary rounded-circle"><i className="fas fa-plus"></i> </button>
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
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.codiglesia}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center', width: '270px' }}>{item.descripcion}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.constituida === 1 ? <span className='text-success2 mayuscula fw-bold'>constituida</span> : item.constituida === null ? <span className='text-danger mayuscula fw-bold'>sin registro</span> : <span className='text-danger2 mayuscula fw-bold'>no constituida</span>}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>
                          <button onClick={seleccionaOperacion(item.idiglesia,4)} className="btn btn-sm mx-3 btn-info rounded-circle" ><i className="fas fa-eye"></i> </button>
                          <button onClick={seleccionaOperacion(item.idiglesia,2)} className="btn btn-sm mx-1 btn-warning rounded-circle"><i className="fa fa-edit"></i> </button>
                          <button onClick={seleccionaOperacion(item.idiglesia,3)} className="btn btn-sm mx-1 btn-danger rounded-circle"><i className="fa fa-trash"></i> </button>
                          <button onClick={imprimirQr} className="btn btn-sm mx-1 btn-primary rounded-circle"><i className="fa fa-print"></i> </button>

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
      </div >
   
  
      <Dimmer active={activate} inverted>
        <Loader inverted>cargando...</Loader>
      </Dimmer>
      <Mensaje mensaje={mensaje}
        onHide={() => setMensaje({mostrar: false, titulo: '', texto: '', icono: ''})} />
      <MensajeSiNo mensaje={mensajesino}
        onHideNo={() => setMensajesino({mostrar: false, titulo: '', texto: '', icono: ''})} onHideSi={handleCloseSi} />
      <GestionarRegistroIglesia 
      show={mostrar}
      onHideCancela={cerrarModal}
      operacion={operacion}
      iglesia={iglesia}
      zona={codigo}
      render={seleccionaRegistros}
      estado={estado}
     
      />
    </div>
  );
}
export default TablaRegistroZonal;